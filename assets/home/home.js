/* Layout 8 · Object studio. Progressive enhancement: the page is complete without this file. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var zh = (doc.lang || '').indexOf('zh') === 0;
  var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || /[?&]noanim/.test(location.search);
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- sticky header: a hairline once the page has moved ---------- */
  var hdr = $('.hdr');
  if (hdr) {
    var scrolled = false;
    var onHdr = function () { var s = (window.scrollY || window.pageYOffset || 0) > 8; if (s !== scrolled) { scrolled = s; hdr.classList.toggle('is-scrolled', s); } };
    window.addEventListener('scroll', onHdr, { passive: true });
    onHdr();
  }

  /* ---------- reveal (fade up). Anything already on screen is shown at once. ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    doc.classList.add('motion');
    var targets = $$('.rv, .ba');
    var vh = window.innerHeight || 800;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > 0) { requestAnimationFrame(function () { el.classList.add('in'); }); }
      else io.observe(el);
    });
    // safety net: never leave content hidden (e.g. print, odd capture tools)
    window.addEventListener('beforeprint', function () { targets.forEach(function (el) { el.classList.add('in'); }); });
  }

  /* ---------- scroll parallax: objects drift a few px, rAF-throttled, transform only ---------- */
  if (!reduce) {
    var drifts = $$('[data-drift]');
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = 0; i < drifts.length; i++) {
        var el = drifts[i], r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        var k = parseFloat(el.getAttribute('data-drift')) || 0;
        var off = (r.top + r.height / 2 - vh / 2) * k; // px from viewport centre
        if (off > 28) off = 28; else if (off < -28) off = -28;
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- FAQ: one open at a time keeps the index tidy ---------- */
  var dets = $$('.faq-list details');
  dets.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) dets.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- contact form ---------- */
  var form = $('#contactForm');
  function setTopic(topic) {
    if (!form || !topic) return;
    var sel = form.elements.topic;
    for (var i = 0; i < sel.options.length; i++) {
      if ((sel.options[i].value || sel.options[i].text) === topic) { sel.selectedIndex = i; break; }
    }
  }
  $$('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () { setTopic(a.getAttribute('data-topic')); });
  });
  try {
    var tp = new URLSearchParams(location.search).get('topic');
    // ?topic=signup (the QR code at the end of the dashboard talk): open a dashboard account. The Email is the Gmail they sign in with.
    if (tp === 'signup' && form) {
      setTopic('開通管理後台');
      form.elements.email.placeholder = '登入用的 Gmail';
      if (!form.elements.message.value) form.elements.message.value = '我想開通管理後台與審閱頁\n公司名稱：\n網站：\n登入用的 Gmail（和上面的 Email 相同就好）：';
    } else if (tp) setTopic(tp);
  } catch (e) {}

  if (form) {
    var status = $('.status', form), btn = $('button[type="submit"]', form);
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'status';
      var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(),
          message = form.elements.message.value.trim(), topic = form.elements.topic.value;
      if (!name || !email || !message || !emailRe.test(email)) {
        status.textContent = zh ? '請填寫姓名、正確的 Email 與訊息內容。' : 'Please fill in your name, a valid email and a message.';
        status.classList.add('err');
        (!name ? form.elements.name : (!emailRe.test(email) ? form.elements.email : form.elements.message)).focus();
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
