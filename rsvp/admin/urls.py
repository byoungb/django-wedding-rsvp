from django.conf.urls import url

from rsvp.admin.views import IndexView, GuestsView

urlpatterns = [
    url(
        regex=r'^$',
        view=IndexView.as_view(),
        name='index',
    ),
    url(
        regex=r'^guests/$',
        view=GuestsView.as_view(),
        name='guests',
    ),
]
