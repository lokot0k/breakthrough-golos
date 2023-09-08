from django.urls import path
from .views import poll, IPPoll

urlpatterns = [
    # path('', views.index, name="index"),
    path('', poll.PollView.as_view(), name="poll"),
    path('vote/', IPPoll.IPPollView.as_view(), name="IPPoll"),
    path('<str:uuid>', poll.PollView.as_view(), name="poll_all")
]
