from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    RefreshTokenView,
    UserProfileView,
    UserListView,
    UserDetailByUsernameView,
    FollowUserView,
)

urlpatterns = [
    # Auth endpoints
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('refresh/', RefreshTokenView.as_view(), name='auth-refresh'),

    # Authenticated user's own profile
    path('profile/', UserProfileView.as_view(), name='auth-profile'),

    # User directory
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<str:username>/', UserDetailByUsernameView.as_view(), name='user-detail'),
    path('users/<str:username>/follow/', FollowUserView.as_view(), name='user-follow'),
]
