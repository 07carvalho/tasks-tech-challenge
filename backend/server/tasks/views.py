from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from tasks.models import Task
from tasks.serializers import TaskSerializer


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Task.objects.filter(created_by=self.request.user).order_by('due_date')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
