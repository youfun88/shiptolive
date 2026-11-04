/* Layout 1 · Bento — interactions. Progressive enhancement: the page is complete without this file. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var zh = (doc.lang || '').indexOf('zh') === 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) doc.classList.add('motion');

  // rAF with a timer fallback (rAF can stall in background tabs / headless captures)
  function tick(fn) { var done = false; var t = setTimeout(function () { if (!done) { done = true; fn(performance.now()); } }, 34); requestAnimationFrame(function (ts) { if (!done) { done = true; clearTimeout(t); fn(ts); } }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- mobile menu ---------- */
  var hdr = $('.hdr'), mb = $('.menu-btn');
  if (hdr && mb) {
    mb.addEventListener('click', function () {
      var open = hdr.classList.toggle('open');
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('.mnav a').forEach(function (a) {
      a.addEventListener('click', function () { hdr.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* ---------- reveal + in-view hooks ---------- */
  var inviewCbs = [];
  function onView(el, cb) { inviewCbs.push({ el: el, cb: cb, done: false }); }
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        inviewCbs.forEach(function (o) {
          if (o.el === e.target) {
            o.visible = e.isIntersecting;
            if (e.isIntersecting && !o.done) { o.done = true; o.cb(true); }
            else if (o.done && o.cb.length) { o.cb(e.isIntersecting); }
          }
        });
      });
    }, { threshold: 0.25 });
    setTimeout(function () { inviewCbs.forEach(function (o) { io2.observe(o.el); }); }, 0);
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
    setTimeout(function () { inviewCbs.forEach(function (o) { o.cb(true); }); }, 0);
  }

  /* ---------- counters ---------- */
  $$('[data-count]').forEach(function (el) {
    if (reduce) return;
    var to = parseFloat(el.getAttribute('data-count'));
    var dec = (el.getAttribute('data-count').split('.')[1] || '').length;
    var suffix = el.getAttribute('data-suffix') || '';
    var fmt = function (v) { return (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suffix; };
    var started = false;
    onView(el, function () {
      if (started) return; started = true;
      var t0 = null, dur = 1600;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.firstChild.nodeValue = fmt(to * e);
        if (p < 1) tick(step);
      }
      el.firstChild.nodeValue = fmt(0);
      tick(step);
    });
  });

  /* ---------- hover tilt (desktop, fine pointer, motion OK) ---------- */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.tilt').forEach(function (el) {
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(1100px) rotateX(' + (-y * 4).toFixed(2) + 'deg) rotateY(' + (x * 5).toFixed(2) + 'deg) translateZ(0)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- hero: software mini-picker cycle ---------- */
  var mini = $('#miniPicker');
  if (mini) {
    // Same numbers as the main estimator: need range + default answers (6–30 users, web).
    var chips = $$('span[data-need]', mini), outW = $('#miniWeeks'), k = 0, timer = null;
    var defU = $('#picker input[name="users"][value="6-30"]'), defP = $('#picker input[name="plat"][value="web"]');
    var addU = defU ? +defU.dataset.add : 0, addP = defP ? +defP.dataset.add : 0;
    function weeks(need) {
      var n = $('#picker input[name="need"][value="' + need + '"]');
      if (!n) return '';
      var lo = +n.dataset.lo + addU + addP, hi = +n.dataset.hi + 2 * (addU + addP);
      return zh ? '通常 ' + lo + '–' + hi + ' 週' : 'Typically ' + lo + '–' + hi + ' weeks';
    }
    function showMini() {
      chips.forEach(function (c, i) { c.classList.toggle('on', i === k); });
      outW.textContent = weeks(chips[k].getAttribute('data-need'));
      k = (k + 1) % chips.length;
    }
    if (!reduce) onView(mini, function (vis) {
      clearInterval(timer);
      if (vis) { showMini(); timer = setInterval(showMini, 2200); }
    });
  }

  /* ---------- AI timers: 2:00:00 -> 0:10:00 with flow steps ---------- */
  function hms(s) {
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60);
    return h + ':' + (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x;
  }
  $$('[data-timer]').forEach(function (box) {
    var clock = $('.js-clock', box), items = $$('.flow li', box);
    if (!items.length && !clock) return;
    if (reduce) return;
    var running = false;
    function run() {
      if (running) return; running = true;
      var from = 7200, to = 600, dur = 3600, t0 = null;
      items.forEach(function (li) { li.classList.remove('on'); });
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 2.2);
        if (clock) clock.textContent = hms(from - (from - to) * e);
        var n = Math.min(items.length, Math.floor(p * items.length + 0.35));
        items.forEach(function (li, i) { li.classList.toggle('on', i < n); });
        if (p < 1) tick(step);
        else { items.forEach(function (li) { li.classList.add('on'); }); setTimeout(function () { running = false; }, 4000); }
      }
      if (clock) clock.textContent = hms(from);
      tick(step);
    }
    onView(box, function (vis) { if (vis) run(); });
    var replay = $('.js-replay', box);
    if (replay) replay.addEventListener('click', function () { running = false; run(); });
  });

  /* ---------- marketing story stepper ---------- */
  var story = $('#story');
  if (story) {
    var tabs = $$('[role="tab"]', story), panels = $$('.panel', story), list = $('.steps', story);
    var cur = 0, auto = null, DUR = 4200, userTook = false;
    list.style.setProperty('--dur', DUR + 'ms');
    function show(i, focus) {
      cur = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, j) {
        t.setAttribute('aria-selected', j === cur ? 'true' : 'false');
        t.tabIndex = j === cur ? 0 : -1;
        var bar = $('.bar i', t);
        if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
      });
      panels.forEach(function (p, j) { p.classList.toggle('on', j === cur); p.hidden = false; p.setAttribute('aria-hidden', j === cur ? 'false' : 'true'); });
      if (focus) tabs[cur].focus();
    }
    function play() { if (reduce || userTook) return; stop(); list.classList.add('playing'); auto = setInterval(function () { show(cur + 1); }, DUR); }
    function stop() { clearInterval(auto); auto = null; }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { userTook = true; stop(); list.classList.remove('playing'); show(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); userTook = true; stop(); list.classList.remove('playing'); show(cur + 1, true); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); userTook = true; stop(); list.classList.remove('playing'); show(cur - 1, true); }
      });
    });
    show(0);
    onView(story, function (vis) { if (vis) { show(cur); play(); } else stop(); });
  }

  /* ---------- software picker / estimator ---------- */
  var picker = $('#picker');
  if (picker) {
    var T = zh ? {
      none: '先選一到兩個你最想解決的問題，這裡會顯示通常的範圍與時程。',
      tiers: ['小型串接', '標準系統', '多端平台'],
      weeks: function (a, b) { return '通常 ' + a + '–' + b + ' 週'; },
      p1: '先期規劃（1–2 週，固定費用）：流程盤點、可點擊原型、書面規劃與固定報價',
      p2: function (a, b) { return '第一階段（約 ' + a + '–' + b + ' 週，每兩週交一版可以操作的進度）：'; },
      p3: '上線與交接：權限、紀錄、文件；之後的階段你決定要不要做',
      start: '建議從 1–2 週的先期規劃開始。',
      msg: '我有興趣的項目：',
      users: '使用人數', plat: '平台', time: '時程'
    } : {
      none: 'Pick one or two problems you most want solved, and the typical scope and timeline appear here.',
      tiers: ['Small integration', 'Standard system', 'Multi-platform build'],
      weeks: function (a, b) { return 'Typically ' + a + '–' + b + ' weeks'; },
      p1: 'Discovery (1–2 weeks, fixed fee): process map, clickable prototype, written plan and fixed quote',
      p2: function (a, b) { return 'Phase 1 (about ' + a + '–' + b + ' weeks, a working demo every 2 weeks): '; },
      p3: 'Launch and handover: access, logs, documentation. You decide whether to do later phases',
      start: 'We suggest starting with discovery (1–2 weeks).',
      msg: 'What I am interested in: ',
      users: 'Users', plat: 'Platform', time: 'Timeline'
    };
    var out = {
      tier: $('#rTier'), weeks: $('#rWeeks'), phases: $('#rPhases'), get: $('#rGet'), proof: $('#rProof'), cta: $('#rCta'), empty: $('#rEmpty'), body: $('#rBody')
    };
    function val(name) { var c = $('input[name="' + name + '"]:checked', picker); return c ? c : null; }
    var userChanged = false;
    function update() {
      var needs = $$('input[name="need"]:checked', picker);
      if (!needs.length) { out.empty.hidden = false; out.body.hidden = true; return; }
      out.empty.hidden = true; out.body.hidden = false;
      var lo = 0, hi = 0, gets = [], proofs = [], labels = [], score = 0;
      needs.forEach(function (n, i) {
        var a = +n.dataset.lo, b = +n.dataset.hi;
        lo = Math.max(lo, a); hi = Math.max(hi, b);
        gets.push(n.dataset.get); if (n.dataset.proof && proofs.indexOf(n.dataset.proof) < 0) proofs.push(n.dataset.proof);
        labels.push(n.dataset.label); score += +n.dataset.score;
      });
      if (needs.length > 1) { lo += needs.length - 1; hi += 2 * (needs.length - 1); }
      var u = val('users'), p = val('plat'), t = val('time');
      if (u) { lo += +u.dataset.add; hi += +u.dataset.add * 2; score += +u.dataset.add; }
      if (p) { lo += +p.dataset.add; hi += +p.dataset.add * 2; score += +p.dataset.add; }
      hi = Math.min(hi, 24); lo = Math.min(lo, hi - 2);
      var tier = score <= 2 ? 0 : score <= 5 ? 1 : 2;
      out.tier.textContent = T.tiers[tier];
      out.weeks.textContent = T.weeks(lo, hi);
      out.phases.innerHTML = '';
      [T.p1, T.p2(lo, hi) + labels.join(zh ? '、' : ', '), T.p3].forEach(function (s) { var li = document.createElement('li'); li.textContent = s; out.phases.appendChild(li); });
      out.get.textContent = gets.join(zh ? '；' : '; ');
      out.proof.textContent = proofs.length ? proofs.join(zh ? '、' : ', ') : '—';
      var extra = [];
      if (u) extra.push(T.users + ': ' + u.dataset.label);
      if (p) extra.push(T.plat + ': ' + p.dataset.label);
      if (t) extra.push(T.time + ': ' + t.dataset.label);
      var msg = T.msg + labels.join(zh ? '、' : ', ') + (extra.length ? '\n' + extra.join(' · ') : '') + '\n';
      out.cta.setAttribute('data-msg', msg);
      if (userChanged) try {
        var q = new URLSearchParams();
        q.set('need', needs.map(function (n) { return n.value; }).join(','));
        if (u) q.set('users', u.value); if (p) q.set('plat', p.value); if (t) q.set('time', t.value);
        history.replaceState(null, '', location.pathname + '?' + q.toString() + '#picker');
      } catch (e) {}
    }
    picker.addEventListener('change', function () { userChanged = true; update(); });
    // restore from URL
    try {
      var sp = new URLSearchParams(location.search);
      (sp.get('need') || '').split(',').forEach(function (v) { var el = $('input[name="need"][value="' + v + '"]', picker); if (el) el.checked = true; });
      ['users', 'plat', 'time'].forEach(function (k2) { var v = sp.get(k2); var el = v && $('input[name="' + k2 + '"][value="' + v + '"]', picker); if (el) el.checked = true; });
    } catch (e) {}
    update();
  }

  /* ---------- contact form + topic preselect ---------- */
  var form = $('#contactForm');
  function setTopic(topic, msg) {
    if (!form) return;
    var sel = form.elements.topic;
    if (topic) { for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].value === topic) { sel.selectedIndex = i; break; } } }
    if (msg && !form.elements.message.value.trim()) form.elements.message.value = msg;
  }
  $$('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () { setTopic(a.getAttribute('data-topic'), a.getAttribute('data-msg')); });
  });
  try { var tp = new URLSearchParams(location.search).get('topic'); if (tp) setTopic(tp); } catch (e) {}

  if (form) {
    var status = $('.status', form), btn = $('button[type="submit"]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'status';
      var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), message = form.elements.message.value.trim(), topic = form.elements.topic.value;
      if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = zh ? '請填寫姓名、正確的 Email 與訊息內容。' : 'Please fill in your name, a valid email and a message.';
        status.classList.add('err');
        var first = !name ? form.elements.name : (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? form.elements.email : form.elements.message;
        first.focus();
        return;
      }
      var first = name.split(/\s+/)[0];
      var okMsg = zh ? '謝謝您，' + name + '！訊息已送出，我們會在 1–2 個工作天內回覆。' : 'Thanks, ' + first + "! We'll reply within 1–2 business days.";
      if (form.elements._honey.value) { form.reset(); status.textContent = okMsg; status.classList.add('ok'); return; }
      btn.disabled = true;
      fetch('https://admin.shiptolive.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name: name, email: email, topic: topic, message: message, lang: doc.lang, page: location.pathname })
      }).then(function (r) {
        if (!r.ok) throw new Error('bad');
        form.reset(); status.textContent = okMsg; status.classList.add('ok');
      }).catch(function () {
        status.textContent = zh ? '抱歉，訊息沒有送出成功。請直接寫信到 yufan@shiptolive.com。' : "Sorry, the message didn't go through. Please email yufan@shiptolive.com directly.";
        status.classList.add('err');
      }).then(function () { btn.disabled = false; });
    });
  }
})();
