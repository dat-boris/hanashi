from django.conf.urls import url

from . import views

urlpatterns = [
    # url(r'^$', views.home, name='home'),
    url(r'^$', views.slideshow, name='home'),
    url(r'^s/(?P<name>[^/]+)/$', views.slideshow, name='slideshow'),
]
