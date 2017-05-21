$(window).load(function() {

    globalZIndex = 10;

    animationDuration = 2500;
    enlargedContentWidth = 0.8;
    enlargedContentHeight = "80%";
    enlargedContentTopSpacing = 0.1;

    // Hold id of videos that are playing or pending to be played
    currentlyPlayingId = null;
    currentlyPlayingIdHasAutoplay = false;
    currentlyPendingId = null;

    video_pl = video_pt = video_ph = video_pw = null;
    console.log(video_pl);
    console.log(video_pt);
    console.log(video_ph);
    console.log(video_pw);
    pending_pl = pending_pt = pending_ph = pending_pw = null;

    animatingMarqueeImage = false;


    $( "#sortable" ).sortable({
        axis: 'x',
        stop: function(event, ui) {
             $('.sortableElement').each(function(index) {
                 selector = "form[name=hiddenForm] input[name=" + $(this).attr('id') + "]";
                 $(selector).val(index);
                 $('form[name=hiddenForm]').submit();
             });
        }
    });
    $( "#sortable" ).disableSelection();

       var $mq =  $('.marquee').marquee({
        startVisible: true,
        duration: 50000,
        gap: 5,
        delayBeforeStart: 0,
        direction: 'right',
        duplicated: true
    });

    $('.marquee').css('visibility', 'visible');

    $('.marqueeComments').css('visibility', 'visible');

    $('.marquee img').click(function(e){
            $mq.marquee('pause');
            var target = $(e.target);

            widthToHeightRatio = target.width()/target.height();
            enlargedWidth = enlargedContentWidth*$(window).height() * widthToHeightRatio;
            previousLeft = target.position().left;

            target.css("z-index", ++globalZIndex);
            target.css("position","absolute");
            target.css("height", $(".marquee").css("height"));
            target.css("top", $(".marquee").css("margin-top"));
            target.css("left", previousLeft);

            target.animate({
                top: enlargedContentTopSpacing*$(window).height() + "px",
                left: (($(window).width() - enlargedWidth )/2)  + "px",
                height: enlargedContentHeight // of window
            }, {
                duration: 2500
            });
            target.animate({
                top: $(".marquee").css("margin-top"),
                left: previousLeft,
                height: $(".marquee").css("height") // of window
            }, {
                duration: 2500
            });
            setTimeout( function() {
                target.css("z-index", 1);
                target.css('position', 'static');
                target.css('height', '100%');
			    $mq.marquee('resume');
	        }, 5100);
    });


    $(".contentPieceWrapper video").click(function (e) {
        var target = $(e.target);
        console.log(target);

        // If some video is already playing
        if (currentlyPlayingId != null) {
            if (currentlyPlayingId == $(this).attr('id')) { // clicked video is playing -> stop it
                $(this)[0].pause();
                restoreContentPiece(target, video_pt, video_pl, video_ph, video_pw);

                currentlyPlayingId = null;
                if (currentlyPendingId != null) {
                    currentlyPlayingId = currentlyPendingId
                    currentlyPendingId = null;
                    $('#' + currentlyPlayingId).get(0).play();
                }
            } else { // Some other video is playing -> stop it and start this video
                $('#' + currentlyPlayingId)[0].pause(); // If this video is supposed to be played infinitely, just pause it

                if ($('#' + currentlyPlayingId).autoplay) {
                    currentlyPendingId = currentlyPlayingId;
                    pending_ph = video_ph;
                    pending_pl = video_pl;
                    pending_pt = video_pt;
                    pending_pw = video_pw;
                }
                restoreContentPiece($('#' + currentlyPlayingId), video_pt, video_pl, video_ph, video_pw);

                currentlyPlayingId = $(this).attr('id');
                video_pl = $(this).position().left;
                video_pt = $(this).position().top;
                video_ph = $(this).height();
                video_pw = $(this).width();
                $(this).get(0).play();
                enlargeContentPiece($(this), video_ph, video_pl, video_ph, video_pw);
            }
         } else { // nothing is playing, just play this video
            video_pl = $(this).position().left;
            video_pt = $(this).position().top;
            video_ph = $(this).height();
            video_pw = $(this).width();
            currentlyPlayingId = $(this).attr('id');
            $(this).get(0).play();
            enlargeContentPiece(target, video_pt, video_pl, video_ph, video_pw);
        }
    })

    $(".contentPieceWrapper video").bind('ended', function(){
       $(this).get(0).currentTime = 0;
        if ( $(this).get(0).autoplay == true) { // Play in infinite loop
            console.log("sem autoplay")
            $(this).get(0).play();
        } else {
            console.log("nisem autoplay")
            restoreContentPiece(target, video_pt, video_pl, video_ph, video_pw);
            if (currentlyPendingId != null) {
                currentlyPlayingId = currentlyPendingId;
                enlargeContentPiece($('#' + currentlyPlayingId), pending_pt, pending_pl, pending_ph, pending_pw);
                currentlyPendingId = null;
                $('#' + currentlyPlayingId).get(0).play();
            }
        }
    });

    $(".contentPieceWrapper img").click(function(e) {
        var target = $(e.target);

        /* Special handling of the OHO picture -> change picture befor enlarging */
        if (target.attr('id') == "specialImage") {
            target.attr('src',"/static/konceptneTable/media/content/DSC_0018.jpg");
        }

        previousLeft = target.position().left;
        previousTop = target.position().top;
        previousHeight =  target.height();
        previousWidth =  target.width();
        enlargeContentPiece(target, previousTop, previousLeft, previousHeight, previousWidth);
        restoreContentPiece(target, previousTop, previousLeft, previousHeight, previousWidth);

        setTimeout( function() {
            target.css("z-index", 1);
            target.css('position', 'static');

            /* Special handling of the OHO picture -> change picture back after animation ends */
            if (target.attr('id') == "specialImage") {
                target.attr('src',"/static/konceptneTable/media/content/b_2_oho.PNG");
            }
        }, 5100);
    });

    var $mqText = $('.marqueeComments').marquee({
        duration: 30000,
        direction: 'left',
        duplicated: true,
        gap: 60
    });

    function enlargeContentPiece(target, pt, pl, ph, pw) {
        contentDiv = target.parent();
        previousParentWidth = contentDiv.outerWidth();
        previousParentHeight = contentDiv.outerHeight();

        widthToHeightRatio = target.width()/target.height();
        enlargedWidth = enlargedContentWidth*$(window).height() * widthToHeightRatio;

         if (target.prop("tagName") == "VIDEO") {
           target.attr("class", "");
        }
        if (target.autoplay) {
            target.attr("class", "autoplay");
        }

        target.css("z-index", ++globalZIndex);
        target.css("position","absolute");
        target.css("top",  pt);
        target.css("left", pl);
        target.css("height", ph);
        target.css("width", pw);

        contentDiv.css("width", previousParentWidth);
        contentDiv.css("height", previousParentHeight);

        target.animate({
            top: enlargedContentTopSpacing*$(window).height() + "px",
            left: (($(window).width() - enlargedWidth )/2)  + "px",
            height: enlargedContentHeight, // of window
            width: enlargedWidth
        }, {
            duration: 2500
        });
    }

    function restoreContentPiece(target, pt, pl, ph, pw) {
        target.animate({
            top: pt,
            left: pl,
            height: ph,
            width: pw
        }, {
            duration: 2500
        });
    }

    jQuery.fn.center = function () {
        this.css("position","absolute");
        this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2)/ + $(window).scrollTop()) + "px");
        this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
        return this;
    }

    $('#descriptionContainer').click(function() {
        toggleLanguage($('#description-si').is(":visible"));
    });

    $('#iconSlo').click(function() {
         toggleLanguage(false);
    });
    $('#iconEn').click(function() {
        toggleLanguage(true);
    });

    var k = $('#keyboard')
        .keyboard({
            beforeVisible: function() {
                $('#keyboard_keyboard > div.ui-keyboard-preview-wrapper > input').val(""); // Clear keyboards input text
                $('#keyboard').dimBackground();
            },
            beforeClose: function() {
                $.undim();
            },
            // openOn!0
            layout: 'ms-Slovenian',
            css: {
                    buttonDefault: 'btn btn-default largeBtn',
                    buttonAction: 'active largeBtn',
                    buttonDisabled: 'disabled largeBtn'
                },
            reposition: true,
            position: {
                of: $(window),
                my: 'center center',
                at: 'center center',
                at2: 'center center'
            }
        })
        .addTyping({
            showTyping: true,
            delay: 50
        })


    var submitComment;
    $('#sendComment').click(function() {
        submitComment = true;
        k.getkeyboard().reveal();
    });

    $('#sendQuery').click(function() {
        submitComment = false;
        k.getkeyboard().reveal();
    });

    var csrftoken = Cookies.get('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    },
    complete: function(){
        $('#loader').hide();
    }
});

   $.keyboard.keyaction.accept = function(base) {
       base.accept();
       base.close(true);

       if (submitComment) {
           $('#commentForm').submit(function (event) {
              event.preventDefault();
               $.ajax({
                   type: "POST",
                   url: 'postComment/',
                   data: {'content': $('#commentForm').find('input[name="content"]').val() },
                   success: function (results) {
                       $('.marqueeComments').html(results);
                           var $mqText = $('.marqueeComments').marquee({
                            duration: 30000,
                            direction: 'left',
                            duplicated: true,
                            gap: 60
                        });
                   },
                   error: function (xhr, errmgs, err) {
                       console.log(xhr.status);
                       console.log(xhr.responseText);
                   }
               })
           });
           // UNCOMMENT!!!!!
       } else {
           $('#commentForm').submit(function (event) {
               event.preventDefault();
               $('#loader').show();
               $.ajax({
                   type: "POST",
                   url: 'sendQuery/',
                   data: {'query': $('#commentForm').find('input[name="content"]').val()},
                   success: function (results) {
                       $('#clearSearch').show();
                       $('#queryResultsContainer').html(results);
                       toggleLanguageOnButtons(!$('#description-si').is(":visible"));
                   },
                   error: function (xhr, errmgs, err) {
                       $('#clearSearch').show();
                       if ($('#description-si').is(":visible")) {
                           $('#queryResultsContainer').html("<span class='searchError'>Prišlo je do napake pri spletnem iskanju.<br/> Prosimo, poskusite znova.</span>");
                       } else {
                           $('#queryResultsContainer').html("<span class='searchError'>An error has occurred during search.<br/> Please try again.</span>");
                       }
                       console.log(xhr.status);
                       console.log(xhr.responseText);
                   }
               })
           });

       }
       $('#commentForm').submit();
       $('#commentForm').off( "submit" )

       return false;
   }


	$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
	});

	function animateUpperBand() {
		$(".band-upper").animateCss("slideInLeft");
		$(".band-upper").animateCss("slideOutRight");
		//animateUpperBand();
	}

    $('#clearSearch').click(function(target) {
        $('#queryResultsContainer').html("");
        $('#clearSearch').hide();
    })

    function toggleLanguage(showEnglish) {
        //showEnglish = !$('#description-si').is(":visible");
        if (showEnglish) {
           $('#description-si').hide();
           $('#description-en').show();
        } else {
           $('#description-en').hide();
           $('#description-si').show();
        }

       toggleLanguageOnButtons(showEnglish);
    }

    function toggleLanguageOnButtons(en) {
        str = $("#searchResultsTitle").text();
        searchErrStr = $(".searchError").text();

        if (en) {
            $("#sendComment").val("Post a comment");
            $("#sendQuery").val("Search");
            $("#clearSearch").val("Clear search results");
            translatedStr = str.replace("Rezultati iskanja za", "Search results for");
            if (searchErrStr != "") { $(".searchError").html("An error has occurred during search.<br/> Please try again.") }
            k.getkeyboard().options.layout = "qwerty";
        } else {
            $("#sendComment").val("Pošlji komentar");
            $("#sendQuery").val("Iskanje");
            $("#clearSearch").val("Počisti rezultate iskanja");
            translatedStr = str.replace("Search results for", "Rezultati iskanja za");
            if (searchErrStr != "") { $(".searchError").html("Prišlo je do napake pri spletnem iskanju.<br/> Prosimo, poskusite znova.") }
            k.getkeyboard().options.layout = "ms-Slovenian";
        }
         //k.getkeyboard().redraw();
         $("#searchResultsTitle").text(translatedStr);
    }

    $('#id_isImage').change(function() {
        if ($('#id_isImage option:selected').val() == "False") {
            $('#autoplayDiv').show();
        } else {
            $('#autoplayDiv').hide();
        }
    })

    $('.editContentPieceBtn').click(function (event) {
        event.preventDefault();
           $.ajax({
               type: "GET",
               url: $(this).attr("id") + '/edit/',
               success: function (results) {
                   console.log(results);
                   $('#editContentPieceFormPlaceholder').html(results);
                   $('#contentPieceEditModal').modal('show');
               },
               error: function (xhr, errmgs, err) {
                   console.log(xhr.status);
                   console.log(xhr.responseText);
               }
           })
       });


            // Pocakaj, da se autoplay video element najprej pozicionira, nato sprozi click event
            // Ce ne das timeouta, mas ob reloadu weird width
            setTimeout(function() {
                $(".autoplay").each(function(i) {
                    $(this).click();
            })}, 3000);

});