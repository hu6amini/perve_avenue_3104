//Reply Counter
document.addEventListener("DOMContentLoaded",(function(){!function processPostElements(){const e=document.querySelectorAll(".post"),t=function getPageNumber(){const e=new URLSearchParams(window.location.search);return parseInt(e.get("st")||0)+1}();e.forEach(((e,n)=>{!function createReplyCounter(e,t,n){const o=document.createElement("b");o.className="reply_counter",o.textContent="#"+t;const r=e.querySelector(".mini_buttons.rt.Sub");r&&("after"===n?r.appendChild(o):r.insertBefore(o,r.firstChild))}(e,t+n,"after")}))}()}));
//Favicons
document.addEventListener("DOMContentLoaded",(function(){function updateFaviconsForLinks(e){e.forEach((e=>{if(!(e.closest(".spoiler .code_top a")||e.closest(".fancyborder a")||e.closest(".quote_top a")||e.querySelector("img"))){let o=document.createElement("img");e.href.includes("youtu.be")?o.src="https://www.google.com/s2/favicons?domain=youtube.com":o.src="https://www.google.com/s2/favicons?domain="+e.href,o.alt="fav",e.matches(".quote a,.tmsg a")?(o.width=14,o.height=14):(o.width=16,o.height=16),e.prepend(o)}}))}const e=new MutationObserver((e=>{e.forEach((e=>{updateFaviconsForLinks(e.target.querySelectorAll(".color a, span.tmsg a"))}))})),o=document.querySelector("body");e.observe(o,{childList:!0,subtree:!0});updateFaviconsForLinks(document.querySelectorAll(".color a, span.tmsg a"))}));
//Quote
document.addEventListener("DOMContentLoaded",(()=>{function expandQuotes(e){const updateHeight=()=>{const t=e.querySelector(".quotebtn button");if(!t&&e.scrollHeight>170){e.style.maxHeight="170px";const t=document.createElement("div");t.className="quotebtn";const o=document.createElement("button");o.innerHTML="Show More...",t.appendChild(o),e.appendChild(t),o.addEventListener("click",(o=>{o.preventDefault(),o.stopPropagation(),e.style.transition="max-height 0.382s ease-in-out",e.style.maxHeight=e.scrollHeight+"px",t.style.display="none",setTimeout((()=>{e.style.maxHeight="none"}),382)}))}else t&&e.scrollHeight<=170&&t.parentNode.remove()};updateHeight();const t=new ResizeObserver(updateHeight);t.observe(e);const o=e.querySelector(".spoiler .code_top a");o&&o.addEventListener("click",(()=>{e.style.maxHeight="none",t.disconnect()}))}function modifyQuoteTop(e){const t=e.textContent,o=e.querySelector("a");if(t.includes("@")){const n=t.replace(/QUOTE\s*\(([^@]+)@[^)]+\)\s*/,"$1 said:");e.innerHTML=n,e.style.color="var(--mdcol)",o&&(e.appendChild(o),o.style.color="var(--mdcol)")}else{const t=e.querySelector(".quote_top b");t&&(t.style.opacity=1)}}(function initializeExpandQuotes(){document.querySelectorAll(".quote").forEach(expandQuotes),new MutationObserver((e=>{for(const t of e)t.addedNodes.length>0&&t.addedNodes.forEach((e=>{e.nodeType===Node.ELEMENT_NODE&&(e.classList.contains("quote")?expandQuotes(e):e.querySelectorAll(".quote").forEach(expandQuotes))}))})).observe(document.body,{childList:!0,subtree:!0})})(),document.querySelectorAll(".quote_top").forEach(modifyQuoteTop),function observeMutations(){new MutationObserver((e=>{for(const t of e)"childList"===t.type&&t.addedNodes.forEach((e=>{e.nodeType===Node.ELEMENT_NODE&&e.querySelectorAll(".quote_top").forEach(modifyQuoteTop)}))})).observe(document.body,{childList:!0,subtree:!0})}()}));
//Textarea Autogrow
document.addEventListener("DOMContentLoaded",(function(){!function resizeTextarea(){const e=document.querySelector("textarea#Post");function updateTextareaHeight(){e.style.height="0",e.style.height=e.scrollHeight+"px",e.style.maxHeight="655px"}e&&(updateTextareaHeight(),e.addEventListener("input",updateTextareaHeight),window.addEventListener("load",updateTextareaHeight),e.addEventListener("paste",(function(){setTimeout(updateTextareaHeight,0)})))}()}));
//Goto
document.addEventListener("DOMContentLoaded",(function(){let e;function scrollToSmooth(e){window.scrollTo({top:e,behavior:"smooth",duration:600})}function showGotoElement(e){e.classList.add("active"),e.style.zIndex="9999"}function hideGotoElement(e){e.classList.remove("active")}!function initSmoothScrolling(){document.querySelector(".p_up").addEventListener("click",(()=>{scrollToSmooth(0)})),document.querySelector(".p_down").addEventListener("click",(()=>{scrollToSmooth(document.body.scrollHeight)}));const o=document.querySelector(".goto");window.addEventListener("scroll",(()=>{clearTimeout(e),showGotoElement(o),e=setTimeout((()=>{hideGotoElement(o)}),3e3)})),o.addEventListener("mouseenter",(()=>{clearTimeout(e),showGotoElement(o)})),o.addEventListener("mouseleave",(()=>{e=setTimeout((()=>{hideGotoElement(o)}),3e3)}))}()}));
//Preview
document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".send").forEach((function(e){var n=e.querySelectorAll("ul li.Item");if(n.length>=2){var t=document.getElementById("loading");t&&n[1].appendChild(t)}}))}));
//Emojione 
function applyEmojiTransformation(element) { 
 if (!element.classList.contains("[class*=e1a-]")) { 
 element.innerHTML = emojione.toImage(emojione.shortnameToUnicode(emojione.toShort(element.innerHTML))); 
 } 
} 
 
function observeElements(selector) { 
 document.querySelectorAll(selector).forEach(applyEmojiTransformation); 
 
 var emojiObserver = new MutationObserver(function(mutations) { 
 mutations.forEach(function(mutation) { 
 if (mutation.type === 'childList') { 
 mutation.addedNodes.forEach(function(node) { 
 if (node.nodeType === Node.ELEMENT_NODE) { 
 if (node.matches(selector) || node.querySelector(selector)) { 
 applyEmojiTransformation(node.matches(selector) ? node : node.querySelector(selector)); 
 } 
 } 
 }); 
 } 
 }); 
 }); 
 
 emojiObserver.observe(document.body, { childList: true, subtree: true }); 
} 
 
observeElements('.color,.tmsg,.profile-interests,.web a,.mtitle'); 
 
//Timestamps 
// Function to format dates relative to the current date 
 function formatDate(dateString) { 
 var now = new Date(); 
 var postDate = new Date(dateString); 
 if (isNaN(postDate.getTime())) { 
 // Handle invalid date parsing 
 return dateString; // Or some fallback message 
 } 
 
 var diff = now - postDate; 
 var days = Math.floor(diff / (1000 * 60 * 60 * 24)); 
 var years = now.getFullYear() - postDate.getFullYear(); 
 
 // Format time 
 var timeOptions = { hour: '2-digit', minute: '2-digit' }; 
 var timeString = postDate.toLocaleTimeString([], timeOptions); 
 
 // Format date with day name 
 var dayOptions = { weekday: 'long' }; 
 var dayName = postDate.toLocaleDateString([], dayOptions); 
 
 if (years > 1) { 
 // More than a year old 
 var dateOptions = { year: 'numeric', month: 'short', day: 'numeric' }; 
 var dateString = postDate.toLocaleDateString([], dateOptions); 
 return dateString; 
 } else if (days === 0) { 
 return 'Today at ' + timeString; 
 } else if (days === 1) { 
 return 'Yesterday at ' + timeString; 
 } else if (days < 7) { 
 return dayName + ' at ' + timeString; 
 } else { 
 var dateOptions = { year: 'numeric', month: 'short', day: 'numeric' }; 
 var dateString = postDate.toLocaleDateString([], dateOptions); 
 return dateString + ' at ' + timeString; 
 } 
 } 
 
 // Update the .post .when elements with formatted dates 
 function updatePostDates() { 
 document.querySelectorAll('.post .when, .summary .when').forEach(function(element) { 
 var originalText = element.textContent.trim(); 
 // Remove "Posted on " prefix and format the remaining date 
 var dateString = originalText.replace('Posted on ', '').trim(); 
 
 // Check if dateString is valid before formatting 
 if (dateString) { 
 var formattedDate = formatDate(dateString); 
 element.innerHTML = '<span>' + formattedDate + '</span>'; 
 } else { 
 // If no valid date, display original text 
 element.innerHTML = '<span>' + originalText + '</span>'; 
 } 
 }); 
 } 
 
 // Set up a MutationObserver to handle dynamically added .post .when elements 
 const timestamp = new MutationObserver(mutations => { 
 mutations.forEach(mutation => { 
 if (mutation.type === 'childList') { 
 mutation.addedNodes.forEach(node => { 
 if (node.nodeType === Node.ELEMENT_NODE) { 
 // Check if new node contains .post .when elements 
 node.querySelectorAll('.post .when, .summary .when').forEach(element => { 
 updatePostDates(); 
 }); 
 } 
 }); 
 } 
 }); 
 }); 
 
 // Start observing the document body for changes 
 timestamp.observe(document.body, { childList: true, subtree: true }); 
 
 // Initial call to update existing .post .when elements 
 updatePostDates(); 
