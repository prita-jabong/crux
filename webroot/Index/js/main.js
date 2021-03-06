/**
 * Generic javascript file for all modules
 * 
 * @author Chandra Shekhar <shekharsharma705@gmail.com>
 */

APP_CONSTANTS = {
    CSRF_TOKEN_NAME : 'csrf_token',
    SUCCESS_CODE : 'success',
    FAILURE_CODE : 'error',
    MAX_SEARCH_SUGGEST : 15,
    cssSelectors : {
        popupBg : '.popup-opacity-background',
        accountDD : '.account-dropdown',
        AboutBlock : '#about-me-block'
    }
};

var popupFlags = {
    chpwd : 0,
    userPref : 0,
    execCode : 0,
    about : 0,
    account : 0
};

var lastPopupBlockSelector = null;

var errorObject = {
    isError : false,
    errorMsg : ''
};

function getAjaxConnection() {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

function addEvent(element, event, fn) {
    if (element.addEventListener)
        element.addEventListener(event, fn, false);
    else if (element.attachEvent)
        element.attachEvent('on' + event, fn);
}

// Enabling ctl+F to be used for site search
addEvent(window, 'keydown', function(e) {
    if (e.ctrlKey && e.keyCode === 70) {
        e.preventDefault();
        $('#searchbox').focus();
    }
});

addEvent(window, 'keydown', function(e) {
    if (e.keyCode === 27) {
        e.preventDefault();
        hideBgPopups();
    }
});

function hideBgPopups() {
    if (!$('.account-dropdown').is(':hidden')) {
        $(APP_CONSTANTS.cssSelectors.popupBg).hide();
        $('.account-dropdown').hide();
    }
}

function hideBgPopups1(flagKey) {
    $(APP_CONSTANTS.cssSelectors.popupBg).hide();
    $('.popupDiv').hide();
    popupFlags[flagKey] = 0;
}

$('#username-link').click(function() {
    var selector = APP_CONSTANTS.cssSelectors.accountDD;
    getPartialPopup(selector);
});

AJAX = getAjaxConnection();

function attachPopupEvents(bg, container, flagKey, callback) {
    // Aligning box in the middle
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var popupHeight = $(container).height();
    var popupWidth = $(container).width();
    // centering
    $(container).css({
        "position" : "fixed",
        "top" : windowHeight / 2 - popupHeight / 2,
        "left" : windowWidth / 2 - popupWidth / 2
    });

    // aligning full bg
    $(bg).css({
        "height" : windowHeight
    });
    lastPopupBlockSelector = container;
    // Pop up the div and Bg
    if (popupFlags[flagKey] == 0) {
        $(bg).css({
            "opacity" : "0.7",
            "z-index" : "999"
        });
        $(bg).fadeIn("slow");
        $(container).fadeIn("slow");
        popupFlags[flagKey] = 1;
    }

    if (typeof flagKey != 'undefined') {
        addEvent(window, 'keydown', function(e) {
            if (e.keyCode === 27 && popupFlags[flagKey] === 1) {
                e.preventDefault();
                $(container).fadeOut("fast");
                $(bg).fadeOut("slow");
                popupFlags[flagKey] = 0;
            }
        });
    }

    if (typeof callback != 'undefined') {
        callback();
    }
}

// Close Them
$("#popupClose").click(function() {
    closePopup();
});

function closePopup(bg, container) {
    if (popupStatus == 1) {
        $(bg).fadeOut("slow");
        $(container).fadeOut("slow");
        popupStatus = 0;
    }
}

function getPartialPopup(visibleBlock) {
    $(APP_CONSTANTS.cssSelectors.popupBg).css({
        'opacity' : '0.7',
        'z-index' : '999'
    });
    $(APP_CONSTANTS.cssSelectors.popupBg).toggle();
    $(visibleBlock).zIndex(1000);
    $(visibleBlock).slideToggle();
    lastPopupBlockSelector = visibleBlock;
}

function closePartialPopup(visibleBlock) {
    $(APP_CONSTANTS.cssSelectors.popupBg).fadeOut("fast");
    $(visibleBlock).slideToggle();
}

// Initialize search suggestions
var searchSuggestions = [];
if (typeof searchDataSource != 'undefined') {
    searchSuggestions = JSON.parse(searchDataSource);
    searchSuggestions.sort();
    $("#searchbox").autocomplete({
        source : function(request, response) {
            var results = $.ui.autocomplete.filter(searchSuggestions, request.term);
            response(results.slice(0, APP_CONSTANTS.MAX_SEARCH_SUGGEST));
        },
        appendTo : '#jquery-autocomplete-results',
        // position : {
        // my : 'right top',
        // at : 'center'
        // },
        select : function(event, ui) {
            $('#searchbox').val(ui.item.value);
            $('.searchform').submit();
        }
    });
    searchB = $('#searchbox')[0];
    $('#jquery-autocomplete-results').css({
        'position' : 'absolute',
        'top' : searchB.getClientRects()[0].top + searchB.clientHeight + 2,
        'left' : searchB.getClientRects()[0].left,
        'width' : searchB.clientWidth,
        'min-width' : searchB.clientWidth
    });
}

$('#searchbox').focus(function() {
    $('#middleware').css({
        'opacity' : 0.5,
    });
});

$('#searchbox').blur(function() {
    $('#middleware').css({
        'opacity' : 1,
    });
});

/**
 * Commenting because of bad-syncing of toggle events
 */
// $(APP_CONSTANTS.cssSelectors.popupBg).click(function(){
// $(APP_CONSTANTS.cssSelectors.popupBg).fadeOut('slow');
// $(lastPopupBlockSelector).slideToggle();
// });
function removeClass(el, className) {
    className = " " + className.trim(); // must keep a space before class name
    el.className = el.className.replace(className, "");
}

function getLoadingPopup() {
    var container = document.createElement('span');
    container.innerHTML = 'Loading...';
    attachPopupEvents($(APP_CONSTANTS.cssSelectors.popupBg)[0], container);
}