function updateFaviconsForLinks(elements) {
    elements.forEach(element => {
        if (!(element.closest(".spoiler .code_top a") || element.closest(".fancyborder a") || element.closest(".quote_top a") || element.querySelector("img"))) {
            let img = document.createElement("img");
            if (element.href.includes("youtu.be")) {
                img.src = "https://www.google.com/s2/favicons?domain=youtube.com";
            } else {
                img.src = "https://www.google.com/s2/favicons?domain=" + element.href;
            }
            img.alt = "fav";
            if (element.matches(".quote a, .tmsg a")) {
                img.width = 14;
                img.height = 14;
            } else {
                img.width = 16;
                img.height = 16;
            }
            element.prepend(img);
        }
    });
}

function waitForElementToAppear(selector, callback) {
    const fav = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                callback();
            }
        });
    });

    const body = document.querySelector("body");
    fav.observe(body, { childList: true, subtree: true });

    const initialElements = document.querySelectorAll(selector);
    if (initialElements.length) {
        callback();
    }
}

waitForElementToAppear(".color a, span.tmsg a", function() {
    updateFaviconsForLinks(document.querySelectorAll(".color a, span.tmsg a"));
});
