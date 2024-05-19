import json
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.hashers import make_password
from rest_framework import status
from .models import User

class LoginAPIView(APIView):
    def post(self, request):
            try:
                data = json.loads(request.body)
                username = data.get("username")
                password = data.get("password")
            except json.JSONDecodeError:
                return Response({
                    "message": "Invalid JSON data."
                }, status=status.HTTP_400_BAD_REQUEST)

            if username is None or password is None:
                return Response({
                    "message": "Le nom d'utilisateur et le mot de passe sont requis."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user: User = authenticate(request, username=username, password=password)
            if user is None:
                return Response({
                    "message": "Le nom d'utilisateur ou/et le mot de passe sont incorrects."
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            token, created = Token.objects.get_or_create(user=user)

            return Response({
               "username": user.username,
               "email": user.email,
               "token": token.key
            })
    
class LoginFromTokenAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "token": request.user.auth_token.key
        })
    
class RegisterAPIView(APIView):
     def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
        except json.JSONDecodeError:
            return Response({
                "message": "Invalid JSON data."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not username or not email or not password:
            return Response({
                "message": "Le nom d'utilisateur, l'adresse email et le mot de passe sont requis."
            }, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({
                "message": "Ce nom d'utilisateur est déjà pris."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({
                "message": "Cette adresse email est déjà lié à un autre compte."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create(
                username=username,
                email=email,
                password=make_password(password)
            )
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                "message": "Une erreur est survenue pendant la création de votre compte.",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)