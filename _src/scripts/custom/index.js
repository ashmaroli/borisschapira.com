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
        } catch (e) {}
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


    (function(){
        window.visibilityJoke = {
            song: [
                "🎶 Moi je t'offrirai",
                "🎶 Des commits ciselés",
                "🎶 Sur des branches forkées",
                "🎶 Où on ne rebase pas.",
                "🎶 …",
                "🎶 Je ferai des pull",
                "🎶 Jusqu'après ma mort",
                "🎶 Pour avoir tes tags",
                "🎶 Jusque dans mon stash.",
                "🎶 …",
                "🎶 Je ferai un HEAD",
                "🎶 Où l'amour sera roi,",
                "🎶 Où l'amour sera loi,",
                "🎶 Où tu pourras merge.",
                "🎶 …",
                "🎶 Ne me git pas,",
                "🎶 …",
                "🎶 Ne me git pas,",
                "🎶 …",
                "🎶 Ne me git pas,",
                "🎶 …",
                "🎶 Ne me git pas."
            ],
            id_interval: null,
            index: 0
        };

        document.addEventListener("visibilitychange", function () {

            function iterateSongTitle() {
                if (window.visibilityJoke.index < window.visibilityJoke.song.length) {
                    document.title = window.visibilityJoke.song[window.visibilityJoke.index];
                    window.visibilityJoke.index += 1;
                } else {
                    rollbackTitle();
                }
            }

            function rollbackTitle() {
                if (window.visibilityJoke.id_interval) {
                    clearInterval(window.visibilityJoke.id_interval);
                    window.visibilityJoke.index = 0;
                }
                try {
                    var title = localStorage.getItem("away_title");
                    if (title) {
                        document.title = title;
                    }
                } catch (e) {}
            }

            if ("visible" === document.visibilityState) {
                rollbackTitle();
            } else {
                localStorage.setItem("away_title", document.title);
                iterateSongTitle();
                window.visibilityJoke.id_interval = setInterval(iterateSongTitle, 2000);
            }
        });
    })();
});