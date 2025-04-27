(function() {
    // Immediately hide content and block image loading
    document.documentElement.style.visibility = 'hidden';
    
    // Tiny transparent GIF (1x1 pixel)
    const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    
    // Check if image should be skipped
    const shouldSkipImage = function(img) {
        return img.closest(".slick_carousel") || 
               img.closest("#st-visual-editor") || 
               img.closest(".send") ||
               img.hasAttribute("data-src") || 
               img.classList.contains("lazyload") || 
               img.getAttribute("decoding") === "async" || 
               img.src.indexOf("data:") === 0;
    };
    
    // Convert image to lazyload format (ultra-fast version)
    const convertToLazyload = function(img) {
        // Store original attributes
        var src = img.src;
        var width = img.width || img.getAttribute('width');
        var height = img.height || img.getAttribute('height');
        
        // Immediately block loading with placeholder
        img.src = placeholder;
        img.setAttribute('data-src', src);
        img.classList.add('lazyload');
        img.setAttribute('decoding', 'async');
        
        // Maintain layout dimensions
        if (width) img.setAttribute('width', width);
        if (height) img.setAttribute('height', height);
    };
    
    // Process all images (optimized bulk operation)
    const processAllImages = function() {
        var images = document.querySelectorAll('img:not([data-src]):not(.lazyload)');
        for (var i = 0, len = images.length; i < len; i++) {
            if (!shouldSkipImage(images[i])) {
                convertToLazyload(images[i]);
            }
        }
        document.documentElement.style.visibility = 'visible';
    };
    
    // MutationObserver for dynamic content
    var lazyim = new MutationObserver(function(mutations) {
        for (var m = 0; m < mutations.length; m++) {
            var nodes = mutations[m].addedNodes;
            for (var n = 0; n < nodes.length; n++) {
                var node = nodes[n];
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'IMG') {
                        if (!shouldSkipImage(node)) convertToLazyload(node);
                    } else if (node.querySelectorAll) {
                        var imgs = node.querySelectorAll('img:not([data-src]):not(.lazyload)');
                        for (var i = 0; i < imgs.length; i++) {
                            if (!shouldSkipImage(imgs[i])) convertToLazyload(imgs[i]);
                        }
                    }
                }
            }
        }
    });
    
    // Start processing
    if (document.readyState === 'complete') {
        processAllImages();
    } else {
        document.addEventListener('DOMContentLoaded', processAllImages);
        window.addEventListener('load', processAllImages);
    }
    
    // Observe the entire document
    lazyim.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
