from datetime import timedelta
from typing import Any, Dict

from django.conf import settings
from django.utils import timezone

import jwt

from core.exceptions import AuthenticationFailed


class JWTUtils:

    @staticmethod
    def create_token_payload(user_id):
        now = timezone.now()
        return {
            'header_type': 'Bearer',
            'user_id': user_id,
            'iat': now,
        }

    @staticmethod
    def generate_tokens(user_id):
        now = timezone.now()
        base_payload = JWTUtils.create_token_payload(user_id)

        access_token_payload = base_payload.copy()
        access_token_payload['exp'] = int((now + timedelta(days=7)).timestamp())
        access_token = jwt.encode(access_token_payload, settings.JWT_SECRET_KEY, algorithm='HS256')

        refresh_token_payload = base_payload.copy()
        refresh_token_payload['exp'] = int((now + timedelta(days=30)).timestamp())
        refresh_token = jwt.encode(refresh_token_payload, settings.JWT_SECRET_KEY, algorithm='HS256')

        return {
            'header_type': 'Bearer',
            'access_token': access_token,
            'refresh_token': refresh_token,
        }

    @staticmethod
    def verify_token(token) -> Dict[str, Any]:
        try:
            return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token is expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
