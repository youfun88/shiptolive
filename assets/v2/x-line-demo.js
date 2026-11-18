/* /line-ai/demo/: try-it-yourself LINE AI demo (loaded on that page only), 2026-11-18.
   Talks to admin.shiptolive.com/api/demo/{generate,session,ask} with text/plain JSON (no CORS preflight).
   Nothing is kept in the browser beyond this tab (sessionStorage, so a reload keeps the 體驗碼). */
(function () {
  'use strict';
  var cfg = window.LINE_DEMO || {};
  var API = cfg.api || 'https://admin.shiptolive.com';
  var OA = cfg.oa || '';
  // Local testing only: ?api=http://localhost:3000 on a localhost page.
  try {
    var qa = new URLSearchParams(location.search).get('api');
    if (qa && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(qa)) API = qa;
  } catch (e) { /* ignore */ }

  var LIM = { qa: 30, inv: 30, ex: 6, field: 300 };
  var $ = function (id) { return document.getElementById(id); };
  if (!$('ld-qa')) return;

  var SAMPLE = {
    business: '範例烘焙坊：台北巷弄裡的烘焙坊，賣麵包、整模蛋糕和點心盒，可預訂生日蛋糕，週一公休。',
    style: '稱呼客人「您」。語氣親切、簡短，可以用一個表情符號 😊。句尾常用「喔」「唷」。',
    examples: ['週六有開喔！10:00–19:00，等您來 😊', '整模蛋糕要提前 3 天訂唷，直接告訴我們日期就好。', '不好意思，今天的可頌已經賣完了，明天早上 10 點會再出爐喔！'],
    qa: [
      { q: '週六、週日有營業嗎？', a: '有，週六日 10:00–19:00；每週一公休。', handoff: false },
      { q: '生日蛋糕要提前多久訂？', a: '整模蛋糕請至少提前 3 天預訂，告訴我們日期、尺寸和口味就可以。', handoff: false },
      { q: '6 吋蛋糕多少錢？', a: '6 吋鮮奶油蛋糕 NT$680，8 吋 NT$980。', handoff: false },
      { q: '可以宅配嗎？', a: '麵包和餅乾可以宅配，蛋糕只能來店自取。', handoff: false },
      { q: '附近好停車嗎？', a: '店門口沒有停車位，步行 2 分鐘有收費停車場。', handoff: false },
      { q: '可以刷卡嗎？', a: '可以刷卡，也可以用 LINE Pay。', handoff: false },
      { q: '預訂後可以改日期嗎？', a: '取貨前 2 天告訴我們都可以改。', handoff: false },
      { q: '公司要訂 50 份以上點心盒', a: '大量訂購由負責人為您報價，我已經通知負責人。', handoff: true },
      { q: '收到的蛋糕有問題', a: '非常抱歉！請提供訂購姓名和照片，負責人會盡快聯絡您。', handoff: true }
    ],
    inventory: [
      { item: '原味可頌', qty: 12, price: 'NT$65', note: '' },
      { item: '肉桂捲', qty: 0, price: 'NT$75', note: '今日售完' },
      { item: '6 吋草莓鮮奶油蛋糕', qty: 3, price: 'NT$680', note: '需預訂' },
      { item: '布朗尼', qty: 20, price: 'NT$90', note: '' },
      { item: '點心盒（6 入）', qty: null, price: 'NT$350', note: '數量請洽負責人' }
    ]
  };

  var ERR = {
    rate_ip: '這個網路位址這一小時的使用次數已達上限，請過一陣子再試。',
    rate_day: '今天的示範名額已經用完了，明天再來試試，或直接加我們的 LINE 問問看。',
    too_many_qa: 'Q&A 最多 30 題。', too_many_items: '庫存最多 30 項。', too_many_examples: '範例回覆最多 6 則。',
    no_qa: '請至少留一題有問題和答案的 Q&A。', no_business: '請先填寫店家簡介。',
    expired: '體驗碼已過期或已更換，請再按一次「開始體驗」。',
    too_large: '內容太長了，請刪掉一些再試。', generate: '產生失敗，請再試一次，或直接修改下面的內容。'
  };
  var errText = function (code) { return ERR[code] || '暫時無法連線，請稍後再試。'; };

  var kit = clone(SAMPLE);
  var session = null; // { code, token, expires, link, qr }
  var dirty = false;
  var busy = false;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'on') for (var ev in attrs.on) n.addEventListener(ev, attrs.on[ev]);
      else if (attrs[k] === true) n.setAttribute(k, '');
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function post(path, body) {
    return fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'http' }; }); })
      .catch(function () { return { ok: false, error: 'network' }; });
  }
  function status(id, text, isErr) { var s = $(id); s.textContent = text || ''; s.classList.toggle('err', !!isErr); }
  function honey(form) { var h = form && form.querySelector('[name="_honey"]'); return h ? h.value : ''; }
  function changed() {
    if (session && !dirty) { dirty = true; status('ld-go-status', '內容已修改：再按一次「開始體驗」，新的內容才會生效。'); }
    counts();
  }

  // ---------- editor ----------
  function field(label, value, max, onInput, multi, extra) {
    var input = el(multi ? 'textarea' : 'input', Object.assign({ maxlength: String(max), 'aria-label': label, rows: multi ? '2' : null }, extra || {}));
    input.value = value == null ? '' : value;
    input.addEventListener('input', function () { onInput(input.value); changed(); });
    return input;
  }
  function counts() {
    $('ld-qa-count').textContent = kit.qa.length + '／' + LIM.qa + ' 題';
    $('ld-inv-count').textContent = kit.inventory.length + '／' + LIM.inv + ' 項';
    $('ld-ex-count').textContent = kit.examples.length + '／' + LIM.ex + ' 則';
    $('ld-qa-add').disabled = kit.qa.length >= LIM.qa;
    $('ld-inv-add').disabled = kit.inventory.length >= LIM.inv;
    $('ld-ex-add').disabled = kit.examples.length >= LIM.ex;
  }
  function renderQA() {
    var box = $('ld-qa'); box.textContent = '';
    kit.qa.forEach(function (r, i) {
      var row = el('div', { class: 'ld-qrow' + (r.handoff ? ' hand' : ''), role: 'listitem' });
      var cb = el('input', { type: 'checkbox' }); cb.checked = !!r.handoff;
      cb.addEventListener('change', function () { r.handoff = cb.checked; row.classList.toggle('hand', cb.checked); changed(); });
      row.appendChild(el('div', null, [el('span', { class: 'lbl', 'aria-hidden': 'true', text: '問題' }), field('第 ' + (i + 1) + ' 題：問題', r.q, LIM.field, function (v) { r.q = v; }, true)]));
      row.appendChild(el('div', null, [el('span', { class: 'lbl', 'aria-hidden': 'true', text: '標準答案' }), field('第 ' + (i + 1) + ' 題：標準答案', r.a, LIM.field, function (v) { r.a = v; }, true)]));
      row.appendChild(el('label', { class: 'ld-ho' }, [cb, '轉真人']));
      row.appendChild(el('button', { type: 'button', class: 'ld-x', 'aria-label': '刪除第 ' + (i + 1) + ' 題', text: '×', on: { click: function () { kit.qa.splice(i, 1); renderQA(); changed(); } } }));
      box.appendChild(row);
    });
    counts();
  }
  function renderEx() {
    var box = $('ld-ex'); box.textContent = '';
    kit.examples.forEach(function (t, i) {
      box.appendChild(el('div', { class: 'ld-exrow' }, [
        field('範例回覆 ' + (i + 1), t, LIM.field, function (v) { kit.examples[i] = v; }, true),
        el('button', { type: 'button', class: 'ld-x', 'aria-label': '刪除範例回覆 ' + (i + 1), text: '×', on: { click: function () { kit.examples.splice(i, 1); renderEx(); changed(); } } })
      ]));
    });
    counts();
  }
  function renderInv() {
    var box = $('ld-inv'); box.textContent = '';
    kit.inventory.forEach(function (r, i) {
      var n = i + 1;
      var cell = function (label, input) { return el('div', null, [el('span', { class: 'lbl', 'aria-hidden': 'true', text: label }), input]); };
      box.appendChild(el('div', { class: 'ld-irow' }, [
        cell('品項', field('第 ' + n + ' 項：品項或時段', r.item, LIM.field, function (v) { r.item = v; })),
        cell('數量', field('第 ' + n + ' 項：數量（留空＝請負責人確認）', r.qty == null ? '' : String(r.qty), 6, function (v) { var x = parseInt(v, 10); r.qty = v.trim() === '' || isNaN(x) ? null : Math.max(0, x); }, false, { type: 'number', min: '0', inputmode: 'numeric', placeholder: '?' })),
        cell('價格', field('第 ' + n + ' 項：價格', r.price || '', 60, function (v) { r.price = v; })),
        cell('備註', field('第 ' + n + ' 項：備註', r.note || '', LIM.field, function (v) { r.note = v; })),
        el('button', { type: 'button', class: 'ld-x', 'aria-label': '刪除第 ' + n + ' 項', text: '×', on: { click: function () { kit.inventory.splice(i, 1); renderInv(); changed(); } } })
      ]));
    });
    counts();
  }
  function renderAll() {
    $('ld-business').value = kit.business || '';
    $('ld-style').value = kit.style || '';
    renderQA(); renderEx(); renderInv(); header();
  }
  function shortName(b) {
    var s = String(b || '').split(/[：:，,。]/)[0].trim();
    return (s || '示範店家').slice(0, 14);
  }
  function header() {
    var name = shortName(kit.business);
    $('ld-name').textContent = name;
    $('ld-av').textContent = name.replace(/^範例/, '').charAt(0) || '店';
  }
  $('ld-business').addEventListener('input', function () { kit.business = this.value; header(); changed(); });
  $('ld-style').addEventListener('input', function () { kit.style = this.value; changed(); });
  $('ld-qa-add').addEventListener('click', function () { if (kit.qa.length < LIM.qa) { kit.qa.push({ q: '', a: '', handoff: false }); renderQA(); changed(); var t = $('ld-qa').querySelectorAll('textarea'); if (t.length) t[t.length - 2].focus(); } });
  $('ld-ex-add').addEventListener('click', function () { if (kit.examples.length < LIM.ex) { kit.examples.push(''); renderEx(); changed(); var t = $('ld-ex').querySelectorAll('textarea'); if (t.length) t[t.length - 1].focus(); } });
  $('ld-inv-add').addEventListener('click', function () { if (kit.inventory.length < LIM.inv) { kit.inventory.push({ item: '', qty: null, price: '', note: '' }); renderInv(); changed(); var t = $('ld-inv').querySelectorAll('.ld-irow:last-child input'); if (t.length) t[0].focus(); } });

  // ---------- step 1: generate ----------
  var pick = $('ld-pick');
  var custom = pick.querySelector('.ld-custom');
  pick.addEventListener('change', function () { custom.hidden = pick.preset.value !== 'custom'; if (!custom.hidden) custom.querySelector('textarea').focus(); });
  pick.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    var preset = pick.preset.value;
    var description = pick.description.value.trim();
    if (preset === 'custom' && description.length < 4) { status('ld-gen-status', '請先用一兩句話描述您的店。', true); pick.description.focus(); return; }
    var btn = $('ld-gen'); busy = true; btn.setAttribute('aria-busy', 'true'); btn.disabled = true;
    status('ld-gen-status', 'AI 正在整理 Q&A，大約 10–20 秒…');
    post('/api/demo/generate', { preset: preset, description: description, _honey: honey(pick) }).then(function (d) {
      busy = false; btn.removeAttribute('aria-busy'); btn.disabled = false;
      if (!d.ok || !d.kit) { status('ld-gen-status', errText(d.error), true); return; }
      kit = { business: d.kit.business || '', style: d.kit.style || '', examples: d.kit.examples || [], qa: d.kit.qa || [], inventory: (d.kit.inventory || []).map(function (r) { return { item: r.item, qty: r.qty, price: r.price || '', note: r.note || '' }; }) };
      renderAll(); changed();
      status('ld-gen-status', '完成了：' + kit.qa.length + ' 題 Q&A、' + kit.inventory.length + ' 項庫存（示範資料）。請檢查、修改後，按「開始體驗」。');
    });
  });

  // ---------- step 3: start ----------
  function payload() {
    var qa = kit.qa.filter(function (r) { return r.q.trim() && (r.a.trim() || r.handoff); });
    return {
      business: kit.business, style: kit.style,
      examples: kit.examples.filter(function (t) { return t.trim(); }),
      qa: qa, inventory: kit.inventory.filter(function (r) { return r.item.trim(); })
    };
  }
  function showSession() {
    var box = $('ld-code');
    $('ld-code-n').textContent = session.code;
    Array.prototype.forEach.call(document.querySelectorAll('.ld-code-inline'), function (n) { n.textContent = session.code; });
    var exp = new Date(session.expires);
    $('ld-code-exp').textContent = '有效到 ' + (exp.getMonth() + 1) + '/' + exp.getDate() + ' ' + ('0' + exp.getHours()).slice(-2) + ':' + ('0' + exp.getMinutes()).slice(-2);
    var link = /^https:\/\/line\.me\//.test(session.link || '') ? session.link : 'https://line.me/R/oaMessage/' + OA + '/?' + encodeURIComponent('體驗碼 ' + session.code);
    $('ld-line').href = link;
    var qr = $('ld-qr');
    if (typeof session.qr === 'string' && /^\s*<svg[\s>]/.test(session.qr) && !/<script|on\w+=/i.test(session.qr)) qr.innerHTML = session.qr;
    else qr.textContent = '';
    box.hidden = false;
    var q = $('ld-q'); q.disabled = false; q.placeholder = '像客人一樣問問看'; $('ld-send').disabled = false;
  }
  $('ld-go').addEventListener('click', function () {
    if (busy) return;
    var body = payload();
    if (!body.business.trim()) { status('ld-go-status', errText('no_business'), true); $('ld-business').focus(); return; }
    if (!body.qa.length) { status('ld-go-status', errText('no_qa'), true); return; }
    var btn = this; busy = true; btn.disabled = true; btn.setAttribute('aria-busy', 'true');
    status('ld-go-status', '建立中…');
    post('/api/demo/session', { kit: body, oa: OA, _honey: honey(pick) }).then(function (d) {
      busy = false; btn.disabled = false; btn.removeAttribute('aria-busy');
      if (!d.ok || !d.code) { status('ld-go-status', errText(d.error), true); return; }
      var renewed = !!session;
      session = { code: d.code, token: d.token, expires: d.expires, link: d.link, qr: d.qr };
      dirty = false;
      try { sessionStorage.setItem('ld-session', JSON.stringify({ s: session, kit: kit })); } catch (e) { /* private mode */ }
      showSession();
      resetChat(renewed ? '已換成新的體驗碼 ' + d.code + '，用新的內容回答。' : '');
      btn.textContent = '用目前內容重新開始';
      status('ld-go-status', '');
      if (matchMedia('(max-width: 1000px)').matches) $('ld-code').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---------- web chat ----------
  var log = $('ld-log');
  function bubble(cls, text) {
    var r = el('div', { class: 'lc-r ' + cls });
    var now = new Date();
    var t = el('small', { text: ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) });
    var m = el('p', { class: 'lc-m' });
    if (text != null) m.textContent = text;
    if (cls.indexOf('c') === 0) { r.appendChild(t); r.appendChild(m); } else { r.appendChild(m); r.appendChild(t); }
    log.appendChild(r); log.scrollTop = log.scrollHeight;
    return r;
  }
  function note(cls, text) { var n = el('span', { class: 'lc-note ' + cls, text: text }); log.appendChild(n); log.scrollTop = log.scrollHeight; }
  function resetChat(msg) {
    Array.prototype.slice.call(log.querySelectorAll('.lc-r, .lc-note, .ld-empty')).forEach(function (n) { n.remove(); });
    if (msg) note('', msg);
    else bubble('a', '您好，這裡是「' + shortName(kit.business) + '」的 AI 客服（示範）。想問什麼都可以喔！');
  }
  $('ld-ask').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('ld-q');
    var q = input.value.trim();
    if (!q || !session || input.dataset.busy) return;
    input.value = ''; input.dataset.busy = '1'; $('ld-send').disabled = true;
    bubble('c', q);
    var wait = bubble('a wait'); wait.querySelector('.lc-m').innerHTML = '<i></i><i></i><i></i>';
    wait.querySelector('.lc-m').setAttribute('aria-label', 'AI 回覆中');
    post('/api/demo/ask', { code: session.code, token: session.token, question: q.slice(0, LIM.field), _honey: honey($('ld-ask')) }).then(function (d) {
      wait.remove(); delete input.dataset.busy; $('ld-send').disabled = false; input.focus();
      if (!d.ok) { note('err', errText(d.error)); if (d.error === 'expired') { session = null; input.disabled = true; $('ld-send').disabled = true; } return; }
      bubble('a', d.reply);
      if (d.handoff) note('hand', d.note || '（示範：這裡會通知負責人接手）');
    });
  });

  // ---------- restore after a reload (same tab only) ----------
  try {
    var saved = JSON.parse(sessionStorage.getItem('ld-session') || 'null');
    if (saved && saved.s && saved.s.expires > Date.now() + 60000 && saved.kit) {
      kit = saved.kit; session = saved.s;
      renderAll(); showSession(); resetChat('');
      $('ld-go').textContent = '用目前內容重新開始';
      status('ld-gen-status', '已載入您這次的內容。');
      return;
    }
  } catch (e) { /* ignore */ }
  renderAll();
})();
