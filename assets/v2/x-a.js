/* UX pass agent A: homepage (logo marquee, contact steps) */
(function () {
  function init() {
    var S = window.STL; if (!S) return;
    // client names are a static row now (2026-11-13 deslop pass); no marquee
    S.onSeen(S.$$('.reply'), function (el) { el.classList.add('in'); }, 0.4);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
