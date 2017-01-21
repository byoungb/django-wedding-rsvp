from django.core.management.base import BaseCommand

from rsvp.models import Icon


ICONS = {
    'icon-bottle': "\e900",
    'icon-light-bulb': "\e901",
    'icon-cake-cover': "\e902",
    'icon-cupcake': "\e903",
    'icon-calendar': "\e904",
    'icon-candle': "\e905",
    'icon-cat': "\e906",
    'icon-clock': "\e907",
    'icon-cloud': "\e908",
    'icon-couple': "\e909",
    'icon-cup': "\e90a",
    'icon-folder': "\e90b",
    'icon-gift': "\e90c",
    'icon-glasses': "\e90d",
    'icon-hands': "\e90e",
    'icon-heart-alt': "\e90f",
    'icon-heart': "\e910",
    'icon-house': "\e911",
    'icon-letter': "\e914",
    'icon-lightening': "\e915",
    'icon-lock': "\e916",
    'icon-map': "\e917",
    'icon-message': "\e918",
    'icon-moon': "\e919",
    'icon-notebook': "\e91a",
    'icon-phone-alt': "\e91b",
    'icon-phone': "\e91c",
    'icon-plant': "\e91d",
    'icon-pot': "\e91e",
    'icon-smiley-1': "\e920",
    'icon-smiley-2': "\e921",
    'icon-smiley-3': "\e922",
    'icon-smiley-4': "\e923",
    'icon-teapot': "\e924",
    'icon-umbrella': "\e925",
    'icon-wine': "\e926",
    'icon-yinyang': "\e927",
    'icon-jar': "\e912",
    'icon-key': "\e913",
}


class Command(BaseCommand):
    def handle(self, *args, **options):
        for font_class in ICONS.keys():
            Icon.objects.create(
                font_family='loveicon',
                font_class=font_class,
            )
