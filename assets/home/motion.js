/* Motion layer (pairs with motion.css). Progressive enhancement: without this file, or with
   prefers-reduced-motion, every number, bar and mock shows its final state. home.js keeps doing .rv reveals. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || /[?&]noanim/.test(location.search);
  if (reduce || !('IntersectionObserver' in window) || !window.requestAnimationFrame) return;
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var zh = (doc.lang || '').indexOf('zh') === 0;

  /* ---------- count-up (easeOutQuart), text only; the real value is kept for screen readers ---------- */
  function count(el, from, to, delay, dur) {
    var t0 = 0;
    el.textContent = from;
    function f(now) {
      if (!t0) t0 = now + delay;
      var k = Math.min(1, Math.max(0, (now - t0) / dur));
      var e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  // Keep the number's box at its final width so nothing beside it moves while it counts.
  // Reads first, then writes (no layout thrash).
  function prepNumbers(nums) {
    var widths = nums.map(function (n) { return n.getBoundingClientRect().width; });
    nums.forEach(function (n, i) {
      var sr = document.createElement('span');
      sr.className = 'sr';
      sr.textContent = n.textContent;
      n.parentNode.insertBefore(sr, n);
      n.setAttribute('aria-hidden', 'true');
      n.style.minWidth = Math.ceil(widths[i]) + 'px';
    });
  }

  /* ---------- prepare components ---------- */
  var figs = $$('.figs.f4 .fig-n');
  var deltas = $$('.delta [data-count]');
  prepNumbers($$('.n[data-count]', document).filter(function (n) { return n.closest('.figs'); }).concat(deltas));
  figs.forEach(function (card, i) {
    card.style.setProperty('--dl', (i * 0.12) + 's');
    $$('.seg i', card).forEach(function (c, j) { c.style.setProperty('--i', j); });
    var n = card.querySelector('.n[data-count]');
    if (n) n.textContent = n.getAttribute('data-from') || '0';
  });
  deltas.forEach(function (b) { b.textContent = b.getAttribute('data-from') || '0'; });

  doc.classList.add('mo');

  function play(el) {
    if (el.classList.contains('fig-n')) {
      el.classList.add('on');
      var n = el.querySelector('.n[data-count]');
      if (!n) return;
      var to = +n.getAttribute('data-count'), hasFrom = n.hasAttribute('data-from');
      var from = +(n.getAttribute('data-from') || 0), dl = parseFloat(el.style.getPropertyValue('--dl')) * 1000 || 0;
      if (el.querySelector('.seg')) count(n, 0, to, dl + 150, 1000);         // in step with the 15 cells
      else if (hasFrom) count(n, from, to, dl + 550, 1600);                    // with the orange gain
      else count(n, 0, to, dl + 150, 2000);                                    // across the whole bar
    } else if (el.matches('.delta [data-count]')) {
      count(el, +(el.getAttribute('data-from') || 0), +el.getAttribute('data-count'), 200, 1500);
    } else if (el.classList.contains('ask')) {
      type(el);
    } else {
      el.classList.add('in');
    }
  }

  /* ---------- typing (demo-type): the bubble keeps its final size; letters appear on a layer above ---------- */
  function type(box) {
    var gh = box.querySelector('.gh'), q = box.querySelector('.q');
    if (!gh || !q || box.classList.contains('typing')) return;
    box.classList.add('typing');
    var chars = Array.from ? Array.from(gh.textContent) : gh.textContent.split('');
    var ty = document.createElement('span');
    ty.className = 'ty';
    ty.setAttribute('aria-hidden', 'true');
    q.appendChild(ty);
    var i = 0, step = zh ? 85 : 38;
    setTimeout(function tick() {
      ty.textContent = chars.slice(0, ++i).join('');
      if (i < chars.length) setTimeout(tick, step + (Math.random() * step * 0.6 | 0));
      else box.classList.add('done');
    }, 500);
  }

  /* ---------- observe ---------- */
  var targets = figs.concat(deltas, $$('.road, .okm, .ask, #report .stage'));
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { io.unobserve(e.target); play(e.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
  targets.forEach(function (t) { io.observe(t); });

  // Inside a <details>: replay the road / approval each time it is opened.
  $$('details').forEach(function (d) {
    var inner = $$('.road, .okm', d);
    if (!inner.length) return;
    d.addEventListener('toggle', function () {
      if (d.open) return;
      inner.forEach(function (el) { el.classList.remove('in'); io.observe(el); });
    });
  });

  // Never leave anything half-drawn when printing.
  window.addEventListener('beforeprint', function () {
    targets.forEach(function (t) {
      t.classList.add('in', 'on', 'done');
      if (t.matches('[data-count]')) t.textContent = t.getAttribute('data-count');
      var n = t.querySelector && t.querySelector('.n[data-count]');
      if (n) n.textContent = n.getAttribute('data-count');
      var g = t.querySelector && t.querySelector('.gh');
      if (g) g.style.visibility = 'visible';
    });
  });
})();
