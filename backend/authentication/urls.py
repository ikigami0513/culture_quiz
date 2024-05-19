from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name="api_login"),
    path('login/token/', LoginFromTokenAPIView.as_view(), name="api_login_token"),
    path('register/', RegisterAPIView.as_view(), name="api_register")
]
