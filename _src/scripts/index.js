/**
 * @license
 * touchtap-event <http://github.com/Tyriar/touchtap-event>
 * Copyright 2014 Daniel Imms <http://www.growingwiththeweb.com>
 * Released under the MIT license <http://github.com/Tyriar/touchtap-event/blob/master/LICENSE>
 */
(function () {
  'use strict';

  var touchTapEvent;
  var isTapLength;
  var tapLengthTimeout;
  var startPosition = { x: -1, y: -1 };
  var currentPosition = { x: -1, y: -1 };

  /**
   * Gets the touch object from a touch* event.
   * @param {Event} e The event.
   * @returns {Touch} The (first) touch object from the event.
   */
  function getTouchObject(e) {
    if (e.originalEvent && e.originalEvent.targetTouches) {
      return e.originalEvent.targetTouches[0];
    }
    if (e.targetTouches) {
      return e.targetTouches[0];
    }
    return e;
  }

  /**
   * Gets whether two numbers are approximately equal to each other.
   * @param {number} a The first number.
   * @param {number} b The second number.
   * @returns {Boolean}
   */
  function approximatelyEqual(a, b) {
    return Math.abs(a - b) < 2;
  }

  /**
   * Handler for the touchstart event.
   * @param {Event} e The touchstart event.
   */
  function touchstart(e) {
    var touchObject = getTouchObject(e);
    startPosition.x = touchObject.pageX;
    startPosition.y = touchObject.pageY;
    currentPosition.x = touchObject.pageX;
    currentPosition.y = touchObject.pageY;
    isTapLength = true;
    if (tapLengthTimeout) {
      clearTimeout(tapLengthTimeout);
    }
    tapLengthTimeout = setTimeout(function () {
      isTapLength = false;
    }, 200);
  }

  /**
   * Handler for the touchend event.
   * @param {Event} e The touchend event.
   */
  function touchend(e) {
    if (isTapLength &&
        approximatelyEqual(startPosition.x, currentPosition.x) &&
        approximatelyEqual(startPosition.y, currentPosition.y)) {
      touchTapEvent.customData = {
        touchX: currentPosition.x,
        touchY: currentPosition.y
      };
      e.target.dispatchEvent(touchTapEvent);
    }
  }

  /**
   * Handler for the touchmove event.
   * @param {Event} e The touchmove event.
   */
  function touchmove(e) {
    var touchObject = getTouchObject(e);
    currentPosition.x = touchObject.pageX;
    currentPosition.y = touchObject.pageY;
  }

  /**
   * Initialises the library.
   */
  function init() {
    try {
      // The basic events module is supported by most browsers, including IE9 and newer.
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent#Example
      touchTapEvent = document.createEvent('Event');
      touchTapEvent.initEvent('touchtap', true, true);

      // EventTarget.addEventListener() is supported by most browsers, including IE9 and newer.
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Browser_compatibility
      document.addEventListener('touchstart', touchstart, false);
      document.addEventListener('touchend', touchend, false);
      document.addEventListener('touchcancel', touchend, false);
      document.addEventListener('touchmove', touchmove, false);
    }
    catch (err) {
      // Ignore "Object doesn't support this property or method" in IE8 and earlier.
    }
  }

  init();
})();

/**
 * @license
 * abbr-touch <http://github.com/Tyriar/abbr-touch>
 * Copyright 2014 Daniel Imms <http://www.growingwiththeweb.com>
 * Released under the MIT license <http://github.com/Tyriar/abbr-touch/blob/master/LICENSE>
 */
var abbrTouch = (function () { // eslint-disable-line no-unused-vars
  'use strict';

  /**
   * Generates a touchtap event handler that calls the tap handler provided.
   * @param {function} handler The tap handler to call.
   * @returns {function}
   */
  function generateTouchtapHandler(handler) {
    return function (e) {
      handler(e.currentTarget, e.currentTarget.title, e.customData.touchX, e.customData.touchY);
    };
  }

  /**
   * The default lightweight tap handler.
   */
  function defaultOnTapHandler(target, title, touchX, touchY) { // eslint-disable-line no-unused-vars
    alert(title); // eslint-disable-line no-alert
  }

  /**
   * Attaches abbrTouch events on all abbr[title] elements within an element
   * @param {HTMLElement} elementScope The element containing abbr[title]
   * elements.
   * @param {function} customTapHandler (Optional) A custom touchtap handler to
   * be used when abbr[title] elements are touched.
   */
  function init(elementScope, customTapHandler) {
    if (!elementScope) {
      elementScope = document;
    }

    var tapHandler = customTapHandler || defaultOnTapHandler;

    var elements = elementScope.querySelectorAll('abbr[title]');
    var touchtapHandler = generateTouchtapHandler(tapHandler);
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('touchtap', touchtapHandler);
    }
  }

  return init;
})();

/* global abbrTouch */
function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function perfmark(callback, key) {
    performance.mark('mark_' + key + '_start');
    callback();
    performance.mark('mark_' + key + '_end');
    performance.measure('mark_' + key, 'mark_' + key + '_start', 'mark_' + key + '_end');
}

(function switchlang() {
    perfmark(function () {
        // Detect user language and redirect, if first time, to the right page ----------------
        try {
            var lang_user;
            lang_user = localStorage.getItem("lang_user");
            if (!lang_user) {
                lang_user = (window.navigator.userLanguage || (window.navigator.languages.length > 0 && window.navigator.languages[0]) || window.navigator.language).slice(0, 2);
                localStorage.setItem("lang_user", lang_user);
                var lang_site = document.getElementsByTagName('html')[0].lang;
                if (lang_user != lang_site) {
                    window.location = document.querySelector('[hreflang][rel="alternate"]').href;
                }
            }
        } catch (e) {
        }
    }, 'switchlang');
})();

ready(function () {
    (function (abbrTouch) {

        var tooltipTimeout;

        function getTooltipElement() {
            var tooltip = document.querySelector('#abbr-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'abbr-tooltip';
                // Technically this is duplicate content, just exposing it on mobile
                tooltip.setAttribute('aria-hidden', 'true');
                document.body.appendChild(tooltip);
            }
            return tooltip;
        }

        function updateTooltip(tooltip, term, expandedTerm) {
            var text = term + ': ' + expandedTerm;
            tooltip.innerHTML = text;
            tooltip.classList.add('visible');

            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
            }

            var timeoutLength = text.length * 120;
            tooltipTimeout = setTimeout(function () {
                tooltip.classList.remove('visible');
            }, timeoutLength);
        }


        perfmark(function () {
            abbrTouch(document.querySelector('article'), function (target, title) {
                var tooltip = getTooltipElement();
                // Ensure the tooltip is ready so that the initial transition works
                setTimeout(function () {
                    updateTooltip(tooltip, target.innerHTML, title);
                }, 0);
            });
        }, 'abbrTouch');
    })(abbrTouch);

    /***********************************************
     ***********************************************/

    (function videoPlayPause() {

        perfmark(function () {
            var authorize_download = false;
            var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection && typeof connection.effectiveType != 'undefined') {
                authorize_download = connection.effectiveType == "4g";
            }
            var videos = document.querySelectorAll('.videoWrapper.gif');
            videos.forEach(function (item) {
                var insideVid = item.querySelector('video');
                // In order to prevent a disgracious "flash" when load()

                item.style.height = insideVid.clientHeight + 'px';
                item.style.width = insideVid.clientWidth + 'px';
                insideVid.style.height = insideVid.clientHeight + 'px';
                if (authorize_download) {
                    insideVid.setAttribute('preload', 'auto');
                }

                item.addEventListener('click', toggleVideo, false);
            });
        }, 'video_hover');
    
        function playVideo(e, v) {
            var video = v || this.querySelector('video');
            if (!video.classList.contains('loading-started')) {
                video.classList.add('loading-started');
                video.addEventListener("canplay", function () {
                    this.play();
                });
            }
            video.load();
        }
    
        function pauseVideo(e, v) {
            var video = v || this.querySelector('video');
            video.pause();
        }
    
        function toggleVideo(e, v) {
            var video = v || this.querySelector('video');
            if (video.paused) {
                video.parentElement.classList.add('playing');
                playVideo(e, video);
            } else {
                pauseVideo(e, video);
                video.parentElement.classList.remove('playing');
            }
        }
    })();
});