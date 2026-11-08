// Booking clicks and finished Calendly bookings, reported to admin.shiptolive.com.
// Anonymous: no name, email or IP is sent (city-level location is added server-side).
// "Calendly 預約追蹤" in the admin decides whether the link opens Calendly in a popup
// on this page (so a finished booking can be recorded) or opens calendly.com as before.
(function () {
  var SITE = 'shiptolive';
  var ADMIN = 'https://admin.shiptolive.com';
  var KEY = 'stl_first_touch';
  var popup = false;

  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }

  // Where the visitor first came from, kept 90 days.
  function firstTouch() {
    var saved = store(function (s) { return JSON.parse(s.getItem(KEY) || 'null'); });
    if (saved && Date.now() - saved.t < 90 * 864e5) return saved;
    var ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch (e) {}
    if (ref === location.hostname.replace(/^www\./, '')) ref = '';
    var q = new URLSearchParams(location.search);
    var utm = ['utm_source', 'utm_medium', 'utm_campaign'].map(function (k) { return q.get(k) ? k.slice(4) + '=' + q.get(k) : ''; }).filter(Boolean).join('&');
    var ft = { t: Date.now(), ref: ref, src: q.get('utm_source') || '', utm: utm, landing: location.pathname };
    store(function (s) { s.setItem(KEY, JSON.stringify(ft)); });
    return ft;
  }
  var ft = firstTouch();

  function log(event, label) {
    var body = JSON.stringify({
      site: SITE, event: event, label: label || '',
      referrerHost: ft.ref, utmSource: ft.src, utm: ft.utm, landing: ft.landing,
      page: location.pathname, lang: document.documentElement.lang || navigator.language || ''
    });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon(ADMIN + '/api/track', new Blob([body], { type: 'text/plain' }));
      else fetch(ADMIN + '/api/track', { method: 'POST', body: body, keepalive: true, mode: 'no-cors' });
    } catch (e) {}
  }

  // Calendly's popup widget, loaded only when tracking is on and a booking link is clicked.
  var widget = null;
  function loadWidget() {
    if (widget) return widget;
    widget = new Promise(function (resolve, reject) {
      var css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(css);
      var s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js'; s.async = true;
      s.onload = function () { resolve(window.Calendly); }; s.onerror = reject;
      document.head.appendChild(s);
    });
    return widget;
  }

  fetch(ADMIN + '/api/booking-config?site=' + SITE)
    .then(function (r) { return r.ok ? r.json() : { on: false }; })
    .then(function (c) { popup = !!c.on; })
    .catch(function () {});

  var lastLabel = '';
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="calendly.com/"]');
    if (!a) return;
    lastLabel = (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    log('book_consultation_click', lastLabel);
    if (!popup || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var url = a.href;
    loadWidget().then(function (C) {
      if (C && C.initPopupWidget) C.initPopupWidget({ url: url });
      else window.open(url, '_blank', 'noopener');
    }).catch(function () { window.open(url, '_blank', 'noopener'); });
  }, true);

  // Calendly tells the page when the visitor finishes booking in the popup.
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://calendly.com') return;
    if (e.data && e.data.event === 'calendly.event_scheduled') log('booking_scheduled', lastLabel);
  });
})();
