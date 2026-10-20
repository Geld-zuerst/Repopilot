from rest_framework import serializers
from .models import Post, Comment
from accounts.serializers import UserSerializer
from projects.serializers import ProjectListSerializer


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for individual comments.
    Author is shown as the compact UserSerializer.
    On create, the author is set from the request context.
    """
    author = UserSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(source='author', read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 'author', 'author_id', 'post',
            'content', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'author', 'author_id', 'post', 'created_at', 'updated_at']


class PostListSerializer(serializers.ModelSerializer):
    """
    Compact serializer used when listing posts in the feed.
    Includes author info, like count, and comment count.
    Does NOT include full comment list to keep response lean.
    """
    author = UserSerializer(read_only=True)
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'title', 'content',
            'tags', 'project',
            'likes', 'is_liked', 'comment_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'likes', 'created_at', 'updated_at']

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.liked_by.filter(pk=request.user.pk).exists()
        return False


class PostSerializer(serializers.ModelSerializer):
    """
    Full serializer for post detail, create, and update.
    Includes paginated comments inline.
    """
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    project_detail = ProjectListSerializer(source='project', read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'author',
            'title', 'content', 'tags',
            'project', 'project_detail',
            'likes', 'is_liked',
            'comments', 'comment_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'author', 'likes', 'created_at', 'updated_at',
            'comments', 'comment_count', 'project_detail',
        ]

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.liked_by.filter(pk=request.user.pk).exists()
        return False

    def validate_tags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('tags must be a JSON array.')
        return value
