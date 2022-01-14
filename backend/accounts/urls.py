from django.urls import path
from .views import GetCSRFToken, SignUpView, LogInView, CheckAuthentication, LogOutView, DeleteAccountView

urlpatterns = [
    path('get_csrf_cookie', GetCSRFToken.as_view()),
    path('register', SignUpView.as_view()),
    path('login', LogInView.as_view()),
    path('check_authentication', CheckAuthentication.as_view()),
    path('logout', LogOutView.as_view()),
    path('delete', DeleteAccountView.as_view())
]
