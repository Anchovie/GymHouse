from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

app_name = 'authenticate' #This enables namespacing (eg. using links in templates <a href="{% url mainpage:index'%}")
urlpatterns = [
    url(r'^login', views.login_view, name='login'),
    #url(r'^login', auth_views.login, {'template_name': 'authenticate/login_template.html'}, name='login'),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
]
