"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from myapp.api import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', views.LoginUser.as_view()),
    path('api/register/', views.RegisterUser.as_view()),
    path('api/edit-account/', views.ChangePassword.as_view()),
    path('api/items/', views.ItemList.as_view()),
    path('api/items/<int:pk>/', views.ItemDetail.as_view()),
    path('api/users/', views.UserList.as_view()),
    path('api/populate/', views.populate),
    path('api/personal-items/', views.PersonalItems.as_view(), name='personal-items'),
    path('api/users/<int:pk>/', views.UserDetail.as_view()),
    path('api/users/cart/', views.CartDetail.as_view(), name='user-cart-detail'),
    path('api/add-to-cart/', views.AddToCart.as_view(), name='add-to-cart'),
    path('api/remove-from-cart/<int:item_id>/', views.RemoveFromCart.as_view(), name='remove-from-cart'),
    path('api/purchased-items/', views.PurchasedItemList.as_view(), name='purchased-items'),
    path('api/pay-items/', views.PayForItems.as_view(), name="pay-items"),
    path('api/sold-items/', views.SoldItemList.as_view(), name="sold_items"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
