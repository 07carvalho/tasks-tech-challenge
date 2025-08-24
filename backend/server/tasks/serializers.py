from django.utils import timezone

from rest_framework import serializers
from tasks.models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'due_date',
            'status',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
        ]

    def validate_due_date(self, value):
        if value and value < timezone.localdate():
            raise serializers.ValidationError('Due date can not be in the past')
        return value
