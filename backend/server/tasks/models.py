from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Task(models.Model):
    PENDING = 'P'
    IN_PROGRESS = 'I'
    COMPLETED = 'C'
    STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (IN_PROGRESS, 'In Progress'),
        (COMPLETED, 'Completed'),
    )
    title = models.CharField(max_length=120, null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=PENDING)
    due_date = models.DateField(null=False, blank=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
