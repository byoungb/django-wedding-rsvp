from django_choice_object.choice import Choice


class STATUSES(Choice):
    ATTENDING = 'attending'
    DECLINED = 'declined'
