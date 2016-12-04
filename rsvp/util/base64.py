from __future__ import absolute_import
from string import ascii_uppercase, ascii_lowercase, digits


class Base64Encoder(object):
    ALPHABET = ascii_uppercase + ascii_lowercase + digits + '-_'
    ALPHABET_REVERSE = dict((c, i) for (i, c) in enumerate(ALPHABET))
    BASE = len(ALPHABET)

    @classmethod
    def encode(cls, number):
        s = []
        while True:
            number, r = divmod(number, cls.BASE)
            s.append(cls.ALPHABET[r])
            if number == 0:
                break
        return ''.join(s[::-1])

    @classmethod
    def decode(cls, string):
        number = 0
        for c in string:
            number = number * cls.BASE + cls.ALPHABET_REVERSE[c]
        return number

encode = Base64Encoder.encode
decode = Base64Encoder.decode
