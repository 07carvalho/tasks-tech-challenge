from django.contrib.auth import get_user_model

from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication

from core.exceptions import AuthenticationFailed
from core.jwt import JWTUtils

User = get_user_model()


class CustomAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return None

        if not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token')

        token = auth_header.split(' ')[1]
        return self.authenticate_credentials(token)

    def authenticate_credentials(self, token):
        try:
            payload = JWTUtils.verify_token(token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))

        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Invalid token')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')

        return user, token

    def authenticate_header(self, request):
        return 'Bearer'
