from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from mainpage.models import Profile
from mainpage.models import Registration
from django.http import JsonResponse
from django.template.defaulttags import register


def main_view_not_logged_in(request):
    context = {'variable_example': "This variable was sent from views!"}

    if (request.user.is_authenticated):
        trainer_lvl = {"1": "Beginner", "2": "Intermediate", "3": "Advanced", "4": "Expert"}
        userProfile=Profile.objects.get(user=request.user)
        registrations = userProfile.registrations.all().order_by('-date').filter(passed=False)
        context = {'user': request.user,
            'profile': userProfile,
            'registrations': registrations,
            'logged_in': request.user.is_authenticated,
            'trainer_lvl': trainer_lvl}

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
	
def ajax_edit_profile(request):

    if request.method == "POST" and request.is_ajax:
        context = {}
        
        level = {'Beginner':'1', 'Intermediate':'2', 'Advanced':'3', 'Expert':'4'}
        userProfile=Profile.objects.get(user=request.user)
        
        if request.POST.get("fullName") != "":
            name = request.POST.get("fullName").split(" ");
            userProfile.first_name = name[0]
            userProfile.last_name = name[1]
            context['name'] = request.POST.get("fullName")
		
        if request.POST.get("age") != "":
            userProfile.age = request.POST.get("age")
            context['age'] = request.POST.get("age")
			
        if request.POST.get("height") != "":
            userProfile.height = request.POST.get("height")
            context['height'] = request.POST.get("height")
			
        if request.POST.get("weight") != "":
            userProfile.weight = request.POST.get("weight")
            context['weight'] = request.POST.get("weight")
			
        if 'picture' in request.FILES:
            userProfile.image = request.FILES['picture'];
			
        if request.POST.get("level") != "":
            userProfile.level = level.get(request.POST.get("level"))
            context['level'] = level.get(request.POST.get("level"))

        #entry.delete()
        
        #userProfile.registrations.add(newEntry)
        
        userProfile.save()
        
        if 'picture' in request.FILES:
            context['img_url'] = userProfile.image.url
        
    return JsonResponse(context)
	
@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)
