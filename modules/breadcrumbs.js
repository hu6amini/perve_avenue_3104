/* =============================================
   Breadcrumbs, Pagination & Topic Header Module
   Emerald Theme
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

        LEGACY_TITLE_TABLE_SELECTOR: 'table.mback',
        LEGACY_STATS_BAR_SELECTOR: '.title.bottom.Item.Justify',
        MODERN_TOPIC_HEADER_ID: 'modern-topic-header',

        WRAPPER_ID: 'modern-forum-wrapper',
        INSERT_AFTER_SELECTOR: '.carousel-wrapper',
        BOARD_LIST_ID: 'modern-board-list',
        TOPIC_LIST_ID: 'modern-topic-list',
        POSTS_CONTAINER_ID: 'posts-container'
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

    // =========================================================================
    // CONTAINER HELPERS
    // =========================================================================
    function getWrapper() {
        return document.getElementById(CONFIG.WRAPPER_ID);
    }

    function getOrCreateContainer(id, tagName, className, insertAfterSelector) {
        const wrapper = getWrapper();
        if (!wrapper) return null;

        let container = document.getElementById(id);
        if (container) return container;

        container = document.createElement(tagName || 'div');
        container.id = id;
        container.className = className || id;

        const referenceNode = wrapper.querySelector(insertAfterSelector);
        if (referenceNode) {
            referenceNode.insertAdjacentElement('afterend', container);
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

        var actionButtons = legacyBar.querySelectorAll('.right.Sub .buttons a');
        var actionsHtml = '';
        for (var j = 0; j < actionButtons.length; j++) {
            var actionBtn = actionButtons[j];
            var actionSpan = actionBtn.querySelector('span');
            var actionIcon = actionSpan ? actionSpan.querySelector('i') : null;
            var iconClass = actionIcon ? actionIcon.className : '';
            var actionText = actionSpan ? actionSpan.textContent.trim() : actionBtn.textContent.trim();
            var actionHref = actionBtn.getAttribute('href');
            actionsHtml += '<a href="' + escapeHtml(actionHref) + '" class="modern-btn modern-btn-primary modern-pagination-action">';
            if (iconClass) {
                actionsHtml += '<i class="' + escapeHtml(iconClass) + '" aria-hidden="true"></i> ';
            }
            actionsHtml += escapeHtml(actionText) + '</a>';
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
    // TOPIC HEADER
    // =========================================================================
    function extractTopicHeaderData() {
        var titleEl = document.querySelector(CONFIG.LEGACY_TITLE_TABLE_SELECTOR + ' h2.mtitle');
        var titleText = titleEl ? titleEl.textContent.trim() : '';

        var statsBar = document.querySelector(CONFIG.LEGACY_STATS_BAR_SELECTOR);
        var viewsCount = '';
        var repliesCount = '';

        if (statsBar) {
            var text = statsBar.textContent || '';
            var repliesMatch = text.match(/(\d[\d,]*)\s*replies/i);
            var viewsMatch = text.match(/(\d[\d,]*)\s*views/i);
            repliesCount = repliesMatch ? repliesMatch[1] : '';
            viewsCount = viewsMatch ? viewsMatch[1] : '';
        }

        return {
            title: titleText,
            views: viewsCount,
            replies: repliesCount
        };
    }

    function buildTopicHeaderHtml(data) {
        if (!data.title) return '';

        var html = '<div class="topic-header">';
        html += '<div class="topic-title-content">';
        html += '<h1 class="topic-title">' + escapeHtml(data.title) + '</h1>';
        html += '<div class="topic-meta">';
        if (data.replies) {
            html += '<span class="topic-stats"><i class="fa-regular fa-comment" aria-hidden="true"></i><span>Replies: ' + escapeHtml(data.replies) + '</span></span>';
        }
        if (data.views) {
            html += '<span class="topic-stats"><i class="fa-regular fa-eye" aria-hidden="true"></i><span>Views: ' + escapeHtml(data.views) + '</span></span>';
        }
        html += '</div>';
        html += '</div>';

        html += '<div class="topic-actions">';
        html += '<button class="btn btn-icon" id="modern-topic-share-btn" title="Share Topic"><i class="fa-regular fa-share-nodes" aria-hidden="true"></i></button>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function convertTopicHeader() {
        var data = extractTopicHeaderData();
        if (!data.title) return;

        var insertAfter = '#' + CONFIG.MODERN_BREADCRUMB_ID;
        if (!document.getElementById(CONFIG.MODERN_BREADCRUMB_ID)) {
            insertAfter = CONFIG.INSERT_AFTER_SELECTOR;
        }

        var container = getOrCreateContainer(CONFIG.MODERN_TOPIC_HEADER_ID, 'div', 'modern-topic-header', insertAfter);
        if (!container) return;

        container.innerHTML = buildTopicHeaderHtml(data);

        var shareBtn = document.getElementById('modern-topic-share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function () {
                var legacyShareLink = document.querySelector(CONFIG.LEGACY_STATS_BAR_SELECTOR + ' .a2a_dd');
                if (legacyShareLink) {
                    legacyShareLink.click();
                } else {
                    navigator.clipboard.writeText(window.location.href).then(function () {
                        alert('Link copied to clipboard!');
                    });
                }
            });
        }

        console.log('[BreadcrumbsModule] Topic header modernised');
    }

    // =========================================================================
    // OBSERVER INTEGRATION
    // =========================================================================
    function registerObserver() {
        if (!globalThis.forumObserver) return;

        var observers = [
            { id: 'breadcrumbs-module', selector: CONFIG.LEGACY_NAV_SELECTOR, callback: convertBreadcrumb },
            { id: 'pagination-module-top', selector: CONFIG.LEGACY_PAGINATION_SELECTOR_TOP, callback: convertAllPagination },
            { id: 'pagination-module-bottom', selector: CONFIG.LEGACY_PAGINATION_SELECTOR_BOTTOM, callback: convertAllPagination },
            { id: 'topic-header-module', selector: CONFIG.LEGACY_TITLE_TABLE_SELECTOR, callback: convertTopicHeader }
        ];

        observers.forEach(function (obs) {
            try {
                globalThis.forumObserver.register({
                    id: obs.id,
                    selector: obs.selector,
                    priority: 'high',
                    callback: obs.callback
                });
            } catch (e) {
                console.error('[BreadcrumbsModule] Observer registration failed for ' + obs.id, e);
            }
        });

        console.log('[BreadcrumbsModule] Registered with ForumCoreObserver');
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    function initialize() {
        if (document.querySelector(CONFIG.LEGACY_NAV_SELECTOR)) convertBreadcrumb();
        if (document.querySelector(CONFIG.LEGACY_PAGINATION_SELECTOR_TOP) ||
            document.querySelector(CONFIG.LEGACY_PAGINATION_SELECTOR_BOTTOM)) convertAllPagination();
        if (document.querySelector(CONFIG.LEGACY_TITLE_TABLE_SELECTOR + ' h2.mtitle')) convertTopicHeader();

        registerObserver();
        console.log('[BreadcrumbsModule] Initialised');
    }

    return {
        initialize: initialize,
        refresh: function () {
            convertBreadcrumb();
            convertAllPagination();
            convertTopicHeader();
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
