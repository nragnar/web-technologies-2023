from rest_framework.routers import DefaultRouter
from myapp.api.urls import post_router
from django.urls import path, include

router = DefaultRouter()

# myapp
router.registry.extend(post_router.registry)

urlpatterns = [
    path('', include(router.urls))
]

# otherapp