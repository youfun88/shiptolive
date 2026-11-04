/* Layout 7 · Cinematic. Progressive enhancement: the page is complete without this file. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var zh = (doc.lang || '').indexOf('zh') === 0;
  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  var reduce = mq('(prefers-reduced-motion: reduce)') || /[?&]noanim\b/.test(location.search);
  if (!reduce) doc.classList.add('motion');
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* ---------- hero intro ---------- */
  var hero = $('.hero');
  if (hero) setTimeout(function () { hero.classList.add('in'); }, reduce ? 0 : 150);

  /* ---------- in-view reveals (one-shot) ---------- */
  var revealEls = $$('.reveal, [data-chapter]');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -22% 0px', threshold: 0 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- scroll-linked scenes (rAF-throttled, transform/opacity only) ---------- */
  var hdr = $('#hdr');
  var heroMedia = $('[data-hero-media]'), heroCopy = $('[data-hero-copy]');
  var chapters = $$('[data-chapter]').map(function (el) {
    return { el: el, media: $('[data-ch-media]', el), dim: $('[data-ch-dim]', el), copy: $('[data-ch-copy]', el) };
  });
  var tiltEl = $('[data-tilt] picture'), tiltWrap = $('[data-tilt]');
  var lites = $$('[data-lite]');
  var vh = window.innerHeight, desk = false, ticking = false;

  function measure() {
    vh = window.innerHeight;
    desk = mq('(min-width: 900px) and (min-aspect-ratio: 1/1)');
    if (!desk) chapters.forEach(function (c) { c.media.style.transform = ''; c.dim.style.opacity = ''; c.copy.style.transform = ''; });
  }

  function frame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (hdr) hdr.classList.toggle('solid', y > vh * 0.55);
    if (reduce) return;

    // --- reads ---
    var ch = desk ? chapters.map(function (c) { return c.el.getBoundingClientRect(); }) : null;
    var tr = tiltWrap ? tiltWrap.getBoundingClientRect() : null;
    var lr = lites.map(function (li) { return li.getBoundingClientRect().top; });

    // --- writes ---
    if (heroMedia && y < vh * 1.2) {
      var p = clamp(y / vh);
      heroMedia.style.transform = 'translate3d(0,' + (p * vh * 0.28).toFixed(1) + 'px,0) scale(' + (1 + p * 0.12).toFixed(4) + ')';
      heroCopy.style.opacity = (1 - p * 1.5).toFixed(3);
      heroCopy.style.transform = 'translate3d(0,' + (-p * 70).toFixed(1) + 'px,0)';
    }
    if (desk) {
      chapters.forEach(function (c, i) {
        var r = ch[i];
        if (r.bottom < 0 || r.top > vh) return;
        var s = clamp((vh - r.top) / r.height);
        c.media.style.transform = 'scale(' + (1.15 - 0.15 * s).toFixed(4) + ')';
        c.dim.style.opacity = (clamp((s - 0.55) / 0.45) * 0.38).toFixed(3);
        c.copy.style.transform = 'translate3d(0,' + ((0.5 - s) * 40).toFixed(1) + 'px,0)';
      });
    }
    if (tr && tr.top < vh && tr.bottom > 0) {
      var t = clamp((vh - tr.top) / (vh * 0.75));
      tiltEl.style.transform = 'rotateX(' + (20 * (1 - t)).toFixed(2) + 'deg) scale(' + (0.92 + 0.08 * t).toFixed(4) + ')';
    }
    lites.forEach(function (li, i) {
      var top = lr[i];
      if (top > vh * 1.1 || top < -vh) return;
      li.style.opacity = (0.22 + 0.78 * clamp((vh * 0.86 - top) / (vh * 0.26))).toFixed(3);
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  measure(); frame();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });

  /* ---------- video loops: start in view, pause off-screen, keep the still on failure ---------- */
  var saveData = navigator.connection && navigator.connection.saveData;
  var landscape = mq('(min-aspect-ratio: 4/5)');
  var vids = $$('video[data-src]');
  if (!reduce && !saveData && landscape && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (v.dataset.failed) return;
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) {
            v.poster = v.dataset.poster;
            v.addEventListener('playing', function () { v.classList.add('on'); });
            v.addEventListener('error', function () { v.dataset.failed = '1'; v.classList.remove('on'); v.removeAttribute('src'); vio.unobserve(v); });
            v.src = v.dataset.src;
          }
          var pr = v.play();
          if (pr && pr.catch) pr.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.15 });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- contact form + topic preselect ---------- */
  var form = $('#contactForm');
  function setTopic(topic) {
    if (!form || !topic) return;
    var sel = form.elements.topic;
    for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].value === topic) { sel.selectedIndex = i; break; } }
  }
  $$('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () { setTopic(a.getAttribute('data-topic')); });
  });
  try { var tp = new URLSearchParams(location.search).get('topic'); if (tp) setTopic(tp); } catch (e) {}

  if (form) {
    var status = $('.status', form), btn = $('button[type="submit"]', form);
    var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'status';
      var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), message = form.elements.message.value.trim(), topic = form.elements.topic.value;
      if (!name || !emailOk(email) || !message) {
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
