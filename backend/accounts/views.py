from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import authenticate

from .models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    UserDetailSerializer,
)


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Register a new user account. Returns JWT tokens immediately on success
    so the client can log in without a separate request.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    'message': 'Account created successfully.',
                    'user': UserSerializer(user, context={'request': request}).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Authenticate with email + password. Returns JWT access and refresh tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response(
                {
                    'message': 'Login successful.',
                    'user': UserSerializer(user, context={'request': request}).data,
                    'tokens': {
                        'access': serializer.validated_data['access'],
                        'refresh': serializer.validated_data['refresh'],
                    },
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(TokenRefreshView):
    """
    POST /api/auth/refresh/
    Exchange a valid refresh token for a new access token.
    Inherits all logic from SimpleJWT's TokenRefreshView.
    """
    pass


class UserProfileView(APIView):
    """
    GET  /api/auth/profile/   -> Returns the authenticated user's full profile.
    PUT  /api/auth/profile/   -> Updates the authenticated user's profile fields.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserDetailSerializer(request.user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        serializer = UserDetailSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message': 'Profile updated successfully.',
                    'user': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        """PATCH is an alias for partial PUT."""
        return self.put(request, *args, **kwargs)


class UserListView(generics.ListAPIView):
    """
    GET /api/auth/users/
    List all users with optional search by username or bio.
    Read-only; no authentication required.
    """
    queryset = User.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    search_fields = ['username', 'bio', 'skills']

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', '')
        if search:
            qs = qs.filter(username__icontains=search)
        return qs


class UserDetailByUsernameView(APIView):
    """
    GET /api/auth/users/<username>/
    Retrieve a single user's public profile by their username.
    """
    permission_classes = [AllowAny]

    def get(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username, is_active=True)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = UserDetailSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowUserView(APIView):
    """
    POST /api/auth/users/<username>/follow/
    Toggle follow/unfollow for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, username, *args, **kwargs):
        try:
            target = User.objects.get(username=username, is_active=True)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if target == request.user:
            return Response(
                {'detail': 'You cannot follow yourself.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.user.following.filter(pk=target.pk).exists():
            request.user.following.remove(target)
            action = 'unfollowed'
        else:
            request.user.following.add(target)
            action = 'followed'

        return Response(
            {
                'message': f'Successfully {action} {target.username}.',
                'action': action,
                'followers_count': target.followers.count(),
            },
            status=status.HTTP_200_OK,
        )
