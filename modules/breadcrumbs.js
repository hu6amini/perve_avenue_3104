/* =============================================
   Breadcrumbs, Pagination & Topic Header Module – Emerald Theme
   Modernises legacy .nav, .navsub.*.Justify,
   h2.mtitle and .title.bottom.Item.Justify
   into accessible breadcrumb, pagination and topic header.
   ============================================= */
'use strict';

const BreadcrumbsModule = (function () {
    console.log('🔥 BreadcrumbsModule loaded (breadcrumbs + pagination + topic header)');

    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    const CONFIG = Object.freeze({
        LEGACY_NAV_SELECTOR: 'ul.nav',
        MODERN_BREADCRUMB_ID: 'modern-breadcrumbs',
        LEGACY_PAGINATION_SELECTOR_TOP: '.navsub.top.Justify',
        LEGACY_PAGINATION_SELECTOR_BOTTOM: '.navsub.bottom.Justify',
        MODERN_PAGINATION_ID: 'modern-pagination',
        WRAPPER_ID: 'modern-forum-wrapper',
        INSERT_AFTER_SELECTOR: '.carousel-wrapper',
        BOARD_LIST_ID: 'modern-board-list',
        TOPIC_LIST_ID: 'modern-topic-list',
        POSTS_CONTAINER_ID: 'posts-container',

        // Topic header (only on body#topic)
        LEGACY_TITLE_SELECTOR: 'div.mtitle h1, h1.mtitle, h2.mtitle',
        LEGACY_STATS_SELECTOR: '.title.bottom.Item.Justify',
        MODERN_TOPIC_HEADER_ID: 'modern-topic-header',
        MODERN_BREADCRUMB_ID: 'modern-breadcrumbs'
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

    function extractPageJumpParams(hrefOrOnclick) {
        if (!hrefOrOnclick) return null;
        var match = hrefOrOnclick.match(/page_jump\('([^']+)'\s*,\s*(\d+)\s*,\s*(\d+)\)/);
        if (match) {
            return {
                baseUrl: match[1],
                totalPages: parseInt(match[2], 10),
                entriesPerPage: parseInt(match[3], 10)
            };
        }
        return null;
    }

    function toSentenceCase(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    // =========================================================================
    // CONTAINER HELPERS
    // =========================================================================
    function getWrapper() {
        return document.getElementById(CONFIG.WRAPPER_ID);
    }

    function getOrCreateContainer(id, tagName, className, insertAfterSelector, appendToWrapper) {
        const wrapper = getWrapper();
        if (!wrapper) return null;

        let container = document.getElementById(id);
        if (container) return container;

        container = document.createElement(tagName || 'div');
        container.id = id;
        container.className = className || id;

        if (appendToWrapper) {
            wrapper.appendChild(container);
        } else if (insertAfterSelector) {
            const referenceNode = wrapper.querySelector(insertAfterSelector);
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
    // TOPIC HEADER
    // =========================================================================
    function extractTopicHeaderData() {
        var titleEl = document.querySelector(CONFIG.LEGACY_TITLE_SELECTOR);
        var topicTitle = titleEl ? titleEl.textContent.trim() : '';

        var statsEl = document.querySelector(CONFIG.LEGACY_STATS_SELECTOR);
        var replyCount = '';
        var viewCount = '';
        if (statsEl) {
            var leftSub = statsEl.querySelector('.left.Sub');
            if (leftSub) {
                var text = leftSub.textContent || '';
                var replyMatch = text.match(/(\d+)\s*repl(?:y|ies)/i);
                if (replyMatch) replyCount = replyMatch[1];
                var viewsSpan = leftSub.querySelector('.views');
                if (viewsSpan) {
                    var viewMatch = viewsSpan.textContent.match(/([\d,]+)/);
                    if (viewMatch) viewCount = viewMatch[1];
                }
            }
        }

        var shareLink = statsEl ? statsEl.querySelector('a.a2a_dd') : null;

        return {
            topicTitle: topicTitle,
            replyCount: replyCount,
            viewCount: viewCount,
            shareLink: shareLink
        };
    }

    function buildTopicHeaderHtml(data) {
        if (!data.topicTitle) return '';

        var html = '<div class="topic-header">';
        html += '<div class="topic-title-content">';
        html += '<h1 class="topic-title">' + escapeHtml(data.topicTitle) + '</h1>';

        if (data.viewCount || data.replyCount) {
            html += '<div class="topic-meta">';
            if (data.viewCount) {
                html += '<span class="topic-stats"><i class="fa-regular fa-eye" aria-hidden="true"></i><span>Views: ' + escapeHtml(data.viewCount) + '</span></span>';
            }
            if (data.replyCount) {
                html += '<span class="topic-stats"><i class="fa-regular fa-comment" aria-hidden="true"></i><span>Replies: ' + escapeHtml(data.replyCount) + '</span></span>';
            }
            html += '</div>';
        }

        html += '</div>';

        if (data.shareLink) {
            html += '<div class="topic-actions">';
            html += '<button class="btn btn-icon modern-share-topic-btn" data-action="share-topic" title="Share topic" aria-label="Share topic">';
            html += '<i class="fa-regular fa-share-nodes" aria-hidden="true"></i>';
            html += '</button>';
            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    function convertTopicHeader() {
        console.log('[BreadcrumbsModule] convertTopicHeader called, body.id:', document.body.id);

        if (document.body.id !== 'topic') {
            console.log('[BreadcrumbsModule] Skipping – not a topic page');
            return;
        }

        var data = extractTopicHeaderData();
        console.log('[BreadcrumbsModule] extractTopicHeaderData result:', JSON.stringify(data));

        if (!data.topicTitle) {
            console.log('[BreadcrumbsModule] No title on first try – retrying in 100ms');
            setTimeout(function () {
                var retryData = extractTopicHeaderData();
                console.log('[BreadcrumbsModule] Retry data:', JSON.stringify(retryData));
                if (retryData.topicTitle) {
                    renderTopicHeader(retryData);
                } else {
                    var breadcrumb = document.getElementById(CONFIG.MODERN_BREADCRUMB_ID);
                    if (breadcrumb) {
                        var currentEl = breadcrumb.querySelector('.modern-breadcrumb-item--current .modern-breadcrumb-text');
                        if (currentEl) {
                            retryData.topicTitle = currentEl.textContent.trim();
                            console.log('[BreadcrumbsModule] Using breadcrumb title:', retryData.topicTitle);
                            renderTopicHeader(retryData);
                        }
                    }
                }
            }, 100);
            return;
        }

        renderTopicHeader(data);
    }

    function renderTopicHeader(data) {
        if (!data.topicTitle) return;

        var container = getOrCreateContainer(
            CONFIG.MODERN_TOPIC_HEADER_ID,
            'div',
            'modern-topic-header',
            '#' + CONFIG.MODERN_BREADCRUMB_ID
        );
        if (!container) {
            console.log('[BreadcrumbsModule] Could not create topic header container');
            return;
        }

        container.innerHTML = buildTopicHeaderHtml(data);
        console.log('[BreadcrumbsModule] Topic header rendered');

        if (data.shareLink) {
            var shareBtn = container.querySelector('.modern-share-topic-btn');
            if (shareBtn) {
                shareBtn.addEventListener('click', function () {
                    data.shareLink.click();
                });
            }
        }
    }

    // =========================================================================
    // PAGINATION & ACTION BAR
    // =========================================================================
    function extractPaginationData(legacyBar) {
        var pageItems = [];
        var pagesList = legacyBar.querySelector('.left.Sub ul.pages');
        if (pagesList) {
            var lis = pagesList.querySelectorAll('li');
            for (var i = 0; i < lis.length; i++) {
                var li = lis[i];
                var link = li.querySelector('a');
                var isCurrent = li.classList.contains('current');
                var isFirst = li.classList.contains('first');
                var isLastPost = li.classList.contains('lastpost');
                var isBreak = li.classList.contains('break');

                if (isBreak) {
                    pageItems.push({ type: 'ellipsis' });
                    continue;
                }

                if (link) {
                    var href = link.getAttribute('href') || '';
                    var jumpParams = extractPageJumpParams(href);

                    if (jumpParams) {
                        pageItems.push({
                            type: 'jump',
                            totalPages: jumpParams.totalPages,
                            entriesPerPage: jumpParams.entriesPerPage,
                            baseUrl: jumpParams.baseUrl
                        });
                    } else if (isFirst) {
                        pageItems.push({
                            type: 'first',
                            url: href,
                            text: 'First page'
                        });
                    } else if (isLastPost) {
                        pageItems.push({
                            type: 'lastpost',
                            url: href,
                            text: 'First unread post'
                        });
                    } else {
                        pageItems.push({
                            type: 'page',
                            url: href,
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

        // Action buttons with unique classes and sentence-case text
        var actionButtons = legacyBar.querySelectorAll('.right.Sub .buttons a');
        var actionsHtml = '';
        for (var j = 0; j < actionButtons.length; j++) {
            var actionBtn = actionButtons[j];
            var actionSpan = actionBtn.querySelector('span');
            var spanClass = actionSpan ? actionSpan.className : '';
            var actionIcon = actionSpan ? actionSpan.querySelector('i') : null;
            var iconClass = actionIcon ? actionIcon.className : '';
            var actionText = actionSpan ? actionSpan.textContent.trim() : actionBtn.textContent.trim();

            // Determine a unique class based on the span class
            var extraClass = 'modern-pagination-action';
            if (spanClass.indexOf('reply') !== -1) {
                extraClass += ' modern-pagination-action--reply';
            } else if (spanClass.indexOf('newpost') !== -1) {
                extraClass += ' modern-pagination-action--new-topic';
            }

            var displayText = toSentenceCase(actionText);
            var actionHref = actionBtn.getAttribute('href');

            actionsHtml += '<a href="' + escapeHtml(actionHref) + '" class="modern-btn modern-btn-primary ' + extraClass + '">';
            if (iconClass) {
                actionsHtml += '<i class="' + escapeHtml(iconClass) + '" aria-hidden="true"></i> ';
            }
            actionsHtml += escapeHtml(displayText) + '</a>';
        }

        return {
            pageItems: pageItems,
            actionsHtml: actionsHtml
        };
    }

    function buildPaginationHtml(data) {
        var html = '<div class="modern-pagination-bar">';

        if (data.pageItems.length > 0) {
            html += '<nav class="modern-pagination-pages" aria-label="pagination">';
            html += '<ol class="modern-page-list">';

            data.pageItems.forEach(function (item) {
                if (item.type === 'ellipsis') {
                    html += '<li class="modern-page-item modern-page-ellipsis"><span>…</span></li>';
                } else if (item.type === 'jump') {
                    html += '<li class="modern-page-item modern-page-jump">';
                    html += '<form class="modern-jump-form" onsubmit="return false;">';
                    html += '<input type="number" class="modern-jump-input" min="1" max="' + item.totalPages + '" value="" placeholder="Pg" aria-label="Jump to page">';
                    html += '<button type="submit" class="modern-jump-btn modern-btn modern-btn-secondary">Go</button>';
                    html += '</form>';
                    html += '</li>';
                } else if (item.type === 'first') {
                    html += '<li class="modern-page-item modern-page-first">';
                    html += '<a href="' + escapeHtml(item.url) + '" class="modern-page-link modern-page-icon-link" title="' + escapeHtml(item.text) + '" aria-label="' + escapeHtml(item.text) + '">';
                    html += '<i class="fa-regular fa-angles-left" aria-hidden="true"></i>';
                    html += '</a>';
                    html += '</li>';
                } else if (item.type === 'lastpost') {
                    html += '<li class="modern-page-item modern-page-lastpost">';
                    html += '<a href="' + escapeHtml(item.url) + '" class="modern-page-link modern-page-icon-link" title="' + escapeHtml(item.text) + '" aria-label="' + escapeHtml(item.text) + '">';
                    html += '<i class="fa-regular fa-arrow-down-to-line" aria-hidden="true"></i>';
                    html += '</a>';
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

        if (data.actionsHtml) {
            html += '<div class="modern-pagination-action-wrap">' + data.actionsHtml + '</div>';
        }

        html += '</div>';
        return html;
    }

    function convertPagination(legacyBar) {
        if (!legacyBar) return;

        var insertAfter = null;
        var postsContainer = document.getElementById(CONFIG.POSTS_CONTAINER_ID);
        if (postsContainer) {
            insertAfter = '#' + CONFIG.POSTS_CONTAINER_ID;
        } else {
            var topicList = document.getElementById(CONFIG.TOPIC_LIST_ID);
            var boardList = document.getElementById(CONFIG.BOARD_LIST_ID);
            if (topicList) insertAfter = '#' + CONFIG.TOPIC_LIST_ID;
            else if (boardList) insertAfter = '#' + CONFIG.BOARD_LIST_ID;
            else insertAfter = CONFIG.INSERT_AFTER_SELECTOR;
        }

        var container = getOrCreateContainer(CONFIG.MODERN_PAGINATION_ID, 'div', 'modern-pagination', insertAfter);
        if (!container) return;

        var data = extractPaginationData(legacyBar);
        container.innerHTML = buildPaginationHtml(data);

        var jumpForm = container.querySelector('.modern-jump-form');
        if (jumpForm) {
            var jumpInput = jumpForm.querySelector('.modern-jump-input');
            var jumpBtn = jumpForm.querySelector('.modern-jump-btn');
            var jumpParams = null;
            data.pageItems.forEach(function (item) {
                if (item.type === 'jump') jumpParams = item;
            });
            if (jumpParams) {
                jumpBtn.addEventListener('click', function () {
                    var page = parseInt(jumpInput.value, 10);
                    if (isNaN(page) || page < 1) page = 1;
                    if (page > jumpParams.totalPages) page = jumpParams.totalPages;
                    var start = (page - 1) * jumpParams.entriesPerPage;
                    var url = jumpParams.baseUrl + '&st=' + start;
                    window.location.href = url;
                });
            }
        }

        console.log('[BreadcrumbsModule] Pagination modernised');
    }

    function convertAllPagination() {
        var topBar = document.querySelector(CONFIG.LEGACY_PAGINATION_SELECTOR_TOP);
        var bottomBar = document.querySelector(CONFIG.LEGACY_PAGINATION_SELECTOR_BOTTOM);
        var legacyBar = bottomBar || topBar;
        if (legacyBar) convertPagination(legacyBar);
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
                id: 'topic-header-module',
                selector: CONFIG.LEGACY_TITLE_SELECTOR,
                priority: 'high',
                pageTypes: ['topic'],
                callback: function () { convertTopicHeader(); }
            });
        } catch (e) {
            console.error('[BreadcrumbsModule] Topic header observer registration failed:', e);
        }

        try {
            globalThis.forumObserver.register({
                id: 'pagination-module-top',
                selector: CONFIG.LEGACY_PAGINATION_SELECTOR_TOP,
                priority: 'high',
                callback: function () { convertAllPagination(); }
            });
        } catch (e) {
            console.error('[BreadcrumbsModule] Top pagination observer registration failed:', e);
        }

        try {
            globalThis.forumObserver.register({
                id: 'pagination-module-bottom',
                selector: CONFIG.LEGACY_PAGINATION_SELECTOR_BOTTOM,
                priority: 'high',
                callback: function () { convertAllPagination(); }
            });
        } catch (e) {
            console.error('[BreadcrumbsModule] Bottom pagination observer registration failed:', e);
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

        if (document.body.id === 'topic') {
            if (document.querySelector(CONFIG.LEGACY_TITLE_SELECTOR)) {
                convertTopicHeader();
            }
        }

        if (document.querySelector(CONFIG.LEGACY_PAGINATION_SELECTOR_TOP) ||
            document.querySelector(CONFIG.LEGACY_PAGINATION_SELECTOR_BOTTOM)) {
            convertAllPagination();
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
            if (document.body.id === 'topic') convertTopicHeader();
            convertAllPagination();
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
