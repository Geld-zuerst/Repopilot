from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for the User model."""

    list_display = ['username', 'email', 'is_active', 'is_staff', 'created_at']
    list_filter = ['is_active', 'is_staff', 'is_superuser']
    search_fields = ['username', 'email', 'bio']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username', 'bio', 'avatar', 'github_url', 'website', 'skills')}),
        ('Social Graph', {'fields': ('following',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )

    filter_horizontal = ('following', 'groups', 'user_permissions')
