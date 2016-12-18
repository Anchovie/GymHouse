from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.conf import settings

from mainpage.models import Profile



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
