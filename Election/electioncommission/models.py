from django.db import models
from users.models import Student
class Position(models.Model):
    pos_name=models.CharField(max_length=100)
    description=models.TextField(blank=True,null=True)
    def __str__(self):
        return self.pos_name

class Candidate(models.Model):
    student=models.ForeignKey(Student,on_delete=models.CASCADE)
    position=models.ForeignKey(Position,on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.student.name} - {self.position.pos_name}"

class Vote(models.Model):
    voter=models.ForeignKey(Student,on_delete=models.CASCADE)
    candidate=models.ForeignKey(Candidate,on_delete=models.CASCADE)
    position=models.ForeignKey(Position,on_delete=models.CASCADE)
    voted_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together=('voter','position')

    def __str__(self):
        return f"{self.voter.roll_no} - {self.candidate}"
    
class Election(models.Model):
    title = models.CharField(max_length=200)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
class ElectionSettings(models.Model):
    results_released = models.BooleanField(default=False)