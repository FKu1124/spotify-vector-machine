from django.urls import path
from .views import LoginWithSpotify, GetCSRFToken, CheckAuthentication, LogOutView, DeleteAccountView

urlpatterns = [
    path('get_csrf_token', GetCSRFToken.as_view()),
    path('check_authentication', CheckAuthentication.as_view()),
    path('logout', LogOutView.as_view()),
    path('delete', DeleteAccountView.as_view()),
    path('loginwithspotify', LoginWithSpotify.as_view()),
]
