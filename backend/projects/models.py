from django.db import models
from django.conf import settings
from django.utils import timezone


class Project(models.Model):
    """
    Represents a software project / repository tracked by RepoPilot.

    Stores both metadata (from GitHub or manually entered) and RepoPilot-specific
    fields like featured status and tags.
    """

    # --- Core info ---
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, default='')

    # Owner references the custom User model via settings.AUTH_USER_MODEL
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects',
    )

    # --- Language metadata ---
    # Primary language (e.g. "Python") — fast filtering
    language = models.CharField(max_length=100, blank=True, default='', db_index=True)

    # Full list of languages used, e.g. ["Python", "TypeScript", "Dockerfile"]
    languages_list = models.JSONField(default=list, blank=True)

    # --- GitHub info ---
    github_url = models.URLField(blank=True, default='')

    # GitHub stats — synced from the API or set manually
    stars = models.IntegerField(default=0)
    forks = models.IntegerField(default=0)
    watchers = models.IntegerField(default=0)

    # --- RepoPilot metadata ---
    # Searchable tags like ["machine-learning", "open-source"]
    tags = models.JSONField(default=list, blank=True)

    # Curated / featured flag for the homepage
    is_featured = models.BooleanField(default=False, db_index=True)

    # --- Timestamps ---
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects_project'
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['language', '-created_at']),
            models.Index(fields=['is_featured', '-stars']),
        ]

    def __str__(self):
        return f'{self.title} ({self.owner.username})'
