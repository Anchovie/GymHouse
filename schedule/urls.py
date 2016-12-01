from django.conf.urls import url

from . import views

app_name = 'schedule' #This enables namespacing (eg. using links in templates <a href="{% url mainpage:index'%}")
urlpatterns = [
    #url(r'^$', views.index, name='index'),
    url(r'^$', views.calendar_view, name='calendar_view'),
    url(r'^ajax/register/$', views.ajax_entry_registration, name='register'),
]