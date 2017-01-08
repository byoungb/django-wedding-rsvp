# from threading import local

from django.http.response import HttpResponseRedirect

from rsvp import login, logout, LOGIN_KEY
from rsvp.models import Invite


# _active = local()


# def get_current_request():
#     return getattr(_active, 'request', None)


class RedirectException(Exception):
    def __init__(self, redirect_to):
        self.redirect_to = redirect_to


class RsvpMiddleware(object):
    def __init__(self, get_response=None):
        self.get_response = get_response

    def __call__(self, request):
        # _active.request = request
        try:
            self.check_for_url_key(request)
            self.check_for_login(request)
            return self.get_response(request)
        except RedirectException as e:
            return HttpResponseRedirect(
                redirect_to=e.redirect_to,
            )

    @staticmethod
    def check_for_url_key(request):
        if 'key' in request.GET:
            try:
                invite = Invite.objects.lookup(
                    key=request.GET['key'],
                )
                login(request, invite)
            except Invite.DoesNotExist:
                pass
            raise RedirectException(
                redirect_to=request.path,
            )

    @staticmethod
    def check_for_login(request):
        request.invite = None
        if LOGIN_KEY in request.session:
            try:
                request.invite = Invite.objects.get(
                    id=request.session[LOGIN_KEY],
                )
            except Invite.DoesNotExist:
                logout(request)
