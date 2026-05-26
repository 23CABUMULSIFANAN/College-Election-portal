from django.urls import path
from .views import student_list,generate_otp,verify_otp,admin_login
urlpatterns=[
    path("student/",student_list),
    path("generate_otp/",generate_otp),
    path("verify_otp/",verify_otp),
    path('admin-login/', admin_login),
]