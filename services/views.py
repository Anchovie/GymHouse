from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from mainpage.models import Profile
from django.template.defaulttags import register


"""
def index(request):
    return HttpResponse("This is the services page");
"""
@login_required
def services_view(request):
    context = {'user': request.user,
			'logged_in': request.user.is_authenticated}

    return render(request, 'services/services_template.html', context);


@login_required
def trainers_view(request):

    userProfiles=Profile.objects.filter(status='TRN')
    trainer_lvl = {"1": "Beginner", "2": "Intermediate", "3": "Advanced", "4": "Expert"}
    context = {'user': request.user,
			'logged_in': request.user.is_authenticated,
			'trainers': userProfiles,
			'trainer_lvl': trainer_lvl}

    return render(request, 'services/trainers_template.html', context);

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)
