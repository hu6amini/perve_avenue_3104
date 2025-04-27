(function() {
    // 1. Immediately hide content and block image loading
    document.documentElement.style.visibility = 'hidden';
    
    // 2. 1x1 transparent GIF (43 bytes - smallest possible placeholder)
    const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    
    // 3. Skip conditions (optimized checks)
    const shouldSkipImage = function(img) {
        return img.hasAttribute("data-src") || 
               img.classList.contains("lazyload") ||
               img.src.startsWith("data:") ||
               img.closest(".slick_carousel, #st-visual-editor, .send");
    };
    
    // 4. Convert to lazyload with dimension preservation
    const convertToLazyload = function(img) {
        // Capture dimensions from multiple possible sources
        const width = img.getAttribute('width') || img.width || img.naturalWidth;
        const height = img.getAttribute('height') || img.height || img.naturalHeight;
        const src = img.src;
        
        // Immediately swap to placeholder
        img.src = placeholder;
        img.setAttribute('data-src', src);
        img.classList.add('lazyload');
        img.setAttribute('decoding', 'async');
        
        // Lock dimensions to prevent layout shifts
        if (width) img.setAttribute('width', width);
        if (height) img.setAttribute('height', height);
    };
    
    // 5. Fast batch processing with debouncing
    let processing = false;
    const processAllImages = function() {
        if (processing) return;
        processing = true;
        
        const images = document.querySelectorAll('img:not([data-src]):not(.lazyload)');
        for (let i = 0, len = images.length; i < len; i++) {
            if (!shouldSkipImage(images[i])) {
                convertToLazyload(images[i]);
            }
        }
        
        document.documentElement.style.visibility = 'visible';
        processing = false;
    };
    
    // 6. Optimized MutationObserver
    const lazyim = new MutationObserver(function(mutations) {
        for (let m = 0; m < mutations.length; m++) {
            const nodes = mutations[m].addedNodes;
            for (let n = 0; n < nodes.length; n++) {
                const node = nodes[n];
                if (node.nodeType === 1) {
                    if (node.tagName === 'IMG' && !shouldSkipImage(node)) {
                        convertToLazyload(node);
                    }
                    if (node.querySelectorAll) {
                        const imgs = node.querySelectorAll('img:not([data-src]):not(.lazyload)');
                        for (let i = 0; i < imgs.length; i++) {
                            if (!shouldSkipImage(imgs[i])) convertToLazyload(imgs[i]);
                        }
                    }
                }
            }
        }
    });
    
    // 7. Initialize with optimal event sequence
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(processAllImages, 0);
    } else {
        document.addEventListener('DOMContentLoaded', processAllImages, {once: true});
    }
    
    // 8. Observe document with optimized parameters
    lazyim.observe(document, {
        childList: true,
        subtree: true,
        attributeFilter: ['src']
    });
    
    // 9. Fallback for dynamic content
    window.addEventListener('load', processAllImages);
})();
