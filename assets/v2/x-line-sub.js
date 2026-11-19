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
    var b = document.createElement('b'); b.textContent = T.pick + (en ? ' ' : '「') + T[k][0] + (en ? '' : '」') + (en ? ': ' : '：');
    var a = document.createElement('a'); a.href = '#' + target[k]; a.textContent = T.see + ' ↓';
    out.appendChild(b); out.appendChild(document.createTextNode(T[k][1] + ' ')); out.appendChild(a);
    // once online sign-up is open (the card's button points at the admin checkout), offer it right here too
    var buy = card && card.querySelector('a[data-sub]');
    if (buy && buy.href.indexOf('/subscribe') > 0) {
      var s2 = document.createElement('a'); s2.href = buy.href; s2.textContent = buy.textContent;
      out.appendChild(document.createTextNode(en ? ' · ' : '・')); out.appendChild(s2);
    }
  });
})();
