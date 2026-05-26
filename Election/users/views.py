from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .models import Student, OTP
from .serializers import StudentSerializer
import random
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.contrib.auth import authenticate


@api_view(['GET'])
def student_list(request):
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)


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

    otp = random.randint(100000, 999999)

    OTP.objects.filter(student=student, is_used=False).delete()

    expiry_time = timezone.now() + timedelta(minutes=5)
    OTP.objects.create(
        student=student,
        otp_code=str(otp),
        expires_at=expiry_time
    )

    # ✅ Check email settings before sending
    if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
        return Response({"error": "Email not configured on server"}, status=500)

    try:
        send_mail(
            subject="Voting System OTP",
            message=f"Your OTP for the College Election Portal is: {otp}\n\nThis OTP expires in 5 minutes.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        print("Email error:", str(e))
        return Response({"error": f"Email sending failed: {str(e)}"}, status=500)

    return Response({"message": "OTP sent successfully"})


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

    return Response({"message": "Login successful", "roll_no": roll_no})


@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        return Response({"message": "Admin login success", "role": "admin"})

    return Response({"message": "Invalid admin credentials"}, status=401)