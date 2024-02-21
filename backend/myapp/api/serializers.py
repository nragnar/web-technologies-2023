from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Item, Cart
from django.utils.timezone import timezone

# convert to JSON
class ItemSerializer(ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    
    class Meta:
        model = Item
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
        username = serializers.CharField()
        password = serializers.CharField()


class RegisterSerializer(serializers.Serializer):
        username = serializers.CharField()
        password = serializers.CharField()

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