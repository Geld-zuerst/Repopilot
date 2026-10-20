from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Post, Comment
from .serializers import PostSerializer, PostListSerializer, CommentSerializer


class PostListView(generics.ListAPIView):
    """
    GET /api/community/posts/
    List all community posts.
    Supports:
      - ?search=<term>    -> search title and content
      - ?tag=<tag>        -> filter by a tag value
      - ?author=<username>-> filter by author username
      - ?ordering=likes   -> order by likes or created_at (default: -created_at)

    No authentication required.
    """
    serializer_class = PostListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Post.objects.select_related('author', 'project').prefetch_related('comments', 'liked_by').order_by('-created_at')

        # Search across title and content
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(content__icontains=search)
            )

        # Filter by tag
        tag = self.request.query_params.get('tag', '').strip()
        if tag:
            qs = qs.filter(tags__contains=tag)

        # Filter by author username
        author = self.request.query_params.get('author', '').strip()
        if author:
            qs = qs.filter(author__username__iexact=author)

        # Filter by project
        project_id = self.request.query_params.get('project', '').strip()
        if project_id:
            qs = qs.filter(project_id=project_id)

        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        allowed = ['created_at', '-created_at', 'likes', '-likes', 'title', '-title']
        if ordering in allowed:
            qs = qs.order_by(ordering)

        return qs


class FeedView(PostListView):
    """
    GET /api/community/feed/
    Alias for PostListView — used as the main community feed endpoint.
    Can be customised later to show posts from followed users only.
    """

    def get_queryset(self):
        qs = super().get_queryset()
        # If authenticated, optionally show only followed users' posts
        user = self.request.user
        following_only = self.request.query_params.get('following', '').lower()
        if following_only in ('true', '1', 'yes') and user.is_authenticated:
            following_ids = user.following.values_list('id', flat=True)
            qs = qs.filter(author_id__in=following_ids)
        return qs


class PostDetailView(generics.RetrieveAPIView):
    """
    GET /api/community/posts/<id>/
    Retrieve a single post with all comments embedded.
    No authentication required.
    """
    queryset = Post.objects.select_related('author', 'project').prefetch_related('comments__author', 'liked_by').all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]


class PostCreateView(generics.CreateAPIView):
    """
    POST /api/community/posts/create/
    Create a new community post. Requires JWT authentication.
    The author is automatically set to the authenticated user.
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                {
                    'message': 'Post created successfully.',
                    'post': serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostUpdateView(generics.UpdateAPIView):
    """
    PUT/PATCH /api/community/posts/<id>/update/
    Update a post. Only the post author can update.
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message': 'Post updated successfully.',
                    'post': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/community/posts/<id>/delete/
    Delete a post. Only the post author can delete.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Post deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT,
        )


class PostLikeView(APIView):
    """
    POST /api/community/posts/<id>/like/
    Toggle like/unlike on a post. Requires authentication.
    Updates the denormalized `likes` counter atomically.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        post = get_object_or_404(Post, pk=pk)

        if post.liked_by.filter(pk=request.user.pk).exists():
            post.liked_by.remove(request.user)
            post.likes = max(0, post.likes - 1)
            action = 'unliked'
        else:
            post.liked_by.add(request.user)
            post.likes += 1
            action = 'liked'

        post.save(update_fields=['likes'])

        return Response(
            {
                'message': f'Post {action} successfully.',
                'action': action,
                'likes': post.likes,
            },
            status=status.HTTP_200_OK,
        )


class CommentListView(generics.ListAPIView):
    """
    GET /api/community/posts/<post_pk>/comments/
    List all comments for a specific post, ordered oldest first.
    No authentication required.
    """
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        post_pk = self.kwargs.get('post_pk')
        return Comment.objects.filter(post_id=post_pk).select_related('author').order_by('created_at')


class CommentCreateView(generics.CreateAPIView):
    """
    POST /api/community/posts/<post_pk>/comments/create/
    Add a comment to a post. Requires JWT authentication.
    The author is set from the JWT token; the post is set from the URL.
    """
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post_pk = self.kwargs.get('post_pk')
        post = get_object_or_404(Post, pk=post_pk)
        serializer.save(author=self.request.user, post=post)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                {
                    'message': 'Comment added successfully.',
                    'comment': serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/community/posts/<post_pk>/comments/<id>/delete/
    Delete a comment. Only the comment author can delete.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_pk = self.kwargs.get('post_pk')
        return Comment.objects.filter(post_id=post_pk, author=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Comment deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT,
        )
