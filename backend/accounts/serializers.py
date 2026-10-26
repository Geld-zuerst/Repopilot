from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Accepts password + password2 confirmation and creates a new user.
    """
    password = serializers.CharField(
        write_only=True, required=True, min_length=8,
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True, required=True,
        style={'input_type': 'password'},
        label='Confirm Password'
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2', 'bio', 'github_url', 'website', 'skills']
        extra_kwargs = {
            'bio': {'required': False},
            'github_url': {'required': False},
            'website': {'required': False},
            'skills': {'required': False},
        }

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login via email + password.
    Returns JWT access and refresh tokens on success.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True, write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been disabled.')

        refresh = RefreshToken.for_user(user)

        attrs['user'] = user
        attrs['access'] = str(refresh.access_token)
        attrs['refresh'] = str(refresh)
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """
    Compact serializer for listing users (used in lists, nested references).
    """
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    avatar_url = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'bio', 'avatar_url',
            'github_url', 'website', 'skills',
            'followers_count', 'following_count', 'is_following', 'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'followers_count', 'following_count']

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.following.filter(pk=obj.pk).exists()
        return False


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Full serializer for user profile GET/PUT.
    Includes all editable fields plus computed social counts.
    """
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    avatar_url = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'bio', 'avatar', 'avatar_url',
            'github_url', 'website', 'skills',
            'followers_count', 'following_count', 'is_following',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'email', 'created_at', 'updated_at', 'followers_count', 'following_count']
        extra_kwargs = {
            'avatar': {'write_only': True, 'required': False},
        }

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.following.filter(pk=obj.pk).exists()
        return False

    def update(self, instance, validated_data):
        # Handle avatar upload separately if needed
        avatar = validated_data.pop('avatar', None)
        if avatar is not None:
            instance.avatar = avatar

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
