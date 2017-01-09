from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from django.db.models.query import QuerySet

from rsvp.managers import InviteQuerySet
from rsvp.models import Invite, Guest


class InviteEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, InviteQuerySet):
            return list(o.prefetch_related('guests'))
        if isinstance(o, QuerySet):
            return list(o)
        if isinstance(o, Guest):
            return model_to_dict(
                instance=o,
                fields=[
                    'id',
                    'name',
                    'type',
                ],
            )
        if isinstance(o, Invite):
            data = model_to_dict(
                instance=o,
                fields=[
                    'id',
                    'name',
                ],
            )
            data.update({
                'guests': o.guests.all(),
                'key': o.key,
            })
            return data
        return super(InviteEncoder, self).default(o)
