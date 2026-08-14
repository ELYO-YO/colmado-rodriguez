from rest_framework import generics

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from .serializers import (
    RegisterSerializer,
    UserProfileSerializer,
)


class RegisterView(
    generics.CreateAPIView
):
    serializer_class = (
        RegisterSerializer
    )

    permission_classes = [
        AllowAny
    ]


class ProfileView(
    generics.RetrieveUpdateAPIView
):
    serializer_class = (
        UserProfileSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(self):
        return self.request.user