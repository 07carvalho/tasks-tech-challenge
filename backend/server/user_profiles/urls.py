from django.urls import include, path

from rest_framework.routers import DefaultRouter

from user_profiles.views import LoginView, SignupView, UserProfileViewSet

router = DefaultRouter()
router.register(r'users', UserProfileViewSet, basename='users')

urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('signup', SignupView.as_view(), name='signup'),
    path('', include(router.urls)),
]
