// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal-on-scroll for cards & sections
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.12 });

document.querySelectorAll('.card, .svc, .next-list li, .contact-card, .about-wrap > div').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.06}s, transform 0.5s ease ${(i % 4) * 0.06}s`;
  io.observe(el);
});

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

  const ENDPOINT = 'https://formsubmit.co/ajax/yufanchen@gmail.com';
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
      setStatus("Thanks! I'll be in touch soon.", 'ok');
      return;
    }

    const d = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      topic: form.topic.value,
      message: form.message.value.trim(),
    };

    if (!d.name || !d.email || !d.message) {
      setStatus('Please add your name, email, and a short message.', 'err');
      return;
    }

    btn.disabled = true;
    setStatus('Sending…', null);

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
        setStatus("Thanks, " + d.name.split(' ')[0] + "! Your message is on its way — I'll reply within 1–2 days.", 'ok');
      })
      .catch(function () {
        setStatus("Sorry — that didn't go through. Please reach out via the LinkedIn button instead.", 'err');
      })
      .finally(function () {
        btn.disabled = false;
      });
  });
})();
