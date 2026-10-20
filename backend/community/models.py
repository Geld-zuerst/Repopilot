from django.db import models
from django.conf import settings
from django.utils import timezone


class Post(models.Model):
    """
    A community post / article on the RepoPilot feed.

    Can optionally reference a Project so users can share project announcements,
    release notes, or discussions directly tied to a codebase.
    """

    # Authorship
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
    )

    # Content
    title = models.CharField(max_length=300, db_index=True)
    content = models.TextField()

    # Categorisation
    tags = models.JSONField(default=list, blank=True)

    # Optional link to a project (nullable so posts don't require a project)
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='community_posts',
    )

    # Engagement
    likes = models.IntegerField(default=0)

    # Users who liked this post (tracked to prevent double-likes)
    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_posts',
        blank=True,
    )

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'community_post'
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['-likes']),
        ]

    def __str__(self):
        return f'{self.title} by {self.author.username}'


class Comment(models.Model):
    """
    A comment on a community Post.
    Comments are flat (no threading) for simplicity.
    """

    # Authorship
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
    )

    # Parent post
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments',
    )

    # Content
    content = models.TextField()

    # Timestamp
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'community_comment'
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        ordering = ['created_at']

    def __str__(self):
        return f'Comment by {self.author.username} on "{self.post.title}"'
