from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect
from django.core.files import File
from django import forms
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.contrib.auth.models import Group

from GymHouse.forms import RegistrationForm
from mainpage.models import Profile
from mainpage import models

import os



def login_view(request):

    context = {'user': request.user,
                'logged_in': request.user.is_authenticated}

    if(request.POST):
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember = request.POST.get('remember')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)


            if not remember:
                settings.SESSION_EXPIRE_AT_BROWSER_CLOSE = True
                print("NO REMEMBER")
            else:
                settings.SESSION_EXPIRE_AT_BROWSER_CLOSE = False
                print("REMEMBER")

            context = {'user': user,
                'logged_in': request.user.is_authenticated}
            #print(request);
            #print("-----");
            #print(context);
            #print("----");
            return redirect('/') #IS THIS OK WITHOUT CONTEXT AND REQUEST???? (Fixes login redirect bug)
            #return render(request, 'mainpage/mainpage_logged_in_template.html', context)
        else:
            print("No user found")
            return HttpResponse("NO USER MATCH")

    else:
        return render(request, 'authenticate/login_template.html',context)


def logout_view(request):
    logout(request)
    print("Logout successfull??")
    return HttpResponse("Logged out successfully")


def register_view(request):
    print("IN REGISTER")

    if (request.user.has_perm('mainpage.can_create')):
        print("HAS PERMISSION")
    else:
        print("NO PERM")

    context = {'user': request.user,
                'logged_in': request.user.is_authenticated}


    if(request.POST):
        #username = request.POST.get('username')
        #password = request.POST.get('password')
        #remember = request.POST.get('remember')


        form = RegistrationForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            #do stuff
            print("FORM VALID, doing stuff")
            username = clean_username(form)#.cleaned_data.get('username')
            pwd = form.cleaned_data.get('password')
            email = form.cleaned_data.get('email')
            if (not username):
                HttpResponse("ERROR")

            user = User.objects.create_user(username=username,
                    email=email,
                    password=pwd)
            print("New user created ")
            print(user)
            new_profile = form.save(commit=False)

            #new_profile.image=settings.MEDIA_ROOT + "nopic.png"

            print(new_profile.image)
            if (not new_profile.image):
                path = 'nopic.png'#os.path.join('media', "nopic.png")
                print("NO IMAGE")
                new_profile.image=path
            else:
                print("IMAGE FOUND")
                print(new_profile.image)
                """
                #path = settings.MEDIA_ROOT + "/nopic.png"
                f = open(path, 'r')
                new_profile.image.save('nopic.png', f.read(), save=True)
                f.close()
                #new_profile.image(path, File().read())
            """
            new_profile.user = user
            #print("NEW PROFILE STATUS = ")
            #print(new_profile.status)
            #print(models.REGULAR)
            #print(type(new_profile.status))
            #print(type(models.REGULAR))
            if (new_profile.status != models.REGULAR):
                creator_group = Group.objects.get(name='Creators')
                #print("Creator group:")
                #print(creator_group)
                creator_group.user_set.add(user)
                print("Added new user to Creators group")
            else:
                print("User is regular, no permission granted")


            new_profile.save() # Now you can send it to DB

            print(new_profile.image)
            if (not new_profile.image):
                print("NO IMG STILL")


            login(request, user)
            return HttpResponseRedirect('/')
            #return HttpResponse("REGISTERED???")

        else:
            print("FORM NOT VALID")
            return HttpResponseRedirect('/')
            """
            context = {'form':form}
            return render_to_response('pageRegistration.html', context,context_instance=RequestContext(request))
            """

    else:
        form = RegistrationForm()
        context['form']=form

        return render(request, 'authenticate/register_template.html', context)


def clean_username(self):
    username = self.cleaned_data['username']
    if User.objects.exclude(pk=self.instance.pk).filter(username=username).exists():
        raise forms.ValidationError(u'Username "%s" is already in use.' % username)
        HttpResponse("validation error, username exists")
    return username
