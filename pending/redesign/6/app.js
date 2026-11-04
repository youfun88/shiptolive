/* Layout 6 (Apple product page). Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var zh = doc.lang.indexOf('zh') === 0;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = mq.matches || /[?&]noanim\b/.test(location.search);
  doc.classList.add('js');
  if (reduce) doc.classList.add('reduce');

  /* ---------- Mobile menu ---------- */
  var mb = $('.menu-btn'), menu = $('#menu');
  function setMenu(open) {
    mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    mb.setAttribute('aria-label', open ? (zh ? '關閉選單' : 'Close menu') : (zh ? '開啟選單' : 'Open menu'));
    document.body.classList.toggle('menu-open', open);
    if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('open'); }); }
    else { menu.classList.remove('open'); menu.hidden = true; }
  }
  if (mb && menu) {
    mb.addEventListener('click', function () { setMenu(mb.getAttribute('aria-expanded') !== 'true'); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); mb.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 833 && !menu.hidden) setMenu(false); });
  }

  /* ---------- Reveal on enter (elements already in view show at once) ---------- */
  var rvs = $$('.rv, .ba');
  if (reduce || !('IntersectionObserver' in window)) { rvs.forEach(function (el) { el.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    rvs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in'); else io.observe(el);
    });
  }

  /* ---------- Scroll-linked scale/opacity on big visuals ---------- */
  var scrubs = $$('[data-scrub]');
  if (!reduce && scrubs.length) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight;
      scrubs.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        // 0 when the top enters the bottom of the viewport, 1 when it reaches 35% from the top
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.65)));
        var e = 1 - Math.pow(1 - p, 3);
        el.style.transform = 'scale(' + (0.88 + 0.12 * e).toFixed(4) + ')';
        el.style.opacity = (0.35 + 0.65 * e).toFixed(3);
      });
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Service carousel ---------- */
  var gallery = $('.gallery'), track = $('#track');
  if (gallery && track) {
    var cards = $$('.card', track), dots = $$('.dot', gallery), playBtn = $('.play', gallery);
    var idx = 0, playing = !reduce, visible = true, userPaused = reduce;
    var setActive = function (i) {
      if (i === idx && cards[i].classList.contains('is-active')) return;
      idx = i;
      cards.forEach(function (c, k) { c.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) {
        if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
        var f = d.querySelector('i'); // restart the progress animation
        f.style.animation = 'none'; void f.offsetWidth; f.style.animation = '';
      });
      syncVideos();
    };
    var goTo = function (i, smooth) {
      i = (i + cards.length) % cards.length;
      var left = cards[i].offsetLeft - cards[0].offsetLeft;
      track.scrollTo({ left: left, behavior: smooth && !reduce ? 'smooth' : 'auto' });
      setActive(i);
    };
    var refresh = function () {
      var on = playing && visible;
      gallery.classList.toggle('playing', playing);
      gallery.classList.toggle('held', playing && !visible);
      playBtn.setAttribute('aria-label', playing ? playBtn.getAttribute('data-l-pause') : playBtn.getAttribute('data-l-play'));
      return on;
    };
    // The active dot's fill animation is the clock: when it ends, advance.
    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { goTo(k, true); });
      d.querySelector('i').addEventListener('animationend', function () {
        if (playing && visible && k === idx) goTo(idx + 1, true);
      });
    });
    playBtn.addEventListener('click', function () { playing = !playing; userPaused = !playing; refresh(); });
    // Track scroll -> active card
    var st = false;
    track.addEventListener('scroll', function () {
      if (st) return; st = true;
      requestAnimationFrame(function () {
        st = false;
        var x = track.scrollLeft, best = 0, bd = Infinity;
        cards.forEach(function (c, k) { var d = Math.abs(c.offsetLeft - cards[0].offsetLeft - x); if (d < bd) { bd = d; best = k; } });
        if (best !== idx) setActive(best);
      });
    }, { passive: true });
    // Stop auto-advance while the user is touching / hovering the track
    track.addEventListener('pointerdown', function () { if (playing) { playing = false; refresh(); } });
    // Pause when off-screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; refresh(); syncVideos(); }, { threshold: 0.25 }).observe(gallery);
    }
    if (mq.addEventListener) mq.addEventListener('change', function (e) { if (e.matches) { playing = false; userPaused = true; refresh(); syncVideos(); } });
    document.addEventListener('visibilitychange', function () { syncVideos(); });

    /* Video loops on the black cards: only if the file exists, never under reduced motion or Save-Data */
    var saveData = navigator.connection && navigator.connection.saveData;
    var vids = [];
    function syncVideos() {
      vids.forEach(function (v) {
        var want = visible && !document.hidden && v.card === cards[idx] && !mq.matches && !reduce;
        if (want) { var p = v.el.play(); if (p && p.catch) p.catch(function () {}); }
        else v.el.pause();
      });
    }
    // Desktop/tablet only: the loops are 16:9, the phone card uses a portrait still.
    if (!reduce && !saveData && window.fetch && window.matchMedia('(min-width:735px)').matches) {
      cards.forEach(function (card) {
        var src = card.getAttribute('data-video');
        if (!src) return;
        fetch(src, { method: 'HEAD' }).then(function (r) {
          if (!r.ok) return;
          var img = card.querySelector('.media img');
          var v = document.createElement('video');
          v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
          v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
          v.poster = img.currentSrc || img.src;
          v.addEventListener('playing', function () { v.classList.add('on'); }, { once: true });
          v.addEventListener('error', function () { v.remove(); });
          v.src = src;
          card.querySelector('.media').appendChild(v);
          vids.push({ el: v, card: card });
          syncVideos();
        }).catch(function () {});
      });
    }

    setActive(0);
    refresh();
  }

  /* ---------- Horizontal strips with arrows ---------- */
  $$('.arrow').forEach(function (b) {
    var strip = document.getElementById(b.getAttribute('data-for'));
    if (!strip) return;
    b.addEventListener('click', function () {
      var item = strip.firstElementChild, step = item ? item.getBoundingClientRect().width + 20 : 300;
      strip.scrollBy({ left: b.classList.contains('next') ? step : -step, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  $$('.strip').forEach(function (strip) {
    var btns = $$('.arrow[data-for="' + strip.id + '"]');
    if (!btns.length) return;
    var upd = function () {
      var max = strip.scrollWidth - strip.clientWidth - 2;
      btns.forEach(function (b) { b.disabled = b.classList.contains('prev') ? strip.scrollLeft <= 2 : strip.scrollLeft >= max; });
    };
    strip.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener('resize', upd); upd();
  });

  /* ---------- Why cards (+) ---------- */
  $$('.plus').forEach(function (b) {
    var panel = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
      if (open) { panel.classList.remove('anim'); void panel.offsetWidth; panel.classList.add('anim'); }
    });
  });

  /* ---------- Segmented control: what we can build ---------- */
  var picker = $('#picker');
  if (picker) {
    var D = zh ? [
      ['6–10', '週', '預約流程、會員資料、LINE 通知。', '預約與會員系統'],
      ['6–10', '週', '訂單、庫存、排班後台與權限。', '內部管理系統'],
      ['8–12', '週', '客戶登入、進度查詢、文件下載。', '客戶專區'],
      ['10–16', '週', 'iOS／Android 的核心畫面與上架準備。', 'App'],
      ['2–4', '週', '把現有系統串起來，不再人工重打。', '系統串接與自動化'],
      ['2', '週試作', '先用你的真實資料試作，確認準確再擴大。', 'AI 助理']
    ] : [
      ['6–10', 'weeks', 'Booking flow, member records, LINE or email reminders.', 'a booking and membership system'],
      ['6–10', 'weeks', 'Orders, stock and scheduling admin, with roles.', 'an internal admin system'],
      ['8–12', 'weeks', 'Client login, status tracking, document downloads.', 'a client portal'],
      ['10–16', 'weeks', 'Core iOS / Android screens and store prep.', 'an app'],
      ['2–4', 'weeks', 'Connect the tools you already use. No more retyping.', 'integrations and automation'],
      ['2', 'week pilot', 'A pilot on your real documents first, then we scale it.', 'an AI assistant']
    ];
    var seg = $('.seg', picker), thumb = $('.seg-thumb', picker), tabs = $$('[role="tab"]', picker), out = $('.pick-out', picker);
    var cta = $('#pkCta');
    var place = function (t) { thumb.style.width = t.offsetWidth + 'px'; thumb.style.transform = 'translateX(' + t.offsetLeft + 'px)'; };
    var pick = function (k, focus) {
      tabs.forEach(function (t, i) { t.setAttribute('aria-selected', i === k ? 'true' : 'false'); t.tabIndex = i === k ? 0 : -1; });
      place(tabs[k]);
      if (focus) tabs[k].focus();
      var d = D[k];
      $('#pkW').textContent = d[0]; $('#pkU').textContent = d[1]; $('#pkWhat').textContent = d[2];
      cta.setAttribute('data-msg', zh ? '我想做' + d[3] + '（網站上顯示：通常 ' + d[0] + ' ' + d[1] + '）。我們的情況是：' : "I'd like to build " + d[3] + ' (your site says typically ' + d[0] + ' ' + d[1] + '). Our situation: ');
      out.classList.remove('swap'); void out.offsetWidth; out.classList.add('swap');
      // keep the selected segment visible on narrow screens
      var wrap = seg.parentNode, l = tabs[k].offsetLeft + seg.offsetLeft, r = l + tabs[k].offsetWidth;
      if (l < wrap.scrollLeft || r > wrap.scrollLeft + wrap.clientWidth) wrap.scrollTo({ left: l - 24, behavior: reduce ? 'auto' : 'smooth' });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); pick((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); pick((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
    thumb.style.transition = 'none'; pick(0); out.classList.remove('swap');
    requestAnimationFrame(function () { thumb.style.transition = ''; });
    window.addEventListener('resize', function () { place(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]); });
  }

  /* ---------- Contact form (BRIEF §5) ---------- */
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
    var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'status';
      var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), message = form.elements.message.value.trim(), topic = form.elements.topic.value;
      if (!name || !email || !message || !emailOk(email)) {
        status.textContent = zh ? '請填寫姓名、正確的 Email 與訊息內容。' : 'Please fill in your name, a valid email and a message.';
        status.classList.add('err');
        (!name ? form.elements.name : !emailOk(email) ? form.elements.email : form.elements.message).focus();
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
