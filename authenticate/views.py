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
                print("YEEEEEESSSS REMEMBER")

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
            """
            if (not new_profile.image):
                path = os.path.join(settings.MEDIA_ROOT, "nopic.png")
                #path = settings.MEDIA_ROOT + "/nopic.png"
                f = open(path, 'r')
                new_profile.image.save('nopic.png', f.read(), save=True)
                f.close()
                #new_profile.image(path, File().read())
            """
            new_profile.user = user

            if (new_profile.status is not 'REG'):
                creator_group = Group.objects.get(name='Creators')
                print("Creator group:")
                print(creator_group)
                creator_group.user_set.add(user)
                #creator_group.user_set.add(new_profile)
                print("Added new user to Creators group")



            new_profile.save() # Now you can send it to DB
            login(request, user)
            return HttpResponseRedirect('/')
            #return HttpResponse("REGISTERED???")

        else:
            print("FORM NOT VALID")

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
