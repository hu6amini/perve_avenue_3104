//Menuwrap Icons
function waitForElement(e,t){const o=new MutationObserver((r=>{for(const i of r)if("childList"===i.type&&document.querySelector(e)){o.disconnect(),t(document.querySelector(e));break}}));o.observe(document.body,{childList:!0,subtree:!0})}function addIdsToMenuItems(e){const t=e.querySelector(".left");t&&(t.style.visibility="visible");e.querySelectorAll(".left li.menu").forEach((e=>{e.querySelector(".nick")?e.id="nick":e.querySelector('a[href="https://msg.forumcommunity.net/?act=Msg&CODE=01&c=655775"]')?e.id="messenger":e.querySelector('a[href="https://msg.forumcommunity.net/?act=UserCP&CODE=26&c=655775"]')?e.id="topics":e.querySelector('a[href="#notifications"]')?e.id="notif":e.querySelector('form[action="/?act=Mod"]')&&(e.id="mod");const t=e.querySelector("a span");t&&"&nbsp;Moderation"===t.innerHTML.trim()&&(e.id="mod");const o=e.querySelector("a span");o&&"&nbsp;Administration"===o.innerHTML.trim()&&(e.id="admin");e.querySelector('a[href="https://www.forumcommunity.net/?cid=655775"]')&&(e.id="admin")}));e.querySelectorAll(".left li:not(.menu)").forEach((e=>{const t=e.querySelector("a");t&&"HOME"===t.textContent.trim()&&(e.id="pahome"),t&&"/latestupdates"===t.getAttribute("href")&&(e.id="updates")}))}waitForElement(".menuwrap",addIdsToMenuItems);
//Emojione
function applyEmojiTransformation(e){e.classList.contains("[class*=e1a-]")||(e.innerHTML=emojione.toImage(emojione.shortnameToUnicode(emojione.toShort(e.innerHTML))))}function observeElements(e){document.querySelectorAll(e).forEach(applyEmojiTransformation),new MutationObserver((function(o){o.forEach((function(o){"childList"===o.type&&o.addedNodes.forEach((function(o){o.nodeType===Node.ELEMENT_NODE&&(o.matches(e)||o.querySelector(e))&&applyEmojiTransformation(o.matches(e)?o:o.querySelector(e))}))}))})).observe(document.body,{childList:!0,subtree:!0})}observeElements(".color,.tmsg,.profile-interests,.web a,.mtitle,.notification-text");

// Emoji mapping
  const emojiMap = {
    ':)': '🙂',
    ':(': '☹️',
    ';)': '😉',
    ':-P': '😛',
    ':-p': '😛',
    ':P': '😛',
    ';P': '😜',
    ';-P': '😜',
    ':-D': '😀',
    ':D': '😀',
    ':fire:': '🔥',
    // Add more emoji mappings as needed
  };

  // Function to replace text representations with emojis
  function replaceEmojis(text) {
    return text.replace(/:\)|:\(|;\)|:-P|:-p|:P|;P|;-P|:-D|:D|:fire:/g, match => emojiMap[match]);
  }

  // Function to handle emoji replacement for .color and textarea#Post elements
  function replaceEmojisInElements() {
    // Get the content of the .color element
    const colorElement = document.querySelector('.color');
    if (colorElement) {
      colorElement.innerHTML = replaceEmojis(colorElement.innerHTML);
    }

    // Get the content of the textarea#Post element
    const postTextarea = document.querySelector('textarea#Post');
    if (postTextarea) {
      postTextarea.value = replaceEmojis(postTextarea.value);
    }
  }

  // Event listener for text input in .color element
  document.querySelector('.color').addEventListener('input', function() {
    this.innerHTML = replaceEmojis(this.innerHTML);
  });

  // Event listener for text input in textarea#Post element
  document.querySelector('textarea#Post').addEventListener('input', function() {
    this.value = replaceEmojis(this.value);
  });

  // Optional: Apply emoji replacement on page load
  document.addEventListener('DOMContentLoaded', function() {
    replaceEmojisInElements();
  });
