from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from notifications.models import Notification
from .models import Order

STATUS_MESSAGES = {
    "confirmed": (
        "Pedido confirmado",
        "Tu pedido #{id} ha sido confirmado."
    ),
    "preparing": (
        "Pedido en preparación",
        "Tu pedido #{id} está siendo preparado."
    ),
    "on_the_way": (
        "Pedido en camino",
        "Tu pedido #{id} ya va en camino."
    ),
    "delivered": (
        "Pedido entregado",
        "Tu pedido #{id} fue entregado correctamente."
    ),
    "cancelled": (
        "Pedido cancelado",
        "Tu pedido #{id} ha sido cancelado."
    ),
}

@receiver(post_save, sender=Order)
def create_order_notification(sender, instance, created, **kwargs):
    if not created or not instance.user:
        return

    Notification.objects.create(
        user=instance.user,
        title="Pedido recibido",
        message=f"Recibimos tu pedido #{instance.id} correctamente.",
    )

@receiver(pre_save, sender=Order)
def create_order_status_notification(sender, instance, **kwargs):
    if not instance.pk or not instance.user:
        return

    try:
        previous_order = Order.objects.get(pk=instance.pk)
    except Order.DoesNotExist:
        return

    if previous_order.status == instance.status:
        return

    notification_data = STATUS_MESSAGES.get(instance.status)

    if not notification_data:
        return

    title, message = notification_data

    Notification.objects.create(
        user=instance.user,
        title=title,
        message=message.format(id=instance.id),
    )