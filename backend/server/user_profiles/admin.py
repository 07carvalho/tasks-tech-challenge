from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from user_profiles.models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        (
            'Permissions',
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'password1', 'password2'),
            },
        ),
    )
    list_display = (
        'id',
        'first_name',
        'last_name',
        'email',
        'is_active',
    )
    ordering = ('email',)
