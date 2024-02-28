from django.db import models
from datetime import datetime
from django.conf import settings
# Create your models here.

class Item(models.Model):
    title = models.CharField(max_length = 30)
    description = models.CharField(max_length = 100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, to_field="username", null=False, on_delete=models.CASCADE, default=None)
    previous_price = models.DecimalField(max_digits=8, decimal_places=2, null=True)

    def save(self, *args, **kwargs):
        if self.pk:
            old_item = Item.objects.get(pk=self.pk)
            if old_item.price != self.price:
                self.previous_price = old_item.price
        super(Item, self).save(*args, **kwargs)

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item)


class PurchasedItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class SoldItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sold_items")
