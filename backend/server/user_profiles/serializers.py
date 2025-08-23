from rest_framework import serializers

from user_profiles.models import UserProfile


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class SignupSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True, allow_blank=False, allow_null=False)
    last_name = serializers.CharField(required=True, allow_blank=False, allow_null=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'email',
            'first_name',
            'last_name',
            'password',
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'first_name',
            'last_name',
            'email',
        ]
