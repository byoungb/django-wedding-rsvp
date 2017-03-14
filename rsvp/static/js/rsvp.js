(function (globals, $) {

    var title_mapping = {
        ATTENDING_SINGLE: 'Looking forward to seeing you there!',
        ATTENDING_GROUP: 'Looking forward to seeing all of you there!',
        ATTENDING_SOME: 'Looking forward to seeing some of you there!',
        NOT_ATTENDING_SINGLE: 'So sorry you can\'t come.',
        NOT_ATTENDING_GROUP: 'So sorry none of you can come.'
    };

    var GuestModel = Backbone.Model.extend({
        is_attending: function () {
            return (this.is_active() && this.get('is_attending'));
        },
        is_active: function () {
            return !_.isEmpty(this.get('name'));
        }
    });

    var GuestCollection = Backbone.Collection.extend({
        model: GuestModel,
        activeGuests: function () {
            return new Backbone.Collection(this.filter(function (model) {
                return model.is_active();
            }));
        },
        attendingGuests: function () {
            return new Backbone.Collection(this.filter(function (model) {
                return model.is_active() && model.get('is_attending');
            }));
        },
        mode: function () {
            var active_guests = this.activeGuests();
            var all_attending = active_guests.all(function (model) {
                return model.get('is_attending');
            });
            var any_attending = active_guests.any(function (model) {
                return model.get('is_attending');
            });
            if (all_attending) {
                return (active_guests.length == 1) ? 'ATTENDING_SINGLE' : 'ATTENDING_GROUP';
            } else if (!any_attending) {
                return (active_guests.length == 1) ? 'NOT_ATTENDING_SINGLE' : 'NOT_ATTENDING_GROUP';
            }
            return 'ATTENDING_SOME';
        },
        titleText: function () {
            return title_mapping[this.mode()];
        }
    });

    var InviteModel = Backbone.Model.extend({
        parse: function (response, options) {
            response.guests = new GuestCollection(response.guests);
            return response;
        }
    });

    var InviteCollection = Backbone.Collection.extend({
        model: InviteModel,
        url: '/api/'
    });

    var GuestView = Backbone.View.extend({
        className: 'form-inline',
        template: _.template(
            '<div>' +
                '<label>' +
                    '<span>Name:&nbsp;</span>' +
                    '<input type="text" name="name" value="<%= model.get(\'name\') %>" class="form-control" />' +
                '</label>' +
                '<label for="is_attending_<%= model.get(\'id\') %>">' +
                    '<span>Attending:&nbsp;</span>' +
                '</label>' +
                '<span class="checkbox">' +
                    '<input type="checkbox" name="is_attending" id="is_attending_<%= model.get(\'id\') %>" class="style"<% if (model.is_attending()) { %> checked="checked"<% } %> />' +
                    '<label for="is_attending_<%= model.get(\'id\') %>">&nbsp;</label>' +
                '</span>' +
            '</div>', {
                variable: 'model'
            }
        ),
        events: {
            'change input': 'update'
        },
        initialize: function (options) {
            var html = this.template(this.model);
            this.$el.html(html);
        },
        update: function (event) {
            this.model.set({
                is_attending: this.$('input[name="is_attending"]').is(':checked'),
                name: this.$('input[name="name"]').val()
            });
        }
    });

    var SearchView = Backbone.View.extend({
        events: {
            'click [data-invite_id]': 'select',
            'submit': 'search'
        },
        template: _.template(
            '<div class="list-group">' +
                '<% collection.each(function (model) { %>' +
                    '<button type="button" class="list-group-item" data-invite_id="<%= model.get(\'id\') %>">' +
                        '<strong><%= model.get("name") %></strong>' +
                    '</button>' +
                '<% }); %>' +
            '</div>', {
                variable: 'collection'
            }
        ),
        initialize: function (options) {
            var throttled = _.debounce(_.bind(this.keyup, this), 300);
            this.$('input[name="name"]').on('keyup', throttled);
            this.listenTo(this.collection, 'request', function () {
                this.loading(true);
            });
            this.listenTo(this.collection, 'sync', this.suggest);
        },
        loading: function (state) {
            this.$('div.progress-bar').css('width', (state ? '100%' : '0%'));
            this.$('div.loading').toggle(state);
        },
        keyup: function () {
            var data = this.$el.serializeObject();
            if (data.name.length > 2) {
                this.collection.fetch({
                    data: $.param({
                        name: data.name
                    })
                });
            }
        },
        suggest: function () {
            var html = this.template(this.collection);
            this.$('div.suggestions').html(html);
            this.loading(false);
        },
        select: function (event) {
            var invite_id = this.$(event.currentTarget).data('invite_id');
            var invite = this.collection.get(invite_id);
            this.trigger('selected', invite);
            this.$el.hide();
        }
    });

    var RsvpView = Backbone.View.extend({
        events: {
            'submit': 'submit'
        },
        load: function (model) {
            this.collection = model.get('guests');
            this.model = model;
            this.render();
        },
        render: function () {
            this.$('div.guests').empty();
            var fragment = document.createDocumentFragment();
            this.collection.each(function (model) {
                var view = new GuestView({
                    model: model
                });
                fragment.appendChild(view.el);
            });
            this.$('div.guests').html(fragment);
            this.$el.show();
        },
        submit: function (event) {
            this.model.save();
            this.trigger('submitted', this.model);
            this.$el.hide();
        }
    });

    var ModalView = Backbone.View.extend({
        events: {
            'submit form#complete_form': 'adjust',
            'hidden.bs.modal': 'hide',
            'shown.bs.modal': 'show'
        },
        template: _.template(
            '<strong><%= model.get("name") %></strong> come and celebrate with us!', {
                variable: 'model'
            }
        ),
        initialize: function (options) {
            this.search_view = new SearchView({
                collection: new InviteCollection(),
                el: this.$('#search_form')
            });
            this.rsvp_view = new RsvpView({
                el: this.$('#rsvp_form')
            });
            this.listenTo(this.search_view, 'selected', this.selected);
            this.listenTo(this.rsvp_view, 'submitted', this.submitted);
        },
        submitted: function (model) {
            var text = model.get('guests').titleText();
            this.$('form#complete_form input[name="invite_id"]').val(model.get('id'));
            this.$('.subtitle').html(text);
            this.$('form#complete_form').show();
            var attending = model.get('guests').attendingGuests().length;
            this.$('form#complete_form span.rsvp-attending').text(attending);
            var total = model.get('guests').activeGuests().length;
            this.$('form#complete_form span.rsvp-total').text(total);
        },
        adjust: function (event) {
            var invite_id = this.$('form#complete_form input[name="invite_id"]').val();
            var model = this.search_view.collection.get(invite_id);
            var html = this.template(model);
            this.$('.subtitle').html(html);
            this.$('form#complete_form').hide();
            this.rsvp_view.load(model);
        },
        selected: function (model) {
            var html = this.template(model);
            this.$('.subtitle').html(html);
            this.rsvp_view.load(model);
        },
        show: function () {
            this.$('#search_form').show().find('input[name="name"]').focus();
        },
        hide: function () {
            this.rsvp_view.$el.hide();
        }
    });

    $.fn.rsvp_modal = function () {
        return this.each(function () {
            if (!$.data(this, 'rsvp_modal')) {
                $.data(this, 'rsvp_modal', new ModalView({
                    el: $(this)
                }));
            }
        });
    };

}(this, jQuery));
