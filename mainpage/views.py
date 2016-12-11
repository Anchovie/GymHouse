from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from mainpage.models import Profile
from mainpage.models import Registration


def main_view_not_logged_in(request):
    context = {'variable_example': "This variable was sent from views!"}

    if (request.user.is_authenticated):
        userProfile=Profile.objects.get(user=request.user)
        registrations = userProfile.registrations.all().order_by('-date').filter(passed=False)
        context = {'user': request.user,
            'profile': userProfile,
            'registrations': registrations,
            'logged_in': request.user.is_authenticated}

        return render(request, 'mainpage/mainpage_logged_in_template.html', context);

    return render(request, 'mainpage/mainpage_template.html', context);
    #IF USING TEMPLATE BLOCKS, RENDER THE _CHILD_, NOT THE PARENT


#This decorator ensures that this view can't be accessed unless
#the user is logged in
@login_required
def main_view_logged_in(request):       #THIS IS THE PROFILE VIEW



    context = {'user': request.user,
            'logged_in': request.user.is_authenticated}

    return render(request, 'mainpage/mainpage_logged_in_template.html', context);
