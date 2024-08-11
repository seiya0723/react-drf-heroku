from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TopicSerializer
from .models import Topic

class TopicView(viewsets.ModelViewSet):
    serializer_class    = TopicSerializer
    queryset            = Topic.objects.all()




