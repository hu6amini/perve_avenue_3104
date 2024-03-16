// Combined Script

// Function to update favicons for links
function updateFaviconsForLinks(e) {
    e.forEach((link) => {
        if (!(link.closest(".spoiler .code_top a") || link.closest(".fancyborder a") || link.closest(".quote_top a") || link.querySelector("img"))) {
            let img = document.createElement("img");
            img.alt = "fav";
            img.width = 16;
            img.height = 16;
            if (link.href.includes("youtu.be")) {
                img.src = "https://www.google.com/s2/favicons?domain=youtube.com";
            } else {
                img.src = "https://www.google.com/s2/favicons?domain=" + link.href;
            }
            link.prepend(img);
        }
    });
}

// Function to handle mutations and update favicons
function handleMutations(mutationsList, observer) {
    mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches(".color a, span.tmsg a")) {
                        updateFaviconsForLinks([node]);
                    } else {
                        updateFaviconsForLinks(node.querySelectorAll(".color a, span.tmsg a"));
                    }
                }
            });
        }
    });
}

// Observer for mutations to update favicons
const favObserver = new MutationObserver(handleMutations);
const body = document.querySelector("body");
favObserver.observe(body, { childList: true, subtree: true });

// Function to resize textarea automatically
function resizeTextarea(textarea) {
    function updateTextareaHeight() {
        textarea.style.height = "0";
        textarea.style.height = textarea.scrollHeight + "px";
        textarea.style.maxHeight = "655px";
    }

    updateTextareaHeight();
    textarea.addEventListener("input", updateTextareaHeight);
    window.addEventListener("load", updateTextareaHeight);
    textarea.addEventListener("paste", () => setTimeout(updateTextareaHeight, 0));
}

// Wait for the textarea to appear and then resize it
waitForElementToAppear("textarea#Post", (textarea) => resizeTextarea(textarea));
