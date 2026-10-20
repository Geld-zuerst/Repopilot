from django.urls import path
from .views import (
    FeedView,
    PostListView,
    PostDetailView,
    PostCreateView,
    PostUpdateView,
    PostDeleteView,
    PostLikeView,
    CommentListView,
    CommentCreateView,
    CommentDeleteView,
)

urlpatterns = [
    # Community feed (with optional ?following=true filter)
    path('feed/', FeedView.as_view(), name='community-feed'),

    # Post CRUD
    path('posts/', PostListView.as_view(), name='post-list'),
    path('posts/create/', PostCreateView.as_view(), name='post-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/update/', PostUpdateView.as_view(), name='post-update'),
    path('posts/<int:pk>/delete/', PostDeleteView.as_view(), name='post-delete'),
    path('posts/<int:pk>/like/', PostLikeView.as_view(), name='post-like'),

    # Comments nested under posts
    path('posts/<int:post_pk>/comments/', CommentListView.as_view(), name='comment-list'),
    path('posts/<int:post_pk>/comments/create/', CommentCreateView.as_view(), name='comment-create'),
    path('posts/<int:post_pk>/comments/<int:pk>/delete/', CommentDeleteView.as_view(), name='comment-delete'),
]
