function loadScript(n, e, l, a, i, s, d) {
    return new Promise((r, t) => {
        var o = document.createElement("script");
        o.src = n;
        e && (o.integrity = e);
        l && (o.crossOrigin = l);
        a && (o.referrerPolicy = a);
        i && (o.async = i);
        d && (o.defer = d); // Add defer attribute if specified
        o.onload = () => {
            s && s(), r();
        };
        o.onerror = () => r();
        document.head.appendChild(o);
    });
}

Promise.all([
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js", "sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==", "anonymous", "no-referrer", false, null, true), // defer
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/emojione/4.5.0/lib/js/emojione.min.js", "sha512-E2Ai/A9+KcoBm0lvfnd5krbr7TWUigQGWTfcoMToNpfmCvQKkZdTbpwyIM4PFbCGMtSmMjE/DAXGjVXpWGdFaQ==", "anonymous", "no-referrer", false, null, true), // defer
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/js/lightgallery.min.js", "sha512-b4rL1m5b76KrUhDkj2Vf14Y0l1NtbiNXwV+SzOzLGv6Tz1roJHa70yr8RmTUswrauu2Wgb/xBJPR8v80pQYKtQ", "anonymous", "no-referrer", false, null, true), // defer
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js", "sha512-HGOnQO9+SP1V92SrtZfjqxxtLmVzqZpjFFekvzZVWoiASSQgSr4cw9Kqd2+l8Llp4Gm0G8GIFJ4ddwZilcdb8A==", "anonymous", "no-referrer", false, null, true) // defer
]).then(() => new Promise(n => {
    document.addEventListener("DOMContentLoaded", n, { once: true });
})).then(() => Promise.all([
    loadScript("https://cdn.jsdelivr.net/gh/hu6amini/perve_avenue_2241@main/pa_scripts.js", null, "anonymous", null, false, null, true) // defer
])).then(() => loadScript("https://nb.forumfree.it/scripts/ace/slider.js", null, null, null, false, null, true)).catch(() => {});
