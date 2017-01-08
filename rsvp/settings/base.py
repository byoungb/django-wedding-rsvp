from os.path import dirname, abspath, join

BASE_DIR = dirname(dirname(dirname(abspath(__file__))))

SECRET_KEY = '1b64s08(we+s_i_)3oq0iuc89zz*hm!1^#bnxf2h$bhtljlpt!'

DEBUG = False

ALLOWED_HOSTS = [
    '*',
]

INSTALLED_APPS = [
    # django apps
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # rsvp apps
    'rsvp',
    'rsvp.admin',

    # third party apps
    'django_jinja',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'rsvp.middleware.RsvpMiddleware',
]

ROOT_URLCONF = 'rsvp.urls'

TEMPLATES = [{
    'NAME': 'jinja',
    'BACKEND': 'django_jinja.backend.Jinja2',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {
        'match_regex': r'^(?!debug_toolbar/).*',
        'newstyle_gettext': True,
        'match_extension': None,
        'lstrip_blocks': True,
        'trim_blocks': True,
        'context_processors': [
            'django.contrib.messages.context_processors.messages',
        ],
        'extensions': [
            'jinja2.ext.do',
            'jinja2.ext.loopcontrols',
            'jinja2.ext.with_',
            'jinja2.ext.i18n',
            'jinja2.ext.autoescape',
            'django_jinja.builtins.extensions.CsrfExtension',
            'django_jinja.builtins.extensions.CacheExtension',
            'django_jinja.builtins.extensions.UrlsExtension',
            'django_jinja.builtins.extensions.StaticFilesExtension',
            'django_jinja.builtins.extensions.DjangoFiltersExtension',
        ],
    },
}]

WSGI_APPLICATION = 'rsvp.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': join(BASE_DIR, 'db.sqlite3'),
    }
}

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Chicago'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_ROOT = join(BASE_DIR, 'static')
STATIC_URL = '/static/'
