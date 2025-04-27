(function() {
    // Hide content until processing is done
    document.documentElement.style.visibility = 'hidden';
    
    const imageDimensionsCache = new Map();
    let pendingImageLoads = 0;
    
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
    
    // Process image with immediate dimension extraction
    const processImage = async function(img) {
        if (shouldSkipImage(img)) return;
        
        const src = img.src;
        if (!src || src.indexOf('data:') === 0) return;
        
        // If we have cached dimensions, process immediately
        if (imageDimensionsCache.has(src)) {
            const {width, height} = imageDimensionsCache.get(src);
            applyLazyAttributes(img, src, width, height);
            return;
        }
        
        // Extract dimensions immediately
        pendingImageLoads++;
        try {
            const dimensions = await getImageDimensions(src);
            imageDimensionsCache.set(src, dimensions);
            applyLazyAttributes(img, src, dimensions.width, dimensions.height);
        } catch {
            applyLazyAttributes(img, src); // Fallback without dimensions
        }
        pendingImageLoads--;
        if (pendingImageLoads === 0) {
            document.documentElement.style.visibility = 'visible';
        }
    };
    
    // Get image dimensions with Promise
    const getImageDimensions = function(src) {
        return new Promise((resolve, reject) => {
            const loader = new Image();
            loader.onload = function() {
                resolve({
                    width: loader.naturalWidth,
                    height: loader.naturalHeight
                });
            };
            loader.onerror = reject;
            loader.src = src;
        });
    };
    
    // Apply lazy loading attributes
    const applyLazyAttributes = function(img, src, width, height) {
        // Immediately block image loading
        img.src = createPlaceholder(width, height);
        img.setAttribute('data-src', src);
        img.classList.add('lazyload');
        img.setAttribute('decoding', 'async');
        
        if (width && height) {
            img.setAttribute('width', width);
            img.setAttribute('height', height);
        }
    };
    
    // Process all images with async/await
    const processAllImages = async function() {
        const images = document.querySelectorAll('img:not([data-src]):not(.lazyload)');
        
        if (images.length === 0) {
            document.documentElement.style.visibility = 'visible';
            return;
        }
        
        await Promise.all(Array.from(images).map(img => processImage(img)));
        
        // Final check in case some images loaded faster than others
        if (pendingImageLoads === 0) {
            document.documentElement.style.visibility = 'visible';
        }
    };
    
    // MutationObserver for dynamic content
    const lazyim = new MutationObserver(function(mutations) {
        mutations.forEach(async (mutation) => {
            const addedNodes = Array.from(mutation.addedNodes);
            for (const node of addedNodes) {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'IMG') {
                        await processImage(node);
                    } else if (node.querySelectorAll) {
                        const childImages = node.querySelectorAll('img:not([data-src]):not(.lazyload)');
                        await Promise.all(Array.from(childImages).map(img => processImage(img)));
                    }
                }
            }
        });
    });
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAllImages);
    } else {
        processAllImages();
    }
    
    // Observe document
    lazyim.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // Handle dynamic content events
    const events = ['ajaxComplete', 'ajaxSuccess', 'load', 'pageshow'];
    events.forEach(event => {
        window.addEventListener(event, processAllImages, { passive: true });
    });
})();
