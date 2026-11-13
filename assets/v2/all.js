/* Ship to Live 2026-11: header menu, reveals, and the two forms (project inquiry, free AI check). */
(function () {
  var doc = document.documentElement, zh = (doc.lang || '').indexOf('zh') === 0;
  doc.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // phone menu
  var hdr = $('.hdr'), burger = $('.burger');
  if (burger) burger.addEventListener('click', function () {
    var open = hdr.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // services dropdown (click / keyboard)
  $$('.dd > button').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var dd = b.parentNode, open = dd.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      e.stopPropagation();
    });
  });
  document.addEventListener('click', function () { $$('.dd.open').forEach(function (d) { d.classList.remove('open'); $('button', d).setAttribute('aria-expanded', 'false'); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { $$('.dd.open').forEach(function (d) { d.classList.remove('open'); }); if (hdr) hdr.classList.remove('open'); } });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { if (hdr) hdr.classList.remove('open'); }); });

  // reveals
  var rv = $$('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });


  // count-up numbers (track record stats)
  var counts = $$('[data-count]');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function run(el) {
    var to = +el.getAttribute('data-count'), from = +(el.getAttribute('data-from') || 0), suf = el.getAttribute('data-suffix') || '', t0 = null, dur = 1600;
    function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      var v = Math.round(from + (to - from) * e); el.textContent = (el.hasAttribute('data-fmt') ? v.toLocaleString('en-US') : v) + suf; if (k < 1) requestAnimationFrame(step); }
    el.textContent = (el.hasAttribute('data-fmt') ? from.toLocaleString('en-US') : from) + suf; requestAnimationFrame(step);
  }
  if (counts.length && !reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { run(en.target); cio.unobserve(en.target); } }); }, { threshold: 0.6 });
    counts.forEach(function (el) { el.style.fontVariantNumeric = 'tabular-nums'; cio.observe(el); });
  }

  // AI question typing (.ask) and the homepage hero question
  function typeInto(el, text, step, done) {
    var chars = Array.from ? Array.from(text) : text.split(''), i = 0;
    setTimeout(function tick() {
      el.textContent = chars.slice(0, ++i).join('');
      if (i < chars.length) setTimeout(tick, step + (Math.random() * step * 0.6 | 0)); else if (done) done();
    }, 500);
  }
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function onSeen(els, fn, th) {
    if (!els.length) return;
    if (still || !('IntersectionObserver' in window)) { els.forEach(function (e) { fn(e, true); }); return; }
    var o = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { o.unobserve(en.target); fn(en.target, false); } }); }, { threshold: th || 0.3 });
    els.forEach(function (e) { o.observe(e); });
  }
  onSeen($$('.ask'), function (box, now) {
    var gh = $('.gh', box), q = $('.q', box);
    if (now) { box.classList.add('done'); return; }
    var ty = document.createElement('span'); ty.className = 'ty'; ty.setAttribute('aria-hidden', 'true'); q.appendChild(ty);
    typeInto(ty, gh.textContent, zh ? 85 : 38, function () { box.classList.add('done'); });
  });
  onSeen($$('.loopw'), function (el) { el.classList.add('in'); }, 0.35);
  onSeen($$('.hero-art'), function (art, now) {
    var t = $('.hq', art);
    if (!t || now) { art.classList.add('answered'); return; }
    var full = t.textContent; t.textContent = '';
    setTimeout(function () { typeInto(t, full, zh ? 90 : 40, function () { setTimeout(function () { art.classList.add('answered'); }, 350); }); }, 300);
  }, 0.2);

  // AI scan console: type a question, ask each AI in turn, show who gets named, fill the meter, suggest a fix
  var SCAN = zh ? {
    you: '您的公司', set: [
      { q: '台北有哪些好吃的中餐餐廳？', r: [['you', '同業 A'], ['同業 A', '同業 B'], ['you', '同業 C'], ['you', '同業 B']], tip: '建議：Gemini 沒有提到您。補上「招牌菜、人均價格、可否訂位」的 FAQ。' },
      { q: '推薦適合公司聚餐的中餐廳？', r: [['同業 B', '同業 A'], ['you', '同業 B'], ['同業 C'], ['you']], tip: '建議：新增「包廂與聚餐」頁面，寫清楚人數、套餐與訂位方式。' },
      { q: '週末適合帶小孩的中餐廳？', r: [['you', '同業 C'], ['you'], ['you', '同業 A'], ['同業 A', 'you']], tip: '4 個 AI 都提到您。接下來每天持續追蹤，確保排名不掉。' }
    ] } : {
    you: 'Your company', set: [
      { q: 'What are the best Chinese restaurants in Taipei?', r: [['you', 'Rival A'], ['Rival A', 'Rival B'], ['you', 'Rival C'], ['you', 'Rival B']], tip: 'Fix: Gemini skipped you. Add an FAQ on signature dishes, price per person and reservations.' },
      { q: 'Chinese restaurants in Taipei for a team dinner?', r: [['Rival B', 'Rival A'], ['you', 'Rival B'], ['Rival C'], ['you']], tip: 'Fix: add a "private rooms and group dinners" page with sizes, set menus and booking.' },
      { q: 'Kid-friendly Chinese restaurants in Taipei this weekend?', r: [['you', 'Rival C'], ['you'], ['you', 'Rival A'], ['Rival A', 'you']], tip: 'All 4 AIs name you. Daily checks keep it that way.' }
    ] };
  function runScan(box, now) {
    var SCAN0 = SCAN; try { if (box.getAttribute('data-scan')) SCAN0 = JSON.parse(box.getAttribute('data-scan')); } catch (e) {}
    var txt = $('.txt', box), rows = $$('.scan-ai li', box), bar = $('.scan-meter i', box), cnt = $('.cnt', box), tip = $('.scan-tip', box), tipP = $('p', tip), qn = $('.qn', box), car = $('.car', box);
    function paint(k, idx) {
      var res = $('.res', rows[k]), names = SCAN0.set[idx].r[k], hit = names.indexOf('you') > -1;
      res.innerHTML = names.map(function (n) { return n === 'you' ? '<span class="tag you">' + SCAN0.you + '</span>' : '<span class="tag">' + n + '</span>'; }).join('');
      rows[k].className = hit ? 'hit' : 'miss';
      return hit;
    }
    function show(idx, instant) {
      var item = SCAN0.set[idx], hits = 0;
      qn.textContent = (idx + 1) + ' / ' + SCAN0.set.length;
      rows.forEach(function (r) { r.className = ''; $('.res', r).innerHTML = ''; });
      bar.style.width = '0'; cnt.textContent = '0 / 4'; tip.classList.remove('on');
      if (instant) {
        txt.textContent = item.q; car.style.display = 'none';
        rows.forEach(function (_, k) { if (paint(k, idx)) hits++; });
        bar.style.width = hits * 25 + '%'; cnt.textContent = hits + ' / 4'; tipP.textContent = item.tip; tip.classList.add('on');
        return;
      }
      car.style.display = '';
      typeInto(txt, item.q, zh ? 70 : 30, function () {
        car.style.display = 'none';
        var k = 0;
        (function next() {
          if (k >= rows.length) { setTimeout(function () { tipP.textContent = item.tip; tip.classList.add('on'); setTimeout(function () { show((idx + 1) % SCAN0.set.length); }, 3800); }, 400); return; }
          $('.res', rows[k]).innerHTML = '<span class="ld"><i></i><i></i><i></i></span>';
          var kk = k;
          setTimeout(function () { if (paint(kk, idx)) hits++; bar.style.width = hits * 25 + '%'; cnt.textContent = hits + ' / 4'; k++; next(); }, 750);
        })();
      });
    }
    show(0, now);
  }
  onSeen($$('.scan'), runScan, 0.3);

  // animated monthly-check chart: line draws point by point, numbers and table follow
  function runChart(fig, now) {
    var d = JSON.parse(fig.getAttribute('data-mc')), V = [0, 7, 16, 26, 35, 43], X = [40, 132, 224, 316, 408, 500];
    var clip = $('.mc-cliprect', fig), pts = $$('.mc-pt', fig), ns = $$('.mc-n', fig), date = $('.mc-date', fig), rows = $$('.mc-tbl tbody tr', fig);
    var cur = 0;
    function tween(el, to) { var from = +el.textContent || 0, t0 = null; function st(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 600); el.textContent = Math.round(from + (to - from) * k); if (k < 1) requestAnimationFrame(st); } requestAnimationFrame(st); }
    function step(i, instant) {
      clip.setAttribute('width', i === 5 ? 540 : X[i] + 8);
      pts.forEach(function (p, k) { p.classList.toggle('on', k <= i); });
      ns.forEach(function (n) { instant ? (n.textContent = V[i]) : tween(n, V[i]); });
      date.textContent = d.dates[i];
      rows.forEach(function (r, k) {
        var c = r.querySelectorAll('.mc-r'), v = d.per[i][k], pv = i ? d.per[i - 1][k] : 0, dl = r.querySelector('.mc-dl');
        c.forEach(function (e) { instant ? (e.textContent = v) : tween(e, v); });
        dl.textContent = i ? d.up.replace('{n}', v - pv) : d.same; dl.className = 'mc-dl' + (i ? '' : ' first');
      });
      if (!instant) { var on = $('.mc-cards .on', fig); on.classList.remove('mc-flash'); void on.offsetWidth; on.classList.add('mc-flash'); }
    }
    if (now) { step(5, true); return; }
    clip.style.transition = 'none'; step(0, true); void clip.getBoundingClientRect(); clip.style.transition = '';
    (function play() {
      cur = 0; clip.style.transition = 'none'; step(0, true); void clip.getBoundingClientRect(); clip.style.transition = '';
      var iv = setInterval(function () { cur++; step(cur); if (cur >= 5) { clearInterval(iv); setTimeout(play, 6000); } }, 900);
    })();
  }
  onSeen($$('.mchart'), runChart, 0.35);

  // phones: sticky bottom CTA, shown after the hero, hidden while a form or the footer is on screen
  var mcta = $('.mcta');
  if (mcta) {
    document.body.classList.add('has-mcta');
    var hide = 0, past = false;
    var upd = function () { mcta.classList.toggle('on', past && hide === 0); };
    window.addEventListener('scroll', function () { var p2 = window.scrollY > 520; if (p2 !== past) { past = p2; upd(); } }, { passive: true });
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (es) { es.forEach(function (en) { hide += en.isIntersecting ? 1 : -1; if (hide < 0) hide = 0; }); upd(); });
      $$('form[data-form], .foot, #check, #contact').forEach(function (el) { mo.observe(el); });
    }
  }
  window.STL = { $: $, $$: $$, onSeen: onSeen, typeInto: typeInto, zh: zh, still: still };

  // ?need=ai|web|software|other preselects the inquiry type
  try {
    var need = new URLSearchParams(location.search).get('need');
    if (need) { var r = $('form[data-form="project"] input[name="need"][value="' + need + '"]'); if (r) r.checked = true; }
    // ?topic=signup (QR code at the end of the dashboard talk): open a dashboard account
    var pf = $('form[data-form="project"]');
    if (pf && new URLSearchParams(location.search).get('topic') === 'signup') {
      var o = $('input[name="need"][value="other"]', pf); if (o) { o.checked = true; o.setAttribute('data-label', zh ? '開通管理後台' : 'Open a dashboard account'); }
      pf.elements.email.placeholder = zh ? '登入用的 Gmail' : 'The Gmail you will sign in with';
      if (!pf.elements.message.value) pf.elements.message.value = zh ? '我想開通管理後台與審閱頁\n公司名稱：\n網站：\n登入用的 Gmail（和上面的 Email 相同就好）：' : 'I would like a dashboard and review page\nCompany:\nWebsite:\nGmail for sign-in (same as above is fine):';
    }
  } catch (e) {}

  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var T = zh ? {
    req: '請填寫必填欄位（姓名、正確的 Email，以及標示必填的項目）。',
    ok: function (n) { return '謝謝您，' + n + '！已收到，我們會在 1–2 個工作天內回覆。'; },
    fail: '抱歉，沒有送出成功。請直接寫信到 yufan@shiptolive.com。',
    sending: '送出中…'
  } : {
    req: 'Please fill in the required fields (name, a valid email, and anything marked required).',
    ok: function (n) { return 'Thanks, ' + n.split(/\s+/)[0] + "! We'll reply within 1–2 business days."; },
    fail: "Sorry, that didn't go through. Please email yufan@shiptolive.com directly.",
    sending: 'Sending…'
  };

  $$('form[data-form]').forEach(function (form) {
    var kind = form.getAttribute('data-form'), status = $('.status', form), btn = $('button[type="submit"]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'status'; status.textContent = '';
      var v = function (n) { var el = form.elements[n]; return el ? String(el.value || '').trim() : ''; };
      var name = v('name'), email = v('email'), topic, message, bad = null;
      $$('[required]', form).forEach(function (el) { if (!bad && !String(el.value || '').trim()) bad = el; });
      if (!bad && !emailRe.test(email)) bad = form.elements.email;
      if (bad) { status.textContent = T.req; status.classList.add('err'); bad.focus(); return; }
      if (kind === 'check') {
        topic = zh ? '免費 AI 曝光檢測' : 'Free AI visibility check';
        var lines = zh
          ? ['網站：' + v('site'), '主要服務城市：' + v('city'), '客戶最常問的問題：' + (v('questions') || '（未填）'), '競爭同業：' + (v('rivals') || '（未填）')]
          : ['Website: ' + v('site'), 'Main city served: ' + v('city'), 'Top customer questions: ' + (v('questions') || '(none)'), 'Competitors: ' + (v('rivals') || '(none)')];
        if (v('note')) lines.push((zh ? '其他說明：' : 'Notes: ') + v('note'));
        message = lines.join('\n');
      } else {
        var chosen = $('input[name="need"]:checked', form);
        topic = chosen ? chosen.getAttribute('data-label') : (zh ? '其他需求' : 'Other');
        message = v('message');
        if (v('company')) message = (zh ? '公司：' : 'Company: ') + v('company') + '\n' + message;
      }
      var okMsg = T.ok(name);
      if (v('_honey')) { form.reset(); status.textContent = okMsg; status.classList.add('ok'); return; }
      btn.disabled = true; var label = btn.textContent; btn.textContent = T.sending;
      fetch('https://admin.shiptolive.com/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name: name, email: email, topic: topic, message: message, lang: doc.lang, page: location.pathname })
      }).then(function (r) {
        if (!r.ok) throw new Error('bad');
        form.reset(); status.textContent = okMsg; status.classList.add('ok');
        if (window.gtag) gtag('event', 'generate_lead', { form: kind });
      }).catch(function () { status.textContent = T.fail; status.classList.add('err'); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });
})();

;
/* UX pass agent A: homepage (logo marquee, contact steps) */
(function () {
  function init() {
    var S = window.STL; if (!S) return;
    // client names are a static row now (2026-11-13 deslop pass); no marquee
    S.onSeen(S.$$('.reply'), function (el) { el.classList.add('in'); }, 0.4);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* UX pass agent B: service-page hero visuals (website, software, AI search) */
(function () {
  var S = window.STL;
  if (!S) return;
  var $ = S.$, $$ = S.$$;

  // website: language toggle flips 中 / EN
  S.onSeen($$('.hv-web'), function (el, now) {
    el.classList.add('in');
    if (now) return;
    var b = $$('.lg b', el), i = 0;
    setTimeout(function flip() {
      i = 1 - i;
      b.forEach(function (x, k) { x.classList.toggle('on', k === i); });
      setTimeout(flip, 2400);
    }, 2400);
  }, 0.25);

  // software: code types in line by line, ships, the app takes two bookings
  var CODE = [
    ['<span class="k">const</span> booking = <span class="k">await</span> db.bookings.create({', 'const booking = await db.bookings.create({'],
    ['  customer, date, seats: 4,', '  customer, date, seats: 4,'],
    ['});', '});'],
    ['<span class="k">await</span> notify.line(customer, <span class="s">' + (S.zh ? "'預約成功'" : "'Booked'") + '</span>);', 'await notify.line(customer, ' + (S.zh ? "'預約成功'" : "'Booked'") + ');'],
    ['<span class="c">// ' + (S.zh ? '測試通過，自動部署' : 'tests pass, deploy') + '</span>', '// ' + (S.zh ? '測試通過，自動部署' : 'tests pass, deploy')]
  ];
  S.onSeen($$('.hv-sw'), function (el, now) {
    el.classList.add('in');
    var lines = $$('.code .ln', el), picks = $$('.cal .pick', el);
    function finish() {
      lines.forEach(function (l, k) { l.innerHTML = CODE[k][0]; });
      el.classList.add('shipped');
      picks.forEach(function (p, k) { setTimeout(function () { p.classList.add('on'); if (k === picks.length - 1) el.classList.add('booked'); }, now ? 0 : 500 + k * 600); });
    }
    if (now) { finish(); return; }
    var k = 0;
    setTimeout(function () { next(); }, 500);
    function next() {
      if (k >= lines.length) { setTimeout(finish, 300); return; }
      var ln = lines[k], c = CODE[k];
      var ch = c[1].split(''), n = 0;
      (function t() { ln.textContent = ch.slice(0, ++n).join(''); if (n < ch.length) setTimeout(t, 18); else { ln.innerHTML = c[0]; k++; setTimeout(next, 140); } })();
    }
  }, 0.25);

  // AI search: your company rises to #1, then SEO / AEO / GEO light up; replays every few seconds
  S.onSeen($$('.hv-ai'), function (el, now) {
    var chips = $$('.c3 span', el);
    if (now) { el.classList.add('won'); chips.forEach(function (c) { c.classList.add('on'); }); return; }
    function play() {
      el.classList.remove('won'); chips.forEach(function (c) { c.classList.remove('on'); });
      setTimeout(function () {
        el.classList.add('won');
        chips.forEach(function (c, k) { setTimeout(function () { c.classList.add('on'); }, 1300 + k * 350); });
      }, 900);
      setTimeout(play, 9000);
    }
    play();
  }, 0.3);
})();

;
/* UX pass agent c: use window.STL helpers */
(function () {
  var S = window.STL; if (!S) return;
  S.onSeen(S.$$('.ab-art, .ptl, .rep'), function (el) { el.classList.add('in'); }, 0.3);
})();
