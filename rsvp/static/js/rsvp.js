(function (globals, $) {

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
        list: function () {
            return this.activeGuests().pluck('name').join(', ');
        },
        activeGuests: function () {
            return new Backbone.Collection(this.filter(function (model) {
                return model.is_active();
            }));
        },
        buttonText: function () {
            var active_guests = this.activeGuests();
            var all_attending = active_guests.all(function (model) {
                return model.get('is_attending');
            });
            var any_attending = active_guests.any(function (model) {
                return model.get('is_attending');
            });
            if (all_attending) {
                return (active_guests.length == 1) ? 'I will be there!' : 'We will be there!';
            } else if (!any_attending) {
                return (active_guests.length == 1) ? 'I am sorry I can\'t come.' : 'We are sorry we can\'t come.';
            }
            return 'Some of us will be there!';
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
            '<input type="text" name="name" value="<%= model.get(\'name\') %>" class="form-control" />' +
            '<input type="checkbox" name="is_attending"<% if (model.is_attending()) { %> checked="checked"<% } %> />', {
                variable: 'model'
            }
        ),
        events: {
            'switchChange.bootstrapSwitch input[name="is_attending"]': 'update',
            'change input[name="name"]': 'update'
        },
        initialize: function (options) {
            var html = this.template(this.model);
            this.$el.html(html);
            this.$('input[name="is_attending"]').bootstrapSwitch({
                offText: 'Not Attending',
                onText: 'Attending',
                offColor: 'danger',
                onColor: 'success'
            });
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
                        '<% if (!model.get("guests").isEmpty()) { %>' +
                            '<br />' +
                            '<p><%= model.get("guests").list() %></p>' +
                        '<% } %>' +
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
        initialize: function (options) {
            this.collection = this.model.get('guests');
            this.listenTo(this.collection, 'change', this.change);
            this.render();
        },
        change: function () {
            var text = this.collection.buttonText();
            this.$('button[type="submit"]').text(text);
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
            this.change();
        },
        submit: function (event) {
            this.model.save();
            this.model.trigger('submitted');
        }
    });

    var ModalView = Backbone.View.extend({
        events: {
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
            this.listenTo(this.search_view, 'selected', this.selected);
        },
        selected: function (model) {
            var html = this.template(model);
            this.$('.subtitle').html(html);
            new RsvpView({
                el: this.$('#rsvp_form'),
                model: model
            });
        },
        show: function () {
            this.$('#search_form').show();
            this.$('#search_form input[name="name"]').focus();
        }
    });

    $.fn.rsvp_modal = function (url) {
        return this.each(function () {
            if (!$.data(this, 'rsvp_modal')) {
                $.data(this, 'rsvp_modal', new ModalView({
                    el: $(this)
                }));
            }
        });
    };

}(this, jQuery));
