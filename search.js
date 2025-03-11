document.addEventListener("DOMContentLoaded", function() {
    if (document.body.id === "search") {
        ["https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js",
         "https://cdnjs.cloudflare.com/ajax/libs/emojione/4.5.0/lib/js/emojione.min.js",
         "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js",
         "https://cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/js/lightgallery.min.js"
        ].forEach(src => {
            let script = document.createElement("script");
            script.src = src;
            script.defer = true;
            document.body.appendChild(script);
        });

        // Load Perve Avenue and ACE Slider last
        let paScript = document.createElement("script");
        paScript.src = "https://cdn.jsdelivr.net/gh/hu6amini/perve_avenue_2461@main/pa_scripts.js";
        paScript.defer = true;
        document.body.appendChild(paScript);

        let aceSlider = document.createElement("script");
        aceSlider.src = "https://nb.forumfree.it/scripts/ace/slider.js";
        aceSlider.defer = true;
        document.body.appendChild(aceSlider);
    }
});
