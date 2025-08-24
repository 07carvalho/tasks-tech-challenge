from django.urls import include, path

from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'tasks', TaskViewSet, basename='tasks')

urlpatterns = [
    path('', include(router.urls)),
]
