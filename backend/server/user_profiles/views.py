from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from core.jwt import JWTUtils
from user_profiles.serializers import LoginSerializer, SignupSerializer, UserProfileSerializer
from user_profiles.services import UserProfileService


class BaseAuthView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def generate_token_response(self, user_id, status_code=status.HTTP_201_CREATED):
        tokens = JWTUtils.generate_tokens(user_id)
        return Response(tokens, status=status_code)


class LoginView(BaseAuthView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = UserProfileService.get_user_by_email(email=serializer.validated_data["email"])
        if user is None or not user.check_password(serializer.validated_data["password"]):
            return Response({'detail': 'Email or password incorrects'}, status=status.HTTP_401_UNAUTHORIZED)

        return self.generate_token_response(user.id, status.HTTP_200_OK)


class SignupView(BaseAuthView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = UserProfileService.create_user(serializer.validated_data)

        return self.generate_token_response(user.id)


class UserProfileViewSet(GenericViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
