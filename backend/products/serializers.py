from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "image",
        ]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(
        read_only=True
    )

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "image",
            "category",
            "category_id",
            "available",
            "is_offer",
            "discount_percentage",
            "old_price",
        ]

    def validate(self, attrs):
        is_offer = attrs.get(
            "is_offer",
            getattr(
                self.instance,
                "is_offer",
                False,
            ),
        )

        discount_percentage = attrs.get(
            "discount_percentage",
            getattr(
                self.instance,
                "discount_percentage",
                0,
            ),
        )

        old_price = attrs.get(
            "old_price",
            getattr(
                self.instance,
                "old_price",
                None,
            ),
        )

        if is_offer:
            if discount_percentage <= 0:
                raise serializers.ValidationError(
                    {
                        "discount_percentage":
                            "La oferta debe tener un descuento mayor a 0."
                    }
                )

            if old_price is None:
                raise serializers.ValidationError(
                    {
                        "old_price":
                            "Debes indicar el precio anterior."
                    }
                )

        return attrs