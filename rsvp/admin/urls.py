from django.conf.urls import url

from rsvp.admin.views import IndexView, StoryView, InviteView

urlpatterns = [
    url(
        regex=r'^$',
        view=IndexView.as_view(),
        name='index',
    ),
    url(
        regex=r'^stories/(?:(?P<story_id>\d+))?$',
        view=StoryView.as_view(),
        name='stories',
    ),
    url(
        regex=r'^invites/(?:(?P<invite_id>\d+))?$',
        view=InviteView.as_view(),
        name='invites',
    ),
]
