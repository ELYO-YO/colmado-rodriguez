from django.urls import path

from .views import (
    CancelOrderView,
    OrderDetailView,
    OrderListCreateView,
    UpdateOrderStatusView,
)

urlpatterns = [
    path(
        "",
        OrderListCreateView.as_view(),
        name="order-list-create",
    ),
    path(
        "<int:pk>/",
        OrderDetailView.as_view(),
        name="order-detail",
    ),
    path(
        "<int:pk>/status/",
        UpdateOrderStatusView.as_view(),
        name="order-status",
    ),
    path(
        "<int:pk>/cancel/",
        CancelOrderView.as_view(),
        name="order-cancel",
    ),
]