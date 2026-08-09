from django.db import models

from products.models import Product


class Order(models.Model):
    PAYMENT_METHODS = [
        ("cash", "Efectivo"),
        ("transfer", "Transferencia"),
        ("card", "Tarjeta"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pendiente"),
        ("confirmed", "Confirmado"),
        ("preparing", "Preparando"),
        ("on_the_way", "En camino"),
        ("delivered", "Entregado"),
        ("cancelled", "Cancelado"),
    ]

    customer_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    sector = models.CharField(max_length=120)
    address = models.CharField(max_length=255)
    reference = models.TextField(blank=True)

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS,
        default="cash",
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=100,
    )

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"

    def __str__(self):
        return f"Pedido #{self.id} - {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items",
    )

    product_name = models.CharField(max_length=150)
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = "Producto del pedido"
        verbose_name_plural = "Productos del pedido"

    @property
    def subtotal(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.product_name}"