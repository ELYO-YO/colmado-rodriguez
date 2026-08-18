from django.urls import path

from .views import (
    AdminUserActiveView,
    AdminUserListView,
    AdminUserRoleView,
    ProfileView,
    RegisterView,
)


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),

    path(
        "users/",
        AdminUserListView.as_view(),
        name="admin-users",
    ),

    path(
        "users/<int:pk>/role/",
        AdminUserRoleView.as_view(),
        name="admin-user-role",
    ),

    path(
        "users/<int:pk>/active/",
        AdminUserActiveView.as_view(),
        name="admin-user-active",
    ),
]