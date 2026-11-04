/* Layout 10 · Liquid Glass (round 2): photo crossfade, reveal, nav, hero loop, contact form. Vanilla, no deps. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var zh = /^zh/.test(doc.lang);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mq = function (q) { return window.matchMedia ? matchMedia(q).matches : false; };
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var noanim = doc.classList.contains('noanim');
  var hasIO = 'IntersectionObserver' in window;
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };

  /* ---------- reveal: panels rise with a spring ---------- */
  var rises = $$('.rise');
  if (reduce || noanim || !hasIO) {
    rises.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
    rises.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- fixed photo stack: crossfade to the scene under the viewport centre ---------- */
  var layers = {};
  $$('.bg').forEach(function (b) { layers[b.getAttribute('data-bg')] = b; });
  // scene key -> [layer, deep tint?]
  var map = { hero: ['hero', false], mk: ['mk', false], mk2: ['mk', true], sw: ['sw', false], ai: ['ai', false], end: ['hero', true] };
  var order = ['hero', 'mk', 'sw', 'ai'];
  var scenes = $$('[data-bgk]');
  var loaded = {};
  function load(name) {
    var b = layers[name];
    if (!b || loaded[name]) return; loaded[name] = true;
    $$('[data-srcset]', b).forEach(function (el) { el.setAttribute('srcset', el.getAttribute('data-srcset')); el.removeAttribute('data-srcset'); });
    var img = $('img', b); if (img && !img.getAttribute('src')) { var ss = img.getAttribute('srcset') || ''; var first = ss.split(',').pop().trim().split(' ')[0]; img.setAttribute('src', first); }
  }
  var curKey = null;
  function setScene(key) {
    if (key === curKey) return; curKey = key;
    var m = map[key] || map.hero;
    Object.keys(layers).forEach(function (n) {
      layers[n].classList.toggle('on', n === m[0]);
      layers[n].classList.toggle('deep', n === m[0] && m[1]);
    });
    load(m[0]);
    var i = order.indexOf(m[0]); if (i > -1 && order[i + 1]) load(order[i + 1]); // preload the next photo
  }
  function sceneAt() {
    var y = window.innerHeight * 0.5, k = 'hero';
    for (var i = 0; i < scenes.length; i++) { var r = scenes[i].getBoundingClientRect(); if (r.top <= y && r.bottom > y) { k = scenes[i].getAttribute('data-bgk'); break; } if (r.top > y) break; k = scenes[i].getAttribute('data-bgk'); }
    return k;
  }

  /* ---------- tab bar highlight ---------- */
  var bar = $('.tabbar'), pill = bar && $('.pill', bar), tabs = bar ? $$('a[data-tab]', bar) : [], curTab;
  var secs = $$('[data-sec]');
  function placePill() {
    var a = curTab && $('a[data-tab="' + curTab + '"]', bar);
    tabs.forEach(function (t) { t.setAttribute('aria-current', t === a ? 'true' : 'false'); });
    if (!a) { bar.classList.remove('has'); return; }
    bar.classList.add('has');
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
  }
  function tabAt() {
    var y = window.innerHeight * 0.45, n = null;
    secs.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= y && r.bottom > y) n = s.getAttribute('data-sec'); });
    return n;
  }

  /* ---------- desktop nav: backing bar once scrolled; hide on scroll down, show on scroll up ---------- */
  var lastY = window.scrollY || 0;
  function navState() {
    var y = window.scrollY || 0;
    doc.classList.toggle('scrolled', y > 40);
    if (mq('(min-width: 900px)')) {
      if (y > lastY + 6 && y > 200) doc.classList.add('nav-up');
      else if (y < lastY - 6 || y < 200) doc.classList.remove('nav-up');
    } else doc.classList.remove('nav-up');
    lastY = y;
  }

  /* ---------- hero zoom (transform only) ---------- */
  var heroP = $('[data-par="hero"]'), heroSec = $('.hero');
  function heroZoom() {
    if (!heroP || reduce || noanim) return;
    var k = Math.min(Math.max((window.scrollY || 0) / window.innerHeight, 0), 1.2);
    heroP.style.transform = 'scale(' + (1 + k * 0.08).toFixed(3) + ') translate3d(0,' + (k * -2).toFixed(2) + '%,0)';
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    raf(function () {
      ticking = false;
      setScene(sceneAt());
      if (bar) { var t = tabAt(); if (t !== curTab) { curTab = t; placePill(); } }
      navState();
      heroZoom();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { if (bar) placePill(); onScroll(); }, { passive: true });
  setScene(sceneAt());
  load('mk');
  if (bar) { curTab = tabAt(); placePill(); }
  navState(); heroZoom();

  /* ---------- pointer highlight on glass (desktop only) ---------- */
  if (mq('(hover: hover) and (pointer: fine)') && !reduce) {
    $$('.glass.lit').forEach(function (g) {
      g.addEventListener('pointermove', function (e) {
        var r = g.getBoundingClientRect();
        g.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        g.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- hero loop: muted, inline, only while the hero is on screen, never under reduced motion ---------- */
  var heroLayer = layers.hero;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (heroLayer && heroSec && !reduce && !saveData && hasIO && mq('(orientation: landscape)')) {
    var v = null;
    var mk = function () {
      v = document.createElement('video');
      v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true; v.preload = 'metadata';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
      v.addEventListener('playing', function () { v.classList.add('on'); }, { once: true });
      v.addEventListener('error', function () { if (v && v.parentNode) v.parentNode.removeChild(v); v = null; }, true);
      v.src = '/pending/redesign/shared/r2/video/l10-hero.mp4';
      heroP.appendChild(v);
    };
    var vo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { if (!v) mk(); if (v && v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
        else if (v && !v.paused) v.pause();
      });
    }, { threshold: 0.05 });
    // existence check first, so a missing loop falls back silently to the still
    fetch('/pending/redesign/shared/r2/video/l10-hero.mp4', { method: 'HEAD' }).then(function (r) { if (r.ok) vo.observe(heroSec); }).catch(function () {});
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
    var emailOk = function (s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); };
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
