!function() {
  // Function to modify images for lazy loading
  function prepareImageForLazyLoad(img) {
    // Skip images that already have both data-src and decoding="async"
    if (img.getAttribute('data-src') && img.getAttribute('decoding') === 'async') {
      return; // Skip image if both attributes are already set
    }

    // If the image is missing data-src, add it
    if (!img.getAttribute('data-src')) {
      img.setAttribute("data-src", img.src); // Move src to data-src
      img.removeAttribute("src"); // Remove src to prevent immediate loading
    }

    // If the image is missing decoding="async", add it
    if (!img.getAttribute('decoding')) {
      img.setAttribute("decoding", "async"); // Add decoding="async"
    }

    img.classList.add("lazyload"); // Add the lazyload class
  }

  // MutationObserver to handle dynamically added images
  var lazy = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "IMG") {
          prepareImageForLazyLoad(node);
        }
      });
    });
  });

  // Observe the entire document for added nodes
  lazy.observe(document.documentElement, { childList: true, subtree: true });

  // Handle existing images on DOM load
  document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("img:not(.lazyload)").forEach(function(img) {
      prepareImageForLazyLoad(img);
    });
  });
}();