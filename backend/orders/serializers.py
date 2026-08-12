from rest_framework import serializers

from products.models import Product
from .models import Order, OrderItem


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem

        fields = [
            "id",
            "product",
            "product_name",
            "unit_price",
            "quantity",
            "subtotal",
        ]


class OrderSerializer(serializers.ModelSerializer):
    # Se usa para recibir los productos al crear el pedido
    items = OrderItemCreateSerializer(
        many=True,
        write_only=True,
    )

    # Se usa internamente para devolver los productos
    order_items = OrderItemSerializer(
        source="items",
        many=True,
        read_only=True,
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "customer_name",
            "phone",
            "sector",
            "address",
            "reference",
            "payment_method",
            "subtotal",
            "delivery_fee",
            "total",
            "status",
            "created_at",
            "items",
            "order_items",
        ]

        read_only_fields = [
            "subtotal",
            "delivery_fee",
            "total",
            "status",
            "created_at",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        subtotal = 0

        order = Order.objects.create(
            **validated_data,
            subtotal=0,
            delivery_fee=100,
            total=0,
        )

        for item_data in items_data:
            product = Product.objects.get(
                id=item_data["product_id"]
            )

            quantity = item_data["quantity"]

            item_subtotal = (
                product.price * quantity
            )

            subtotal += item_subtotal

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                unit_price=product.price,
                quantity=quantity,
            )

        order.subtotal = subtotal

        order.total = (
            subtotal + order.delivery_fee
        )

        order.save()

        return order

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # React espera que los productos se llamen "items"
        data["items"] = data.pop(
            "order_items",
            []
        )

        return data