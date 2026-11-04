/* Ship to Live — redesign draft 3 「Editorial」. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var lang = (doc.lang || 'zh-Hant').indexOf('zh') === 0 ? 'zh' : 'en';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  if (!reduce && hasIO) doc.classList.add('motion');
  var motion = doc.classList.contains('motion');

  /* timer-driven frames (setTimeout keeps working in background tabs and headless captures) */
  function tick(fn) { return setTimeout(fn, 16); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- mobile menu ---------- */
  var menuBtn = $('.menu-btn'), nav = $('#siteNav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? menuBtn.getAttribute('data-close') : menuBtn.getAttribute('data-open');
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = menuBtn.getAttribute('data-open');
      });
    });
  }

  /* ---------- in-view observer ---------- */
  function onIn(el) {
    el.classList.add('in');
    if (el.classList.contains('step-5') && motion) {
      setTimeout(function () { el.classList.add('approved'); }, 2400);
    }
  }
  var targets = $$('.reveal, .step, [data-io]');
  if (hasIO) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { onIn(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(onIn);
  }

  /* ---------- mobile booking dock: after the cover, hidden once contact is reached ---------- */
  var dock = $('.dock'), cover = $('.cover'), contact = $('#contact');
  if (dock && cover && contact) {
    var dockTick = false;
    var dockUpd = function () {
      dockTick = false;
      var show = cover.getBoundingClientRect().bottom < 0 && contact.getBoundingClientRect().top > window.innerHeight;
      dock.classList.toggle('show', show);
    };
    window.addEventListener('scroll', function () { if (!dockTick) { dockTick = true; setTimeout(dockUpd, 50); } }, { passive: true });
    window.addEventListener('resize', dockUpd);
    dockUpd();
  }

  /* ---------- timeline progress line ---------- */
  var tl = $('.timeline');
  if (tl && motion) {
    var bar = $('.progress', tl), ticking = false;
    var upd = function () {
      ticking = false;
      var r = tl.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.6 - r.top) / r.height;
      bar.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* ---------- before / after workflow demo ---------- */
  function runBA(box) {
    if (reduce) return;
    var cols = $$('.ba-col', box);
    var data = cols.map(function (c) {
      return {
        col: c,
        items: $$('.tasks li', c).map(function (li) {
          return { li: li, a: parseFloat(li.dataset.a), b: parseFloat(li.dataset.b) };
        }),
        clock: $('.clock .v', c),
        meter: $('.meter', c),
        sent: $('.sent', c),
        offset: parseFloat(c.dataset.offset || '0'),
        total: parseFloat(c.dataset.total),
        end: parseFloat(c.dataset.end)
      };
    });
    if (box._raf) clearTimeout(box._raf);
    box.classList.add('armed');
    var DUR = 9000, t0 = Date.now();
    function paint(T) {
      data.forEach(function (d) {
        var shown = Math.max(0, Math.min(T, d.end) - d.offset);
        shown = Math.min(shown, d.total);
        d.clock.textContent = Math.round(shown);
        d.meter.style.setProperty('--m', (shown / d.total).toFixed(3));
        d.items.forEach(function (it) {
          it.li.classList.toggle('done', T >= it.b);
          it.li.classList.toggle('now', T >= it.a && T < it.b);
        });
        d.sent.classList.toggle('show', T >= d.end);
      });
    }
    function frame() {
      var p = Math.min(1, (Date.now() - t0) / DUR);
      paint(120 * p * p);
      if (p < 1) box._raf = tick(frame);
    }
    paint(0);
    box._raf = tick(frame);
  }
  var replay = $('.ba-replay');
  if (replay) {
    if (reduce) replay.hidden = true;
    replay.addEventListener('click', function () { runBA(replay.closest('.ba')); });
  }

  /* ---------- contact form + topic preselect ---------- */
  var form = $('#contactForm');
  function setTopic(key) {
    if (!form || !key) return;
    var sel = form.elements.topic;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].getAttribute('data-k') === key) { sel.selectedIndex = i; return true; }
    }
  }
  try {
    var q = new URLSearchParams(location.search).get('topic');
    if (q) setTopic(q);
  } catch (e) {}
  $$('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () { setTopic(a.getAttribute('data-topic')); });
  });

  var MSG = {
    zh: {
      ok: function (n) { return '謝謝您，' + n + '！訊息已送出，我們會在 1–2 個工作天內回覆。'; },
      fail: '抱歉，訊息沒有送出成功。請直接寫信到 yufan@shiptolive.com。',
      missing: '請填寫姓名、Email 與訊息。',
      sending: '傳送中…'
    },
    en: {
      ok: function (n) { return 'Thanks, ' + n + '! We’ll reply within 1–2 business days.'; },
      fail: 'Sorry, the message didn’t go through. Please email yufan@shiptolive.com directly.',
      missing: 'Please fill in your name, email and message.',
      sending: 'Sending…'
    }
  }[lang];

  if (form) {
    var status = $('.status', form), btn = $('button[type="submit"]', form);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim(), email = f.email.value.trim(), message = f.message.value.trim(), topic = f.topic.value;
      status.className = 'status';
      if (!name || !email || !message || !f.email.checkValidity()) {
        status.textContent = MSG.missing; status.classList.add('err'); return;
      }
      var first = lang === 'en' ? name.split(/\s+/)[0] : name;
      if (f._honey.value) { form.reset(); status.textContent = MSG.ok(first); status.classList.add('ok'); return; }
      btn.disabled = true; status.textContent = MSG.sending;
      fetch('https://admin.shiptolive.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name: name, email: email, topic: topic, message: message, lang: doc.lang, page: location.pathname })
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        form.reset(); status.textContent = MSG.ok(first); status.classList.add('ok');
      }).catch(function () {
        status.textContent = MSG.fail; status.classList.add('err');
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ---------- software picker ---------- */
  var picker = $('#picker');
  if (!picker) return;
  var S = {
    zh: {
      need: { booking: '預約／會員系統', internal: '內部管理系統', portal: '客戶入口網站', app: 'iOS／Android App', integrate: '資料串接與自動化', ai: 'AI 助理（讀你自己的文件）', rescue: '救援或翻新現有系統' },
      users: { s: '1–5 人', m: '6–30 人', l: '30 人以上' },
      platform: { web: '網頁', mobile: '手機 App', both: '網頁＋App' },
      when: { asap: '盡快', q: '3 個月內', explore: '只是先了解' },
      tiers: ['小型專案', '標準系統', '多端平台'],
      tierSub: ['一個串接或一個核心功能', '一套有後台、有權限的系統', '網頁、App 與後台一起規劃'],
      wk: '週', typical: '第一階段，通常',
      full: '完整範圍通常 4–6 個月，分 2–3 個階段',
      phases: function (first, rest, w) {
        return ['先期規劃 1–2 週（固定費用）：流程圖、可點擊原型、固定報價',
          '第一階段 ' + w + ' 週：先做「' + first + '」，每兩週交一版可以操作的進度',
          rest ? '下一階段（你決定要不要做）：' + rest : '之後依實際使用回饋，再決定下一步',
          '上線與交接：權限、紀錄、交接文件'];
      },
      get: { booking: '線上預約、提醒通知與會員資料', internal: '管理後台、角色權限與操作紀錄', portal: '客戶自己登入查進度、下載文件', app: 'iOS／Android App 上架', integrate: '系統之間自動同步，不再手動重打', ai: '讀你自己文件的 AI 助理，能看什麼事先設定好', rescue: '現有系統的健檢報告，修好後正式上線' },
      own: '原始碼、帳號、網域與資料，全部在你名下',
      tools: { excel: 'Excel 裡的資料可以匯入，不用重打。', line: '可以接 LINE 官方帳號的通知與預約。', saas: '先確認你現在用的雲端軟體能不能做到；能的話我們會直說，只做缺的那一塊。', paper: '先把紙本流程畫成流程圖，再決定哪些值得數位化。' },
      aiNote: 'AI 助理會先用你的真實資料做 2 週試作，確認準確度再擴大。',
      rescueNote: '接手前先花約 1 週讀懂現有程式碼，再告訴你修還是重寫比較划算。',
      first: { go: '建議從 1–2 週的先期規劃（固定費用）開始：就算之後不繼續，規劃書和原型都歸你。', explore: '先約免費 20 分鐘諮詢，聊完再決定要不要做先期規劃。' },
      work: { leadx: 'LEADx · EQ 360 評量平台（評量引擎、計分、管理後台、點數系統）', gohike: '山行接駁 Go Hike（接駁預約網站，102 條路線與價格）' },
      dt: { step: '建議第一步', phases: '典型階段', get: '最後你會拿到', note: '提醒', work: '類似的作品' },
      msg: function (o) { return '我在網站上做了評估：\n需求：' + o.needs + '\n使用人數：' + o.users + '\n平台：' + o.platform + '\n時程：' + o.when + '\n（評估結果：' + o.tier + '，第一階段通常 ' + o.w + ' 週）\n\n想多說明的是：'; },
      join: '、'
    },
    en: {
      need: { booking: 'Booking / membership', internal: 'Internal admin system', portal: 'Client portal', app: 'iOS / Android app', integrate: 'Integrations & automation', ai: 'AI assistant on your own documents', rescue: 'Rescue or rebuild an existing system' },
      users: { s: '1–5 people', m: '6–30 people', l: '30+ people' },
      platform: { web: 'Web', mobile: 'Mobile app', both: 'Web + app' },
      when: { asap: 'As soon as possible', q: 'Within 3 months', explore: 'Just exploring' },
      tiers: ['Small project', 'Standard system', 'Multi-platform'],
      tierSub: ['One integration or one core feature', 'A system with an admin side and permissions', 'Web, app and admin planned together'],
      wk: 'weeks', typical: 'Phase one, typically',
      full: 'The full scope usually takes 4–6 months, in 2–3 phases',
      phases: function (first, rest, w) {
        return ['Discovery, 1–2 weeks (fixed fee): process map, clickable prototype, fixed quote',
          'Phase one, ' + w + ' weeks: “' + first + '” first, with a working version every two weeks',
          rest ? 'Next phase (your call): ' + rest : 'After that, real usage decides the next step',
          'Launch and handover: permissions, logs, handover docs'];
      },
      get: { booking: 'Online booking, reminders and member records', internal: 'An admin back office with roles and an audit log', portal: 'Clients log in to check status and download files', app: 'iOS / Android apps live on the stores', integrate: 'Systems that sync on their own, no retyping', ai: 'An AI assistant that reads your documents, with access scoped up front', rescue: 'A health report on the existing system, then the fixed version live' },
      own: 'Code, accounts, domains and data, all in your name',
      tools: { excel: 'Your Excel data can be imported, no retyping.', line: 'We can connect LINE official-account notifications and booking.', saas: 'We check first whether the software you already pay for can do it. If it can, we say so and build only the missing piece.', paper: 'We map the paper process first, then decide what is worth digitising.' },
      aiNote: 'AI assistants start with a 2-week trial on your real data, so you see the accuracy before scaling up.',
      rescueNote: 'We spend about a week reading the existing code first, then tell you whether fixing or rewriting is the better deal.',
      first: { go: 'Start with Discovery (1–2 weeks, fixed fee). Even if you stop there, the plan and prototype are yours.', explore: 'Start with the free 20-minute call, then decide whether Discovery makes sense.' },
      work: { leadx: 'LEADx · EQ 360 assessment platform (assessment engine, scoring, admin console, credit system)', gohike: 'Go Hike shuttle booking site (102 routes with prices)' },
      dt: { step: 'Suggested first step', phases: 'Typical phases', get: 'What you get at the end', note: 'Good to know', work: 'Similar work' },
      msg: function (o) { return 'I used the estimator on your site:\nNeeds: ' + o.needs + '\nUsers: ' + o.users + '\nPlatform: ' + o.platform + '\nTiming: ' + o.when + '\n(Result: ' + o.tier + ', phase one typically ' + o.w + ' weeks)\n\nMore context: '; },
      join: ', '
    }
  }[lang];

  var W = { integrate: 1, ai: 2, booking: 2, internal: 2, portal: 2, rescue: 2, app: 3 };
  var ORDER = ['booking', 'internal', 'portal', 'app', 'integrate', 'ai', 'rescue'];
  var memo = $('#memo'), out = $('#memoOut'), empty = $('#memoEmpty'), last = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function compute() {
    var fd = new FormData(picker);
    var needs = fd.getAll('need').sort(function (a, b) { return ORDER.indexOf(a) - ORDER.indexOf(b); });
    var users = fd.get('users') || 'm', platform = fd.get('platform') || 'web', when = fd.get('when') || 'q';
    var tools = fd.getAll('tools');
    if (!needs.length) { out.hidden = true; empty.hidden = false; last = null; return; }
    var score = 0;
    needs.forEach(function (n) { score += W[n]; });
    if (users === 'l') score += 1;
    if (platform === 'both') score += 2;
    if (platform === 'mobile' && needs.indexOf('app') < 0) score += 1;
    var tier = score <= 2 ? 0 : score <= 5 ? 1 : 2;
    var w = ['3–6', '6–10', '8–12'][tier];
    var names = needs.map(function (n) { return S.need[n]; });
    var first = names[0], rest = names.slice(1).join(S.join);
    var gets = needs.map(function (n) { return S.get[n]; });
    gets.push(S.own);
    var notes = [];
    if (needs.indexOf('ai') >= 0) notes.push(S.aiNote);
    if (needs.indexOf('rescue') >= 0) notes.push(S.rescueNote);
    tools.forEach(function (t) { if (S.tools[t]) notes.push(S.tools[t]); });
    if (tier === 2) notes.push(S.full + (lang === 'zh' ? '。' : '.'));
    var work = [];
    if (needs.some(function (n) { return n === 'internal' || n === 'portal' || n === 'app'; })) work.push(S.work.leadx);
    if (needs.indexOf('booking') >= 0) work.push(S.work.gohike);

    var h = '';
    h += '<h3>' + esc(S.tiers[tier]) + '</h3><p class="small" style="margin:0">' + esc(S.tierSub[tier]) + '</p>';
    h += '<p class="weeks">' + w + ' <small>' + esc(S.wk) + '</small></p><p class="small" style="margin:0">' + esc(S.typical) + '</p>';
    h += '<dl>';
    h += '<div><dt>' + esc(S.dt.step) + '</dt><dd>' + esc(when === 'explore' ? S.first.explore : S.first.go) + '</dd></div>';
    h += '<div><dt>' + esc(S.dt.phases) + '</dt><dd><ol>' + S.phases(first, rest, w).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol></dd></div>';
    h += '<div><dt>' + esc(S.dt.get) + '</dt><dd><ul>' + gets.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></dd></div>';
    if (notes.length) h += '<div><dt>' + esc(S.dt.note) + '</dt><dd><ul>' + notes.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></dd></div>';
    if (work.length) h += '<div><dt>' + esc(S.dt.work) + '</dt><dd><ul>' + work.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></dd></div>';
    h += '</dl>';
    out.innerHTML = h;
    out.hidden = false; empty.hidden = true;
    memo.classList.remove('flash'); void memo.offsetWidth; memo.classList.add('flash');
    last = {
      needs: names.join(S.join), users: S.users[users], platform: S.platform[platform], when: S.when[when],
      tier: S.tiers[tier], w: w
    };
  }
  picker.addEventListener('change', compute);
  compute();

  var send = $('#memoSend');
  if (send) send.addEventListener('click', function () {
    setTopic('software');
    if (last && form) {
      var m = form.elements.message;
      if (!m.value.trim()) m.value = S.msg(last);
    }
  });
})();
