from django.urls import path
from .views import (
    position_list, vote_cast, candidate_list,
    results, delete_candidate, winners,
    toggle_results, results_status, election_results
)

urlpatterns = [
    path("positions/", position_list),
    path("candidates/", candidate_list),
    path("vote/", vote_cast),
    path("results/", election_results),        # ✅ one results route
    path("results/status/", results_status),   # ✅ specific routes first
    path("results/toggle/", toggle_results),
    path("winners/", winners),
    path("candidates/<int:id>/", delete_candidate),
]