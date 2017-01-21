from django import forms

from rsvp.models import Invite, Guest, Story


class GuestForm(forms.ModelForm):
    class Meta:
        model = Guest
        fields = [
            'name',
            'type',
        ]


class InviteForm(forms.ModelForm):
    class Meta:
        model = Invite
        fields = [
            'name',
        ]

    def save(self, commit=True):
        instance = super(InviteForm, self).save(commit=commit)
        guests = {g.id: g for g in instance.guests.all()}
        for guest_data in self.data['guests']:
            guest_instance = Guest(
                invite=instance,
            )
            guest_id = getattr(guest_data, 'id', None)
            if guest_id:
                guest_instance = guests.pop(guest_id)
            form = GuestForm(
                instance=guest_instance,
                data=guest_data,
            )
            if form.is_valid():
                form.save()
        for guest in guests.values():
            guest.delete()
        return instance


class StoryForm(forms.ModelForm):
    class Meta:
        model = Story
        fields = [
            'title',
            'body',
            'icon',
        ]
