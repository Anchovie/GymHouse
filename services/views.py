from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required



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
    context = {'user': request.user,
			'logged_in': request.user.is_authenticated}

    return render(request, 'services/trainers_template.html', context);
