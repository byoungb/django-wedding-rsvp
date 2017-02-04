$(document).ready(function () {
    var map = new GMaps({
        div: '#map',
        scrollwheel: false,
        lat: 42.468112,
        lng: -91.994214,
        zoom: 12
    });
    map.addMarker({
        lat: 42.448675,
        lng: -91.923585,
        title: 'Reception Location',
        infoWindow: {
            content: '<div class="note">Reception</div>' +
            '<h4 class="map-title script">Heartland Acres</h4>' +
            '<div class="address">' +
                '<span>2600 Swan Lake Blvd</span><br />' +
                '<span>Independence IA 50644</span>' +
            '</div>'
        }
    });
    map.addMarker({
        lat: 42.473451,
        lng: -92.062260,
        verticalAlign: 'top',
        title: 'Ceremony Location',
        infoWindow: {
            content: '<div class="note">Ceremony</div>' +
            '<h4 class="map-title script">St Athanasius</h4>' +
            '<div class="address">' +
                '<span>711 Stevens Street</span><br />' +
                '<span>Jesup IA 50648</span>' +
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

    $('.carousel-inner').swipe({
        swipeLeft: function() {
            $(this).parent().carousel('prev');
        },
        swipeRight: function() {
            $(this).parent().carousel('next');
        },
        threshold: 0
    });

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


