from django.urls import path
from .views import *

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='categories'),
    path('quiz/', QuizAPIView.as_view(), name='quiz')
]
