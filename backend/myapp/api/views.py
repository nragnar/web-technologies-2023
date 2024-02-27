from rest_framework.viewsets import ModelViewSet
from ..models import Item, Cart, PurchasedItem, SoldItem
from .serializers import ItemSerializer
from .serializers import UserSerializer
from .serializers import CartSerializer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .serializers import LoginSerializer, RegisterSerializer, PurchasedItemSerializer, SoldItemSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from myapp.api.permissions import IsOwnerOrReadOnly
from rest_framework import generics
from rest_framework import filters
from django.db import transaction
from django.utils import timezone
from django.db.models import Subquery

class ItemList(generics.ListCreateAPIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # Exclude items that have been purchased
        purchased_item_ids = PurchasedItem.objects.values('item_id')
        queryset = Item.objects.exclude(id__in=Subquery(purchased_item_ids))
    
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # filter functionality
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']

class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

from django.contrib.auth.models import User


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LoginUser(APIView):
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        """
        Login a User
        """
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response("not valid", status=400)
        user = authenticate(
            username=serializer.data["username"], password=serializer.data["password"]
        )
        if user is not None:
            login(request, user)
            return Response(f'is logged in: {user.get_username()}')
        
        return Response(f'No user named {request.data["username"]}', status=404)
    

class RegisterUser(APIView):

    serializer_class = RegisterSerializer

    def post(self, request, format=None):
        """
        Register a User
        """
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response("not valid", status=400)
        user = User.objects.create_user(username=serializer.data["username"], password=serializer.data["password"])
        if user is not None:
            return Response(f'is registered: {user.get_username()}')
        return Response(f'No user named {request.data["username"]}', status=404)
    

class CartDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def get_object(self):
        user = self.request.user
        cart = Cart.objects.get(user=user)
        return cart
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class AddToCart(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        item_id = request.data.get('item_id')
        user = request.user
        if not user.is_authenticated:
            return Response("You are not logged in", status=status.HTTP_401_UNAUTHORIZED)
        
         # Check if the item belongs to the current user
        item = get_object_or_404(Item, pk=item_id)
        if item.owner == user:
            return Response("Cannot add your own item to the cart", status=status.HTTP_400_BAD_REQUEST)

        cart, created = Cart.objects.get_or_create(user=user)
        cart.items.add(item)
        cart.save()        
        return Response("Item added to cart", status=status.HTTP_201_CREATED)

    
class RemoveFromCart(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id, format=None):
        user = request.user
        if not user.is_authenticated:
            return Response("User not authenticated", status=status.HTTP_401_UNAUTHORIZED)
        cart = get_object_or_404(Cart, user=user)
        item = get_object_or_404(cart.items, pk=item_id)
        cart.items.remove(item)
        return Response("Item removed from cart", status=status.HTTP_204_NO_CONTENT)
    

class PayForItems(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            cart = Cart.objects.get(user=user)
            items = cart.items.all()

            with transaction.atomic():
                purchased_items = []
                for item in items:
                    # Create a new instance of the Item model for the purchased item
                    purchased_item = Item.objects.create(
                        title=item.title,
                        description=item.description,
                        price=item.price,
                        owner=user
                    )

                    # Create a new PurchasedItem instance for the purchased item
                    purchased_item_record = PurchasedItem.objects.create(
                        item=purchased_item,
                        buyer=user
                    )

                    # Add the purchased item to the purchased items list
                    purchased_items.append(purchased_item_record)

                    # Remove the item from the cart
                    item.delete()
                    cart.items.remove(item)
                
                # Clear the cart
                cart.items.clear()

            serializer = PurchasedItemSerializer(purchased_items, many=True)
            return Response(serializer.data)

        except Cart.DoesNotExist:
            return Response("Cart not found", status=status.HTTP_404_NOT_FOUND)
        
class PurchasedItemList(generics.ListAPIView):
    serializer_class = PurchasedItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return PurchasedItem.objects.filter(buyer=user)

class SoldItem(APIView):
    def post(self, request, item_id):
        try:
            # Retrieve the item
            item = get_object_or_404(Item, pk=item_id)

            # Retrieve the original seller of the item
            original_seller = item.owner

            # Create a new instance of SoldItem
            sold_item = SoldItem.objects.create(
                item=item,
                seller=original_seller
            )

            # Optionally, you can remove the item from the list of available items
            # item.delete()

            # Add the sold item to the original seller's sold items list
            original_seller.sold_items.add(sold_item)

            # Serialize the sold item
            serializer = SoldItemSerializer(sold_item)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
class SoldItemList(generics.ListAPIView):
    serializer_class = SoldItemSerializer
    permission_classes = [IsAuthenticated]  # Require authentication to access the sold items list

    def get_queryset(self):
        user = self.request.user
        return SoldItem.objects.filter(seller=user)