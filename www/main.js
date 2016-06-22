// Twitter code
window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };
    return t;
}(document, "script", "twitter-wjs"));

// IIFE to simulate a module scope (or, you know, use browserify, babel and
// typescript for ES7 modules + types in client :D)
(function(global) {

    // In case the host's document object is not directly accessible. Again,
    // this is irrelevant to this example.
    var document = global.document;
    var twttr = global.twttr;

    global.addEventListener('load', function() {

        var noTouch;

        // Not sure if the 'in' keyword is ES3 compatible. No point in googling it
        // since this is about what I already know. Here is a fail safe mini-test
        // to find out if we are on a touch device:
        if (!~Object.keys(global).indexOf('ontouchstart')) {
            // Add a no-touch class to the body. I do this to let my CSS know that
            // :hover 's must only apply to non-touch devices. So, my selectors for
            // :hover always start with .no-touch
            document.querySelector('body').className = 'no-touch';
            noTouch = true;
        }

        // Make search box available only when twitter sdk is loaded
        twttr.ready(enableSearch);

        document.querySelector('.search input').addEventListener('keydown', function(event) {
            if (event.keyCode !== 13 || !this.value) return;

            disableSearch();
            var request = new XMLHttpRequest();

            request.open("POST", "search.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            request.onreadystatechange = function() {
                if (request.readyState == 4 && request.status == 200) {
                    var response = JSON.parse(request.responseText);

                    // Empty pool violently
                    document.querySelector('.tweet-pool').innerHTML = '';

                    response.statuses.forEach(function(tweet) {
                      document.querySelector('.tweet-pool').innerHTML +=
                        '<div class="spawn">' +
                          '<a href="https://twitter.com/' + tweet.user.screen_name + '">@' +
                            tweet.user.screen_name +
                          '</a>' +
                          '<div>' + htmlify(tweet.text) + '</div>' +
                        '</div>';
                    });

                    enableSearch();
                }
            };

            request.send("q=" + encodeURI(this.value));
        });

        // Functions
        function enableSearch() {
            document.querySelector('.search input').disabled = false;
            document.querySelector('.loader').classList.add('hidden');

            // We only want to immediately focus if an annoying keyboard won't pop
            // up on the screen, aka we are not on a touch device.
            document.querySelector('.no-touch .search input').focus();
        }

        function disableSearch() {
            document.querySelector('.search input').disabled = true;
            document.querySelector('.loader').classList.remove('hidden');
            document.querySelector('.search input').blur();
        }

        function htmlify(text) {
          text = text.replace(/http[s]\:\/\/[^ ]+/g, function(a){ return '<a href="'+a+'">'+a+'</a>'; });
          text = text.replace(/\@[a-zA-Z0-9_]+/g, function(a){ return '<a href="https://twitter.com/'+a+'">'+a+'</a>'; });
          text = text.replace(/\#[a-zA-Z0-9_]+/g, function(a){ return '<a href="https://twitter.com/hashtag/'+a.replace(/\#/, '')+'">'+a+'</a>'; });

          return text;
        }

        // Fancy kids stuff
        console.log(
            '%c8test %cinitialized.',
            'color:blue; font-weight:bold', 'color:black');

    });

    // Passing in 'this' to make sure we get the global/module scope of the host
    // of this code. Not really relevant to this example, just an old habit.
})(this);
