/* LINE AI plan cards: 「立即訂閱」 opens the admin checkout once online sign-up is open.
   Every button starts as 「即將開放，先填表洽詢」 → #contact. The admin says what is open
   (GET /api/subscribe/status → {zh, en}); zh = NT$ (bank transfer / ECPay), en = USD (Stripe).
   Only the text and link change, so nothing moves; if the request fails, the fallback stays. */
(function () {
  var btns = document.querySelectorAll('a[data-sub]');
  if (!btns.length || !window.fetch) return;
  var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var api = 'https://admin.shiptolive.com';
  fetch(api + '/api/subscribe/status', { credentials: 'omit' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (s) {
      if (!s || s[en ? 'en' : 'zh'] !== true) return;
      for (var i = 0; i < btns.length; i++) {
        var a = btns[i];
        a.href = api + '/subscribe?plan=' + encodeURIComponent(a.getAttribute('data-sub')) + '&lang=' + (en ? 'en' : 'zh');
        a.textContent = en ? 'Subscribe now' : '立即訂閱';
        a.classList.add('orange');
      }
    })
    .catch(function () {});
})();
