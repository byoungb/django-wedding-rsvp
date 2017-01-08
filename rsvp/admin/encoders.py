from __future__ import unicode_literals

from rsvp.util.encoders import InviteEncoder as BaseInviteEncoder
from rsvp.models import Invite


class InviteEncoder(BaseInviteEncoder):
    def default(self, o):
        data = super(InviteEncoder, self).default(o)
        if isinstance(o, Invite):
            data.update({
                # 'qr_code': '{}'.format(o.qr_code()),
                # 'url': o.get_absolute_url(),
                'key': o.key,
            })
        return data
