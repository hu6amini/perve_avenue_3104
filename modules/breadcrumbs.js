/* =============================================
   Breadcrumbs Module – Emerald Theme
   Modernises the legacy .nav list into an
   accessible breadcrumb trail.
   ============================================= */
'use strict';

const BreadcrumbsModule = (function () {
    console.log('🔥 BreadcrumbsModule loaded');

    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    const CONFIG = Object.freeze({
        LEGACY_NAV_SELECTOR: 'ul.nav',
        MODERN_CONTAINER_ID: 'modern-breadcrumbs',
        WRAPPER_ID: 'modern-forum-wrapper',
        INSERT_BEFORE_SELECTOR: '.carousel-wrapper'
    });

    // =========================================================================
    // UTILITIES
    // =========================================================================
    const escapeHtml = (str) => {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    // =========================================================================
    // CONTAINER HELPERS
    // =========================================================================
    function getWrapper() {
        return document.getElementById(CONFIG.WRAPPER_ID);
    }

    function getOrCreateContainer() {
        const wrapper = getWrapper();
        if (!wrapper) return null;

        let container = document.getElementById(CONFIG.MODERN_CONTAINER_ID);
        if (container) return container;

        container = document.createElement('nav');
        container.id = CONFIG.MODERN_CONTAINER_ID;
        container.className = 'modern-breadcrumbs';
        container.setAttribute('aria-label', 'breadcrumb');

        const referenceNode = wrapper.querySelector(CONFIG.INSERT_BEFORE_SELECTOR);
        if (referenceNode) {
            wrapper.insertBefore(container, referenceNode);
        } else {
            wrapper.insertBefore(container, wrapper.firstChild);
        }
        return container;
    }

    // =========================================================================
    // DATA EXTRACTION
    // =========================================================================
    function extractBreadcrumbItems(legacyNav) {
        const items = [];
        const listItems = legacyNav.querySelectorAll('li');

        for (let i = 0; i < listItems.length; i++) {
            const li = listItems[i];
            const link = li.querySelector('a');
            if (link) {
                // It's a link item
                items.push({
                    text: link.textContent.trim(),
                    url: link.getAttribute('href'),
                    isCurrent: false
                });
            } else {
                // Plain text item (current page)
                const text = li.textContent.trim().replace(/^\u200B/, ''); // remove zero-width space
                if (text) {
                    items.push({
                        text: text,
                        url: null,
                        isCurrent: true
                    });
                }
            }
        }
        return items;
    }

    // =========================================================================
    // BUILD MODERN BREADCRUMB
    // =========================================================================
    function buildBreadcrumbHtml(items) {
        if (items.length === 0) return '';

        let html = '<ol class="modern-breadcrumb-list">';

        items.forEach(function (item, index) {
            const isLast = index === items.length - 1;
            html += '<li class="modern-breadcrumb-item' + (isLast ? ' modern-breadcrumb-item--current' : '') + '">';

            if (item.url && !isLast) {
                html += '<a href="' + escapeHtml(item.url) + '" class="modern-breadcrumb-link">' + escapeHtml(item.text) + '</a>';
            } else {
                // Current page (no link)
                html += '<span class="modern-breadcrumb-text" aria-current="page">' + escapeHtml(item.text) + '</span>';
            }

            if (!isLast) {
                html += '<i class="fa-regular fa-chevron-right modern-breadcrumb-separator" aria-hidden="true"></i>';
            }

            html += '</li>';
        });

        html += '</ol>';
        return html;
    }

    // =========================================================================
    // CONVERSION
    // =========================================================================
    function convert() {
        const legacyNav = document.querySelector(CONFIG.LEGACY_NAV_SELECTOR);
        if (!legacyNav) return;

        const container = getOrCreateContainer();
        if (!container) return;

        const items = extractBreadcrumbItems(legacyNav);
        const html = buildBreadcrumbHtml(items);
        container.innerHTML = html;

        // Hide the legacy nav
        legacyNav.style.display = 'none';

        console.log('[BreadcrumbsModule] Breadcrumb modernised');
    }

    // =========================================================================
    // OBSERVER INTEGRATION
    // =========================================================================
    function registerObserver() {
        if (!globalThis.forumObserver) return;

        try {
            globalThis.forumObserver.register({
                id: 'breadcrumbs-module',
                selector: CONFIG.LEGACY_NAV_SELECTOR,
                priority: 'high',
                callback: function () {
                    convert();
                }
            });
            console.log('[BreadcrumbsModule] Registered with ForumCoreObserver');
        } catch (e) {
            console.error('[BreadcrumbsModule] Observer registration failed:', e);
        }
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    function initialize() {
        if (!document.querySelector(CONFIG.LEGACY_NAV_SELECTOR)) return;

        convert();
        registerObserver();
        console.log('[BreadcrumbsModule] Initialised');
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================
    return {
        initialize: initialize,
        refresh: convert
    };
})();

// Auto‑initialize when DOM is ready
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(function () { BreadcrumbsModule.initialize(); }, 0);
} else {
    document.addEventListener('DOMContentLoaded', function () { BreadcrumbsModule.initialize(); });
}

// Expose globally
if (typeof window !== 'undefined') {
    window.BreadcrumbsModule = BreadcrumbsModule;
    window.dispatchEvent(new CustomEvent('breadcrumbs-module-ready'));
}
