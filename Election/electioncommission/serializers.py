from rest_framework import serializers
from .models import Position, Candidate

class PositionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Position
        fields = '__all__'


class CandidateSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source='student.name',
        read_only=True
    )

    position_name = serializers.CharField(
        source='position.pos_name',
        read_only=True
    )

    class Meta:
        model = Candidate

        fields = [
            'id',
            'student_name',
            'position_name',
        ]