from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from mainpage.models import Event
from mainpage.models import Class
from mainpage.models import Profile
import json
from django.core import serializers


"""
def index(request):
    return HttpResponse("This is the schedule/calendar page");
"""
@login_required
def calendar_view(request):
    events = Event.objects.all().order_by('date')
    events = serializers.serialize('json', events)
    classes = Class.objects.all().order_by('begin_date')
    classes = serializers.serialize('json', classes)

    users = {}
    user_objects = Profile.objects.all()
    for user in user_objects :
        users[user.pk]=(str(user.first_name)+" "+str(user.last_name))

    levels = {1:'Beginner',2:'Intermediate',3:'Advanced',4:'Expert'}


    context = {'user': request.user, 
            'logged_in': request.user.is_authenticated,
            'events': events,
            'classes': classes,
            'users': users,
            'levels':levels}

    return render(request, 'schedule/schedule_template.html', context);
