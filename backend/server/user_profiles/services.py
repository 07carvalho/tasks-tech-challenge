from typing import Any, Dict, Union

from django.contrib.auth import get_user_model

from rest_framework import status

from core.exceptions import ServiceException

User = get_user_model()


class UserProfileService:
    @staticmethod
    def get_user_by_email(email: str) -> Union[User, None]:
        return User.objects.filter(email=email).first()

    @staticmethod
    def create_user(user_data: Dict[str, Any]) -> User:
        email = user_data['email']

        if UserProfileService.get_user_by_email(email) is not None:
            raise ServiceException(
                'This email is already taken',
                code='user_email_exists',
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            email=email,
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
        )

        return user
