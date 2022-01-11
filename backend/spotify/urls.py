from django.urls import path, include
from .views import AuthURL, Is_Authenticated, spotify_callback

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', Is_Authenticated.as_view())
]