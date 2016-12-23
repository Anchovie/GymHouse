from django.conf.urls import url

from . import views

app_name = 'services' #This enables namespacing (eg. using links in templates <a href="{% url mainpage:index'%}")
urlpatterns = [
    url(r'^$', views.services_view, name='services_view'),
    url(r'^trainers/$', views.trainers_view, name='trainers_view'),
]
