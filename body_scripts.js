//Menuwrap Icons
function waitForElement(e,t){const o=new MutationObserver((r=>{for(const i of r)if("childList"===i.type&&document.querySelector(e)){o.disconnect(),t(document.querySelector(e));break}}));o.observe(document.body,{childList:!0,subtree:!0})}function addIdsToMenuItems(e){const t=e.querySelector(".left");t&&(t.style.visibility="visible");e.querySelectorAll(".left li.menu").forEach((e=>{e.querySelector(".nick")?e.id="nick":e.querySelector('a[href="https://msg.forumcommunity.net/?act=Msg&CODE=01&c=655775"]')?e.id="messenger":e.querySelector('a[href="https://msg.forumcommunity.net/?act=UserCP&CODE=26&c=655775"]')?e.id="topics":e.querySelector('a[href="#notifications"]')?e.id="notif":e.querySelector('form[action="/?act=Mod"]')&&(e.id="mod");const t=e.querySelector("a span");t&&"&nbsp;Moderation"===t.innerHTML.trim()&&(e.id="mod");const o=e.querySelector("a span");o&&"&nbsp;Administration"===o.innerHTML.trim()&&(e.id="admin");e.querySelector('a[href="https://www.forumcommunity.net/?cid=655775"]')&&(e.id="admin")}));e.querySelectorAll(".left li:not(.menu)").forEach((e=>{const t=e.querySelector("a");t&&"HOME"===t.textContent.trim()&&(e.id="pahome"),t&&"/latestupdates"===t.getAttribute("href")&&(e.id="updates")}))}waitForElement(".menuwrap",addIdsToMenuItems);
//Emojione
function applyEmojiTransformation(e){e.classList.contains("[class*=e1a-]")||(e.innerHTML=emojione.toImage(emojione.shortnameToUnicode(emojione.toShort(e.innerHTML))))}function observeElements(e){document.querySelectorAll(e).forEach(applyEmojiTransformation),new MutationObserver((function(o){o.forEach((function(o){"childList"===o.type&&o.addedNodes.forEach((function(o){o.nodeType===Node.ELEMENT_NODE&&(o.matches(e)||o.querySelector(e))&&applyEmojiTransformation(o.matches(e)?o:o.querySelector(e))}))}))})).observe(document.body,{childList:!0,subtree:!0})}observeElements(".color,.tmsg,.profile-interests,.web a,.mtitle,.notification-text");

// Configuration options for Quill 
const options = { 
    debug: 'info', 
    modules: { 
        toolbar: [ 
            ['bold', 'italic', 'underline'], // Text formatting 
            ['strike', 'blockquote'], // Strikethrough and blockquote 
            [{ 'header': [1, 2, false] }], // Header options 
            [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists 
            [{ 'color': [] }, { 'background': [] }], // Text color and background color 
            [{ 'align': [] }], // Text alignment 
            ['link', 'image'], // Link and image options 
            ['clean'] // Remove formatting button 
        ] 
    }, 
    placeholder: 'Compose an epic...', // Set the placeholder text 
    theme: 'snow' // Use the 'snow' theme 
}; 

// Initialize Quill editor 
const quill = new Quill('#editor', options); 

// Emoticon replacement function
function replaceEmoticons(text) {
    const emoticonMap = {
        ':)': '🙂',
        ':(': '☹️',
        ';)': '😉',
        ':-P': '😛',
        ':-p': '😛',
        ':P': '😛',
        ';P': '😜',
        ':-D': '😀',
        ':D': '😀',
        // Add more emoticons as needed
    };

    // Use a regular expression to replace emoticons
    return text.replace(/(:\)|:\(|;\)|:-P|:-p|:P|;P|:-D|:D)/g, match => emoticonMap[match]);
}

// Sync Quill with the textarea 
quill.on('text-change', function() { 
    // Get the current selection range
    const range = quill.getSelection();
    
    // Get the current text content 
    let content = quill.getText(); 

    // Replace emoticons with emojis in the text content
    const updatedContent = replaceEmoticons(content);
    
    // Check if the content has changed
    if (content !== updatedContent) {
        // Clear the editor
        quill.setText('');

        // Insert the updated content
        quill.insertText(0, updatedContent);

        // Restore the cursor position if there was a selection
        if (range) {
            quill.setSelection(range.index, range.length);
        }
    }

    // Set it to the textarea 
    document.getElementById('Post').value = updatedContent; 
}); 

// Optional: Sync the textarea to Quill on page load or other events 
document.addEventListener('DOMContentLoaded', function() { 
    const initialContent = document.getElementById('Post').value; 
    quill.root.innerHTML = initialContent; // Set initial content to Quill 
}); 
