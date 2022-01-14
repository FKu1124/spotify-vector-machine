from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from django.contrib import auth
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect

# Create your views here.

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set' })

@method_decorator(csrf_protect, name='dispatch')
class SignUpView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']
        conf_password = data['conf_password']

        try:
            if password == conf_password:
                if User.objects.filter(username=username).exists():
                    return Response({ 'error': 'Username already exists' })
                else:
                    if len(password) < 8:
                        return Response({ 'error': 'Password must be at least 8 characters long' })
                    else:
                        user = User.objects.create_user(username=username, password=password)
                        user.save()

                        # TODO: Get Spotify Auth Here

                        return Response({ 'success': 'User created successfully' })
            else:
                return Response({ 'error': 'Passwords do not match' })
        except:
            return Response({ 'error': 'Error while signing up' })

@method_decorator(csrf_protect, name='dispatch')
class CheckAuthentication(APIView):
    def get(self, request, format=None):
        try:
            isAuthenticated = User.is_authenticated

            if isAuthenticated:
                return Response({ 'isAuthenticated': True })
            else:
                return Response({ 'isAuthenticated': False })
        except:
            return Response({ 'error': 'Error checking authentication' })

@method_decorator(csrf_protect, name='dispatch')
class LogInView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data
        username = data['username']
        password = data['password']

        try:
            user = auth.authenticate(username=username, password=password)

            if user is not None:
                auth.login(request, user)
                return Response({ 'success': 'Logged in successfully', 'username': username })
            else:
                return Response({ 'error': 'Error authenticating' })
        except:
            return Response({ 'error': 'Error logging in' })

class LogOutView(APIView):
    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Successfully logged out' })
        except:
            return Response({ 'error': 'Error while logging out' })

class DeleteAccountView(APIView):
    def delete(self, request, format=None):
        user = self.request.user

        try:
            user = User.objects.filter(id=user.id).delete()
            return Response({ 'success': 'User deleted successfully' })
        except:
            return Response({ 'error': 'Error deleting user' })