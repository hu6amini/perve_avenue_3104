document.addEventListener("DOMContentLoaded", function() {
    if (document.body.id === "search") {
        const scripts = [
            "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/emojione/4.5.0/lib/js/emojione.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/js/lightgallery.min.js"
        ];

        let lastScript;

        scripts.forEach(src => {
            let script = document.createElement("script");
            script.src = src;
            script.defer = true;
            document.body.appendChild(script);
            lastScript = script; // Keep track of the last loaded script
        });

        // Load Perve Avenue and ACE Slider only after the last script has loaded
        lastScript.onload = function () {
            let paScript = document.createElement("script");
            paScript.src = "https://cdn.jsdelivr.net/gh/hu6amini/perve_avenue_2669@main/pa_scripts.js";
            paScript.defer = true;
            document.body.appendChild(paScript);

            let aceSlider = document.createElement("script");
            aceSlider.src = "https://nb.forumfree.it/scripts/ace/slider.js";
            aceSlider.defer = true;
            document.body.appendChild(aceSlider);
        };
    }
});
