(function (globals, $) {

    var CountDown = Backbone.View.extend({
        template: _.template(
            '<span class="days">' +
                '<span class="number"><%= duration.days() %></span>' +
                '<span class="unit script">Days</span>' +
            '</span>' +
            '<span class="hours">' +
                '<span class="number"><%= duration.hours() %></span>' +
                '<span class="unit script">Hours</span>' +
            '</span>' +
            '<span class="minutes">' +
                '<span class="number"><%= duration.minutes() %></span>' +
                '<span class="unit script">Minutes</span>' +
            '</span>' +
            '<span class="seconds">' +
                '<span class="number"><%= duration.seconds() %></span>' +
                '<span class="unit script">Seconds</span>' +
            '</span>', {
            variable: 'duration'
        }),
        initialize: function (options) {
            setInterval($.proxy(this.render, this), 1000);
            this.date = options.date;
            this.render();
        },
        render: function () {
            var duration = moment.duration(this.date - new Date());
            this.$el.html(this.template(duration));
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

$(document).ready(function () {
    var map = new GMaps({
        div: '#map',
        scrollwheel: false,
        lat: 42.757755,
        lng: -92.102278,
        zoom: 10
    });
    map.addMarker({
        lat: 42.681078,
        lng: -92.138698,
        title: 'Reception Location',
        infoWindow: {
            content: '<div class="note">Reception</div>' +
            '<h4 class="map-title script">Wapsie Valley High School</h4>' +
            '<div class="address">' +
                '<span>Leah you better not be having</span><br />' +
                '<span>your reception here</span>' +
            '</div>'
        }
    });
    map.addMarker({
        lat: 42.847755,
        lng: -92.102278,
        verticalAlign: 'top',
        title: 'Ceremony Location',
        infoWindow: {
            content: '<div class="note">Ceremony</div>' +
            '<h4 class="map-title script">Immaculate Conception Church</h4>' +
            '<div class="address">' +
                '<span>413 W. 1st Street</span><br />' +
                '<span>Sumner, IA 50674</span>' +
            '</div>'
        }
    });
    // google.maps.event.trigger(map.markers[0]);
    // google.maps.event.trigger(map.markers[1]);

    $('body').scrollspy({
        target: '#header',
        offset: 100
    });

    $('a.scrollto').on('click', function (e) {
        var target = this.hash;
        e.preventDefault();
        $('body').scrollTo(target, 800, {offset: -55, 'axis': 'y'});
        if ($('.navbar-collapse').hasClass('in')) {
            $('.navbar-collapse').removeClass('in').addClass('collapse');
        }
    });

    $('#hero .statement').addClass('animated bounceIn delayp4');
    // $('#wedding .title-text').css('opacity', 0).one('inview', function(event, isInView) {
    //     if (isInView) {$(this).addClass('animated fadeInUp delayp2');}
    // });
    // $('#story .title-text').css('opacity', 0).one('inview', function(event, isInView) {
    //     if (isInView) {$(this).addClass('animated fadeInUp delayp2');}
    // });
    // $('#gallery .title-text').css('opacity', 0).one('inview', function(event, isInView) {
    //     if (isInView) {$(this).addClass('animated fadeInUp delayp2');}
    // });
    // $('#gift .title-text').css('opacity', 0).one('inview', function(event, isInView) {
    //     if (isInView) {$(this).addClass('animated fadeInUp delayp2');}
    // });
    // $('#gift .couple-profile').css('opacity', 0).one('inview', function(event, isInView) {
    //     if (isInView) {$(this).addClass('animated bounceIn delayp3');}
    // });

});



    // /* ======= Scrollspy ======= */
    //
    //
    //
    // /* ======= jQuery Placeholder ======= */
    // /* Ref: https://github.com/mathiasbynens/jquery-placeholder */
    //
    // $('input, textarea').placeholder();
    //
    // /* ===== Packery ===== */
    // //Ref: http://packery.metafizzy.co/
    // //Ref: http://imagesloaded.desandro.com/
    //
    // var $container = $('#photos-wrapper');
    //
    // // init
    // $container.imagesLoaded(function () {
    //     $container.packery({
    //         itemSelector: '.item',
    //         percentPosition: true
    //     });
    // });
    //
    //
    // /* ======= RSVP Form (Dependent form field) ============ */
    // $('#cguests').on("change", function () {
    //
    //     if ($(this).val() == "") {
    //         $('.guestinfo-group').slideUp(); //hide
    //         console.log('not selected');
    //     } else if ($(this).val() == 'No Guests') {
    //         $('.guestinfo-group').slideUp(); //hide
    //         console.log('No guests');
    //         $('#cguestinfo').val('No Guests'); //Pass data to the field so mailer.php can send the form.
    //
    //     } else {
    //         $('.guestinfo-group').slideDown(); //show
    //         $('#cguestinfo').val(''); //Clear data
    //         console.log('Has guests');
    //     }
    //
    //
    // });
    //
    // /* ======= jQuery form validator ======= */
    // /* Ref: http://jqueryvalidation.org/documentation/ */
    // $(".rsvp-form").validate({
    //     messages: {
    //         name: {
    //             required: 'Please enter your full name' //You can customise this message
    //         },
    //         email: {
    //             required: 'Please enter your email' //You can customise this message
    //         },
    //         events: {
    //             required: 'Are you attending?' //You can customise this message
    //         },
    //         guests: {
    //             required: 'How many guests?' //You can customise this message
    //         },
    //         guestinfo: {
    //             required: 'Please provide name(s)' //You can customise this message
    //         },
    //     }
    // });


