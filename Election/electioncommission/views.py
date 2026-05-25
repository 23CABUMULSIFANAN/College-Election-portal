from rest_framework.response import Response
from rest_framework.decorators import api_view
from users.models import Student
from .models import Position,Candidate,Vote,Election,ElectionSettings
from .serializers import PositionSerializer,CandidateSerializer
from django.db.models import Count
from django.utils import timezone


@api_view(['GET'])
def position_list(request):
    position=Position.objects.all()
    serializer=PositionSerializer(position,many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def candidate_list(request):

    if request.method == 'GET':

        candidates = Candidate.objects.all()

        serializer = CandidateSerializer(
            candidates,
            many=True
        )

        return Response(serializer.data)

    elif request.method == 'POST':

        serializer = CandidateSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )
@api_view(['DELETE'])
def delete_candidate(request, id):

    try:

        candidate = Candidate.objects.get(id=id)

    except Candidate.DoesNotExist:

        return Response(
            {"error": "Candidate not found"},
            status=404
        )

    candidate.delete()

    return Response({
        "message": "Candidate deleted"
    })
@api_view(['POST'])
def vote_cast(request):

    roll_no = request.data.get('roll_no')
    candidate_id = request.data.get('candidate_id')

    if not roll_no or not candidate_id:

        return Response(
            {"error": "Roll number and candidate ID required"},
            status=400
        )

    try:

        student = Student.objects.get(
            roll_no=roll_no
        )

    except Student.DoesNotExist:

        return Response(
            {"error": "Student Not Found"},
            status=400
        )

    try:

        candidate = Candidate.objects.get(
            id=candidate_id
        )

    except Candidate.DoesNotExist:

        return Response(
            {"error": "Candidate Not Found"},
            status=400
        )

    # CHECK ELECTION FIRST
    try:

        election = Election.objects.get(
            is_active=True
        )

    except Election.DoesNotExist:

        return Response(
            {"error": "No Active Election"},
            status=400
        )

    current_time = timezone.now()

    if current_time > election.end_date:

        return Response(
            {"error": "Election Ended"},
            status=400
        )

    position = candidate.position

    already_voted = Vote.objects.filter(
        voter=student,
        position=position
    ).exists()

    if already_voted:

        return Response(
            {"error": "Already Voted"},
            status=400
        )

    # CREATE VOTE LAST
    Vote.objects.create(
        voter=student,
        candidate=candidate,
        position=position
    )

    return Response({
        "message": "Vote Casted Successfully"
    })

from django.db.models import Count
from rest_framework.response import Response
from rest_framework.decorators import api_view
from electioncommission.models import Vote

@api_view(['GET'])
def results(request):

    position_name = request.GET.get("position")

    votes = Vote.objects.all()

    if position_name:
        votes = votes.filter(position__pos_name=position_name)

    data = votes.values(
        "candidate__student__name",
        "position__pos_name"
    ).annotate(
        total_votes=Count("id")
    )

    result = []

    for item in data:
        result.append({
            "candidate": item["candidate__student__name"],
            "position": item["position__pos_name"],
            "total_votes": item["total_votes"]
        })

    return Response(result)

@api_view(['GET'])
def winners(request):

    data = Vote.objects.values(
        "position__pos_name",
        "candidate__student__name"
    ).annotate(
        total_votes=Count("id")
    )

    results = {}

    for item in data:

        position = item["position__pos_name"]
        candidate = item["candidate__student__name"]
        votes = item["total_votes"]

        if position not in results:
            results[position] = {
                "winner": candidate,
                "votes": votes
            }
        else:
            if votes > results[position]["votes"]:
                results[position] = {
                    "winner": candidate,
                    "votes": votes
                }

    return Response(results)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ElectionSettings


from django.http import JsonResponse

def results_status(request):

    settings = ElectionSettings.objects.first()

    if not settings:
        return JsonResponse({
            "released": False
        })

    return JsonResponse({
        "released": settings.results_released
    })

from .models import Candidate

@api_view(['GET'])
def election_results(request):

    settings = ElectionSettings.objects.first()

    if not settings or not settings.results_released:
        return Response({
            "message": "Results not released"
        }, status=403)

    candidates = Candidate.objects.all()

    data = []

    for candidate in candidates:
        data.append({
            "id": candidate.id,
            "student_name": candidate.student.name,
            "position_name": candidate.position.name,
            "vote_count": candidate.vote_count
        })

    return Response(data)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ElectionSettings

@api_view(['POST'])
def toggle_results(request):

    settings, created = ElectionSettings.objects.get_or_create(id=1)

    settings.results_released = not settings.results_released

    settings.save()

    return Response({
        "released": settings.results_released
    })