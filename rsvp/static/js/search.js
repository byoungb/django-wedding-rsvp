(function (globals, $) {

    var Search = Backbone.View.extend({
        events: {
            'click button[data-id]': 'select',
            'submit': 'search'
        },
        template: _.template(
            '<div class="list-group">' +
                '<% _.each(suggestions, function (suggestion) { %>' +
                    '<button type="button" class="list-group-item" data-name="<%- suggestion.name %>" data-id="<%= suggestion.id %>">' +
                        '<%= suggestion.name %>' +
                    '</button>' +
                '<% }); %>' +
            '</div>', {
                variable: 'suggestions'
            }
        ),
        initialize: function (options) {
            var throttled = _.debounce(_.bind(this.keyup, this), 300);
            this.$('input[name="name"]').on('keyup', throttled);
            this.url = options.url;
        },
        ajax: function (callback, method) {
            $.ajax({
                data: this.$el.serializeObject(),
                success: _.bind(callback, this),
                error: _.bind(this.error),
                method: method,
                url: this.url
            });
        },
        loading: function (state) {
            this.$('div.progress-bar').css('width', (state ? '100%' : '0%'));
            this.$('div.loading').toggle(state);
        },
        select: function (event) {
            var data = this.$(event.currentTarget).data();
            this.$('input[name="name"]').val(data.name).prop('disabled', true);
            this.$('input[name="invite"]').val(data.id);
            this.$('div.suggestions').hide();
            this.$('div.authorize').show();
        },
        keyup: function () {
            var data = this.$el.serializeObject();
            if (data.name.length > 2) {
                this.ajax(this.suggest, 'PUT');
                this.loading(true);
            }
        },
        suggest: function (data) {
            this.$('div.suggestions').html(this.template(data)).show();
            this.loading(false);
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
        },
        search: function () {
            this.ajax(this.success, 'POST');
            return false;
        },
        success: function (data) {
        }
    });
    $.fn.search = function (url) {
        return this.each(function () {
            if (!$.data(this, 'search')) {
                $.data(this, 'search', new Search({
                    el: $(this),
                    url: url
                }));
            }
        });
    };

}(this, jQuery));
