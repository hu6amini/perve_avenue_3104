(function() {
    // Hide content until all images are processed
    document.documentElement.style.visibility = 'hidden';
    
    const imageDimensionsCache = new Map();
    let pendingImageLoads = 0;
    let isProcessing = false;
    
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
    
    // Create SVG placeholder
    const createPlaceholder = function(width, height) {
        return 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'' + 
               (width || 1) + '\' height=\'' + (height || 1) + 
               '\' viewBox=\'0 0 ' + (width || 1) + ' ' + (height || 1) + 
               '\'%3E%3C/svg%3E';
    };
    
    // Convert image to lazyload format
    const convertToLazyload = function(img, src, width, height) {
        // Immediately replace src with placeholder to prevent loading
        img.src = createPlaceholder(width, height);
        img.setAttribute('data-src', src);
        img.classList.add('lazyload');
        img.setAttribute('decoding', 'async');
        
        if (width && height) {
            img.setAttribute('width', width);
            img.setAttribute('height', height);
        }
    };
    
    // Process single image with dimension extraction
    const processImage = function(img) {
        if (shouldSkipImage(img)) return;
        
        var src = img.src;
        if (!src || src.indexOf('data:') === 0) return;
        
        // If we have cached dimensions, process immediately
        if (imageDimensionsCache.has(src)) {
            var dimensions = imageDimensionsCache.get(src);
            convertToLazyload(img, src, dimensions.width, dimensions.height);
            return;
        }
        
        // Otherwise load image to get dimensions
        pendingImageLoads++;
        var loader = new Image();
        loader.onload = function() {
            var dimensions = {
                width: loader.naturalWidth,
                height: loader.naturalHeight
            };
            imageDimensionsCache.set(src, dimensions);
            convertToLazyload(img, src, dimensions.width, dimensions.height);
            pendingImageLoads--;
            checkAllImagesProcessed();
        };
        loader.onerror = function() {
            convertToLazyload(img, src);
            pendingImageLoads--;
            checkAllImagesProcessed();
        };
        loader.src = src;
    };
    
    // Check if all images have been processed
    const checkAllImagesProcessed = function() {
        if (pendingImageLoads === 0) {
            document.documentElement.style.visibility = 'visible';
        }
    };
    
    // Process all images on page
    const processAllImages = function() {
        if (isProcessing) return;
        isProcessing = true;
        
        var images = document.querySelectorAll('img:not([data-src]):not(.lazyload)');
        for (var i = 0; i < images.length; i++) {
            processImage(images[i]);
        }
        
        // If no images needed loading, show page immediately
        if (pendingImageLoads === 0) {
            document.documentElement.style.visibility = 'visible';
        }
        
        isProcessing = false;
    };
    
    // MutationObserver for dynamic content
    var lazyim = new MutationObserver(function(mutations) {
        for (var m = 0; m < mutations.length; m++) {
            var addedNodes = mutations[m].addedNodes;
            for (var n = 0; n < addedNodes.length; n++) {
                var node = addedNodes[n];
                if (node.nodeType === 1) {
                    if (node.tagName === 'IMG') {
                        processImage(node);
                    } else if (node.querySelectorAll) {
                        var childImages = node.querySelectorAll('img:not([data-src]):not(.lazyload)');
                        for (var c = 0; c < childImages.length; c++) {
                            processImage(childImages[c]);
                        }
                    }
                }
            }
        }
    });
    
    // Initialize based on ready state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAllImages);
    } else {
        processAllImages();
    }
    
    // Observe document for changes
    lazyim.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // Event listeners for common updates
    var events = ['ajaxComplete', 'ajaxSuccess', 'load', 'pageshow'];
    for (var e = 0; e < events.length; e++) {
        window.addEventListener(events[e], processAllImages, { passive: true });
    }
})();
