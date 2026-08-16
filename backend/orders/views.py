from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderSerializer


def get_user_role(user):
    if user.is_superuser:
        return "admin"

    if hasattr(user, "profile"):
        return user.profile.role

    return "customer"


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        role = get_user_role(self.request.user)

        if role in ["admin", "employee"]:
            return Order.objects.all()

        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        role = get_user_role(self.request.user)

        if role in ["admin", "employee"]:
            return Order.objects.all()

        return Order.objects.filter(user=self.request.user)


class UpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    ALLOWED_TRANSITIONS = {
        "pending": "confirmed",
        "confirmed": "preparing",
        "preparing": "on_the_way",
        "on_the_way": "delivered",
    }

    def patch(self, request, pk):
        role = get_user_role(request.user)

        if role not in ["admin", "employee"]:
            return Response(
                {"detail": "No tienes permiso para actualizar pedidos."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Pedido no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status in ["delivered", "cancelled"]:
            return Response(
                {"detail": "Este pedido ya no puede cambiar de estado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        next_status = self.ALLOWED_TRANSITIONS.get(order.status)

        if not next_status:
            return Response(
                {"detail": "No se puede actualizar este estado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = next_status
        order.save()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK,
        )


class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            order = Order.objects.get(
                pk=pk,
                user=request.user,
            )
        except Order.DoesNotExist:
            return Response(
                {"detail": "Pedido no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status != "pending":
            return Response(
                {"detail": "Solo puedes cancelar pedidos pendientes."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = "cancelled"
        order.save()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK,
        )