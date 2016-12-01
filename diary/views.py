from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from mainpage.models import Profile
from mainpage.models import Registration
from datetime import datetime


"""
def index(request):
    return HttpResponse("This is the exercise diary page/profile");
"""
@login_required
def diary_view(request):
    userProfile=Profile.objects.get(user=request.user)
    registrations = userProfile.registrations.all().order_by('-date')
    
    #print("DATE")
    #print(datetime.strptime(reg.date, "%Y-%m-%d"))

    for reg in registrations:
        if reg.passed == False:
            #print("comparing these dates:")
            #print(reg.date)
            #print(datetime.now().date())
            #d = datetime.strptime(reg.date, "%Y-%m-%d")
            if reg.date < datetime.now().date():
                #print("It has passed")
                reg.passed = True
                reg.save()

    passed_registrations = registrations.filter(passed=True)
    registrations = registrations.filter(passed=False)

    #print(userProfile.first_name)
    #print("REGS:")
    #print(registrations)
    #print("Passed")
    #print(passed_registrations)
    context = {'user': request.user,
            'registrations': registrations, 
            'passed': passed_registrations,
            'logged_in': request.user.is_authenticated}

    return render(request, 'diary/diary_template.html', context)

# Create your views here.
