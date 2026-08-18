from django.contrib.auth.models import User

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserProfile

from .serializers import (
    AdminUserSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)


def get_user_role(user):
    if user.is_superuser:
        return "admin"

    if hasattr(user, "profile"):
        return user.profile.role

    return "customer"


class RegisterView(
    generics.CreateAPIView
):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class ProfileView(
    generics.RetrieveUpdateAPIView
):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AdminUserListView(
    generics.ListAPIView
):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        role = get_user_role(
            self.request.user
        )

        if role != "admin":
            return User.objects.none()

        return User.objects.all().order_by(
            "username"
        )


class AdminUserRoleView(APIView):
    permission_classes = [IsAuthenticated]

    ALLOWED_ROLES = [
        "customer",
        "employee",
    ]

    def patch(self, request, pk):
        role = get_user_role(
            request.user
        )

        if role != "admin":
            return Response(
                {
                    "detail":
                        "No tienes permiso para modificar usuarios."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            user = User.objects.get(
                pk=pk
            )

        except User.DoesNotExist:
            return Response(
                {
                    "detail":
                        "Usuario no encontrado."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if user.is_superuser:
            return Response(
                {
                    "detail":
                        "No puedes cambiar el rol de un superusuario."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_role = request.data.get(
            "role"
        )

        if new_role not in self.ALLOWED_ROLES:
            return Response(
                {
                    "detail":
                        "Rol no válido."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile, _ = (
            UserProfile.objects.get_or_create(
                user=user
            )
        )

        profile.role = new_role
        profile.save()

        return Response(
            AdminUserSerializer(
                user
            ).data,
            status=status.HTTP_200_OK,
        )


class AdminUserActiveView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        role = get_user_role(
            request.user
        )

        if role != "admin":
            return Response(
                {
                    "detail":
                        "No tienes permiso para modificar usuarios."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            user = User.objects.get(
                pk=pk
            )

        except User.DoesNotExist:
            return Response(
                {
                    "detail":
                        "Usuario no encontrado."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if user.is_superuser:
            return Response(
                {
                    "detail":
                        "No puedes desactivar un superusuario."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_active = request.data.get(
            "is_active"
        )

        if not isinstance(
            is_active,
            bool
        ):
            return Response(
                {
                    "detail":
                        "El valor is_active debe ser verdadero o falso."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = is_active
        user.save(
            update_fields=[
                "is_active"
            ]
        )

        return Response(
            AdminUserSerializer(
                user
            ).data,
            status=status.HTTP_200_OK,
        )