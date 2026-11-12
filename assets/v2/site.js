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
      el.textContent = Math.round(from + (to - from) * e) + suf; if (k < 1) requestAnimationFrame(step); }
    el.textContent = from + suf; requestAnimationFrame(step);
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
      { q: '台北有哪些好玩的密室逃脫？', r: [['you', '同業 A'], ['同業 A', '同業 B'], ['you', '同業 C'], ['you', '同業 B']], tip: '建議：Gemini 沒有提到您。補上「適合幾人、多久、價格」的 FAQ。' },
      { q: '推薦適合公司團康的密室逃脫？', r: [['同業 B', '同業 A'], ['you', '同業 B'], ['同業 C'], ['you']], tip: '建議：新增「企業包場」頁面，寫清楚人數與包場方式。' },
      { q: '週末帶小孩可以玩的密室逃脫？', r: [['you', '同業 C'], ['you'], ['you', '同業 A'], ['同業 A', 'you']], tip: '4 個 AI 都提到您。接下來每天持續追蹤，確保排名不掉。' }
    ] } : {
    you: 'Your company', set: [
      { q: 'What are the most fun escape rooms in Taipei?', r: [['you', 'Rival A'], ['Rival A', 'Rival B'], ['you', 'Rival C'], ['you', 'Rival B']], tip: 'Fix: Gemini skipped you. Add an FAQ on group size, length and price.' },
      { q: 'Escape rooms in Taipei for a team outing?', r: [['Rival B', 'Rival A'], ['you', 'Rival B'], ['Rival C'], ['you']], tip: 'Fix: add a "private bookings for companies" page with group sizes.' },
      { q: 'Kid-friendly escape rooms in Taipei this weekend?', r: [['you', 'Rival C'], ['you'], ['you', 'Rival A'], ['Rival A', 'you']], tip: 'All 4 AIs name you. Daily checks keep it that way.' }
    ] };
  function runScan(box, now) {
    var txt = $('.txt', box), rows = $$('.scan-ai li', box), bar = $('.scan-meter i', box), cnt = $('.cnt', box), tip = $('.scan-tip', box), tipP = $('p', tip), qn = $('.qn', box), car = $('.car', box);
    function paint(k, idx) {
      var res = $('.res', rows[k]), names = SCAN.set[idx].r[k], hit = names.indexOf('you') > -1;
      res.innerHTML = names.map(function (n) { return n === 'you' ? '<span class="tag you">' + SCAN.you + '</span>' : '<span class="tag">' + n + '</span>'; }).join('');
      rows[k].className = hit ? 'hit' : 'miss';
      return hit;
    }
    function show(idx, instant) {
      var item = SCAN.set[idx], hits = 0;
      qn.textContent = (idx + 1) + ' / ' + SCAN.set.length;
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
          if (k >= rows.length) { setTimeout(function () { tipP.textContent = item.tip; tip.classList.add('on'); setTimeout(function () { show((idx + 1) % SCAN.set.length); }, 3800); }, 400); return; }
          $('.res', rows[k]).innerHTML = '<span class="ld"><i></i><i></i><i></i></span>';
          var kk = k;
          setTimeout(function () { if (paint(kk, idx)) hits++; bar.style.width = hits * 25 + '%'; cnt.textContent = hits + ' / 4'; k++; next(); }, 750);
        })();
      });
    }
    show(0, now);
  }
  onSeen($$('.scan'), runScan, 0.3);

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
