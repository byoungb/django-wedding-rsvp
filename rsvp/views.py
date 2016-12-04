from datetime import datetime, timedelta

from django.views.generic.base import TemplateResponseMixin, View
from django.utils.timezone import make_aware


class IndexView(TemplateResponseMixin, View):
    template_name = 'index.html'

    def get(self, request, *args, **kwargs):
        return self.render_to_response({
            'NAMES': ('Leah', 'Adam'),
            'CEREMONY_DATETIME': make_aware(datetime(2017, 7, 1, 14)),
            'CEREMONY_DURATION': timedelta(hours=2),
            'RECEPTION_DATETIME': make_aware(datetime(2017, 7, 1, 18)),
            'RECEPTION_DURATION': timedelta(hours=4),
            'GOOGLE_MAPS_API_KEY': 'AIzaSyCYhdc-qA-ut3oH4YNfVFKHHgnvIo6eM0U',
        })
