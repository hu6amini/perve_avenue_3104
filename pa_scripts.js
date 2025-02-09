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
