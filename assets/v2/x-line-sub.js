/* Year-end offer (zh /line-ai/ only): the HTML shows the promo (NT$699, no setup fee) and a
   countdown to data-promo-end. Once that time has passed (on load or while the page is open),
   the banner is removed and every [data-promo] element is swapped for the normal-price
   <template data-norm> right after it. The en page has no [data-promo-end], so nothing runs. */
(function () {
  var box = document.querySelector('[data-promo-end]');
  if (!box) return;
  var end = Date.parse(box.getAttribute('data-promo-end'));
  if (isNaN(end)) return;
  var cd = box.querySelector('.la-cd'), timer = 0;
  function revert() {
    if (timer) clearInterval(timer);
    var els = document.querySelectorAll('[data-promo]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], t = el.nextElementSibling;
      if (t && t.tagName === 'TEMPLATE' && t.hasAttribute('data-norm')) {
        el.parentNode.replaceChild(document.importNode(t.content, true), el);
        t.parentNode.removeChild(t);
      } else el.parentNode.removeChild(el);
    }
    if (box.parentNode) box.parentNode.removeChild(box);
  }
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var ms = end - Date.now();
    if (ms <= 0) { revert(); return; }
    var x = Math.floor(ms / 1000);
    var v = { d: Math.floor(x / 86400), h: two(Math.floor(x / 3600) % 24), m: two(Math.floor(x / 60) % 60), s: two(x % 60) };
    if (!cd) return;
    for (var k in v) { var e = cd.querySelector('[data-u="' + k + '"]'); if (e) e.textContent = v[k]; }
  }
  tick();
  if (Date.now() >= end) return;
  if (cd) cd.hidden = false;
  timer = setInterval(tick, 1000);
})();

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

/* 「哪個方案適合我？」: two questions → outline the matching plan card and say why.
   Monthly contacts decide the plan; "who sets it up" only matters under 100 (Starter is do-it-yourself). */
(function () {
  var form = document.querySelector('.la-fit');
  if (!form) return;
  var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var out = form.querySelector('.la-fit-r');
  var T = en ? {
    starter: ['Starter', '$39/month, no setup fee. You set it up yourself with our wizard.'],
    light: ['Light', '$79/month. We write your Q&A with you and test it before launch; 300 monthly active contacts included.'],
    standard: ['Standard', '$159/month. 1,000 monthly active contacts, a monthly Q&A tune-up and replies in your own tone.'],
    ent: ['Enterprise', 'from $319/month. 3,000 monthly active contacts and up to 5 people to hand off to.'],
    pick: 'We suggest', see: 'See the plan'
  } : {
    starter: ['入門', 'NT$1,190／月，免設定費，您照著精靈自己設定。'],
    light: ['輕量', 'NT$2,490／月，我們幫您整理 Q&A、一起測過才上線，每月含 300 位月活躍聯絡人。'],
    standard: ['標準', 'NT$4,900／月，每月含 1,000 位月活躍聯絡人，每月補強 Q&A，AI 用您的語氣回覆。'],
    ent: ['企業', 'NT$9,900／月起，每月含 3,000 位月活躍聯絡人，轉真人通知最多 5 位。'],
    pick: '建議您選', see: '看這個方案'
  };
  // during the zh year-end offer the suggestion shows the offer price too
  if (!en) {
    var P = { starter: ['NT$1,190／月，免設定費', 'NT$699／月（原價 NT$1,190），免設定費'],
              light: ['NT$2,490／月', 'NT$699／月（原價 NT$2,490），免設定費'],
              standard: ['NT$4,900／月', 'NT$699／月（原價 NT$4,900），免設定費'] };
    var promoT = {};
    for (var pk in P) promoT[pk] = [T[pk][0], T[pk][1].replace(P[pk][0], P[pk][1])];
  }
  var target = { starter: 'plan-starter', light: 'plan-light', standard: 'plan-standard', ent: 'enterprise' };
  function val(n) { var c = form.querySelector('input[name="' + n + '"]:checked'); return c ? c.value : ''; }
  form.addEventListener('change', function () {
    var n = val('fit-n'), s = val('fit-s');
    if (!n || (n === '100' && !s)) return;
    var k = n === 'max' ? 'ent' : n === '1000' ? 'standard' : n === '300' ? 'light' : (s === 'self' ? 'starter' : 'light');
    var old = document.querySelectorAll('.la-plan.fit, .la-oa.fit');
    for (var i = 0; i < old.length; i++) old[i].classList.remove('fit');
    var card = document.getElementById(target[k]);
    if (card) card.classList.add('fit');
    out.innerHTML = '';
    var line = (!en && promoT[k] && document.querySelector('[data-promo-end]')) ? promoT[k] : T[k];
    var b = document.createElement('b'); b.textContent = T.pick + (en ? ' ' : '「') + line[0] + (en ? '' : '」') + (en ? ': ' : '：');
    var a = document.createElement('a'); a.href = '#' + target[k]; a.textContent = T.see + ' ↓';
    out.appendChild(b); out.appendChild(document.createTextNode(line[1] + ' ')); out.appendChild(a);
    // once online sign-up is open (the card's button points at the admin checkout), offer it right here too
    var buy = card && card.querySelector('a[data-sub]');
    if (buy && buy.href.indexOf('/subscribe') > 0) {
      var s2 = document.createElement('a'); s2.href = buy.href; s2.textContent = buy.textContent;
      out.appendChild(document.createTextNode(en ? ' · ' : '・')); out.appendChild(s2);
    }
  });
})();
