// Send visitors and crawlers to the real site when a proxy serves this page
// from another domain. The host is reversed so proxies that rewrite
// "decibel.pt" in the HTML they relay leave it intact.
(() => {
  const host = "tp.lebiced".split("").reverse().join("");
  const local = ["", "localhost", "127.0.0.1"];
  if (location.hostname === host || local.includes(location.hostname)) return;
  location.replace(
    `https://${host}${location.pathname}${location.search}${location.hash}`,
  );
})();
