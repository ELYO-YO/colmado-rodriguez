from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        "product",
        "product_name",
        "unit_price",
        "quantity",
        "subtotal",
    )

    def subtotal(self, item):
        return item.subtotal


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "phone",
        "payment_method",
        "status",
        "total",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_method",
        "created_at",
    )

    search_fields = (
        "customer_name",
        "phone",
        "address",
        "sector",
    )

    readonly_fields = (
        "subtotal",
        "delivery_fee",
        "total",
        "created_at",
    )

    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "product_name",
        "unit_price",
        "quantity",
        "subtotal",
    )

    search_fields = (
        "product_name",
        "order__customer_name",
    )

    def subtotal(self, item):
        return item.subtotal