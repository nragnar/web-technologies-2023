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

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item)