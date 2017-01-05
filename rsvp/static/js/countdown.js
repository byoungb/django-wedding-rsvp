(function (globals, $) {

    var CountDown = Backbone.View.extend({
        template: _.template(
            '<span>' +
                '<span class="number"><%= value %></span>' +
                '<span class="unit script"><%= text %></span>' +
            '</span>'
        ),
        initialize: function (options) {
            setInterval($.proxy(this.render, this), 1000);
            this.date = options.date;
            this.render();
        },
        render: function () {
            var duration = moment.duration(this.date - new Date());
            var html = '';
            _.each({
                'years': ['Years', 'Year'],
                'months': ['Months', 'Month'],
                'days': ['Days', 'Day'],
                'hours': ['Hours', 'Hour'],
                'minutes': ['Minutes', 'Minute'],
                'seconds': ['Seconds', 'Second']
            }, function (text, unit) {
                var value = duration[unit]();
                if (value) {
                    html += this.template({
                        text: (value > 1) ? text[0] : text[1],
                        value: value
                    });
                }
            }, this);
            this.$el.html(html);
        }
    });
    $.fn.countdown = function (date) {
        return this.each(function () {
            if (!$.data(this, 'wedding')) {
                $.data(this, 'wedding', new CountDown({
                    el: $(this),
                    date: date
                }));
            }
        });
    };

}(this, jQuery));
