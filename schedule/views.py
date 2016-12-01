from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from mainpage.models import Event
from mainpage.models import Class
from mainpage.models import Profile
from mainpage.models import Registration
import json
from django.core import serializers


"""
def index(request):
    return HttpResponse("This is the schedule/calendar page");
"""
@ensure_csrf_cookie
@login_required
def calendar_view(request):
    csrf_token = get_token(request)
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

#@ensure_csrf_cookie
def ajax_entry_registration(request):
    csrf_token = get_token(request)
    if request.method == "POST" and request.is_ajax:
        print("Received post:")
        print(request.POST)
        print("mydict:")
        myDict = dict(request.POST.iterlists())
        print(myDict)
        #print(hack(myDict,"name"))
        print(myDict.get("JS"))
        decoded = json.loads(request.POST.get("JS"))
        date = request.POST.get("dateOfEntry")
        entryType = request.POST.get("eType")
        print("DATE AND TYPE:")
        print(date)
        print(entryType)
        print("DECODED")
        print(decoded)
        print("-------")



        obj = decoded.get("fields")
        print(obj)
        print(obj.get("date"))
        userProfile=Profile.objects.get(user=request.user)
        trainerProfile = Profile.objects.get(pk=obj.get("trainer"))
        newEntry = Registration(
            name=obj.get("name"),
            description=obj.get("description"),
            entryType = entryType,
            trainer = trainerProfile,
            level = obj.get("level"),
            date = date,
            time = obj.get("time"),
            owner = userProfile,
            comment = "WOW SUCH FUN",
            passed = False,
        )

        newEntry.save()
        userProfile.registrations.add(newEntry)
        print(newEntry)
        print("NEW:")
        print(userProfile.registrations)
        userProfile.save()
        #new entry = ....pk=ajax
        #
    return HttpResponse()

def hack(d, var):
    return d.get("entryObj[fields]["+var+"]")[0]