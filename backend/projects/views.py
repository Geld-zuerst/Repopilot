from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q

from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer


class ProjectListView(generics.ListAPIView):
    """
    GET /api/projects/
    List projects with optional filtering by:
      - ?featured=true          -> only featured projects
      - ?language=Python        -> filter by primary language
      - ?search=<term>          -> full-text search across title, description, tags
      - ?ordering=stars         -> order results (default: -created_at)

    No authentication required (public endpoint).
    """
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Project.objects.select_related('owner').order_by('-created_at')

        # Filter: featured only
        featured = self.request.query_params.get('featured', '').lower()
        if featured in ('true', '1', 'yes'):
            qs = qs.filter(is_featured=True)

        # Filter: primary language
        language = self.request.query_params.get('language', '').strip()
        if language:
            qs = qs.filter(language__iexact=language)

        # Filter: tag
        tag = self.request.query_params.get('tag', '').strip()
        if tag:
            # JSONField contains lookup (works in SQLite 3.38+)
            qs = qs.filter(tags__contains=tag)

        # Search: title + description
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(language__icontains=search)
            )

        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        allowed_orderings = [
            'created_at', '-created_at',
            'stars', '-stars',
            'forks', '-forks',
            'title', '-title',
        ]
        if ordering in allowed_orderings:
            qs = qs.order_by(ordering)

        return qs


class ProjectDetailView(generics.RetrieveAPIView):
    """
    GET /api/projects/<id>/
    Retrieve a single project by its primary key.
    No authentication required.
    """
    queryset = Project.objects.select_related('owner').all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]


class ProjectCreateView(generics.CreateAPIView):
    """
    POST /api/projects/create/
    Create a new project. Requires JWT authentication.
    The owner is automatically set to the authenticated user.
    """
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                {
                    'message': 'Project created successfully.',
                    'project': serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectUpdateView(generics.UpdateAPIView):
    """
    PUT/PATCH /api/projects/<id>/update/
    Update a project. Only the project owner can update.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Owners can only update their own projects
        return Project.objects.filter(owner=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message': 'Project updated successfully.',
                    'project': serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/projects/<id>/delete/
    Delete a project. Only the project owner can delete.
    """
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Project deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT,
        )


class MyProjectsView(generics.ListAPIView):
    """
    GET /api/projects/mine/
    List all projects belonging to the authenticated user.
    """
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).order_by('-created_at')
