from django.urls import path
from .views import (
    ProjectListView,
    ProjectDetailView,
    ProjectCreateView,
    ProjectUpdateView,
    ProjectDeleteView,
    MyProjectsView,
)

urlpatterns = [
    # Public list with filters
    path('', ProjectListView.as_view(), name='project-list'),

    # Create (auth required)
    path('create/', ProjectCreateView.as_view(), name='project-create'),

    # Authenticated user's own projects
    path('mine/', MyProjectsView.as_view(), name='project-mine'),

    # Single project detail, update, delete
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('<int:pk>/update/', ProjectUpdateView.as_view(), name='project-update'),
    path('<int:pk>/delete/', ProjectDeleteView.as_view(), name='project-delete'),
]
