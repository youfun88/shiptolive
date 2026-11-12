/* UX pass agent B: service-page hero visuals (website, software, AI search) */
(function () {
  var S = window.STL;
  if (!S) return;
  var $ = S.$, $$ = S.$$;

  // website: language toggle flips 中 / EN
  S.onSeen($$('.hv-web'), function (el, now) {
    el.classList.add('in');
    if (now) return;
    var b = $$('.lg b', el), i = 0;
    setTimeout(function flip() {
      i = 1 - i;
      b.forEach(function (x, k) { x.classList.toggle('on', k === i); });
      setTimeout(flip, 2400);
    }, 2400);
  }, 0.25);

  // software: code types in line by line, ships, the app takes two bookings
  var CODE = [
    ['<span class="k">const</span> booking = <span class="k">await</span> db.bookings.create({', 'const booking = await db.bookings.create({'],
    ['  customer, date, seats: 4,', '  customer, date, seats: 4,'],
    ['});', '});'],
    ['<span class="k">await</span> notify.line(customer, <span class="s">' + (S.zh ? "'預約成功'" : "'Booked'") + '</span>);', 'await notify.line(customer, ' + (S.zh ? "'預約成功'" : "'Booked'") + ');'],
    ['<span class="c">// ' + (S.zh ? '測試通過，自動部署' : 'tests pass, deploy') + '</span>', '// ' + (S.zh ? '測試通過，自動部署' : 'tests pass, deploy')]
  ];
  S.onSeen($$('.hv-sw'), function (el, now) {
    el.classList.add('in');
    var lines = $$('.code .ln', el), picks = $$('.cal .pick', el);
    function finish() {
      lines.forEach(function (l, k) { l.innerHTML = CODE[k][0]; });
      el.classList.add('shipped');
      picks.forEach(function (p, k) { setTimeout(function () { p.classList.add('on'); if (k === picks.length - 1) el.classList.add('booked'); }, now ? 0 : 500 + k * 600); });
    }
    if (now) { finish(); return; }
    var k = 0;
    setTimeout(function () { next(); }, 500);
    function next() {
      if (k >= lines.length) { setTimeout(finish, 300); return; }
      var ln = lines[k], c = CODE[k];
      var ch = c[1].split(''), n = 0;
      (function t() { ln.textContent = ch.slice(0, ++n).join(''); if (n < ch.length) setTimeout(t, 18); else { ln.innerHTML = c[0]; k++; setTimeout(next, 140); } })();
    }
  }, 0.25);

  // AI search: your company rises to #1, then SEO / AEO / GEO light up; replays every few seconds
  S.onSeen($$('.hv-ai'), function (el, now) {
    var chips = $$('.c3 span', el);
    if (now) { el.classList.add('won'); chips.forEach(function (c) { c.classList.add('on'); }); return; }
    function play() {
      el.classList.remove('won'); chips.forEach(function (c) { c.classList.remove('on'); });
      setTimeout(function () {
        el.classList.add('won');
        chips.forEach(function (c, k) { setTimeout(function () { c.classList.add('on'); }, 1300 + k * 350); });
      }, 900);
      setTimeout(play, 9000);
    }
    play();
  }, 0.3);
})();
