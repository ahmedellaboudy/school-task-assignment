from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'), 
    
    path('signup/', views.signup_page, name='signup_page'),
    path('login/', views.login_page, name='login_page'),

    path('api/signup/', views.signup_api, name='signup_api'),
    path('api/login/', views.login_api, name='login_api'),
    path('api/logout/', views.logout_api, name='logout_api'),
    path('api/me/', views.me_api, name='me_api'),
]