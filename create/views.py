from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required, permission_required

from GymHouse.forms import NewEventForm, NewClassForm
from mainpage.models import Profile


"""
def index(request):
    return HttpResponse("This is the create new entry page for trainers");
"""


@permission_required('mainpage.can_create')
@login_required
def create_new_event(request):
    print("IN NEW EVENT");
    context = {'user': request.user,
            'logged_in': request.user.is_authenticated,
            'form': NewEventForm()}

    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = NewEventForm(request.POST, prefix = "event")
        # check whether it's valid:

        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            #####form.save()
            new_event = form.save(commit=False)
            # commit=False tells Django that "Don't send this to database yet.
            # I have more things I want to do with it."
            creator_profile=Profile.objects.get(user=request.user)
            new_event.creator = creator_profile # Set the user object here
            new_event.save() # Now you can send it to DB
            return HttpResponse(
                    "New event saved! <br/>" +
                    "Redirecting to homepage..." +
                    "<meta http-equiv=\"refresh\" content=\"3; url=/\" />"
            )

    # if a GET (or any other method) we'll create a blank form
    else:
        print("returning show forms from event")
        return show_forms(request)
        form = NewEventForm()

    context['form']=form
    return render(request, 'create/new_entry_template.html', context);

@permission_required('polls.can_vote')
@login_required
def create_new_class(request):
    print("IN NEW CLASS");
    context = {'user': request.user,
            'logged_in': request.user.is_authenticated,
            'form': NewClassForm()}

    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = NewClassForm(request.POST, prefix = "class")
        print(form.errors)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            #####form.save()
            new_class = form.save(commit=False)
            # commit=False tells Django that "Don't send this to database yet.
            # I have more things I want to do with it."
            creator_profile=Profile.objects.get(user=request.user)
            new_class.creator = creator_profile # Set the user object here
            new_class.save() # Now you can send it to DB
            return HttpResponse(
                    "New class saved! <br/>" +
                    "Redirecting to homepage..." +
                    "<meta http-equiv=\"refresh\" content=\"3; url=/create\" />"
            )
        else:
            print("FORM IS NOT VALID")
    # if a GET (or any other method) we'll create a blank form
    else:
        print("returning show forms from class")
        return show_forms(request)
        form = NewClassForm()

    context['form']=form
    return render(request, 'create/new_entry_template.html', context);


@login_required
def show_forms(request):
    context = {'user': request.user,
            'logged_in': request.user.is_authenticated
            }
    """
    event_form = NewEventForm(prefix = "event")
    class_form = NewClassForm(prefix = "class")
    """
    context['event_form']=NewEventForm(prefix = "event")
    context['class_form']=NewClassForm(prefix = "class")

    return render(request, 'create/new_entry_template.html', context);
