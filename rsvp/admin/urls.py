from django.conf.urls import url

from rsvp.admin.views import IndexView, InviteView

urlpatterns = [
    url(
        regex=r'^$',
        view=IndexView.as_view(),
        name='index',
    ),
    url(
        regex=r'^invites(?:/(?P<invite_id>\d+))?/$',
        view=InviteView.as_view(),
        name='invites',
    ),
]
