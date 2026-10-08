// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu + header border once the page scrolls
(function () {
  const nav = document.querySelector('.nav');
  const btn = nav && nav.querySelector('.menu-btn');
  if (!nav) return;
  const ZH = /^zh/i.test(document.documentElement.lang || '');

  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? (ZH ? '關閉選單' : 'Close menu') : (ZH ? '開啟選單' : 'Open menu'));
  }
  if (btn) {
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
  }

  const onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 4); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Reveal-on-scroll. Elements start visible if JS or IntersectionObserver is missing.
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// Count the hero numbers up once they scroll into view ("40M", "4,000 萬", "1M+").
(function () {
  const els = document.querySelectorAll('.stats strong');
  if (!els.length || !('IntersectionObserver' in window) || document.visibilityState === 'hidden' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function run(el) {
    const m = el.textContent.match(/^([\d,]+)([\s\S]*)$/);
    if (!m) return;
    const end = parseInt(m[1].replace(/,/g, ''), 10);
    if (end < 10) return; // "0M+" mid-count reads as a typo; small numbers just appear
    const final = el.textContent;
    // rAF stalls in background tabs — guarantee the real number lands regardless.
    setTimeout(function () { el.textContent = final; }, 1300);
    const commas = m[1].indexOf(',') !== -1;
    const suffix = m[2];
    const t0 = performance.now();
    const dur = 1100;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = (commas ? v.toLocaleString('en-US') : String(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  els.forEach(function (el) { io.observe(el); });
})();

// ---------- Contact form ----------
// No backend: posts to FormSubmit (https://formsubmit.co), which relays the
// message to my inbox. The email address is not displayed anywhere on the page.
// TO FULLY HIDE IT FROM SOURCE TOO: after activating FormSubmit, it gives you a
// random alias for your address — swap the line below to that alias, e.g.
//   const ENDPOINT = 'https://formsubmit.co/ajax/abcdef123456';
// so the raw email no longer appears in this file either.
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const ENDPOINT = 'https://formsubmit.co/ajax/yufan@shiptolive.com';

  // Same form on /  and /zh/ — pick the copy off <html lang>.
  const ZH = /^zh/i.test(document.documentElement.lang || '');
  const T = ZH
    ? {
        bot: '謝謝！我會盡快與您聯絡。',
        missing: '請填寫姓名、Email 與簡短說明。',
        sending: '傳送中…',
        ok: function (name) { return '謝謝您，' + name + '！訊息已送出，我會在 1–2 個工作天內回覆。'; },
        err: '抱歉，訊息沒有送出成功。請改用下方的 LinkedIn 與我聯絡。',
      }
    : {
        bot: "Thanks! I'll be in touch soon.",
        missing: 'Please add your name, email, and a short message.',
        sending: 'Sending…',
        ok: function (name) { return 'Thanks, ' + name + "! Your message is on its way — I'll reply within 1–2 days."; },
        err: "Sorry — that didn't go through. Please reach out via the LinkedIn button instead.",
      };
  // Links like /?topic=visibility#contact (from the AI Visibility Checker page)
  // arrive with the right option chosen and the message started.
  const topic = new URLSearchParams(location.search).get('topic');
  if (topic === 'visibility') {
    const opt = Array.prototype.find.call(form.topic.options, function (o) { return /GEO/.test(o.text); });
    if (opt) form.topic.value = opt.value;
    if (!form.message.value) {
      form.message.value = ZH
        ? 'AI 能見度檢測申請\n公司名稱：\n網站：\n城市：\n客戶通常會找我們做什麼：'
        : 'AI Visibility Check request\nBusiness name:\nWebsite:\nCity:\nWhat customers usually ask us for:';
    }
  }

  const btn = document.getElementById('send');
  const statusEl = document.getElementById('formStatus');

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // honeypot — silently succeed for bots
    if (form.querySelector('[name="_honey"]').value) {
      setStatus(T.bot, 'ok');
      return;
    }

    const d = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      topic: form.topic.value,
      message: form.message.value.trim(),
    };

    if (!d.name || !d.email || !d.message) {
      setStatus(T.missing, 'err');
      return;
    }

    btn.disabled = true;
    setStatus(T.sending, null);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: d.name,
        email: d.email,
        _replyto: d.email,
        topic: d.topic,
        message: d.message,
        _subject: 'New inquiry (' + d.topic + ') — ' + d.name,
        _template: 'table',
      }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error('bad status ' + r.status);
        return r.json();
      })
      .then(function () {
        form.reset();
        setStatus(T.ok(ZH ? d.name : d.name.split(' ')[0]), 'ok');
      })
      .catch(function () {
        setStatus(T.err, 'err');
      })
      .finally(function () {
        btn.disabled = false;
      });
  });
})();
