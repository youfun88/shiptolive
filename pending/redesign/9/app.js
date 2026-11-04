(function () {
  'use strict';
  var doc = document.documentElement;
  var zh = /^zh/.test(doc.lang);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]noanim/.test(location.search);

  /* ---------- header + mobile menu ---------- */
  var hdr = $('.hdr'), menuBtn = $('.menu-btn'), mnav = $('#mnav');
  if (menuBtn && mnav) {
    menuBtn.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { mnav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }); });
  }

  /* ---------- scroll-linked depth (one rAF loop, transform-only) ---------- */
  var stage = $('#stage'), ribbon = $('.hero-art .ribbon'), arts = $$('.mk-art,.ai-art'), swImg = $('.sw-photo img');
  var ticking = false;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function frame() {
    ticking = false;
    var vh = window.innerHeight, y = window.scrollY || window.pageYOffset;
    if (hdr) hdr.classList.toggle('scrolled', y > 8);
    if (reduce) return;
    if (ribbon && y < vh * 1.2) ribbon.style.setProperty('--hy', (y * 0.16).toFixed(1) + 'px');
    if (stage) {
      var r = stage.getBoundingClientRect();
      if (r.top < vh * 1.2 && r.bottom > -200) {
        // 0 (tilted 12deg) when the stage enters at the bottom, 1 (flat) once its top reaches 20% of the viewport
        var p = clamp((vh - r.top) / (vh * 0.8), 0, 1);
        p = 1 - Math.pow(1 - p, 2);
        stage.style.setProperty('--p', p.toFixed(4));
      }
    }
    for (var i = 0; i < arts.length; i++) {
      var b = arts[i].parentNode.getBoundingClientRect();
      if (b.bottom < 0 || b.top > vh) continue;
      var c = (b.top + b.height / 2 - vh / 2) / vh;
      arts[i].style.setProperty('--oy', (c * -60).toFixed(1) + 'px');
    }
    if (swImg) {
      var s = swImg.parentNode.getBoundingClientRect();
      if (s.bottom > 0 && s.top < vh) swImg.style.setProperty('--sp', clamp((vh - s.top) / (vh + s.height), 0, 1).toFixed(4));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* ---------- count once ---------- */
  function inView(el) { var b = el.getBoundingClientRect(); return b.top < window.innerHeight && b.bottom > 0; }
  function animate(dur, step) {
    var t0 = null;
    function tick(t) {
      if (t0 === null) t0 = t;
      var k = clamp((t - t0) / dur, 0, 1);
      step(1 - Math.pow(1 - k, 3));
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    $$('.count').forEach(function (el) {
      if (inView(el)) return; // visible on load: keep the real number
      var to = +el.getAttribute('data-to');
      el.textContent = '0';
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        io.disconnect();
        animate(1400, function (e) { el.textContent = String(Math.round(to * e)); });
      }, { threshold: 0.5 });
      io.observe(el);
    });
  }

  /* ---------- contact form + topic preselect ---------- */
  var form = $('#contactForm');
  function setTopic(topic) {
    if (!form || !topic) return;
    var sel = form.elements.topic;
    for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].value === topic) { sel.selectedIndex = i; break; } }
  }
  $$('[data-topic]').forEach(function (a) { a.addEventListener('click', function () { setTopic(a.getAttribute('data-topic')); }); });
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
        (!name ? form.elements.name : (!emailOk(email) ? form.elements.email : form.elements.message)).focus();
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
