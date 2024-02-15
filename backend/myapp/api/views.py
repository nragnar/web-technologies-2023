from rest_framework.viewsets import ModelViewSet
from ..models import Item, Cart
from .serializers import ItemSerializer
from .serializers import UserSerializer
from .serializers import CartSerializer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .serializers import LoginSerializer, RegisterSerializer
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

class ItemList(generics.ListCreateAPIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
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
            return Response("User not authenticated", status=status.HTTP_401_UNAUTHORIZED)
        
         # Check if the item belongs to the current user
        item = get_object_or_404(Item, pk=item_id)
        if item.owner == user:
            return Response("Cannot add your own item to the cart", status=status.HTTP_400_BAD_REQUEST)

        item = get_object_or_404(Item, pk=item_id)
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