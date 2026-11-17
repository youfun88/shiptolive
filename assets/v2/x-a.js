/* UX pass agent A: homepage (client logo row, contact steps) */
(function () {
  // Client logos: a row that drifts slowly left (static row with reduced motion). Logos are not links
  // unless "客戶 Logo 連結" is on in the admin; then each opens the client's site in a new tab, nofollow.
  function clients(mq) {
    var ul = mq && mq.querySelector('.logos'); if (!ul) return;
    var items = [].slice.call(ul.children);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (li) { var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); ul.appendChild(c); });
      mq.classList.add('run');
      // the row is clipped, so lazy images off to the right would pop in late: load them all as the row nears
      var eager = function () { [].forEach.call(ul.querySelectorAll('img'), function (im) { im.loading = 'eager'; }); };
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { eager(); io.disconnect(); } }, { rootMargin: '800px 0px' });
        io.observe(mq);
      } else eager();
    }
    if (!window.fetch) return;
    fetch('https://admin.shiptolive.com/api/client-links?site=shiptolive').then(function (r) { return r.json(); }).then(function (d) {
      if (!d || d.on !== true) return;
      [].forEach.call(ul.children, function (li) {
        var href = li.getAttribute('data-href'), im = li.querySelector('img');
        if (!href || !im || im.parentNode.tagName === 'A') return;
        var a = document.createElement('a');
        a.href = href; a.target = '_blank'; a.rel = 'nofollow noopener';
        if (li.getAttribute('aria-hidden')) a.tabIndex = -1;
        li.insertBefore(a, im); a.appendChild(im);
      });
    }).catch(function () {});
  }
  function init() {
    var S = window.STL; if (!S) return;
    clients(S.$('.mq'));
    S.onSeen(S.$$('.reply'), function (el) { el.classList.add('in'); }, 0.4);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
