from django.urls import path
from .views import Stuent_List,generate_otp,verify_otp,admin_login
urlpatterns=[
    path("student/",Stuent_List),
    path("generate_otp/",generate_otp),
    path("verify_otp/",verify_otp),
    path('admin-login/', admin_login),
]