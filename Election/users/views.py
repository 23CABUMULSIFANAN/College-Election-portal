from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student, OTP
import random
import os
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import authenticate
from .serializers import StudentSerializer
import resend


@api_view(['GET'])
def student_list(request):
    try:
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def generate_otp(request):
    roll_no = request.data.get('roll_no')
    email = request.data.get('email')

    if not roll_no or not email:
        return Response({"error": "Roll number and Email ID is required"}, status=400)

    try:
        student = Student.objects.get(roll_no=roll_no, email=email)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=400)
    except Exception as e:
        return Response({"error": f"Database error: {str(e)}"}, status=500)

    otp = random.randint(100000, 999999)

    OTP.objects.filter(student=student, is_used=False).delete()
    expiry_time = timezone.now() + timedelta(minutes=5)
    OTP.objects.create(
        student=student,
        otp_code=str(otp),
        expires_at=expiry_time
    )

    try:
        resend.api_key = os.environ.get("RESEND_API_KEY")
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": email,
            "subject": "Voting System OTP",
            "text": f"Your OTP for College Election Portal is: {otp}\n\nExpires in 5 minutes. Do not share this with anyone."
        })
        print(f"OTP email sent to {email}")
    except Exception as e:
        print(f"Email error: {str(e)}")

    return Response({
        "message": "OTP sent successfully",
       
    })


@api_view(['POST'])
def verify_otp(request):
    roll_no = request.data.get('roll_no')
    otp = request.data.get('otp')

    if not roll_no or not otp:
        return Response({"error": "Roll number and OTP required"}, status=400)

    try:
        student = Student.objects.get(roll_no=roll_no)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=400)
    except Exception as e:
        return Response({"error": f"Database error: {str(e)}"}, status=500)

    otp_record = OTP.objects.filter(
        student=student,
        otp_code=otp,
        is_used=False
    ).order_by('-created_at').first()

    if not otp_record:
        return Response({"error": "Invalid OTP"}, status=400)

    if timezone.now() > otp_record.expires_at:
        return Response({"error": "OTP expired"}, status=400)

    otp_record.is_used = True
    otp_record.save()

    return Response({
        "message": "Login successful",
        "roll_no": roll_no
    })


@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    try:
        user = authenticate(username=username, password=password)
    except Exception as e:
        return Response({"error": f"Auth error: {str(e)}"}, status=500)

    if user is not None and user.is_staff:
        return Response({
            "message": "Admin login success",
            "role": "admin"
        })

    return Response({"message": "Invalid admin credentials"}, status=401)

from django.contrib.auth.models import User

@api_view(['GET'])
def reset_admin_password(request):
    try:
        user = User.objects.get(username='admin')
        user.set_password('admin123')
        user.save()
        return Response({"message": "Password reset to admin123"})
    except User.DoesNotExist:
        return Response({"message": "Admin not found"}, status=404)
@api_view(['GET'])
def create_admin(request):
    try:
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                password='admin123',
                email='umulsifananasarali@gmail.com'
            )
            return Response({"message": "Admin created successfully"})
        else:
            user = User.objects.get(username='admin')
            user.set_password('admin123')
            user.save()
            return Response({"message": "Admin password reset to admin123"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)