/* =============================================
   Breadcrumbs & Pagination Module – Emerald Theme
   Modernises legacy .nav list AND .navsub.top.Justify
   into accessible breadcrumb + bottom action bar.
   ============================================= */
'use strict';

const BreadcrumbsModule = (function () {
    console.log('🔥 BreadcrumbsModule loaded (breadcrumbs + pagination)');

    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    const CONFIG = Object.freeze({
        LEGACY_NAV_SELECTOR: 'ul.nav',
        MODERN_BREADCRUMB_ID: 'modern-breadcrumbs',
        LEGACY_PAGINATION_SELECTOR: '.navsub.top.Justify',
        MODERN_PAGINATION_ID: 'modern-pagination',
        WRAPPER_ID: 'modern-forum-wrapper',
        INSERT_AFTER_SELECTOR: '.carousel-wrapper'
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

    function extractPageJumpParams(onclick) {
        // onclick looks like: page_jump('https://...',2,30)
        if (!onclick) return null;
        var match = onclick.match(/page_jump\('([^']+)'\s*,\s*(\d+)\s*,\s*(\d+)\)/);
        if (match) {
            return {
                baseUrl: match[1],
                totalPages: parseInt(match[2], 10),
                entriesPerPage: parseInt(match[3], 10)
            };
        }
        return null;
    }

    // =========================================================================
    // CONTAINER HELPERS
    // =========================================================================
    function getWrapper() {
        return document.getElementById(CONFIG.WRAPPER_ID);
    }

    function getOrCreateContainer(id, tagName, className, insertAfter) {
        const wrapper = getWrapper();
        if (!wrapper) return null;

        let container = document.getElementById(id);
        if (container) return container;

        container = document.createElement(tagName || 'div');
        container.id = id;
        container.className = className || id;

        if (insertAfter) {
            const referenceNode = wrapper.querySelector(insertAfter);
            if (referenceNode) {
                referenceNode.insertAdjacentElement('afterend', container);
            } else {
                wrapper.appendChild(container);
            }
        } else {
            wrapper.appendChild(container);
        }
        return container;
    }

    // =========================================================================
    // BREADCRUMB
    // =========================================================================
    function extractBreadcrumbItems(legacyNav) {
        const items = [];
        const listItems = legacyNav.querySelectorAll('li');

        for (var i = 0; i < listItems.length; i++) {
            var li = listItems[i];
            var link = li.querySelector('a');
            if (link) {
                items.push({
                    text: link.textContent.trim(),
                    url: link.getAttribute('href'),
                    isCurrent: false
                });
            } else {
                var text = li.textContent.trim().replace(/^\u200B/, '');
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

    function buildBreadcrumbHtml(items) {
        if (items.length === 0) return '';

        var html = '<ol class="modern-breadcrumb-list">';

        items.forEach(function (item, index) {
            var isLast = index === items.length - 1;
            html += '<li class="modern-breadcrumb-item' + (isLast ? ' modern-breadcrumb-item--current' : '') + '">';

            if (item.url && !isLast) {
                html += '<a href="' + escapeHtml(item.url) + '" class="modern-breadcrumb-link">' + escapeHtml(item.text) + '</a>';
            } else {
                html += '<span class="modern-breadcrumb-text" aria-current="page">' + escapeHtml(item.text) + '</span>';
            }

            if (!isLast) {
                html += '<i class="fa-regular fa-angle-right modern-breadcrumb-separator" aria-hidden="true"></i>';
            }

            html += '</li>';
        });

        html += '</ol>';
        return html;
    }

    function convertBreadcrumb() {
        var legacyNav = document.querySelector(CONFIG.LEGACY_NAV_SELECTOR);
        if (!legacyNav) return;

        var container = getOrCreateContainer(CONFIG.MODERN_BREADCRUMB_ID, 'nav', 'modern-breadcrumbs', CONFIG.INSERT_AFTER_SELECTOR);
        if (!container) return;

        var items = extractBreadcrumbItems(legacyNav);
        container.innerHTML = buildBreadcrumbHtml(items);

        console.log('[BreadcrumbsModule] Breadcrumb modernised');
    }

    // =========================================================================
    // PAGINATION & ACTION BAR
    // =========================================================================
    function extractPaginationData(legacyBar) {
        // Extract page links
        var pageItems = [];
        var pagesList = legacyBar.querySelector('.left.Sub ul.pages');
        if (pagesList) {
            var lis = pagesList.querySelectorAll('li');
            for (var i = 0; i < lis.length; i++) {
                var li = lis[i];
                var link = li.querySelector('a');
                var isCurrent = li.classList.contains('current');
                if (link) {
                    var onclick = link.getAttribute('onclick') || '';
                    var jumpParams = extractPageJumpParams(onclick);
                    if (jumpParams) {
                        pageItems.push({
                            type: 'jump',
                            totalPages: jumpParams.totalPages,
                            entriesPerPage: jumpParams.entriesPerPage,
                            baseUrl: jumpParams.baseUrl,
                            text: link.textContent.trim()
                        });
                    } else {
                        pageItems.push({
                            type: 'page',
                            url: link.getAttribute('href'),
                            text: link.textContent.trim(),
                            isCurrent: isCurrent
                        });
                    }
                } else {
                    pageItems.push({
                        type: 'current',
                        text: li.textContent.trim(),
                        isCurrent: true
                    });
                }
            }
        }

        // Extract action button (e.g., "New Topic")
        var actionBtn = legacyBar.querySelector('.right.Sub .buttons a');
        var actionHtml = '';
        if (actionBtn) {
            var actionSpan = actionBtn.querySelector('span');
            var actionIcon = actionSpan ? actionSpan.querySelector('i') : null;
            var iconClass = actionIcon ? actionIcon.className : '';
            var actionText = actionSpan ? actionSpan.textContent.trim() : actionBtn.textContent.trim();
            var actionHref = actionBtn.getAttribute('href');
            actionHtml = '<a href="' + escapeHtml(actionHref) + '" class="modern-btn modern-btn-primary modern-pagination-action">';
            if (iconClass) {
                actionHtml += '<i class="' + escapeHtml(iconClass) + '" aria-hidden="true"></i> ';
            }
            actionHtml += escapeHtml(actionText) + '</a>';
        }

        return {
            pageItems: pageItems,
            actionHtml: actionHtml
        };
    }

    function buildPaginationHtml(data) {
        var html = '<div class="modern-pagination-bar">';

        // Page numbers / jump
        if (data.pageItems.length > 0) {
            html += '<nav class="modern-pagination-pages" aria-label="pagination">';
            html += '<ol class="modern-page-list">';

            data.pageItems.forEach(function (item) {
                if (item.type === 'jump') {
                    // Replace with a small "Page X of Y" input
                    html += '<li class="modern-page-item modern-page-jump">';
                    html += '<form class="modern-jump-form" onsubmit="return false;">';
                    html += '<input type="number" class="modern-jump-input" min="1" max="' + item.totalPages + '" value="" placeholder="Pg" aria-label="Jump to page">';
                    html += '<button type="submit" class="modern-jump-btn modern-btn modern-btn-secondary">Go</button>';
                    html += '</form>';
                    html += '</li>';
                } else if (item.type === 'current') {
                    html += '<li class="modern-page-item modern-page-current"><span aria-current="page">' + escapeHtml(item.text) + '</span></li>';
                } else {
                    var currentClass = item.isCurrent ? ' modern-page-current' : '';
                    html += '<li class="modern-page-item' + currentClass + '">';
                    if (item.isCurrent) {
                        html += '<span aria-current="page">' + escapeHtml(item.text) + '</span>';
                    } else {
                        html += '<a href="' + escapeHtml(item.url) + '" class="modern-page-link">' + escapeHtml(item.text) + '</a>';
                    }
                    html += '</li>';
                }
            });

            html += '</ol>';
            html += '</nav>';
        }

        // Action button (e.g., "New Topic")
        if (data.actionHtml) {
            html += '<div class="modern-pagination-action-wrap">' + data.actionHtml + '</div>';
        }

        html += '</div>';
        return html;
    }

    function convertPagination() {
        var legacyBar = document.querySelector(CONFIG.LEGACY_PAGINATION_SELECTOR);
        if (!legacyBar) return;

        var container = getOrCreateContainer(CONFIG.MODERN_PAGINATION_ID, 'div', 'modern-pagination', null);
        if (!container) return;

        var data = extractPaginationData(legacyBar);
        container.innerHTML = buildPaginationHtml(data);

        // Attach jump form behaviour
        var jumpForm = container.querySelector('.modern-jump-form');
        if (jumpForm) {
            var jumpInput = jumpForm.querySelector('.modern-jump-input');
            var jumpBtn = jumpForm.querySelector('.modern-jump-btn');
            // Get jump params from the first page item with type 'jump'
            var jumpParams = null;
            data.pageItems.forEach(function (item) {
                if (item.type === 'jump') jumpParams = item;
            });
            if (jumpParams) {
                jumpBtn.addEventListener('click', function () {
                    var page = parseInt(jumpInput.value, 10);
                    if (isNaN(page) || page < 1) page = 1;
                    if (page > jumpParams.totalPages) page = jumpParams.totalPages;
                    // Calculate start index
                    var start = (page - 1) * jumpParams.entriesPerPage;
                    // Build URL
                    var url = jumpParams.baseUrl + '&st=' + start;
                    window.location.href = url;
                });
            }
        }

        console.log('[BreadcrumbsModule] Pagination modernised');
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
                callback: function () { convertBreadcrumb(); }
            });
        } catch (e) {
            console.error('[BreadcrumbsModule] Breadcrumb observer registration failed:', e);
        }

        try {
            globalThis.forumObserver.register({
                id: 'pagination-module',
                selector: CONFIG.LEGACY_PAGINATION_SELECTOR,
                priority: 'high',
                callback: function () { convertPagination(); }
            });
        } catch (e) {
            console.error('[BreadcrumbsModule] Pagination observer registration failed:', e);
        }

        console.log('[BreadcrumbsModule] Registered with ForumCoreObserver');
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    function initialize() {
        if (document.querySelector(CONFIG.LEGACY_NAV_SELECTOR)) {
            convertBreadcrumb();
        }
        if (document.querySelector(CONFIG.LEGACY_PAGINATION_SELECTOR)) {
            convertPagination();
        }
        registerObserver();
        console.log('[BreadcrumbsModule] Initialised');
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================
    return {
        initialize: initialize,
        refresh: function () {
            convertBreadcrumb();
            convertPagination();
        }
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
