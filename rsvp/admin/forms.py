from django import forms

from rsvp.models import Invite


class InviteForm(forms.ModelForm):
    class Meta:
        model = Invite
        fields = [
            'name',
        ]
