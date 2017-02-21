from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from django.db.models.query import QuerySet

from rsvp.models import Invite, Guest


class InviteEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, QuerySet):
            return list(o)
        if isinstance(o, Invite):
            data = model_to_dict(
                instance=o,
                fields=[
                    'is_submitted',
                    'name',
                    'id',
                ],
            )
            data['guests'] = o.guests.all()
            return data
        if isinstance(o, Guest):
            return model_to_dict(
                instance=o,
                fields=[
                    'is_attending',
                    'name',
                    'id',
                ],
            )
        return super(InviteEncoder, self).default(o)
