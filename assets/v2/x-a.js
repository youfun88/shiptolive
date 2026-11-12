/* UX pass agent A: homepage (logo marquee, contact steps) */
(function () {
  function init() {
    var S = window.STL; if (!S) return;
    // logo marquee: duplicate the list once (hidden from assistive tech) so it loops seamlessly
    S.$$('.mq').forEach(function (mq) {
      if (S.still) return;
      var ul = S.$('.logos', mq);
      S.$$('li', ul).forEach(function (li) {
        var c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        S.$$('a', c).forEach(function (a) { a.setAttribute('tabindex', '-1'); });
        ul.appendChild(c);
      });
      mq.classList.add('run');
    });
    S.onSeen(S.$$('.reply'), function (el) { el.classList.add('in'); }, 0.4);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
