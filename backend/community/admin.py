from django.contrib import admin
from .models import Post, Comment


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Admin interface for Post model."""

    list_display = ['title', 'author', 'likes', 'comment_count_display', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'content', 'author__username']
    ordering = ['-created_at']
    readonly_fields = ['likes', 'created_at', 'updated_at']
    filter_horizontal = ['liked_by']

    fieldsets = (
        ('Post Info', {
            'fields': ('author', 'title', 'content', 'tags', 'project')
        }),
        ('Engagement', {
            'fields': ('likes', 'liked_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    def comment_count_display(self, obj):
        return obj.comments.count()
    comment_count_display.short_description = 'Comments'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin interface for Comment model."""

    list_display = ['id', 'author', 'post', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'author__username', 'post__title']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
