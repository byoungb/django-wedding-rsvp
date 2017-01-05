from string import ascii_uppercase
from hashids import Hashids


class InviteHash(Hashids):
    def __init__(self):
        super(InviteHash, self).__init__(
            alphabet=ascii_uppercase,
            min_length=3,
            salt='rsvp',
        )

    def decode(self, hashid):
        try:
            return super(InviteHash, self).decode(hashid)[0]
        except IndexError:
            return None
