function waitForElementToAppear(selector, callback) {
    const intervalId = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(intervalId);
            callback(element);
        }
    }, 100);
}

waitForElementToAppear(".color a, span.tmsg a", (links) => {
    function updateFaviconsForLinks(links) {
        links.forEach((link) => {
            if (
                !(
                    link.closest(".spoiler .code_top a") ||
                    link.closest(".fancyborder a") ||
                    link.closest(".quote_top a") ||
                    link.querySelector("img")
                )
            ) {
                const img = document.createElement("img");
                if (link.href.includes("youtu.be")) {
                    img.src = "https://www.google.com/s2/favicons?domain=youtube.com";
                } else {
                    img.src = "https://www.google.com/s2/favicons?domain=" + link.href;
                }
                img.alt = "fav";
                if (link.matches(".quote a, .tmsg a")) {
                    img.width = 14;
                    img.height = 14;
                } else {
                    img.width = 16;
                    img.height = 16;
                }
                link.prepend(img);
            }
        });
    }

    const favObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    updateFaviconsForLinks(node.querySelectorAll(".color a, span.tmsg a"));
                }
            });
        });
    });

    favObserver.observe(document.body, { childList: true, subtree: true });

    updateFaviconsForLinks(links);
});
