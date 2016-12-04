from django.conf.urls import url, include

from rsvp.views import IndexView

urlpatterns = [
    url(
        regex=r'^$',
        view=IndexView.as_view(),
        name='index',
    ),
    url(
        regex=r'^admin/',
        view=include(
            arg='rsvp.admin.urls',
            namespace='admin',
        ),
    ),
]
