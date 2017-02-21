from django.conf.urls import url, include

from rsvp.views import IndexView, ApiView

urlpatterns = [
    url(
        regex=r'^$',
        view=IndexView.as_view(),
        name='index',
    ),
    url(
        regex=r'^api/(?:(?P<invite_id>\d+))?$',
        view=ApiView.as_view(),
        name='api',
    ),
    url(
        regex=r'^admin/',
        view=include(
            arg='rsvp.admin.urls',
            namespace='admin',
        ),
    ),
]
