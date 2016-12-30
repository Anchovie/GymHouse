from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required



@login_required
def online_view(request):
    context = {'user': request.user,
			'logged_in': request.user.is_authenticated,
            'permission': request.user.has_perm('mainpage.can_create')}

    return render(request, 'online/online_template.html', context);

# Create your views here.
