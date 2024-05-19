from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from .models import Category
from .serializers import QuestionSerializer, CategorySerializer
import random

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.annotate(num_questions=Count('questions'))
        queryset = queryset.filter(num_questions__gte=10)
        return queryset

class QuizAPIView(APIView):
    def get(self, request):
        category_id = request.GET.get('category')

        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({
                "error": "Category not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        questions = category.questions.all()

        if len(questions) < 10:
            return Response({
                "error": "Not enough questions in this category"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        random_questions = random.sample(list(questions), 10)
        serializer = QuestionSerializer(random_questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)