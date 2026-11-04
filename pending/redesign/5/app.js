/* Ship to Live redesign, layout 5: Academy + Studio */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var ZH = (root.lang || '').toLowerCase().indexOf('zh') === 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqMobile = window.matchMedia('(max-width: 819px)');
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }

  /* ---------- header ---------- */
  var hdr = $('.hdr');
  function onScroll() { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var menuBtn = $('.menu-btn'), mnav = $('#mnav');
  if (menuBtn && mnav) {
    menuBtn.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  function closeMenu() { if (mnav) { mnav.classList.remove('open'); menuBtn && menuBtn.setAttribute('aria-expanded', 'false'); } }

  /* ---------- reveal ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- hero path ---------- */
  var path = $('#heroPath');
  if (path) {
    var items = $$('li', path), pi = 0;
    setTimeout(function () { path.classList.add('in'); }, 200);
    function lightPath() { items.forEach(function (li, i) { li.classList.toggle('on', i === pi); }); }
    if (reduce) { pi = 2; lightPath(); }
    else { lightPath(); setInterval(function () { pi = (pi + 1) % items.length; lightPath(); }, 2200); }
  }

  /* ---------- academy / studio: sticky jump links with scrollspy ---------- */
  var seg = $('#seg'), views = $$('.view');
  function setSeg(name) {
    if (!seg) return;
    seg.setAttribute('data-active', name);
    $$('a', seg).forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('data-view') === name ? 'true' : 'false'); });
  }
  function scrollToEl(el) {
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.scrollY - (mqMobile.matches ? 116 : 120);
    window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
  }
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setSeg(e.target.getAttribute('data-view')); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    views.forEach(function (v) { spy.observe(v); });
  }

  /* ---------- contact topic prefill ---------- */
  var form = $('#contactForm'), sel = form && form.querySelector('select[name=topic]'), msg = form && form.querySelector('textarea[name=message]');
  function setTopic(key, text) {
    if (!sel || !key) return;
    var o = sel.querySelector('option[data-key="' + key + '"]');
    if (o) sel.value = o.value;
    if (text && msg && !msg.value.trim()) msg.value = text;
  }
  var qp = new URLSearchParams(location.search).get('topic');
  if (qp) setTopic(qp === 'ai' ? 'training' : qp);

  // in-page links: switch view if needed, prefill topic
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var target = doc.getElementById(id);
    if (!target) return;
    if (a.hasAttribute('data-topic')) setTopic(a.getAttribute('data-topic'), a.getAttribute('data-msg'));
    e.preventDefault();
    closeMenu();
    scrollToEl(target);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    if (id === 'contact') { var n = doc.getElementById('cf-name'); if (n) setTimeout(function () { try { n.focus({ preventScroll: true }); } catch (_) {} }, 500); }
  });

  /* ---------- before / after demo ---------- */
  var EX = ZH ? [
    { bl: '2 小時', al: '10 分鐘', unit: '／每週', w: 8.3,
      b: [['打開 CRM，把本週業績數字抄出來', 25], ['在 Excel 整理成表格、算成長率', 30], ['翻 LINE 群組，找各組進度', 20], ['寫摘要與重點', 35], ['排版、寄給主管', 10]],
      a: [['每週五 17:00 自動抓取 CRM、試算表、Gmail', 0, '⚙'], ['AI 依公司範本起草週報', 0, 'AI'], ['你審閱、改兩句話', 8, '✓'], ['按下寄出', 2, '↗']] },
    { bl: '1.5 小時', al: '25 分鐘', unit: '／每天', w: 27.8,
      b: [['逐則讀 LINE、Email、粉專訊息', 25], ['查訂單與出貨狀態', 20], ['翻規格表與退換貨規定', 15], ['一則一則打字回覆', 30]],
      a: [['AI 讀取 FAQ、規格表與訂單狀態', 0, '⚙'], ['為每則訊息起草回覆，語氣一致', 0, 'AI'], ['同仁確認或修改後送出', 20, '✓'], ['特殊狀況轉給專人', 5, '↗']] },
    { bl: '1.5 小時', al: '15 分鐘', unit: '／每場會議', w: 16.7,
      b: [['整理會議紀錄', 30], ['對照價目表做報價單', 35], ['寫待辦、分派給同事', 15], ['追進度', 10]],
      a: [['錄音自動整理成摘要、決議與待辦', 0, '⚙'], ['AI 依價目表填好報價單草稿', 0, 'AI'], ['你檢查數字與條款', 12, '✓'], ['待辦自動推到團隊工具', 3, '↗']] }
  ] : [
    { bl: '2 hours', al: '10 min', unit: '/ week', w: 8.3,
      b: [['Open the CRM, copy this week\'s sales numbers', 25], ['Tidy them in Excel, work out growth', 30], ['Scroll LINE/Slack groups for team updates', 20], ['Write the summary and highlights', 35], ['Format it and email your manager', 10]],
      a: [['Every Friday 5 pm: pull CRM, Sheets and Gmail automatically', 0, '⚙'], ['AI drafts the report in your company template', 0, 'AI'], ['You review and tweak two sentences', 8, '✓'], ['Press send', 2, '↗']] },
    { bl: '1.5 hours', al: '25 min', unit: '/ day', w: 27.8,
      b: [['Read every LINE, email and Facebook message', 25], ['Look up order and shipping status', 20], ['Check the spec sheet and return policy', 15], ['Type each reply by hand', 30]],
      a: [['AI reads your FAQ, spec sheet and order status', 0, '⚙'], ['Drafts a reply to each message, same tone every time', 0, 'AI'], ['Staff approve or edit, then send', 20, '✓'], ['Unusual cases go to a person', 5, '↗']] },
    { bl: '1.5 hours', al: '15 min', unit: '/ meeting', w: 16.7,
      b: [['Write up the meeting notes', 30], ['Build the quote from the price list', 35], ['Write to-dos and assign them', 15], ['Chase follow-ups', 10]],
      a: [['Recording becomes a summary, decisions and to-dos', 0, '⚙'], ['AI fills the quote template from your price list', 0, 'AI'], ['You check the numbers and terms', 12, '✓'], ['To-dos pushed to your team\'s tool', 3, '↗']] }
  ];
  var T = ZH ? { auto: '自動', min: ' 分', fmt: function (m) { return m >= 60 ? Math.floor(m / 60) + ' 小時' + (m % 60 ? ' ' + (m % 60) + ' 分' : '') : m + ' 分鐘'; } }
             : { auto: 'auto', min: ' min', fmt: function (m) { return m >= 60 ? Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : m + ' min'; } };
  var demo = $('#demoBox');
  if (demo) {
    var exI = 0, timers = [], played = false;
    var tb = $('[data-timer=before]', demo), ta = $('[data-timer=after]', demo);
    var ub = $('[data-unit=before]', demo), ua = $('[data-unit=after]', demo);
    var olB = $('[data-steps=before]', demo), olA = $('[data-steps=after]', demo);
    var barA = $('.bar.a i', demo);
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function render(ex) {
      olB.innerHTML = ex.b.map(function (s, i) { return '<li><span class="ic">' + (i + 1) + '</span><span>' + s[0] + '</span><span class="t">' + s[1] + T.min + '</span></li>'; }).join('');
      olA.innerHTML = ex.a.map(function (s) { var auto = !s[1]; return '<li class="' + (auto ? 'auto' : 'human') + '"><span class="ic">' + s[2] + '</span><span>' + s[0] + '</span><span class="t">' + (auto ? T.auto : s[1] + T.min) + '</span></li>'; }).join('');
      ub.textContent = ua.textContent = ZH ? ex.unit : ' ' + ex.unit;
      barA.style.setProperty('--w', ex.w + '%');
    }
    function finalState(ex) {
      tb.textContent = ex.bl; ta.textContent = ex.al;
      $$('.steps li', demo).forEach(function (li) { li.classList.add('show'); });
      demo.classList.add('done');
    }
    function play() {
      clear();
      var ex = EX[exI];
      render(ex);
      if (reduce) { finalState(ex); return; }
      demo.classList.add('armed'); demo.classList.remove('done');
      tb.textContent = T.fmt(0); ta.textContent = T.fmt(0);
      var t = 300, sum = 0;
      $$('li', olB).forEach(function (li, i) {
        later(function () {
          li.classList.add('show');
          var from = sum; sum += ex.b[i][1]; var to = sum;
          count(tb, from, to, 450);
        }, t); t += 600;
      });
      later(function () { tb.textContent = ex.bl; }, t);
      var sumA = 0; t += 200;
      $$('li', olA).forEach(function (li, i) {
        later(function () {
          li.classList.add('show');
          var from = sumA; sumA += ex.a[i][1]; count(ta, from, sumA, 350);
        }, t); t += 500;
      });
      later(function () { ta.textContent = ex.al; demo.classList.add('done'); }, t + 100);
    }
    function count(el, from, to, dur) {
      if (from === to) { el.textContent = T.fmt(to); return; }
      var st = performance.now();
      (function f(now) {
        var p = Math.min(1, (now - st) / dur);
        el.textContent = T.fmt(Math.round(from + (to - from) * p));
        if (p < 1) requestAnimationFrame(f);
      })(st);
    }
    $$('.tabs button', demo).forEach(function (b) {
      b.addEventListener('click', function () {
        exI = +b.getAttribute('data-ex');
        $$('.tabs button', demo).forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        play();
      });
    });
    var rp = $('#replay'); if (rp) rp.addEventListener('click', play);
    if ('IntersectionObserver' in window) {
      var dio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !played) { played = true; play(); dio.disconnect(); } });
      }, { threshold: 0.35 });
      dio.observe(demo);
    }
  }

  /* ---------- marketing story stepper ---------- */
  var story = $('#story');
  if (story) {
    story.classList.add('on');
    var tabs = $$('[role=tab]', story), panels = $$('.panel', story), cap = $('#storyCap'), si = 0, auto = !reduce, tmr = null, inView = false, DUR = 6500;
    function go(i, user) {
      si = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === si ? 'true' : 'false');
        t.tabIndex = k === si ? 0 : -1;
        var pr = $('.prog', t); pr.classList.remove('run'); void pr.offsetWidth;
      });
      panels.forEach(function (p, k) { p.classList.toggle('active', k === si); });
      if (cap) {
        var t = tabs[si];
        cap.innerHTML = '<b>' + si1(si) + $('b', t).textContent + '</b><p>' + $('.d', t).textContent + '</p>';
      }
      if (user) auto = false;
      schedule();
    }
    function si1(i) { return (i + 1) + '. '; }
    function schedule() {
      clearTimeout(tmr);
      if (!auto || !inView) return;
      var pr = $('.prog', tabs[si]); pr.style.setProperty('--dur', DUR + 'ms'); pr.classList.add('run');
      tmr = setTimeout(function () { go(si + 1); }, DUR);
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { go(k, true); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(si + 1, true); tabs[si].focus(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(si - 1, true); tabs[si].focus(); }
      });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting; schedule(); }); }, { threshold: 0.3 }).observe(story);
    }
    go(0);
  }

  /* ---------- software picker ---------- */
  var picker = $('#picker');
  if (picker) {
    var L = ZH ? {
      names: { booking: '預約・會員', internal: '內部管理', portal: '客戶入口', app: 'App', integrate: '串接・自動化', ai: 'AI 助理' },
      empty: ['先選你需要的', '從先期規劃（1–2 週，固定費用）開始', '選了之後，這裡會顯示通常的時程'],
      tiers: [['小型串接', '通常 2–4 週上線', '一個階段就能完成'], ['標準系統', '通常 6–10 週上線第一版', '分 2 個階段，每兩週可操作'], ['多端平台', '通常 10–16 週上線第一版', '分 2–3 個階段，先上最核心的部分']],
      disc: ['先期規劃', '1–2 週：流程地圖、可點擊原型、固定報價'],
      p1: '第一階段', p2: '第二階段', p3: '第三階段',
      core: { booking: '預約流程、會員資料、LINE 通知', internal: '訂單／庫存／排班後台與權限', portal: '客戶登入、進度查詢、文件下載', app: 'App 核心畫面與上架準備', integrate: '把現有系統串起來，告別人工重打', ai: '用你的文件做 AI 助理試作（真實資料兩週）' },
      later: '報表、權限細分、更多串接', launch: '上線、交接文件、操作教學',
      app: 'iOS／Android 上架', get: '<b>最後你會拿到：</b>', getItems: { booking: '線上預約與會員系統', internal: '內部管理後台', portal: '客戶入口網站', app: 'iOS／Android App', integrate: '自動化串接流程', ai: '讀你文件的 AI 助理' }, own: '程式碼、帳號、交接文件都歸你。',
      users: ['1–5 人', '6–30 人', '30 人以上／對外客戶'], plat: ['網頁', '手機 App', '網頁＋App'],
      msg: function (n, u, p) { return '我想了解：' + n + '。使用人數：' + u + '；平台：' + p + '。'; },
      cta: '用這些選項聯絡我們'
    } : {
      names: { booking: 'Booking & members', internal: 'Internal admin', portal: 'Client portal', app: 'App', integrate: 'Integrations & automation', ai: 'AI assistant' },
      empty: ['Pick what you need', 'Start with Discovery (1–2 weeks, fixed fee)', 'Pick options to see a typical timeline'],
      tiers: [['Small integration', 'Typically live in 2–4 weeks', 'Done in a single phase'], ['Standard system', 'Typically 6–10 weeks to a first version', 'Two phases, something usable every 2 weeks'], ['Multi-platform', 'Typically 10–16 weeks to a first version', '2–3 phases, the core ships first']],
      disc: ['Discovery', '1–2 weeks: process map, clickable prototype, fixed quote'],
      p1: 'Phase 1', p2: 'Phase 2', p3: 'Phase 3',
      core: { booking: 'Booking flow, member records, LINE/email reminders', internal: 'Orders / stock / scheduling admin with roles', portal: 'Client login, status tracking, documents', app: 'Core app screens and store prep', integrate: 'Connect the tools you already use, no more retyping', ai: 'AI assistant pilot on your real documents (two weeks)' },
      later: 'Reports, finer permissions, more integrations', launch: 'Launch, handover docs, training',
      app: 'iOS / Android store release', get: '<b>What you end up with:</b> ', getItems: { booking: 'online booking & member system', internal: 'internal admin', portal: 'client portal', app: 'iOS / Android app', integrate: 'automated integrations', ai: 'AI assistant on your own documents' }, own: 'Code, accounts and handover docs are yours.',
      users: ['1–5 people', '6–30 people', '30+ / external customers'], plat: ['Web', 'Mobile app', 'Web + app'],
      msg: function (n, u, p) { return 'I\'m interested in: ' + n + '. Users: ' + u + '. Platform: ' + p + '.'; },
      cta: 'Contact us with these choices'
    };
    var W = { booking: 2, internal: 2, portal: 2, app: 3, integrate: 1, ai: 2 };
    var elTier = $('#pkTier'), elWeeks = $('#pkWeeks'), elPh = $('#pkPhases'), elGet = $('#pkGet'), cta = $('#pkCta');
    function calc() {
      var needs = $$('input[name=need]:checked', picker).map(function (i) { return i.value; });
      var u = +($('input[name=users]:checked', picker) || { value: 0 }).value;
      var p = +($('input[name=plat]:checked', picker) || { value: 0 }).value;
      if (needs.indexOf('app') > -1 && p === 0) p = 1;
      var lis = '<li><b>' + L.disc[0] + '</b><span>' + L.disc[1] + '</span></li>';
      if (!needs.length) {
        elTier.textContent = L.empty[0];
        elWeeks.innerHTML = L.empty[1] + '<small>' + L.empty[2] + '</small>';
        elPh.innerHTML = lis;
        elGet.innerHTML = L.get + L.own;
        cta.removeAttribute('data-msg');
        return;
      }
      var score = needs.reduce(function (s, n) { return s + W[n]; }, 0) + u + p;
      var tier = score <= 3 ? 0 : score <= 7 ? 1 : 2;
      var t = L.tiers[tier];
      elTier.textContent = t[0];
      elWeeks.innerHTML = t[1] + '<small>' + t[2] + '</small>';
      var first = needs.slice(0, tier === 0 ? 2 : 2).map(function (n) { return L.core[n]; }).join(ZH ? '；' : '; ');
      lis += '<li><b>' + L.p1 + '</b><span>' + first + '</span></li>';
      if (tier >= 1) {
        var rest = needs.slice(2).map(function (n) { return L.core[n]; });
        if (p > 0 && needs.indexOf('app') === -1) rest.push(L.app);
        rest.push(L.later);
        lis += '<li><b>' + L.p2 + '</b><span>' + rest.join(ZH ? '；' : '; ') + '</span></li>';
      }
      lis += '<li><b>' + (tier === 2 ? L.p3 : tier === 1 ? (ZH ? '上線' : 'Launch') : (ZH ? '上線' : 'Launch')) + '</b><span>' + L.launch + '</span></li>';
      elPh.innerHTML = lis;
      elGet.innerHTML = L.get + needs.map(function (n) { return L.getItems[n]; }).join(ZH ? '、' : ', ') + (ZH ? '。' : '. ') + L.own;
      cta.setAttribute('data-msg', L.msg(needs.map(function (n) { return L.names[n]; }).join(ZH ? '、' : ', '), L.users[u], L.plat[p]));
    }
    picker.addEventListener('change', calc);
    cta.addEventListener('click', function () {
      // overwrite the message with the latest picker choices
      if (msg && cta.getAttribute('data-msg')) msg.value = cta.getAttribute('data-msg');
    }, true);
    calc();
  }

  /* ---------- contact form ---------- */
  if (form) {
    var status = $('.status', form), btn = $('button[type=submit]', form);
    var M = ZH ? {
      need: '請填寫姓名、有效的 Email 和想聊的內容。',
      sending: '傳送中…',
      ok: function (n) { return '謝謝您，' + n + '！訊息已送出，我們會在 1–2 個工作天內回覆。'; },
      err: '抱歉，訊息沒有送出成功。請直接寫信到 yufan@shiptolive.com。'
    } : {
      need: 'Please add your name, a valid email and a message.',
      sending: 'Sending…',
      ok: function (n) { return 'Thanks, ' + n.split(/\s+/)[0] + '! We\'ll reply within 1–2 business days.'; },
      err: 'Sorry, that didn\'t go through. Please email yufan@shiptolive.com directly.'
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim(), email = f.email.value.trim(), topic = f.topic.value, message = f.message.value.trim();
      var bad = [];
      if (!name) bad.push(f.name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.push(f.email);
      if (!message) bad.push(f.message);
      [f.name, f.email, f.message].forEach(function (el) { el.setAttribute('aria-invalid', bad.indexOf(el) > -1 ? 'true' : 'false'); });
      if (bad.length) { status.className = 'status err'; status.textContent = M.need; bad[0].focus(); return; }
      function success() { form.reset(); status.className = 'status ok'; status.textContent = M.ok(name); }
      if (f._honey.value) { success(); return; }
      status.className = 'status'; status.textContent = M.sending; btn.disabled = true;
      fetch('https://admin.shiptolive.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name: name, email: email, topic: topic, message: message, lang: root.lang, page: location.pathname })
      }).then(function (r) {
        if (r.ok) success(); else throw new Error('HTTP ' + r.status);
      }).catch(function () {
        status.className = 'status err'; status.textContent = M.err;
      }).then(function () { btn.disabled = false; });
    });
  }
})();
