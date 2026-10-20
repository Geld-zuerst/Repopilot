"""
URL configuration for repopilot project.

RepoPilot - AI-powered codebase intelligence platform
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone


@api_view(['GET'])
@permission_classes([AllowAny])
def stats_view(request):
    """
    Returns platform-wide stats: total users, projects, and posts.
    This is a lightweight inline view to avoid a dedicated app.
    """
    from accounts.models import User
    from projects.models import Project
    from community.models import Post

    total_users = User.objects.count()
    total_projects = Project.objects.count()
    total_posts = Post.objects.count()
    featured_projects = Project.objects.filter(is_featured=True).count()

    return Response({
        'total_users': total_users,
        'total_projects': total_projects,
        'total_posts': total_posts,
        'featured_projects': featured_projects,
        'server_time': timezone.now().isoformat(),
        'platform': 'RepoPilot',
        'version': '1.0.0',
    })


urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # Auth endpoints (register, login, refresh, profile, users)
    path('api/auth/', include('accounts.urls')),

    # Projects endpoints (list, detail, create)
    path('api/projects/', include('projects.urls')),

    # Community endpoints (feed, posts, comments)
    path('api/community/', include('community.urls')),

    # Platform stats
    path('api/stats/', stats_view, name='platform-stats'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
