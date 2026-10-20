from rest_framework import serializers
from .models import Project
from accounts.serializers import UserSerializer


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Compact serializer used when listing many projects (index page, search results).
    Includes the owner's compact representation.
    """
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'owner',
            'language', 'languages_list',
            'github_url', 'stars', 'forks', 'watchers',
            'tags', 'is_featured',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    """
    Full project serializer used for create, retrieve, and update operations.
    On write operations the owner is automatically set to the requesting user.
    """
    owner = UserSerializer(read_only=True)
    owner_id = serializers.PrimaryKeyRelatedField(
        source='owner',
        read_only=True,
    )

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description',
            'owner', 'owner_id',
            'language', 'languages_list',
            'github_url', 'stars', 'forks', 'watchers',
            'tags', 'is_featured',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'owner_id', 'created_at', 'updated_at']

    def validate_stars(self, value):
        if value < 0:
            raise serializers.ValidationError('Stars cannot be negative.')
        return value

    def validate_forks(self, value):
        if value < 0:
            raise serializers.ValidationError('Forks cannot be negative.')
        return value

    def validate_watchers(self, value):
        if value < 0:
            raise serializers.ValidationError('Watchers cannot be negative.')
        return value

    def validate_languages_list(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('languages_list must be a JSON array.')
        return value

    def validate_tags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('tags must be a JSON array.')
        return value

    def create(self, validated_data):
        # Owner is injected by the view via perform_create
        return Project.objects.create(**validated_data)
