from django_choice_object.choice import Choice

from rsvp.util.hash import InviteHash


LOGIN_KEY = 'invite_id'
HASH = InviteHash()


class STATUSES(Choice):
    ATTENDING = 'attending'
    DECLINED = 'declined'


def login(request, invite):
    request.session[LOGIN_KEY] = invite.id


def logout(request):
    if LOGIN_KEY in request.session:
        del request.session[LOGIN_KEY]
