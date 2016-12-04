from __future__ import absolute_import
from qrcode.image.svg import SvgPathFillImage
from qrcode import QRCode as BaseQRCode
from contextlib import closing
from cStringIO import StringIO
from base64 import b64encode


class QRCode(BaseQRCode, object):
    def __init__(self, url):
        super(QRCode, self).__init__(
            box_size=100,
            border=1,
        )
        self.add_data(
            data=url,
        )

    def __unicode__(self):
        return self.svg

    @property
    def svg(self):
        with closing(StringIO()) as io:
            self.make_image(
                image_factory=SvgPathFillImage,
            ).save(
                stream=io,
            )
            io.seek(0)
            return b64encode(io.read())
