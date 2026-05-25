from django.db import models
from django.utils import timezone
from datetime import timedelta

class Student(models.Model):
    roll_no=models.CharField(max_length=20,unique=True)
    name=models.CharField(max_length=100)
    email=models.EmailField(max_length=50,unique=True)
    department=models.CharField(max_length=100,blank=True,null=True)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.roll_no
    
class OTP(models.Model):
    student=models.ForeignKey(Student,on_delete=models.CASCADE)
    otp_code=models.CharField(max_length=6)
    created_at=models.DateTimeField(auto_now_add=True)
    expires_at=models.DateTimeField()
    is_used=models.BooleanField(default=False)

    def save(self,*args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=5)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.student.roll_number} - {self.otp_code}"
    

