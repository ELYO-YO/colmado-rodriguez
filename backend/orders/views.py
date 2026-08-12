from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderSerializer



class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
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
                {
                    "detail": "Pedido no encontrado."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status != "pending":
            return Response(
                {
                    "detail": (
                        "Solo puedes cancelar pedidos pendientes."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = "cancelled"
        order.save()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )