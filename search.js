document.addEventListener("DOMContentLoaded", function() {
  if (document.body.id === "search") {
    const libraries = [
      // Emoji support (required for emoji processing)
      "https://cdnjs.cloudflare.com/ajax/libs/emojione/4.5.0/lib/js/emojione.min.js",
      
      // Moment.js and timezone support (MUST load before pa_scripts.js)
      "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.43/moment-timezone-with-data.min.js",
      
      // Other supporting libraries
      "https://cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/js/lightgallery.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/lite-youtube-embed/0.3.3/lite-yt-embed.js",
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js"
    ];

    // Load all libraries with proper error handling
    Promise.all(libraries.map(function(url) {
      return new Promise(function(resolve, reject) {
        const script = document.createElement("script");
        script.src = url;
        script.defer = true;
        script.onload = resolve;
        script.onerror = function() {
          console.error("Failed to load script: " + url);
          reject(new Error("Script load failed: " + url));
        };
        document.body.appendChild(script);
      });
    }))
    .then(function() {
      // Verify moment.js is loaded before proceeding
      if (typeof moment === 'undefined' || typeof moment.tz === 'undefined') {
        throw new Error("Moment.js or moment-timezone failed to load");
      }

      // Load main forum scripts AFTER dependencies are confirmed ready
      const paScript = document.createElement("script");
      paScript.src = "https://cdn.jsdelivr.net/gh/hu6amini/perve_avenue_2897@main/pa_scripts.js";
      paScript.defer = true;
      document.body.appendChild(paScript);

      const sliderScript = document.createElement("script");
      sliderScript.src = "https://nb.forumfree.it/scripts/ace/slider.js";
      sliderScript.defer = true;
      document.body.appendChild(sliderScript);
    })
    .catch(function(error) {
      console.error("Script loading failed:", error);
      // Optional: Implement fallback behavior here
    });
  }
});
