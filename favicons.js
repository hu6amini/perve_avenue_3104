(function waitForElements() {
    const colorLinks = document.querySelectorAll(".color a");
    const tmsgLinks = document.querySelectorAll("span.tmsg a");
    if (colorLinks.length > 0 || tmsgLinks.length > 0) {
        updateFaviconsForLinks(colorLinks);
        updateFaviconsForLinks(tmsgLinks);
    } else {
        setTimeout(waitForElements, 100); 
    }
})();

function updateFaviconsForLinks(links) {
    links.forEach((link) => {
        if (!(link.closest(".spoiler .code_top a") || link.closest(".fancyborder a") || link.closest(".quote_top a") || link.querySelector("img"))) {
            let img = document.createElement("img");
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

const favicon = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        updateFaviconsForLinks(mutation.target.querySelectorAll(".color a, span.tmsg a"));
    });
});

const body = document.querySelector("body");
favicon.observe(body, { childList: true, subtree: true });

updateFaviconsForLinks(document.querySelectorAll(".color a, span.tmsg a"));
