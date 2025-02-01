(function() {
  // Create and add lazysizes script first
  var lazysizesScript = document.createElement('script');
  lazysizesScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  lazysizesScript.integrity = 'sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==';
  lazysizesScript.crossOrigin = 'anonymous';
  lazysizesScript.referrerPolicy = 'no-referrer';
  lazysizesScript.async = true; // Make sure it loads asynchronously
  document.head.appendChild(lazysizesScript);

  // Create and add lazyload.js script next
  var lazyloadScript = document.createElement('script');
  lazyloadScript.src = 'https://cdn.jsdelivr.net/gh/hu6amini/perve_avenue_2067@main/lazyload.js';
  lazyloadScript.crossOrigin = 'anonymous';
  lazyloadScript.async = true; // Load asynchronously
  document.head.appendChild(lazyloadScript);
})();
