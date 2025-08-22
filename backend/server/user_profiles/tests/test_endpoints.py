from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from core.jwt import JWTUtils

User = get_user_model()


class BaseTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpassword123',
            'first_name': 'Test',
            'last_name': 'User',
        }
        self.login_data = {'email': 'test@example.com', 'password': 'testpassword123'}


class LoginViewTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('login')
        self.user = User.objects.create_user(
            email=self.user_data['email'],
            password=self.user_data['password'],
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name'],
        )

    def test_login_success(self):
        response = self.client.post(self.url, self.login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.data)
        self.assertIn('refresh_token', response.data)

    def test_login_wrong_password(self):
        data = {'email': 'test@example.com', 'password': 'wrongpassword'}

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'], 'Email or password incorrects')

    def test_login_nonexistent_user(self):
        data = {'email': 'nonexistent@example.com', 'password': 'anypassword'}

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'], 'Email or password incorrects')

    def test_login_missing_fields(self):
        data = {'password': 'testpassword123'}

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {'email': 'test@example.com'}

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class SignupViewTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('signup')

    def test_signup_success(self):
        response = self.client.post(self.url, self.user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access_token', response.data)
        self.assertIn('refresh_token', response.data)

        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())

    def test_signup_missing_required_fields(self):
        data = self.user_data.copy()
        del data['email']

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = self.user_data.copy()
        del data['password']

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_signup_duplicate_email(self):
        User.objects.create_user(email=self.user_data['email'], password=self.user_data['password'])

        response = self.client.post(self.url, self.user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserProfileViewSetTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('users-me')
        self.user = User.objects.create_user(
            email=self.user_data['email'],
            password=self.user_data['password'],
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name'],
        )
        self.tokens = JWTUtils.generate_tokens(self.user.id)
        self.access_token = self.tokens['access_token']

    def test_get_user_profile_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertEqual(response.data['first_name'], self.user_data['first_name'])
        self.assertEqual(response.data['last_name'], self.user_data['last_name'])

    def test_get_user_profile_unauthenticated(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_profile_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalidtoken')

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_profile_endpoints_require_authentication(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class JWTTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(email=self.user_data['email'], password=self.user_data['password'])

    def test_token_generation(self):
        tokens = JWTUtils.generate_tokens(self.user.id)

        self.assertIn('access_token', tokens)
        self.assertIn('refresh_token', tokens)
        self.assertIsInstance(tokens['access_token'], str)
        self.assertIsInstance(tokens['refresh_token'], str)

    def test_token_verification(self):
        tokens = JWTUtils.generate_tokens(self.user.id)

        access_payload = JWTUtils.verify_token(tokens['access_token'])
        self.assertEqual(access_payload['user_id'], self.user.id)

        refresh_payload = JWTUtils.verify_token(tokens['refresh_token'])
        self.assertEqual(refresh_payload['user_id'], self.user.id)
