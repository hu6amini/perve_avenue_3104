//Reply Counter
document.addEventListener("DOMContentLoaded",(function(){!function processPostElements(){const e=document.querySelectorAll(".post"),t=function getPageNumber(){const e=new URLSearchParams(window.location.search);return parseInt(e.get("st")||0)+1}();e.forEach(((e,n)=>{!function createReplyCounter(e,t,n){const o=document.createElement("b");o.className="reply_counter",o.textContent="#"+t;const r=e.querySelector(".mini_buttons.rt.Sub");r&&("after"===n?r.appendChild(o):r.insertBefore(o,r.firstChild))}(e,t+n,"after")}))}()}));
//Favicons
document.addEventListener("DOMContentLoaded",(function(){function updateFaviconsForLinks(e){e.forEach((e=>{if(!(e.closest(".spoiler .code_top a")||e.closest(".fancyborder a")||e.closest(".quote_top a")||e.querySelector("img"))){let o=document.createElement("img");e.href.includes("youtu.be")?o.src="https://www.google.com/s2/favicons?domain=youtube.com":o.src="https://www.google.com/s2/favicons?domain="+e.href,o.alt="fav",e.matches(".quote a,.tmsg a")?(o.width=14,o.height=14):(o.width=16,o.height=16),e.prepend(o)}}))}const e=new MutationObserver((e=>{e.forEach((e=>{updateFaviconsForLinks(e.target.querySelectorAll(".color a, span.tmsg a"))}))})),o=document.querySelector("body");e.observe(o,{childList:!0,subtree:!0});updateFaviconsForLinks(document.querySelectorAll(".color a, span.tmsg a"))}));
//Quote
(function waitForElementToAppear() {
    const targetElement = document.querySelector(".quote");

    if (targetElement) {
        initializeScript(targetElement);
    } else {
        setTimeout(waitForElementToAppear, 100); // Check again after 100ms
    }
})();

function initializeScript(targetElement) {
    const maxHeight = 170;

    function expandQuotes(element) {
        const updateHeight = () => {
            const quoteButton = element.querySelector(".quotebtn button");
            if (!quoteButton && element.scrollHeight > maxHeight) {
                element.style.maxHeight = maxHeight + "px";
                const quoteButtonWrapper = document.createElement("div");
                quoteButtonWrapper.className = "quotebtn";
                const showMoreButton = document.createElement("button");
                showMoreButton.innerHTML = "Show More...";
                quoteButtonWrapper.appendChild(showMoreButton);
                element.appendChild(quoteButtonWrapper);
                showMoreButton.addEventListener("click", () => {
                    element.style.transition = "max-height 0.382s ease-in-out";
                    element.style.maxHeight = element.scrollHeight + "px";
                    quoteButtonWrapper.style.display = "none"; // Hide the button wrapper
                    setTimeout(() => {
                        element.style.maxHeight = "none";
                    }, 382);
                });
            } else if (quoteButton && element.scrollHeight <= maxHeight) {
                quoteButton.parentNode.remove(); // Remove the button wrapper
            }
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(element);

        const spoilerCodeLink = element.querySelector(".spoiler .code_top a");
        if (spoilerCodeLink) {
            spoilerCodeLink.addEventListener("click", () => {
                element.style.maxHeight = "none";
                resizeObserver.disconnect();
            });
        }
    }

    function modifyQuoteTop(element) {
        const text = element.textContent;
        const link = element.querySelector("a");
        if (text.includes("@")) {
            const modifiedText = text.replace(/QUOTE\s*\(([^@]+)@[^)]+\)\s*/, "$1 said:");
            element.innerHTML = modifiedText;
            element.style.color = "var(--mdcol)";
            if (link) {
                element.appendChild(link);
                link.style.color = "var(--mdcol)";
            }
        } else {
            const boldElement = element.querySelector("b");
            if (boldElement) {
                boldElement.style.opacity = 1;
            }
        }
    }

    function handleMutations(mutations) {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.classList.contains("quote")) {
                        expandQuotes(node);
                    } else {
                        node.querySelectorAll(".quote").forEach(expandQuotes);
                    }
                }
            });
        });
    }

    const quotObserver = new MutationObserver(handleMutations);
    quotObserver.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll(".quote_top").forEach(modifyQuoteTop);
}

//Textarea Autogrow
function waitForElementToAppear(e,t){const a=document.querySelector(e);a?t(a):setTimeout((()=>waitForElementToAppear(e,t)),100)}waitForElementToAppear("textarea#Post",(e=>{!function resizeTextarea(){function updateTextareaHeight(){t.style.height="0",t.style.height=t.scrollHeight+"px",t.style.maxHeight="655px"}const t=e;t&&(updateTextareaHeight(),t.addEventListener("input",updateTextareaHeight),window.addEventListener("load",updateTextareaHeight),t.addEventListener("paste",(()=>setTimeout(updateTextareaHeight,0))))}()}));
//Goto
document.addEventListener("DOMContentLoaded",(function(){let e;function scrollToSmooth(e){window.scrollTo({top:e,behavior:"smooth",duration:600})}function showGotoElement(e){e.classList.add("active"),e.style.zIndex="9999"}function hideGotoElement(e){e.classList.remove("active")}!function initSmoothScrolling(){document.querySelector(".p_up").addEventListener("click",(()=>{scrollToSmooth(0)})),document.querySelector(".p_down").addEventListener("click",(()=>{scrollToSmooth(document.body.scrollHeight)}));const o=document.querySelector(".goto");window.addEventListener("scroll",(()=>{clearTimeout(e),showGotoElement(o),e=setTimeout((()=>{hideGotoElement(o)}),3e3)})),o.addEventListener("mouseenter",(()=>{clearTimeout(e),showGotoElement(o)})),o.addEventListener("mouseleave",(()=>{e=setTimeout((()=>{hideGotoElement(o)}),3e3)}))}()}));
//Preview
document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".send").forEach((function(e){var n=e.querySelectorAll("ul li.Item");if(n.length>=2){var t=document.getElementById("loading");t&&n[1].appendChild(t)}}))}));
