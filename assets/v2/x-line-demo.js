/* /line-ai/demo/ and /en/line-ai/demo/: try-it-yourself LINE AI demo (loaded on those pages only), 2026-11-18.
   Talks to admin.shiptolive.com/api/demo/{generate,session,ask} with text/plain JSON (no CORS preflight).
   Language from <html lang>: "en" uses the English strings and sample kit below and sends lang:'en' to the API
   (English sample businesses, an English session, the LINE link types "Demo code 1234").
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
  var EN = /^en\b/i.test(document.documentElement.lang || '');
  var LANG = EN ? 'en' : 'zh';

  var SAMPLE_ZH = {
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
      { q: '收到的蛋糕有問題', a: '非常抱歉！方便的話請傳一張照片，負責人會在這裡直接回覆您。', handoff: true }
    ],
    inventory: [
      { item: '原味可頌', qty: 12, price: 'NT$65', note: '' },
      { item: '肉桂捲', qty: 0, price: 'NT$75', note: '今日售完' },
      { item: '6 吋草莓鮮奶油蛋糕', qty: 3, price: 'NT$680', note: '需預訂' },
      { item: '布朗尼', qty: 20, price: 'NT$90', note: '' },
      { item: '點心盒（6 入）', qty: null, price: 'NT$350', note: '數量請洽負責人' }
    ]
  };
  // English sample kit: the /en/line-ai/ page's Sample Bakery (same hours, prices and hand-off cases); the
  // admin's DEFAULT_SESSION_EN (lib/line-demo-bot.ts) is the same bakery on LINE.
  var SAMPLE_EN = {
    business: 'Sample Bakery: a small neighborhood bakery in Taipei. Bread, whole cakes and snack boxes. Birthday cakes to order. Closed Mondays.',
    style: 'Warm, friendly and short, like a message from the shop. Plain everyday English. One emoji at most.',
    examples: ["Yes, we're open Saturday, 10:00 to 19:00. See you then 😊", "Whole cakes need 3 days' notice. Just tell us the date you'd like.", "Sorry, today's croissants are sold out. The next batch comes out tomorrow at 10:00!"],
    qa: [
      { q: 'What are your opening hours?', a: 'Tuesday to Sunday, 10:00 to 19:00. Closed every Monday.', handoff: false },
      { q: 'Are you open on weekends?', a: 'Yes, Saturday and Sunday 10:00 to 19:00. Closed every Monday.', handoff: false },
      { q: 'How early should I order a birthday cake?', a: 'Please order whole cakes at least 3 days ahead. Send us the date, size and flavor here on LINE.', handoff: false },
      { q: 'How much is a 6-inch cake?', a: 'A 6-inch fresh cream cake is NT$680. An 8-inch is NT$980.', handoff: false },
      { q: 'Do you deliver?', a: 'We ship bread and cookies. Cakes are pickup only.', handoff: false },
      { q: 'Is there parking nearby?', a: "There's no parking at the door. A paid parking lot is a 2-minute walk away.", handoff: false },
      { q: 'Can I pay by card?', a: 'Yes, we take cards and LINE Pay.', handoff: false },
      { q: 'Can I change the date after ordering?', a: 'Yes, just tell us at least 2 days before pickup.', handoff: false },
      { q: 'We need 50+ snack boxes for a company event', a: 'The owner quotes bulk orders personally. I have let the owner know.', handoff: true },
      { q: 'Something was wrong with my cake', a: "We're so sorry! If you can, please send a photo. The owner will reply to you right here.", handoff: true }
    ],
    inventory: [
      { item: 'Plain croissant', qty: 12, price: 'NT$65', note: '' },
      { item: 'Cinnamon roll', qty: 0, price: 'NT$75', note: 'Sold out today' },
      { item: '6-inch strawberry cream cake', qty: 3, price: 'NT$680', note: 'Order ahead' },
      { item: 'Brownie', qty: 20, price: 'NT$90', note: '' },
      { item: 'Snack box (6 pieces)', qty: null, price: 'NT$350', note: 'Ask the owner about quantity' }
    ]
  };
  var SAMPLE = EN ? SAMPLE_EN : SAMPLE_ZH;

  // Every other piece of page text the script writes, zh and en.
  var T = EN ? {
    codeWord: 'Demo code ', fallbackName: 'Demo shop', avatarStrip: /^sample\s+/i,
    nQa: function (n) { return n + ' / ' + LIM.qa; }, nInv: function (n) { return n + ' / ' + LIM.inv; }, nEx: function (n) { return n + ' / ' + LIM.ex; },
    edited: 'You changed the content. Press "Start the demo" again to use it.',
    q: 'Question', a: 'Standard answer', qL: function (i) { return 'Q&A ' + i + ': question'; }, aL: function (i) { return 'Q&A ' + i + ': standard answer'; },
    hand: 'Hand off', delQa: function (i) { return 'Delete Q&A ' + i; },
    exL: function (i) { return 'Example reply ' + i; }, delEx: function (i) { return 'Delete example reply ' + i; },
    item: 'Item', qty: 'Qty', price: 'Price', note: 'Note',
    itemL: function (n) { return 'Row ' + n + ': item or time slot'; }, qtyL: function (n) { return 'Row ' + n + ': quantity (empty = owner checks)'; },
    priceL: function (n) { return 'Row ' + n + ': price'; }, noteL: function (n) { return 'Row ' + n + ': note'; }, delInv: function (n) { return 'Delete row ' + n; },
    preset: { bakery: 'bakery', dental: 'dental clinic', cram: 'tutoring center' },
    customHint: 'Then press "Write my Q&A". It takes about 10 to 20 seconds.',
    sampleReady: 'Sample Bakery is filled in below. You can start the demo right away.',
    presetHint: function (x) { return 'Press "Write my Q&A" and the AI writes Q&A for a sample ' + x + '. It takes about 10 to 20 seconds.'; },
    needDesc: 'Please describe your business in a sentence or two first.',
    genBusy: 'Writing…', genWait: 'The AI is writing your Q&A. This takes about 10 to 20 seconds…', genSlow: 'Taking a little longer than usual. Almost there…', genBtn: 'Write my Q&A',
    genDone: function (q, i) { return 'Done: ' + q + ' Q&A and ' + i + ' inventory rows (demo data). '; },
    genNext: 'Press "Start again with this content" to switch to it.', genFirst: 'Press "Start the demo" to try it. You can still edit everything.',
    until: function (d) { return 'Valid until ' + 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')[d.getMonth()] + ' ' + d.getDate() + ', ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); },
    askPh: 'Ask like a customer would', creating: 'Setting up your demo AI…',
    newCode: function (c) { return 'New demo code ' + c + '. Answers now use your new content.'; },
    restart: 'Start again with this content', replaced: 'You have a new demo code. The old one no longer works.',
    copied: 'Copied', copyManual: 'Copy it by hand', copy: 'Copy',
    hello: function (n) { return 'Hi, this is the AI assistant for "' + n + '" (demo). Ask me anything!'; },
    typing: 'The AI is replying', thinking: ' still thinking…', handNote: '(Demo: a real account would notify the owner here and send an email.)',
    loaded: 'Your content from this visit is back.'
  } : {
    codeWord: '體驗碼 ', fallbackName: '示範店家', avatarStrip: /^範例/,
    nQa: function (n) { return n + '／' + LIM.qa + ' 題'; }, nInv: function (n) { return n + '／' + LIM.inv + ' 項'; }, nEx: function (n) { return n + '／' + LIM.ex + ' 則'; },
    edited: '內容已修改：再按一次「開始體驗」，新的內容才會生效。',
    q: '問題', a: '標準答案', qL: function (i) { return '第 ' + i + ' 題：問題'; }, aL: function (i) { return '第 ' + i + ' 題：標準答案'; },
    hand: '轉真人', delQa: function (i) { return '刪除第 ' + i + ' 題'; },
    exL: function (i) { return '範例回覆 ' + i; }, delEx: function (i) { return '刪除範例回覆 ' + i; },
    item: '品項', qty: '數量', price: '價格', note: '備註',
    itemL: function (n) { return '第 ' + n + ' 項：品項或時段'; }, qtyL: function (n) { return '第 ' + n + ' 項：數量（留空＝請負責人確認）'; },
    priceL: function (n) { return '第 ' + n + ' 項：價格'; }, noteL: function (n) { return '第 ' + n + ' 項：備註'; }, delInv: function (n) { return '刪除第 ' + n + ' 項'; },
    preset: { bakery: '烘焙坊', dental: '牙醫診所', cram: '補習班' },
    customHint: '寫好後按「幫我產生 Q&A」，大約 10–20 秒。',
    sampleReady: '已經放好「範例烘焙坊」的資料，可以直接開始體驗。',
    presetHint: function (x) { return '按「幫我產生 Q&A」，AI 會產生一份' + x + '的範例，大約 10–20 秒。'; },
    needDesc: '請先用一兩句話描述您的店。',
    genBusy: '產生中…', genWait: 'AI 正在整理 Q&A，大約 10–20 秒…', genSlow: '比平常久一點，再等一下…', genBtn: '幫我產生 Q&A',
    genDone: function (q, i) { return '完成了：' + q + ' 題 Q&A、' + i + ' 項庫存（示範資料）。'; },
    genNext: '按「用目前內容重新開始」，換成這份內容。', genFirst: '按「開始體驗」試試看，內容之後也能改。',
    until: function (d) { return '有效到 ' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); },
    askPh: '像客人一樣問問看', creating: '正在建立您的示範 AI 客服…',
    newCode: function (c) { return '已換成新的體驗碼 ' + c + '，用新的內容回答。'; },
    restart: '用目前內容重新開始', replaced: '已換成新的體驗碼，舊的體驗碼不能再用了。',
    copied: '已複製', copyManual: '請手動複製', copy: '複製',
    hello: function (n) { return '您好，這裡是「' + n + '」的 AI 客服（示範）。想問什麼都可以喔！'; },
    typing: 'AI 回覆中', thinking: ' 還在想…', handNote: '（示範：這裡會通知負責人接手）',
    loaded: '已載入您這次的內容。'
  };

  var KEEP = EN ? ' Everything you entered is still here.' : '您填的內容都還在。';
  var ERR = EN ? {
    rate_ip: 'Your network has used the demo many times this hour. Please try again in an hour.' + KEEP,
    rate_day: "Today's demo slots are used up. Please come back tomorrow, or message our LINE account.",
    too_many_qa: 'Up to 30 Q&A.', too_many_items: 'Up to 30 inventory rows.', too_many_examples: 'Up to 6 example replies.',
    no_qa: 'Please keep at least one Q&A with a question and an answer.', no_business: 'Please fill in "About the business" first.',
    expired: 'This demo code has expired or been replaced. Press "Start the demo" again.',
    too_large: 'That is too much text. Please remove some and try again.', generate: "That didn't work this time. Please try again, or edit the sample content.",
    network: "We couldn't reach the server. Check your connection and try again." + KEEP,
    timeout: 'The server took too long. Please try again.' + KEEP,
    blocked: "We couldn't process this request. Reload the page and try again. If it keeps happening, message us on LINE.",
    other: 'We can\'t connect right now. Please try again in a moment.' + KEEP
  } : {
    rate_ip: '您目前的網路這一小時已經試用很多次了，請一小時後再試。' + KEEP,
    rate_day: '今天的示範名額已經用完了，明天再來試試，或直接加我們的 LINE 問問看。',
    too_many_qa: 'Q&A 最多 30 題。', too_many_items: '庫存最多 30 項。', too_many_examples: '範例回覆最多 6 則。',
    no_qa: '請至少留一題有問題和答案的 Q&A。', no_business: '請先填寫店家簡介。',
    expired: '體驗碼已過期或已更換，請再按一次「開始體驗」。',
    too_large: '內容太長了，請刪掉一些再試。', generate: '這次沒有產生成功，請再試一次，或直接修改範例內容。',
    network: '連不上伺服器，請確認網路連線後再試一次。' + KEEP,
    timeout: '伺服器回應太久，請再試一次。' + KEEP,
    blocked: '系統暫時無法處理這個請求。請重新整理頁面再試；一直出現的話，直接加我們的 LINE 告訴我們。',
    other: '暫時無法連線，請稍後再試。' + KEEP
  };
  var errText = function (code) { return (code !== 'other' && ERR[code]) || ERR.other; };
  var STORE = EN ? 'ld-session-en' : 'ld-session';

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
  function post(path, body, ms) {
    var ctl = 'AbortController' in window ? new AbortController() : null;
    var timer = ctl && setTimeout(function () { ctl.abort(); }, ms || 30000);
    return fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: r.status === 429 ? 'rate_ip' : 'http' }; }); })
      .catch(function (e) { return { ok: false, error: e && e.name === 'AbortError' ? 'timeout' : 'network' }; })
      .then(function (d) { clearTimeout(timer); return d || { ok: false, error: 'http' }; });
  }
  function status(id, text, isErr, isBusy) { var s = $(id); s.textContent = text || ''; s.classList.toggle('err', !!isErr); s.classList.toggle('busy', !!isBusy); }
  var narrow = function () { return matchMedia('(max-width: 1000px)').matches; };
  function reveal(node) { node.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
  // progress: hero steps and the numbered headings
  function step(n) {
    Array.prototype.forEach.call(document.querySelectorAll('#ld-steps li'), function (li) {
      var k = +li.getAttribute('data-s'); li.classList.toggle('done', k < n); li.classList.toggle('on', k === n);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.ld-main .ld-n'), function (b, i) { b.classList.toggle('done', i + 1 < n && i < 2); });
  }
  // textareas grow with their content (field-sizing: content does this where supported)
  var autoSize = CSS.supports && CSS.supports('field-sizing', 'content') ? function () {} : function (t) { t.style.height = 'auto'; t.style.height = (t.scrollHeight + 2) + 'px'; };
  function sizeAll() { Array.prototype.forEach.call(document.querySelectorAll('.ld-card textarea'), autoSize); }
  function honey(form) { var h = form && form.querySelector('[name="_honey"]'); return h ? h.value : ''; }
  function changed() {
    if (session && !dirty) { dirty = true; status('ld-go-status', T.edited); }
    counts();
  }

  // ---------- editor ----------
  function field(label, value, max, onInput, multi, extra) {
    var input = el(multi ? 'textarea' : 'input', Object.assign({ maxlength: String(max), 'aria-label': label, rows: multi ? '2' : null }, extra || {}));
    input.value = value == null ? '' : value;
    if (multi) input.rows = 1;
    input.addEventListener('input', function () { onInput(input.value); if (multi) autoSize(input); changed(); });
    return input;
  }
  function counts() {
    $('ld-qa-count').textContent = T.nQa(kit.qa.length);
    $('ld-inv-count').textContent = T.nInv(kit.inventory.length);
    $('ld-ex-count').textContent = T.nEx(kit.examples.length);
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
      row.appendChild(el('div', null, [el('span', { class: 'lbl', 'aria-hidden': 'true', text: T.q }), field(T.qL(i + 1), r.q, LIM.field, function (v) { r.q = v; }, true)]));
      row.appendChild(el('div', null, [el('span', { class: 'lbl', 'aria-hidden': 'true', text: T.a }), field(T.aL(i + 1), r.a, LIM.field, function (v) { r.a = v; }, true)]));
      row.appendChild(el('label', { class: 'ld-ho' }, [cb, T.hand]));
      row.appendChild(el('button', { type: 'button', class: 'ld-x', 'aria-label': T.delQa(i + 1), text: '×', on: { click: function () { kit.qa.splice(i, 1); renderQA(); changed(); } } }));
      box.appendChild(row);
    });
    counts();
  }
  function renderEx() {
    var box = $('ld-ex'); box.textContent = '';
    kit.examples.forEach(function (t, i) {
      box.appendChild(el('div', { class: 'ld-exrow' }, [
        field(T.exL(i + 1), t, LIM.field, function (v) { kit.examples[i] = v; }, true),
        el('button', { type: 'button', class: 'ld-x', 'aria-label': T.delEx(i + 1), text: '×', on: { click: function () { kit.examples.splice(i, 1); renderEx(); changed(); } } })
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
        cell(T.item, field(T.itemL(n), r.item, LIM.field, function (v) { r.item = v; })),
        cell(T.qty, field(T.qtyL(n), r.qty == null ? '' : String(r.qty), 6, function (v) { var x = parseInt(v, 10); r.qty = v.trim() === '' || isNaN(x) ? null : Math.max(0, x); }, false, { type: 'number', min: '0', inputmode: 'numeric', placeholder: '?' })),
        cell(T.price, field(T.priceL(n), r.price || '', 60, function (v) { r.price = v; })),
        cell(T.note, field(T.noteL(n), r.note || '', LIM.field, function (v) { r.note = v; })),
        el('button', { type: 'button', class: 'ld-x', 'aria-label': T.delInv(n), text: '×', on: { click: function () { kit.inventory.splice(i, 1); renderInv(); changed(); } } })
      ]));
    });
    counts();
  }
  function renderAll() {
    $('ld-business').value = kit.business || '';
    $('ld-style').value = kit.style || '';
    renderQA(); renderEx(); renderInv(); header(); sizeAll();
  }
  // Same rule as the bot's shortName (admin lib/line-demo-bot.ts): zh up to the first ：/comma, 14 characters; en also stops at ". ", 24.
  function shortName(b) {
    var s = String(b || '').split(EN ? /[：:，,。]|\.\s/ : /[：:，,。]/)[0].trim();
    return EN ? (s || T.fallbackName).slice(0, 24).trim() : (s || T.fallbackName).slice(0, 14);
  }
  function header() {
    var name = shortName(kit.business);
    $('ld-name').textContent = name;
    var c = name.replace(T.avatarStrip, '').charAt(0);
    $('ld-av').textContent = EN ? (c || 'S').toUpperCase() : c || '店';
  }
  $('ld-business').addEventListener('input', function () { kit.business = this.value; header(); changed(); });
  $('ld-style').addEventListener('input', function () { kit.style = this.value; autoSize(this); changed(); });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(sizeAll, 200); });
  $('ld-qa-add').addEventListener('click', function () { if (kit.qa.length < LIM.qa) { kit.qa.push({ q: '', a: '', handoff: false }); renderQA(); changed(); var t = $('ld-qa').querySelectorAll('textarea'); if (t.length) t[t.length - 2].focus(); } });
  $('ld-ex-add').addEventListener('click', function () { if (kit.examples.length < LIM.ex) { kit.examples.push(''); renderEx(); changed(); var t = $('ld-ex').querySelectorAll('textarea'); if (t.length) t[t.length - 1].focus(); } });
  $('ld-inv-add').addEventListener('click', function () { if (kit.inventory.length < LIM.inv) { kit.inventory.push({ item: '', qty: null, price: '', note: '' }); renderInv(); changed(); var t = $('ld-inv').querySelectorAll('.ld-irow:last-child input'); if (t.length) t[0].focus(); } });

  // ---------- step 1: generate ----------
  var pick = $('ld-pick');
  var custom = pick.querySelector('.ld-custom');
  var PRESET = T.preset;
  pick.addEventListener('change', function (e) {
    if (e.target.name !== 'preset') return;
    var v = pick.preset.value;
    custom.hidden = v !== 'custom';
    if (!custom.hidden) { custom.querySelector('textarea').focus(); status('ld-gen-status', T.customHint); }
    else if (v === 'bakery' && !generated) status('ld-gen-status', T.sampleReady);
    else status('ld-gen-status', T.presetHint(PRESET[v]));
  });
  var generated = false;
  pick.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    var preset = pick.preset.value;
    var description = pick.description.value.trim();
    if (preset === 'custom' && description.length < 4) { status('ld-gen-status', T.needDesc, true); pick.description.focus(); return; }
    var btn = $('ld-gen'); busy = true; btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.textContent = T.genBusy;
    $('ld-edit').setAttribute('aria-busy', 'true');
    status('ld-gen-status', T.genWait, false, true);
    var slow = setTimeout(function () { status('ld-gen-status', T.genSlow, false, true); }, 20000);
    post('/api/demo/generate', { preset: preset, description: description, lang: LANG, _honey: honey(pick) }, 60000).then(function (d) {
      clearTimeout(slow);
      busy = false; btn.removeAttribute('aria-busy'); btn.disabled = false; btn.textContent = T.genBtn;
      $('ld-edit').removeAttribute('aria-busy');
      if (!d.ok || !d.kit) { status('ld-gen-status', errText(d.error), true); return; }
      kit = { business: d.kit.business || '', style: d.kit.style || '', examples: d.kit.examples || [], qa: d.kit.qa || [], inventory: (d.kit.inventory || []).map(function (r) { return { item: r.item, qty: r.qty, price: r.price || '', note: r.note || '' }; }) };
      generated = true;
      renderAll(); changed();
      status('ld-gen-status', T.genDone(kit.qa.length, kit.inventory.length) + (session ? T.genNext : T.genFirst));
      step(2);
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
    $('ld-code-exp').textContent = T.until(new Date(session.expires));
    var link = /^https:\/\/line\.me\//.test(session.link || '') ? session.link : 'https://line.me/R/oaMessage/' + OA + '/?' + encodeURIComponent(T.codeWord + session.code);
    $('ld-line').href = link;
    var qr = $('ld-qr');
    if (typeof session.qr === 'string' && /^\s*<svg[\s>]/.test(session.qr) && !/<script|on\w+=/i.test(session.qr)) qr.innerHTML = session.qr;
    else qr.textContent = '';
    box.hidden = false;
    var q = $('ld-q'); q.disabled = false; q.placeholder = T.askPh; $('ld-send').disabled = false;
    suggest();
  }
  // a few one-tap questions taken from the visitor's own Q&A (two ordinary ones, one that goes to a person)
  function suggest() {
    var box = $('ld-sugg');
    Array.prototype.slice.call(box.querySelectorAll('button')).forEach(function (b) { b.remove(); });
    var qs = kit.qa.filter(function (r) { return r.q.trim() && !r.handoff; }).slice(0, 2)
      .concat(kit.qa.filter(function (r) { return r.q.trim() && r.handoff; }).slice(0, 1))
      .map(function (r) { return r.q.trim().slice(0, 40); });
    qs.forEach(function (text) { box.appendChild(el('button', { type: 'button', text: text, on: { click: function () { ask(text); } } })); });
    box.hidden = !qs.length || !session;
  }
  $('ld-go').addEventListener('click', function () {
    if (busy) return;
    var body = payload();
    if (!body.business.trim()) { status('ld-go-status', errText('no_business'), true); $('ld-business').focus(); return; }
    if (!body.qa.length) { status('ld-go-status', errText('no_qa'), true); var f = $('ld-qa').querySelector('textarea'); if (f) f.focus(); return; }
    var btn = this; busy = true; btn.disabled = true; btn.setAttribute('aria-busy', 'true');
    status('ld-go-status', T.creating, false, true);
    post('/api/demo/session', { kit: body, oa: OA, lang: LANG, _honey: honey(pick) }, 30000).then(function (d) {
      busy = false; btn.disabled = false; btn.removeAttribute('aria-busy');
      if (!d.ok || !d.code) { status('ld-go-status', errText(d.error), true); return; }
      var renewed = !!session;
      session = { code: d.code, token: d.token, expires: d.expires, link: d.link, qr: d.qr };
      dirty = false;
      try { sessionStorage.setItem(STORE, JSON.stringify({ s: session, kit: kit })); } catch (e) { /* private mode */ }
      showSession();
      resetChat(renewed ? T.newCode(d.code) : '');
      btn.textContent = T.restart;
      status('ld-go-status', renewed ? T.replaced : '');
      step(3);
      reveal($('ld-code')); $('ld-code').focus({ preventScroll: true });
    });
  });
  // copy the code (with its prefix, the way the demo account expects it)
  $('ld-copy').addEventListener('click', function () {
    if (!session) return;
    var btn = this, text = T.codeWord + session.code;
    var done = function (ok) { btn.textContent = ok ? T.copied : T.copyManual; btn.classList.toggle('ok', ok); setTimeout(function () { btn.textContent = T.copy; btn.classList.remove('ok'); }, 2400); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    else {
      var t = el('textarea', { readonly: true, style: 'position:fixed;opacity:0' }); t.value = text; document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { /* ignore */ } t.remove(); done(ok);
    }
  });
  $('ld-to-chat').addEventListener('click', function () { reveal($('ld-chat')); setTimeout(function () { $('ld-q').focus({ preventScroll: true }); }, narrow() ? 450 : 0); });
  $('ld-again').addEventListener('click', function (e) { e.preventDefault(); reveal($('ld-start')); $('ld-go').focus({ preventScroll: true }); });

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
    else bubble('a', T.hello(shortName(kit.business)));
  }
  function setAsking(on) {
    var input = $('ld-q');
    if (on) input.dataset.busy = '1'; else delete input.dataset.busy;
    $('ld-send').disabled = on;
    Array.prototype.forEach.call($('ld-sugg').querySelectorAll('button'), function (b) { b.disabled = on; });
  }
  function ask(q) {
    var input = $('ld-q');
    if (!q || !session || input.dataset.busy) return;
    input.value = ''; setAsking(true);
    bubble('c', q);
    var wait = bubble('a wait'); var wm = wait.querySelector('.lc-m');
    wm.innerHTML = '<i></i><i></i><i></i><span class="sr">' + T.typing + '</span>';
    var slow = setTimeout(function () { wm.appendChild(document.createTextNode(T.thinking)); }, 8000);
    post('/api/demo/ask', { code: session.code, token: session.token, question: q.slice(0, LIM.field), _honey: honey($('ld-ask')) }, 30000).then(function (d) {
      clearTimeout(slow); wait.remove(); setAsking(false);
      if (!narrow()) input.focus({ preventScroll: true });
      if (!d.ok) {
        note('err', errText(d.error));
        if (d.error === 'expired') { session = null; input.disabled = true; $('ld-send').disabled = true; $('ld-sugg').hidden = true; step(2); }
        else if (!input.value) input.value = q; // keep the question so it can be sent again
        return;
      }
      bubble('a', d.reply);
      if (d.handoff) note('hand', d.note || T.handNote);
    });
  }
  $('ld-ask').addEventListener('submit', function (e) { e.preventDefault(); ask($('ld-q').value.trim()); });

  // the floating LINE button and the phone CTA bar would cover inputs and the send button: hide them while the builder is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { document.body.classList.toggle('ld-quiet', es[0].isIntersecting); }, { rootMargin: '-80px 0px -80px 0px' }).observe($('build'));
  }

  // ---------- restore after a reload (same tab only) ----------
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORE) || 'null');
    if (saved && saved.s && saved.s.expires > Date.now() + 60000 && saved.kit) {
      kit = saved.kit; session = saved.s;
      renderAll(); showSession(); resetChat('');
      $('ld-go').textContent = T.restart;
      status('ld-gen-status', T.loaded);
      step(3);
      return;
    }
  } catch (e) { /* ignore */ }
  renderAll(); step(1);
})();
