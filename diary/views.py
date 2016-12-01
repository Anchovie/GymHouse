from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from mainpage.models import Profile
from mainpage.models import Registration

"""
def index(request):
    return HttpResponse("This is the exercise diary page/profile");
"""
@login_required
def diary_view(request):
    userProfile=Profile.objects.get(user=request.user)
    registrations = userProfile.registrations.all().order_by('-date')
    print(userProfile.first_name)
    print(registrations)
    context = {'user': request.user,
            'registrations': registrations, 
            'logged_in': request.user.is_authenticated}

    return render(request, 'diary/diary_template.html', context)

# Create your views here.
