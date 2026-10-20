from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """Admin interface for Project model."""

    list_display = ['title', 'owner', 'language', 'stars', 'forks', 'is_featured', 'created_at']
    list_filter = ['is_featured', 'language', 'created_at']
    search_fields = ['title', 'description', 'owner__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Project Info', {
            'fields': ('title', 'description', 'owner', 'is_featured')
        }),
        ('Languages & Tags', {
            'fields': ('language', 'languages_list', 'tags')
        }),
        ('GitHub Stats', {
            'fields': ('github_url', 'stars', 'forks', 'watchers')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
