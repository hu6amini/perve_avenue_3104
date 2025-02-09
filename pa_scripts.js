//Menuwrap Icons
function waitForElement(e,t){const n=new MutationObserver((i=>{for(const o of i)if("childList"===o.type&&document.querySelector(e)){n.disconnect(),t(document.querySelector(e));break}})),i=document.querySelector(".menuwrap");i&&n.observe(i,{childList:!0,subtree:!0})}function addIdsToMenuItems(e){const t=e.querySelector(".left");t&&(t.style.visibility="visible"),e.querySelectorAll(".left li.menu").forEach((e=>{const t=e.querySelector("a");if(t){const n=t.getAttribute("href"),i=(t.innerHTML.trim(),t.querySelector("span")?.innerHTML.trim());e.querySelector(".nick")?e.id="nick":"https://msg.forumcommunity.net/?act=Msg&CODE=01&c=655775"===n?e.id="messenger":"https://msg.forumcommunity.net/?act=UserCP&CODE=26&c=655775"===n?e.id="topics":"#notifications"===n?e.id="notif":e.querySelector('form[action="/?act=Mod"]')||["&nbsp;Moderation","&nbsp;Moderazione","&nbsp;Moderación","&nbsp;Modération","&nbsp;Mäßigung","&nbsp;Moderação"].includes(i)?e.id="mod":(["&nbsp;Administration","&nbsp;Amministrazione","&nbsp;Administración","&nbsp;Verwaltung","&nbsp;Administração"].includes(i)||"https://www.forumcommunity.net/?cid=655775"===n)&&(e.id="admin"),"&nbsp;Messenger"===i&&(e.id="messenger")}})),e.querySelectorAll(".left li:not(.menu)").forEach((e=>{const t=e.querySelector("a");t&&("HOME"===t.textContent.trim()?e.id="pahome":"/latestupdates"===t.getAttribute("href")&&(e.id="updates"))}))}waitForElement(".menuwrap",addIdsToMenuItems);


//Emojione
 // Function to process emojis in elements with the `.color` class 
 function processEmojisInColorClass() { 
 // Select all elements with the `.color` class 
 const colorElements = document.querySelectorAll('.color,.tiptap.ProseMirror'); 
 
 // Loop through each element and convert emojis 
 colorElements.forEach(element => { 
 element.innerHTML = emojione.toImage(element.innerHTML); 
 }); 
 } 
 
 // Call the function to process emojis in `.color` elements 
 processEmojisInColorClass(); 

//Light gallery
const postColors = document.querySelectorAll(".post .color"); 
 
postColors.forEach(t => { 
 // Modify the <a> elements and their child <img> elements, applying exclusions 
 t.querySelectorAll('img:not(.emojione):not(.signature img):not([src^="https://img.forumfree.net/html/emoticons/new"]):not([src^="https://img.forumfree.net/html/mime_types"])') 
 .forEach(t => { 
 // Exclude images based on specific conditions (alt text, src, etc.) 
 if (!(t.alt && t.alt.startsWith(":") || 
 "a" === t.parentNode.tagName.toLowerCase() && t.src.startsWith("https://www.google.com/s2/favicons"))) { 
 const e = t.parentNode; 
 
 // Handle images inside <a> tags 
 if ("a" === e.tagName.toLowerCase()) { 
 if (t.classList.contains("lazyload") && t.hasAttribute("data-src")) { 
 e.setAttribute("data-lightbox", "gallery"); 
 } else { 
 if (e.href !== t.src) e.setAttribute("href", t.src); 
 e.setAttribute("data-lightbox", "gallery"); 
 } 
 } else { 
 // Wrap images in <a> tags 
 const o = document.createElement("a"); 
 o.href = t.src || t.getAttribute("data-src"); 
 o.setAttribute("data-lightbox", "gallery"); 
 e.insertBefore(o, t); 
 o.appendChild(t); 
 } 
 } 
 }); 
 
 // Initialize LightGallery after modifying the <a> tags with data-lightbox="gallery" 
 lightGallery(t, { selector: 'a[data-lightbox="gallery"]' }); 
}); 
