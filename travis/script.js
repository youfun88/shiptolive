// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  io.observe(el);
});

// ---------- Subscribe form ----------
// No backend: posts to FormSubmit (https://formsubmit.co), which relays the
// signup to the site owner's inbox. To hide the address from source too, swap
// the ENDPOINT for the random alias FormSubmit gives you after activation, e.g.
//   const ENDPOINT = 'https://formsubmit.co/ajax/abcdef123456';
(function () {
  const form = document.getElementById('subscribeForm');
  if (!form) return;

  const ENDPOINT = 'https://formsubmit.co/ajax/yufanchen@gmail.com';
  const btn = document.getElementById('subBtn');
  const statusEl = document.getElementById('formStatus');

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // honeypot — silently succeed for bots
    if (form.querySelector('[name="_honey"]').value) {
      setStatus('Thank you for your message. It has been sent.', 'ok');
      return;
    }

    const email = form.email.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please enter a valid email address.', 'err');
      return;
    }

    btn.disabled = true;
    setStatus('Subscribing…', null);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email: email,
        _replyto: email,
        _subject: 'New newsletter subscriber — The New Emotional Intelligence',
        _template: 'table',
      }),
    })
      .then(function (r) { if (!r.ok) throw new Error('bad status ' + r.status); return r.json(); })
      .then(function () {
        form.reset();
        setStatus('Thank you for your message. It has been sent.', 'ok');
      })
      .catch(function () {
        setStatus('There was an error trying to send your message. Please try again later.', 'err');
      })
      .finally(function () { btn.disabled = false; });
  });
})();
