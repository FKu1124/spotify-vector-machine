from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.contrib import auth
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect

from django.http import HttpResponseRedirect

import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import DjangoSessionCacheHandler
# Create your views here.

scope = "user-read-email"
client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set' })

@method_decorator(csrf_protect, name='dispatch')
class LoginWithSpotify(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            cache_handler = DjangoSessionCacheHandler(request=request)
            auth_manager = SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope, cache_handler=cache_handler)
            
            # Case 2: Spotify responds to auth attempt via given callback uri
            if self.request.GET.get("code"):
                auth_manager.get_access_token(self.request.GET.get("code"))

                spotify = spotipy.Spotify(auth_manager=auth_manager)
                user_data = spotify.me()
                username = user_data['id']
                email = user_data['email']
                first_name = user_data['display_name']

                # TODO: Solve password issue 
                password = "BASEPASSWORD1234s"
                if not User.objects.filter(username=username).exists():
                    # Create User
                    user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name)
                    user.save()
                # Sign User in
                user = auth.authenticate(username=username, password=password)
                auth.login(request, user)
                
                return HttpResponseRedirect(redirect_to=f"http://localhost:3000/home?user={first_name}")

            # Case 1: User initiates authentication and retrieves auth_url
            if not auth_manager.validate_token(cache_handler.get_cached_token()):
                auth_url = auth_manager.get_authorize_url()
                return Response({ 'auth_url': auth_url })

        except Exception as e:
            print("----------------------------------")
            print(e)
            return HttpResponseRedirect(redirect_to="http://localhost:3000/login?error=true")
        # Case 3: User is already authenticated with Spotify 
        # return Response({ 'status': 'Success', 'me': spotify.me() })

@method_decorator(csrf_protect, name='dispatch')
class CheckAuthentication(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            return Response({ 'status': True if request.session.get('_auth_user_id', 0) else False, 'msg': '' }, status=status.HTTP_200_OK)
        except:
            return Response({ 'error': 'Error checking authentication' })


@method_decorator(csrf_protect, name='dispatch')
class GetUserProfile(APIView):

    def get(self, request, format=None):
        try:
            user = self.request.user
            user = User.objects.get(username=user.username)

            return Response({ 'status': True, 'data': { 'username': user.first_name } }, status=status.HTTP_200_OK)
        except:
            return Response({ 'status': False, 'msg': 'Error while loading user data' }, status=status.HTTP_403_FORBIDDEN)




@method_decorator(csrf_protect, name='dispatch')
class LogOutView(APIView):
    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Successfully logged out' })
        except:
            return Response({ 'error': 'Error while logging out' })

class DeleteAccountView(APIView):
    def delete(self, request, format=None):

        try:
            user = self.request.user
            user = User.objects.filter(username=user.username).delete()
            return Response({ 'success': 'User deleted successfully' })
        except:
            return Response({ 'error': 'Error deleting user' })