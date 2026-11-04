/* Layout 2 — Scroll story. Vanilla JS, progressive enhancement.
   Without JS (or with reduced motion) every story shows its finished state statically. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var zh = (root.lang || '').indexOf('zh') === 0;
  var story = root.classList.contains('anim');
  var hasIO = 'IntersectionObserver' in window;
  var cssSup = function (q) { try { return window.CSS && CSS.supports(q); } catch (e) { return false; } };
  var mqDesk = window.matchMedia('(min-width: 960px)');

  /* ---------- scroll progress bar (CSS scroll-timeline where supported) ---------- */
  if (!cssSup('animation-timeline: scroll()')) {
    var bar = d.querySelector('.prog i'), ticking = false;
    var upd = function () {
      ticking = false;
      var h = d.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.setProperty('--p', h > 0 ? Math.min(1, window.scrollY / h).toFixed(4) : 0);
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------- reveal on scroll ---------- */
  if (story) {
    if (cssSup('animation-timeline: view()')) {
      root.classList.add('sda');
    } else if (hasIO) {
      var rio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      d.querySelectorAll('.rv').forEach(function (el) { rio.observe(el); });
    } else {
      d.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- pinned stories ---------- */
  function setStep(sec, n) {
    if (sec.getAttribute('data-step') === String(n)) return;
    sec.setAttribute('data-step', n);
    sec.querySelectorAll('.chap').forEach(function (c) {
      c.classList.toggle('now', +c.getAttribute('data-step') === n);
    });
    sec.querySelectorAll('.rg').forEach(function (r) {
      var k = +r.getAttribute('data-n');
      r.classList.toggle('on', k <= n);
      r.classList.toggle('now', k === n);
    });
    sec.querySelectorAll('.dash-steps li').forEach(function (li, i) {
      li.classList.toggle('on', i + 1 < n);
      li.classList.toggle('now', i + 1 === n);
    });
    var ph = sec.querySelector('.rg5');
    if (ph) {
      clearTimeout(sec._t);
      ph.classList.remove('done');
      if (n === 5) sec._t = setTimeout(function () { ph.classList.add('done'); }, 1100);
    }
  }

  var observers = [];
  function buildStories() {
    observers.forEach(function (o) { o.disconnect(); });
    observers = [];
    // Desktop: trigger line at the middle. Mobile: the stage covers the top half, so watch the lower band.
    var margin = '-38% 0px -58% 0px';
    d.querySelectorAll('[data-story]').forEach(function (sec) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) setStep(sec, +e.target.getAttribute('data-step'));
        });
      }, { rootMargin: margin });
      sec.querySelectorAll('.chap').forEach(function (c) { io.observe(c); });
      observers.push(io);
    });
  }
  function updPin() {
    var on = story && hasIO && mqDesk.matches;
    root.classList.toggle('pin', on);
    if (on) {
      d.querySelectorAll('[data-story]').forEach(function (sec) { sec.removeAttribute('data-step'); setStep(sec, 1); });
      buildStories();
    } else {
      observers.forEach(function (o) { o.disconnect(); });
      observers = [];
      d.querySelectorAll('[data-story]').forEach(function (sec) {
        var n = sec.querySelectorAll('.chap').length;
        sec.removeAttribute('data-step'); setStep(sec, n);
      });
    }
  }
  updPin();
  if (mqDesk.addEventListener) mqDesk.addEventListener('change', updPin); else if (mqDesk.addListener) mqDesk.addListener(updPin);

  /* ---------- mobile chapter subnav highlight ---------- */
  var sub = d.querySelector('.subnav');
  if (sub && hasIO) {
    var links = {};
    sub.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = links[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          sub.querySelectorAll('a.on').forEach(function (x) { x.classList.remove('on'); });
          a.classList.add('on');
          var left = a.offsetLeft - 16;
          if (sub.scrollTo) sub.scrollTo({ left: left, behavior: story ? 'smooth' : 'auto' }); else sub.scrollLeft = left;
        }
      });
    }, { rootMargin: '-30% 0px -65% 0px' });
    Object.keys(links).forEach(function (id) { var s = d.getElementById(id); if (s) sio.observe(s); });
  }

  /* ---------- contact form ---------- */
  var form = d.getElementById('contactForm');
  var sel = form && form.querySelector('select[name=topic]');
  function pickTopic(key) {
    if (!sel || !key) return;
    for (var i = 0; i < sel.options.length; i++) {
      var o = sel.options[i];
      if (o.getAttribute('data-k') === key || o.value === key) { sel.selectedIndex = i; return true; }
    }
  }
  try {
    var qp = new URLSearchParams(location.search).get('topic');
    if (qp) pickTopic(qp);
  } catch (e) {}
  d.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('[data-topic]');
    if (!a) return;
    pickTopic(a.getAttribute('data-topic'));
    var msg = a.getAttribute('data-msg');
    if (msg && form) form.message.value = msg;
    if (form) {
      form.classList.remove('flash'); void form.offsetWidth; form.classList.add('flash');
      setTimeout(function () { try { form.name.focus({ preventScroll: true }); } catch (e) {} }, 600);
    }
  });
  if (form) {
    var st = form.querySelector('[role=status]');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim(), email = form.email.value.trim(), message = form.message.value.trim();
      var topic = sel ? sel.value : '';
      st.className = 'form-status';
      if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        st.textContent = zh ? '請填寫姓名、有效的 Email 和訊息。' : 'Please add your name, a valid email and a message.';
        st.classList.add('err');
        return;
      }
      var first = name.split(/\s+/)[0];
      var okMsg = zh ? '謝謝您，' + name + '！訊息已送出，我們會在 1–2 個工作天內回覆。' : 'Thanks, ' + first + "! We'll reply within 1–2 business days.";
      var errMsg = zh ? '抱歉，訊息沒有送出成功。請直接寫信到 yufan@shiptolive.com。' : "Sorry, your message didn't go through. Please email yufan@shiptolive.com.";
      if (form._honey.value) { form.reset(); st.textContent = okMsg; st.classList.add('ok'); return; }
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      st.textContent = zh ? '傳送中…' : 'Sending…';
      fetch('https://admin.shiptolive.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name: name, email: email, topic: topic, message: message, lang: root.lang, page: location.pathname })
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset(); st.textContent = okMsg; st.classList.add('ok');
      }).catch(function () {
        st.textContent = errMsg; st.classList.add('err');
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ---------- software picker / estimator (typical ranges, no prices) ---------- */
  var pk = d.getElementById('pkForm');
  if (pk) {
    var live = d.querySelector('.pk-live');
    var T = zh ? {
      names: { booking: '預約／會員系統', internal: '內部管理系統', portal: '客戶入口網站', app: 'iOS／Android App', integrate: '資料串接與自動化', ai: 'AI 助理', rescue: '舊專案救援與翻新' },
      gets: { booking: '線上預約、會員資料與提醒通知', internal: '取代 Excel 的後台：訂單、庫存或排班', portal: '客戶自己登入看進度與文件', app: '上架 App Store 與 Google Play 的 App', integrate: '系統之間自動同步，不用再人工重打', ai: '讀你自己文件的 AI 助理，回答附來源', rescue: '能部署、有文件、有測試的系統' },
      tiers: ['小型專案：一個流程做好', '標準系統：幾個模組、一個資料庫', '多端平台：網頁、App 與後台'],
      empty: '先選一項需求，這裡會顯示典型的進行方式。',
      disc: '先期規劃（1–2 週，固定費用）', discD: '畫出流程、可點的原型、固定報價',
      p1: '第一階段', p2: '第二階段', p2D: '其餘功能，每 2 週一個可用版本',
      handover: '上線與交接', handoverD: '權限、紀錄、文件；程式碼與帳號歸你',
      pilot: '先用你的真實資料做兩週試作',
      and: '、', sep: '；',
      ref: { leadx: '類似作品：<a href="https://leadx.org" target="_blank" rel="noopener">LEADx EQ 360 評量平台</a>（評量引擎、計分、管理後台、點數系統）', gohike: '類似作品：<a href="https://gohike.tw" target="_blank" rel="noopener">山行接駁 Go Hike</a> 訂車網站（102 條路線與價格）' },
      msg: function (ns, u, p, w) { return '我想了解：' + ns + '。使用人數：' + u + '；平台：' + p + '。（估算器顯示通常 ' + w + ' 週）'; },
      users: { s: '1–5 人', m: '6–30 人', l: '30 人以上／對外開放' }, plats: { web: '網頁', mobile: '手機 App', both: '網頁＋App' }
    } : {
      names: { booking: 'Booking / membership', internal: 'Internal admin system', portal: 'Client portal', app: 'iOS / Android app', integrate: 'Integrations & automation', ai: 'AI assistant', rescue: 'Rescue a stuck project' },
      gets: { booking: 'online booking, member records and reminders', internal: 'a back office that replaces the spreadsheets', portal: 'a login where clients check status and files', app: 'an app live on the App Store and Google Play', integrate: 'systems that sync on their own, no retyping', ai: 'an AI assistant that answers from your own documents, with sources', rescue: 'a system that deploys, with docs and tests' },
      tiers: ['Small project: one workflow done right', 'Standard system: a few modules, one database', 'Multi-platform: web, app and back office'],
      empty: 'Pick at least one need to see how projects like it usually run.',
      disc: 'Discovery (1–2 weeks, fixed fee)', discD: 'process map, clickable prototype, fixed quote',
      p1: 'Phase 1', p2: 'Phase 2', p2D: 'the rest, a working build every 2 weeks',
      handover: 'Launch & handover', handoverD: 'permissions, logs, docs; code and accounts are yours',
      pilot: 'starts with a two-week pilot on your real data',
      and: ', ', sep: '; ',
      ref: { leadx: 'Similar work: <a href="https://leadx.org" target="_blank" rel="noopener">LEADx EQ 360 assessment platform</a> (assessment engine, scoring, admin console, credits)', gohike: 'Similar work: <a href="https://gohike.tw" target="_blank" rel="noopener">Go Hike</a> shuttle-booking site (102 routes with prices)' },
      msg: function (ns, u, p, w) { return "I'd like to talk about: " + ns + '. Users: ' + u + '. Platform: ' + p + '. (The estimator said typically ' + w + ' weeks.)'; },
      users: { s: '1–5', m: '6–30', l: '30+ / public' }, plats: { web: 'Web', mobile: 'Mobile app', both: 'Web + app' }
    };
    var base = { integrate: [3, 6], ai: [4, 8], booking: [6, 10], internal: [6, 12], rescue: [4, 10], portal: [8, 12], app: [10, 16] };
    var order = ['integrate', 'ai', 'booking', 'internal', 'rescue', 'portal', 'app'];
    var el = function (id) { return d.getElementById(id); };
    var calc = function () {
      var needs = [].slice.call(pk.querySelectorAll('input[name=need]:checked')).map(function (i) { return i.value; });
      var users = (pk.querySelector('input[name=users]:checked') || {}).value || 's';
      var plat = (pk.querySelector('input[name=plat]:checked') || {}).value || 'web';
      live.hidden = false;
      if (!needs.length) {
        el('pkTier').textContent = T.empty;
        el('pkTier').className = 'pk-tier pk-empty';
        el('pkWeeks').parentNode.style.display = 'none';
        el('pkPhases').innerHTML = ''; el('pkGet').parentNode.style.display = 'none'; el('pkRef').innerHTML = '';
        el('pkCta').style.display = 'none';
        return;
      }
      el('pkTier').className = 'pk-tier';
      el('pkWeeks').parentNode.style.display = ''; el('pkGet').parentNode.style.display = ''; el('pkCta').style.display = '';
      var withApp = needs.slice();
      if ((plat === 'mobile' || plat === 'both') && withApp.indexOf('app') < 0) withApp.push('app');
      withApp.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
      // Phase 1 = the most useful single module (the first one picked in priority order, excluding the app if web is also wanted)
      var first = withApp[0];
      var lo = base[first][0], hi = base[first][1];
      var extra = withApp.length - 1;
      lo += extra * 2; hi += extra * 3;
      if (users === 'm') { lo += 1; hi += 2; }
      if (users === 'l') { lo += 2; hi += 4; }
      if (plat === 'both') { hi += 2; }
      lo = Math.min(lo, 20); hi = Math.min(Math.max(hi, lo + 2), 26);
      var tier = withApp.length >= 4 || plat === 'both' || (withApp.indexOf('app') >= 0 && withApp.length > 1) ? 2 : (withApp.length >= 2 || users === 'l' ? 1 : 0);
      el('pkTier').textContent = T.tiers[tier];
      var w = lo + '–' + hi;
      el('pkWeeks').textContent = w;
      var ph = '<li><b>' + T.disc + '</b>' + T.discD + '</li>';
      ph += '<li><b>' + T.p1 + (zh ? '：' : ': ') + T.names[first] + '</b>' + (first === 'ai' ? T.pilot : (zh ? '最有用的那塊先上線' : 'the most useful piece goes live first')) + '</li>';
      if (withApp.length > 1) ph += '<li><b>' + T.p2 + (zh ? '：' : ': ') + withApp.slice(1).map(function (k) { return T.names[k]; }).join(T.and) + '</b>' + T.p2D + '</li>';
      ph += '<li><b>' + T.handover + '</b>' + T.handoverD + '</li>';
      el('pkPhases').innerHTML = ph;
      el('pkGet').textContent = withApp.map(function (k) { return T.gets[k]; }).join(T.sep) + (zh ? '。' : '.');
      var ref = '';
      if (withApp.some(function (k) { return k === 'portal' || k === 'internal'; })) ref = T.ref.leadx;
      else if (withApp.indexOf('booking') >= 0) ref = T.ref.gohike;
      el('pkRef').innerHTML = ref;
      var cta = el('pkCta');
      cta.setAttribute('data-msg', T.msg(withApp.map(function (k) { return T.names[k]; }).join(T.and), T.users[users], T.plats[plat], w));
      cta.setAttribute('data-topic', withApp.length === 1 && withApp[0] === 'ai' ? 'ai-build' : 'software');
    };
    pk.addEventListener('change', calc);
    calc();
  }
})();
