from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone

from freezegun import freeze_time
from rest_framework import status
from rest_framework.test import APITestCase
from tasks.models import Task

User = get_user_model()


class TaskApiTests(APITestCase):
    def setUp(self):
        self.url = reverse('tasks-list')
        self.user = User.objects.create_user(
            email='user@example.com',
            password='testpass123',
        )
        self.task = Task.objects.create(
            title='My task',
            description='Description',
            due_date=timezone.now(),
            created_by=self.user,
        )
        self.other_user = User.objects.create_user(
            email='other@example.com',
            password='testpass123',
        )
        self.other_task = Task.objects.create(
            title='Other task',
            description='Other description',
            due_date=timezone.now(),
            created_by=self.other_user,
        )
        self.client.force_authenticate(self.user)

    @freeze_time("2025-08-22")
    def test_create_task(self):
        payload = {
            'title': 'Test task',
            'description': 'Some description',
            'due_date': '2025-08-22',
        }
        response = self.client.post(self.url, payload, format='json')
        task = Task.objects.get(id=response.data['id'])

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['title'], payload['title'])
        self.assertEqual(task.created_by, self.user)

    def test_create_task_old_due_date(self):
        payload = {
            'title': 'Test task',
            'description': 'Some description',
            'due_date': '2022-01-01',
        }
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_tasks_only_own(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'My task')

    def test_retrieve_task(self):
        url = reverse('tasks-detail', args=[self.task.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.task.id)

    def test_user_cannot_retrieve_other_users_task(self):
        url = reverse('tasks-detail', args=[self.other_task.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_task(self):
        payload = {'title': 'New title'}
        url = reverse('tasks-detail', args=[self.task.id])

        response = self.client.patch(url, payload, format='json')
        self.task.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.task.title, payload['title'])

    def test_user_cannot_update_other_users_task(self):
        payload = {'title': 'Hacked'}
        url = reverse('tasks-detail', args=[self.other_task.id])

        response = self.client.patch(url, payload, format='json')
        self.other_task.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(self.other_task.title, 'Other task')

    def test_delete_task(self):
        url = reverse('tasks-detail', args=[self.task.id])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=self.task.id).exists())

    def test_user_cannot_delete_other_users_task(self):
        url = reverse('tasks-detail', args=[self.other_task.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Task.objects.filter(id=self.other_task.id).exists())
