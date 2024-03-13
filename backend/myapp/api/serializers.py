from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Item, Cart, PurchasedItem, SoldItem
from django.utils.timezone import timezone

# convert to JSON
class ItemSerializer(ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    
    class Meta:
        model = Item
        fields = '__all__'
    
    def get_item_notification(self, obj):
        if obj.item_notification:
            return obj.item_notification
        return None

class LoginSerializer(serializers.Serializer):
        username = serializers.CharField()
        password = serializers.CharField()


class RegisterSerializer(serializers.Serializer):
        username = serializers.CharField()
        password = serializers.CharField()

class ChangePasswordSerializer(serializers.Serializer):
     old_password = serializers.CharField()
     new_password = serializers.CharField()

class CartSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']

class UserSerializer(serializers.ModelSerializer):
     #items = serializers.PrimaryKeyRelatedField(many=True, queryset=Item.objects.all())
     cart = CartSerializer()

     class Meta:
          model = User
          fields = ['id', 'username', 'cart']

class PurchasedItemSerializer(serializers.ModelSerializer):
     title = serializers.ReadOnlyField(source='item.title')
     description = serializers.ReadOnlyField(source='item.description')
     price = serializers.ReadOnlyField(source='item.price')
     date = serializers.ReadOnlyField(source='item.date')
     
     class Meta:
          model = PurchasedItem
          fields = ['id', 'title', 'date', 'description', 'price']


class SoldItemSerializer(serializers.ModelSerializer):
    title = serializers.ReadOnlyField(source='item.title')
    description = serializers.ReadOnlyField(source='item.description')
    price = serializers.ReadOnlyField(source='item.price')
    date = serializers.ReadOnlyField(source='item.date')
    
    class Meta:
        model = SoldItem
        fields = ['id', 'title', 'date', 'description', 'price']