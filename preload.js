function loadStyle(href, integrity, crossorigin, referrerPolicy) {
    return new Promise(function(resolve, reject) {
        if (document.querySelector('link[href="' + href + '"]')) {
            return resolve(); // Prevent redundant loading
        }
        var link = document.createElement("link");
        link.rel = "preload";
        link.href = href;
        link.as = "style";
        if (integrity) link.integrity = integrity;
        if (crossorigin) link.crossOrigin = crossorigin;
        if (referrerPolicy) link.referrerPolicy = referrerPolicy;
        link.onload = function() {
            link.rel = "stylesheet"; // Apply the stylesheet after preloading
            resolve();
        };
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

function loadScript(src, integrity, crossorigin, referrerPolicy, async, defer, callback) {
    return new Promise(function(resolve, reject) {
        if (document.querySelector('script[src="' + src + '"]')) {
            return resolve(); // Prevent redundant loading
        }
        var link = document.createElement("link");
        link.rel = "preload";
        link.href = src;
        link.as = "script"; // Preload as script
        if (integrity) link.integrity = integrity;
        if (crossorigin) link.crossOrigin = crossorigin;
        if (referrerPolicy) link.referrerPolicy = referrerPolicy;
        document.head.appendChild(link); // Preload the script

        var script = document.createElement("script");
        script.src = src;
        if (integrity) script.integrity = integrity;
        if (crossorigin) script.crossOrigin = crossorigin;
        if (referrerPolicy) script.referrerPolicy = referrerPolicy;
        if (async) script.async = async;
        if (defer) script.defer = defer;
        script.onload = function() {
            if (callback) callback();
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// **Preload styles first**
Promise.all([
    loadStyle("https://cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/css/lightgallery.min.css", 
              "sha512-kwJUhJJaTDzGp6VTPBbMQWBFUof6+pv0SM3s8fo+E6XnPmVmtfwENK0vHYup3tsYnqHgRDoBDTJWoq7rnQw2+g==", 
              "anonymous", "no-referrer"),
    loadStyle("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.css", 
              "sha512-yHknP1/AwR+yx26cB1y0cjvQUMvEa2PFzt1c9LlS4pRQ5NOTZFWbhBig+X9G9eYW/8m0/4OXNx8pxJ6z57x0dw==", 
              "anonymous", "no-referrer")
])
// **Then preload scripts**
.then(function() {
    return Promise.all([
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js", 
                   "sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==", 
                   "anonymous", "no-referrer", false, true), // defer
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/emojione/4.5.0/lib/js/emojione.min.js", 
                   "sha512-E2Ai/A9+KcoBm0lvfnd5krbr7TWUigQGWTfcoMToNpfmCvQKkZdTbpwyIM4PFbCGMtSmMjE/DAXGjVXpWGdFaQ==", 
                   "anonymous", "no-referrer", false, true), // defer
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/js/lightgallery.min.js", 
                   "sha512-b4rL1m5b76KrUhDkj2Vf14Y0l1NtbiNXwV+SzOzLGv6Tz1roJHa70yr8RmTUswrauu2Wgb/xBJPR8v80pQYKtQ", 
                   "anonymous", "no-referrer", false, true), // defer
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js", 
                   "sha512-HGOnQO9+SP1V92SrtZfjqxxtLmVzqZpjFFekvzZVWoiASSQgSr4cw9Kqd2+l8Llp4Gm0G8GIFJ4ddwZilcdb8A==", 
                   "anonymous", "no-referrer", false, true) // defer
    ]);
})
// **Wait for DOMContentLoaded before loading remaining scripts**
.then(function() {
    return new Promise(function(resolve) {
        document.addEventListener("DOMContentLoaded", resolve, { once: true });
    });
})
// **Load additional scripts after DOM is ready**
.then(function() {
    return Promise.all([
        loadScript("https://cdn.jsdelivr.net/gh/hu6amini/perve_avenue_2272@main/pa_scripts.js", 
                   null, "anonymous", null, false, true) // defer
    ]);
})
.then(function() {
    return loadScript("https://nb.forumfree.it/scripts/ace/slider.js", null, null, null, false, true);
})
.catch(function(err) {
    console.error("Script loading error:", err);
});
