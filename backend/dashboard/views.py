from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from products.models import Product


def get_user_role(user):
    if user.is_superuser:
        return "admin"

    if hasattr(user, "profile"):
        return user.profile.role

    return "customer"


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = get_user_role(request.user)

        if role not in ["admin", "employee"]:
            return Response(
                {
                    "detail":
                        "No tienes permiso para acceder al dashboard."
                },
                status=403,
            )

        delivered_orders = Order.objects.filter(
            status="delivered"
        )

        total_revenue = delivered_orders.aggregate(
            total=Sum("total")
        )["total"] or 0

        data = {
            "total_revenue": str(total_revenue),

            "total_orders":
                Order.objects.count(),

            "pending_orders":
                Order.objects.filter(
                    status="pending"
                ).count(),

            "confirmed_orders":
                Order.objects.filter(
                    status="confirmed"
                ).count(),

            "preparing_orders":
                Order.objects.filter(
                    status="preparing"
                ).count(),

            "on_the_way_orders":
                Order.objects.filter(
                    status="on_the_way"
                ).count(),

            "delivered_orders":
                delivered_orders.count(),

            "cancelled_orders":
                Order.objects.filter(
                    status="cancelled"
                ).count(),

            "total_products":
                Product.objects.count(),

            "active_offers":
                Product.objects.filter(
                    is_offer=True
                ).count(),
        }

        return Response(data)