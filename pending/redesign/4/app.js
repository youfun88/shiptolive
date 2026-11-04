/* Ship to Live, Layout 4: interactive diagnostic + page behaviour. Vanilla JS, no deps. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var ZH = (root.lang || '').toLowerCase().indexOf('zh') === 0;
  var L = ZH ? 'zh' : 'en';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var CAL = 'https://calendly.com/yufansapp/20min';
  var SEP = ZH ? '。' : '. ';

  /* ---------------- shared copy ---------------- */
  var T = {
    zh: {
      title0: '免費診斷 · 約 30 秒', titleQ: function (i, n) { return '第 ' + i + ' 題，共 ' + n + ' 題'; }, titleR: '診斷結果',
      rtag: '診斷結果', wrong: '可能的問題', first: '我們會先做', proof: '相關實績與依據',
      cta: '帶著這份結果聯絡我們', cal: '預約 20 分鐘', more: '看完整說明', restart: '重新診斷', share: '分享這個結果',
      copied: '連結已複製', copyFail: '請直接複製網址列的連結', youChose: '你選了',
      msgHead: '【線上診斷】', msgTail: '\n\n我想進一步了解：',
      weeks: '週', typical: '典型範圍，不是報價；實際以先期規劃的結果為準。',
      phase1: '第一階段通常', phased: '整體通常', phasedTail: '，建議拆成 2–3 個階段，第一階段控制在 8–12 週。',
      tiers: { s: '小型串接／單一功能', m: '標準系統', l: '多端平台' },
      phasesH: '典型階段', getH: '最後你會拿到',
      ph: function (w) { return ['先期規劃（1–2 週，固定費用）：流程圖、功能清單、可點擊原型、固定報價', '第一階段：最小可用版本（' + w + '，每兩週交一版可以操作的進度）', '之後：依實際使用的回饋加功能（可選擇是否繼續）']; },
      own: '程式碼、帳號、網域、資料都在你名下，附交接文件',
      rescueNote: '先 1–2 週盤點現況，再決定修、翻新或重寫。',
      pkCta: '用這個組合聯絡我們', pkEmpty: '先勾選一項你需要的，<br>這裡就會出現典型範圍。',
      pkMsg: '【需求試算】', users: { s: '1–5 人', m: '6–30 人', l: '30 人以上或開放給客戶' }, platform: { web: '電腦／網頁', mobile: '手機為主', both: '電腦與手機' },
      get: { internal: '訂單、庫存或排班集中在一個系統，有權限與操作紀錄', booking: '線上預約、提醒與會員資料，可接 LINE 通知', portal: '客戶登入就看得到進度、文件和下一步', app: 'iOS 與 Android 一套程式碼，協助上架', integrate: '系統之間自動同步，不用人工重打', ai: '讀你自家文件回答問題的 AI 助理（先用真實資料兩週試作）', rescue: '現況盤點報告，以及修、翻新或重寫的建議' },
      sent: function (n) { return '謝謝您，' + n + '！訊息已送出，我們會在 1–2 個工作天內回覆。'; },
      fail: '抱歉，訊息沒有送出成功。請直接寫信到 yufan@shiptolive.com。',
      need: '請填寫稱呼、有效的 Email 和你的狀況。', sending: '送出中…',
      menuOpen: '開啟選單', menuClose: '關閉選單'
    },
    en: {
      title0: 'Free diagnosis · ~30 seconds', titleQ: function (i, n) { return 'Question ' + i + ' of ' + n; }, titleR: 'Your diagnosis',
      rtag: 'Diagnosis', wrong: 'What is probably wrong', first: 'What we would do first', proof: 'Relevant proof',
      cta: 'Contact us with this result', cal: 'Book 20 minutes', more: 'Read the full section', restart: 'Start over', share: 'Share this result',
      copied: 'Link copied', copyFail: 'Copy the link from the address bar', youChose: 'You chose',
      msgHead: '[Online diagnosis] ', msgTail: '\n\nWhat I would like to know:',
      weeks: 'weeks', typical: 'A typical range, not a quote. Discovery sets the real scope.',
      phase1: 'Phase 1 usually takes', phased: 'Overall usually', phasedTail: '. We would split it into 2–3 phases and keep phase 1 to 8–12 weeks.',
      tiers: { s: 'Small integration / single feature', m: 'Standard system', l: 'Multi-platform product' },
      phasesH: 'Typical phases', getH: 'What you get at the end',
      ph: function (w) { return ['Discovery (1–2 weeks, fixed fee): process map, feature list, clickable prototype, fixed quote', 'Phase 1: the smallest useful version (' + w + ', a working build every 2 weeks)', 'Then: features based on real use (continuing is optional)']; },
      own: 'Code, accounts, domains and data in your name, with handover docs',
      rescueNote: 'First 1–2 weeks to map where things stand, then we decide: fix, modernise or rebuild.',
      pkCta: 'Contact us with this combination', pkEmpty: 'Tick at least one need<br>and a typical range appears here.',
      pkMsg: '[Scope picker] ', users: { s: '1–5 people', m: '6–30 people', l: '30+ or open to customers' }, platform: { web: 'Desktop / web', mobile: 'Mostly phones', both: 'Desktop and phones' },
      get: { internal: 'Orders, stock or rosters in one system, with roles and an activity log', booking: 'Online booking, reminders and member records, with LINE or email notices', portal: 'Customers log in to see status, documents and next steps', app: 'One codebase for iOS and Android, plus help with store release', integrate: 'Your systems sync automatically, no retyping', ai: 'An AI assistant that answers from your own documents (2-week pilot on real data first)', rescue: 'A written assessment and a fix / modernise / rebuild recommendation' },
      sent: function (n) { return 'Thanks, ' + n + '! We’ll reply within 1–2 business days.'; },
      fail: 'Sorry, the message didn’t go through. Please email yufan@shiptolive.com.',
      need: 'Please add your name, a valid email and a short message.', sending: 'Sending…',
      menuOpen: 'Open menu', menuClose: 'Close menu'
    }
  }[L];

  /* ---------------- diagnostic content ---------------- */
  var WU_AI = ZH ? { big: '12<small> / 16</small>', text: 'WU LAW INTL：16 則 AI 回答（ChatGPT、Claude、Perplexity、Gemini）中 12 則點名這家事務所；Microsoft Copilot 90 天內引用網站 487 次（Bing Webmaster Tools）。2026 年 10 月量測。' }
    : { big: '12<small> / 16</small>', text: 'WU LAW INTL: named in 12 of 16 AI answers (ChatGPT, Claude, Perplexity, Gemini); Microsoft Copilot cited the site 487 times in 90 days (Bing Webmaster Tools). Measured October 2026.' };
  var WU_G = ZH ? { big: '29<small> 個</small>', text: 'WU LAW INTL：29 個搜尋字詞讓網站出現在 Google 第 1 頁（Google Search Console，2026 年 10 月）。搜尋「外國人繼承台灣遺產應備文件」，Google AI 摘要第一行就引用它。' }
    : { big: '29', text: 'WU LAW INTL: 29 searches show the site on Google page 1 (Google Search Console, October 2026). Google’s AI Overview cites it in its first line for a key inheritance question.' };
  var WU_NEW = ZH ? { big: '6<small> / 20</small>', text: 'WU LAW INTL 新網站上線第一個月：20 場諮詢、6 位付費客戶（業主提供）。山行接駁 Go Hike：102 條路線與價格、22 則 FAQ 都寫進結構化資料。' }
    : { big: '6<small> / 20</small>', text: 'WU LAW INTL’s new site, first month: 20 consultations, 6 paying clients (owner-reported). Go Hike: 102 routes with prices and 22 FAQ answers in structured data.' };
  var HONEST = ZH ? '沒有人能保證 AI 一定會提到你；我們量測，不打包票。' : 'Nobody can guarantee an AI will name you. We measure; we don’t promise.';

  var DX = {
    zh: {
      root: { mkt: '客戶找不到你', auto: '流程太手動', sys: '需要一套系統' },
      mkt: {
        section: '#marketing', topic: 'visibility',
        qs: [
          { q: '你的網站現在是什麼狀況？', sub: '選最接近的一個。', opts: [
            ['noai', 'Google 還行，但 AI 不會提到我', '問 ChatGPT「推薦誰」，答案都是別人'],
            ['nogoogle', '有網站，但 Google 搜不太到', '要搜公司名才找得到'],
            ['noweb', '還沒有網站，或網站很舊', '手機上不好看、很久沒更新'],
            ['unsure', '我不確定', '想先知道現在的狀況']] },
          { q: '你的客戶主要在哪裡？', sub: '這決定要用中文、英文，還是兩種語言量測。', opts: [
            ['tw', '台灣', '客戶用中文搜尋、問 AI'],
            ['intl', '海外', '客戶用英文搜尋、問 AI'],
            ['both', '台灣和海外都有', '中英文都要']] }
        ],
        result: function (a) {
          var r = {
            noai: { title: 'AI 還不認識你', topic: 'visibility',
              wrong: 'ChatGPT、Perplexity 這類 AI 回答時，會讀它信任的地方：名錄、新聞、別人的文章，以及能直接回答問題的頁面。你的網站如果沒有「一打開就直接回答客人問題」的頁面、FAQ 和結構化資料，AI 就會引用別人；有時還會把你和名字相近的公司搞混。',
              first: '免費 AI 能見度檢測：用你客戶真的會問的問題，同時問 ChatGPT、Claude、Perplexity、Gemini，記錄誰被點名、引用了哪些網站。接著每週補上缺的頁面、FAQ、JSON-LD 與 llms.txt，每項修改先給你核准。', proof: WU_AI },
            nogoogle: { title: 'Google 讀不懂你的網站', topic: 'marketing',
              wrong: '常見原因：標題和描述沒寫清楚你做什麼、沒有結構化資料、速度慢、沒提交 sitemap，或頁面沒有回答客戶真正在搜尋的問題。這些都量得到，不用猜。',
              first: '能見度健檢：接上 Google Search Console、爬過整個網站、檢查速度與結構化資料，列出最值得先修的事；接著每週修正、發布，後台看得到點擊和第 1 頁搜尋字詞的變化。', proof: WU_G },
            noweb: { title: '先有一個 AI 讀得懂的網站', topic: 'marketing',
              wrong: '舊網站常把重要資訊放在圖片裡、手機版難用、沒有結構化資料，Google 和 AI 都很難讀懂。修補的成本有時比重做還高。',
              first: '從第一天就把每一頁做成「一打開就直接回答客人問題」：每項服務一頁、常見問題寫成 FAQ，結構化資料與 llms.txt 一起上線。我們先看現有網站值不值得修，再建議修或重做。', proof: WU_NEW },
            unsure: { title: '先量，再決定', topic: 'visibility',
              wrong: '不知道問題在哪很正常：多數老闆沒看過 AI 怎麼介紹自己的公司，也沒打開過 Search Console。',
              first: '免費 AI 能見度檢測：我們用你客戶會問的問題問 4 家 AI，告訴你被提到幾次、推薦了誰、讀了哪些網站。看完再決定要不要做下一步。', proof: WU_AI }
          }[a[0]];
          r.when = { tw: '用繁體中文的真實客戶問題量測與修正。', intl: '英文版要針對海外客戶的問法重寫，不是直接翻譯。', both: '中英文分開量測、一起修：台灣客戶用中文問，海外客戶用英文問。' }[a[1]];
          r.note = HONEST;
          return r;
        }
      },
      auto: {
        section: '#ai', topic: 'training',
        qs: [
          { q: '哪一種工作最花時間？', sub: '選一個最常抱怨的。', opts: [
            ['report', '整理報表、週報', '從 CRM、Excel、LINE 抄數字'],
            ['reply', '回覆客人訊息', 'LINE、email 一直回同樣的問題'],
            ['docs', '會議記錄、報價、文件', '開完會還要花一小時整理'],
            ['byoai', '大家各自用 AI，沒有規範', '不知道誰把什麼資料貼進去']] },
          { q: '你想怎麼開始？', sub: '兩種都可以，也可以先聊再決定。', opts: [
            ['train', '讓員工自己學會', '企業內訓或工作坊'],
            ['build', '直接幫我們做好', '自動化代建'],
            ['talk', '先聊聊再決定', '還不確定適合哪一種']] }
        ],
        result: function (a) {
          var w = {
            report: ['報表與週報可以交給 AI 先做', '資料散在 CRM、Excel 和 LINE 群組，每週有人花兩小時複製貼上。「收集 → 整理 → 寫摘要」最適合交給 AI，人只負責最後審閱。', '週報：約 2 小時 → 約 10 分鐘'],
            reply: ['客服回覆可以先由 AI 擬稿', '出貨、退換貨、規格，同樣的問題每天回幾十次。AI 可以依你的 FAQ、商品資料和訂單狀態先擬好回覆，員工確認後送出，特殊狀況轉給人。', '客服回覆：每天 1–2 小時 → 約 20–30 分鐘'],
            docs: ['會後的文書可以自動化', '開完會要寫記錄、做報價、追待辦，常常比會議本身還久。錄音轉成摘要與待辦，AI 依價目表填好報價單，人只看最後一遍。', '每場會議後：約 1.5 小時 → 約 15 分鐘審閱'],
            byoai: ['先有方法和規範，再談效率', '員工早就在用 AI，但各用各的：沒有範本、沒有規範、看不到成效，資料也可能放進不該放的工具。', '84% 的台灣知識工作者已在用生成式 AI；全球只有 39% 受過公司提供的訓練（Microsoft × LinkedIn，2024）']
          }[a[0]];
          var f = {
            train: ['training', '企業內訓：半日入門、全日實作，或 4–6 週陪跑。每個團隊先盤點重複的工作，選一個流程，兩週內做出來；附 AI 使用守則草稿。'],
            build: ['automation', '自動化代建：先做流程盤點，再用 n8n 或 Claude agents 接上 LINE、Gmail、Google Sheets 或 CRM，附交接文件與操作訓練。AI 能讀什麼事先講好，花錢或對外發送的動作一定有人核准。'],
            talk: ['training', '先預約 20 分鐘：告訴我們哪件事最花時間，我們直接說適合培訓、代建，還是兩者都還不需要。']
          }[a[1]];
          return { title: w[0], wrong: w[1], first: f[1], topic: f[0],
            proof: { big: a[0] === 'byoai' ? '84%' : '', text: (a[0] === 'byoai' ? '' : '示意範例，非客戶實績：') + w[2] + (a[0] === 'byoai' ? '' : '。我們自己的行銷系統也每 8 小時自動檢查、擬草稿，人按核准才上線。') },
            note: '企業內訓可能適用勞動部訓練補助，我們可協助確認資格。' };
        }
      },
      sys: {
        section: '#software', topic: 'software',
        qs: [
          { q: '最想先解決的是？', sub: '先選一個最痛的，其他的在先期規劃時一起談。', two: true, opts: [
            ['internal', '訂單、庫存、排班還在用 Excel', '內部管理系統'],
            ['booking', '客人用 LINE 預約，常漏接', '預約與會員系統'],
            ['portal', '客戶一直打電話問進度', '客戶入口網站'],
            ['app', '想要自己的 App', 'iOS／Android'],
            ['integrate', '好幾套系統要人工重打資料', '串接與自動化'],
            ['ai', '想讓 AI 讀公司文件回答問題', 'AI 助理'],
            ['rescue', '專案卡住，或舊系統沒人敢動', '救援與翻新']] },
          { q: '大概多少人會用？', sub: '用來估計範圍，不是報價。', opts: [
            ['s', '1–5 人', '內部小團隊'],
            ['m', '6–30 人', '幾個部門一起用'],
            ['l', '30 人以上', '或開放給客戶使用']] }
        ],
        result: function (a) {
          var w = {
            internal: ['你需要一個「唯一正確」的版本', 'Excel 適合一個人用，不適合五個人同時改：版本對不上、公式被改壞、沒人知道誰動過。問題通常不是缺軟體，而是資料沒有一個大家都信任的地方。'],
            booking: ['預約要集中，規則要自動', '預約散在 LINE、電話和紙本，就會漏接、重複、爽約沒人追。先看現成的預約工具能不能用；不夠的部分（例如你的特殊規則）再做。'],
            portal: ['讓客戶自己看得到進度', '客戶打電話問進度，是因為他看不到進度。一個登入就看得到狀態、文件和下一步的入口，可以省下大量來回。'],
            app: ['第一版只做讓人回來的那件事', 'App 的價值在熟客會反覆打開它。先確認哪一個功能會讓人每週回來，第一版只做那個，iOS 與 Android 一套程式碼。'],
            integrate: ['不用換系統，先把它們接起來', '工具本身沒問題，問題是它們不會互相講話。企業平均使用 897 套應用程式，只有 29% 彼此串接（MuleSoft，2025）。寫一段串接，通常比換掉整套系統便宜。'],
            ai: ['先整理資料，AI 才答得對', 'AI 助理答錯，多半是讀不到你的文件，或讀到過期的版本。先把資料來源與權限整理好，再用兩週、拿真實資料做試作。'],
            rescue: ['先盤點，再決定修還是重寫', '卡住的專案通常不是程式寫不出來，而是範圍一直變、沒有人說得清楚「完成」長什麼樣子。']
          }[a[0]];
          var e = estimate([a[0]], a[1], a[0] === 'app' ? 'mobile' : 'web');
          var proof = a[0] === 'booking' ? { big: '102', text: '山行接駁 Go Hike：台北、台中到玉山、雪山登山口的接駁預約網站，102 條路線與價格，2026 年 9 月上線。' }
            : { big: '', text: 'LEADx · EQ 360 評量平台：評量引擎、計分、管理後台與點數系統（leadx.org）。台灣案例：山行接駁 Go Hike 預約網站，102 條路線與價格。' };
          return { title: w[0], wrong: w[1], topic: 'software',
            first: '先期規劃（1–2 週，固定費用）：訪談、畫出流程，決定哪些買現成、哪些要做，交給你書面規劃、可點擊的原型和固定報價。就算不繼續合作，這份規劃也是你的。',
            when: a[0] === 'rescue' ? T.rescueNote : (e.long ? T.phased + ' ' + e.lo + '–' + e.hi + ' ' + T.weeks + T.phasedTail : T.phase1 + ' ' + e.lo + '–' + e.hi + ' ' + T.weeks + '（' + T.tiers[e.tier] + '）。' + T.typical),
            proof: proof, note: '軟體開發依專案報價；程式碼、帳號與資料都歸你。' };
        }
      }
    },
    en: {
      root: { mkt: 'Customers can’t find you', auto: 'Too much manual work', sys: 'You need a system' },
      mkt: {
        section: '#marketing', topic: 'visibility',
        qs: [
          { q: 'Where does your website stand today?', sub: 'Pick the closest one.', opts: [
            ['noai', 'Google is OK, but AI never names us', 'Ask ChatGPT who to hire and it names others'],
            ['nogoogle', 'We have a site, but Google barely shows it', 'Only our exact name finds us'],
            ['noweb', 'No website, or a very old one', 'Hard to use on phones, rarely updated'],
            ['unsure', 'Not sure', 'I’d like to know where we stand']] },
          { q: 'Where are your customers?', sub: 'This decides which languages we test in.', opts: [
            ['tw', 'Taiwan', 'They search and ask AI in Chinese'],
            ['intl', 'US / overseas', 'They search and ask AI in English'],
            ['both', 'Both', 'We need English and Chinese']] }
        ],
        result: function (a) {
          var r = {
            noai: { title: 'AI doesn’t know you yet', topic: 'visibility',
              wrong: 'When ChatGPT or Perplexity answers, it reads sources it trusts: directories, news, other people’s articles, and pages that answer the question directly. If your site has no pages that answer customer questions right away, no FAQ and no structured data, the AI cites someone else, and sometimes mixes you up with a similar name.',
              first: 'A free AI visibility check: we ask ChatGPT, Claude, Perplexity and Gemini the questions your customers actually ask, and record who gets named and which sites they read. Then we add the missing pages, FAQ, JSON-LD and llms.txt every week, each one approved by you first.', proof: WU_AI },
            nogoogle: { title: 'Google can’t read your site well', topic: 'marketing',
              wrong: 'The usual causes: titles that don’t say what you do, no structured data, a slow site, no sitemap, or pages that don’t answer what customers search for. All of it can be measured.',
              first: 'A visibility audit: we connect Google Search Console, crawl the whole site, check speed and structured data, and list what to fix first. Then weekly fixes, with clicks and page-1 searches tracked on your dashboard.', proof: WU_G },
            noweb: { title: 'Start with a site AI can read', topic: 'marketing',
              wrong: 'Old sites often keep key facts in images, work badly on phones and have no structured data, so neither Google nor AI can read them. Patching can cost more than rebuilding.',
              first: 'From day one, every page answers a customer question right away: one page per service, real FAQ, structured data and llms.txt at launch. We check first whether your current site is worth fixing.', proof: WU_NEW },
            unsure: { title: 'Measure first, then decide', topic: 'visibility',
              wrong: 'Most owners have never seen how AI describes their business, or opened Search Console. Not knowing is normal.',
              first: 'A free AI visibility check: we ask 4 AI engines your customers’ questions and show you how often you’re named, who is recommended instead, and which sites they read.', proof: WU_AI }
          }[a[0]];
          r.when = { tw: 'We test and fix with real customer questions in Traditional Chinese.', intl: 'English pages get written for how overseas customers ask, not translated.', both: 'English and Chinese are measured separately and fixed together.' }[a[1]];
          r.note = HONEST;
          return r;
        }
      },
      auto: {
        section: '#ai', topic: 'training',
        qs: [
          { q: 'Which work eats the most time?', sub: 'Pick the one people complain about most.', opts: [
            ['report', 'Reports and weekly updates', 'Copying numbers from CRM, Excel, chats'],
            ['reply', 'Answering customer messages', 'The same questions on LINE and email'],
            ['docs', 'Meeting notes, quotes, documents', 'An hour of admin after every meeting'],
            ['byoai', 'Everyone uses AI their own way', 'No rules on what data goes where']] },
          { q: 'How would you like to start?', sub: 'Either works. You can also talk first.', opts: [
            ['train', 'Teach our people', 'Staff training or a workshop'],
            ['build', 'Build it for us', 'Done-for-you automation'],
            ['talk', 'Talk first', 'Not sure which fits']] }
        ],
        result: function (a) {
          var w = {
            report: ['Let AI draft the reports', 'Data sits in the CRM, Excel and chat groups, and someone spends two hours a week copying it. Collect → organise → summarise is ideal AI work, with a person reviewing the result.', 'Weekly report: about 2 hours → about 10 minutes'],
            reply: ['Let AI draft the replies', 'Shipping, returns, specs: the same questions dozens of times a day. AI drafts replies from your FAQ, product sheet and order status; staff approve and send, and unusual cases go to a person.', 'Customer replies: 1–2 hours a day → about 20–30 minutes'],
            docs: ['Automate the after-meeting admin', 'Notes, quotes and follow-ups often take longer than the meeting. The recording becomes a summary and to-dos, AI fills the quote from your price list, a person checks it.', 'After each meeting: about 1.5 hours → about 15 minutes of review'],
            byoai: ['Method and rules first, then speed', 'Your people already use AI, each in their own way: no templates, no rules, no visible results, and data may end up in the wrong tool.', '84% of Taiwan knowledge workers use generative AI; only 39% of AI users worldwide got training from their company (Microsoft × LinkedIn, 2024)']
          }[a[0]];
          var f = {
            train: ['training', 'Staff training: a half-day intro, a full-day hands-on session, or a 4–6 week guided programme. Each team lists repetitive work, picks one process and ships it within two weeks, plus a draft AI usage policy.'],
            build: ['automation', 'Done-for-you automation: we map the process, then build it with n8n or Claude agents wired to LINE, Gmail, Google Sheets or your CRM, with handover docs and training. What the AI can read is agreed up front; anything costly or outbound needs a person’s approval.'],
            talk: ['training', 'Book 20 minutes: tell us which task eats the most time, and we’ll say whether training, a build, or neither makes sense yet.']
          }[a[1]];
          return { title: w[0], wrong: w[1], first: f[1], topic: f[0],
            proof: { big: a[0] === 'byoai' ? '84%' : '', text: (a[0] === 'byoai' ? '' : 'Illustrative example, not a client result: ') + w[2] + (a[0] === 'byoai' ? '' : '. Our own marketing system re-checks sites and drafts fixes every 8 hours; a person approves before anything goes live.') },
            note: 'Training can be on-site in Taiwan or online.' };
        }
      },
      sys: {
        section: '#software', topic: 'software',
        qs: [
          { q: 'What do you most want to fix first?', sub: 'Pick the biggest pain; the rest comes up in discovery.', two: true, opts: [
            ['internal', 'Orders, stock or rosters live in Excel', 'Internal tools'],
            ['booking', 'Bookings arrive by chat and get missed', 'Booking & membership'],
            ['portal', 'Clients keep calling for updates', 'Client portal'],
            ['app', 'We want our own app', 'iOS / Android'],
            ['integrate', 'Staff retype data between systems', 'Integrations & automation'],
            ['ai', 'AI that answers from our documents', 'AI assistant'],
            ['rescue', 'A stuck project or a legacy system', 'Rescue & modernise']] },
          { q: 'Roughly how many people will use it?', sub: 'For a typical range, not a quote.', opts: [
            ['s', '1–5 people', 'A small internal team'],
            ['m', '6–30 people', 'Several departments'],
            ['l', '30+ people', 'Or open to your customers']] }
        ],
        result: function (a) {
          var w = {
            internal: ['You need one version of the truth', 'Excel works for one person, not five editing at once: versions drift, formulas break, nobody knows who changed what. The gap is usually a single trusted place for the data.'],
            booking: ['Centralise bookings, automate the rules', 'Bookings spread over chat, phone and paper get missed or doubled. We check first whether an off-the-shelf tool does the job, and build only your special rules.'],
            portal: ['Let clients see progress themselves', 'Clients call because they can’t see status. A login with status, documents and next steps removes most of that back-and-forth.'],
            app: ['Version 1 does the one thing people return for', 'An app pays off when regulars open it again and again. We find the feature that brings people back weekly and ship that first, one codebase for iOS and Android.'],
            integrate: ['Connect your tools before replacing them', 'The tools are fine; they just don’t talk. The average enterprise runs 897 apps and only 29% are integrated (MuleSoft, 2025). A connector usually costs far less than a new system.'],
            ai: ['Organise the data, then the AI gets it right', 'AI assistants get answers wrong mostly because they can’t see your documents, or see old versions. We sort out sources and permissions, then run a two-week pilot on real data.'],
            rescue: ['Assess first, then fix or rebuild', 'Stuck projects are rarely about code that can’t be written. Usually the scope kept moving and nobody could say what "done" looks like.']
          }[a[0]];
          var e = estimate([a[0]], a[1], a[0] === 'app' ? 'mobile' : 'web');
          var proof = a[0] === 'booking' ? { big: '102', text: 'Go Hike: hiking-shuttle booking site from Taipei and Taichung to Yushan and Xueshan trailheads, 102 routes with prices, launched September 2026.' }
            : { big: '', text: 'LEADx · EQ 360 assessment platform: assessment engine, scoring, admin console and credit system (leadx.org). In Taiwan: the Go Hike booking site, 102 routes with prices.' };
          return { title: w[0], wrong: w[1], topic: 'software',
            first: 'Discovery (1–2 weeks, fixed fee): interviews, a process map, what to buy vs build, then a written plan, clickable prototype and fixed quote. The plan is yours even if you stop there.',
            when: a[0] === 'rescue' ? T.rescueNote : (e.long ? T.phased + ' ' + e.lo + '–' + e.hi + ' ' + T.weeks + T.phasedTail : T.phase1 + ' ' + e.lo + '–' + e.hi + ' ' + T.weeks + ' (' + T.tiers[e.tier] + '). ' + T.typical),
            proof: proof, note: 'Software is quoted per project; the code, accounts and data are yours.' };
        }
      }
    }
  }[L];

  /* ---------------- estimator (shared by picker + diagnostic) ---------------- */
  var BASE = { internal: [6, 10], booking: [4, 8], portal: [6, 10], app: [8, 14], integrate: [2, 4], ai: [4, 8], rescue: [2, 4] };
  function estimate(needs, users, platform) {
    if (!needs.length) return null;
    var lo = 0, hi = 0, n = needs.length, hasApp = needs.indexOf('app') > -1;
    needs.forEach(function (k) { lo = Math.max(lo, BASE[k][0]); hi = Math.max(hi, BASE[k][1]); });
    lo += 2 * (n - 1); hi += 3 * (n - 1);
    if (users === 'm') { lo += 1; hi += 2; } else if (users === 'l') { lo += 2; hi += 4; }
    if (platform === 'both') { lo += hasApp ? 2 : 4; hi += hasApp ? 3 : 6; }
    else if (platform === 'mobile' && !hasApp) { lo += 3; hi += 5; }
    var score = n + (users === 'l' ? 1 : 0) + (platform === 'both' ? 1 : 0) + (hasApp ? 1 : 0);
    var small = n === 1 && /integrate|rescue|ai/.test(needs[0]) && users !== 'l' && platform === 'web';
    var tier = small ? 's' : (score >= 4 || (hasApp && platform === 'both') ? 'l' : 'm');
    return { lo: lo, hi: hi, tier: tier, long: hi > 16 };
  }

  /* ---------------- helpers ---------------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2200);
  }
  var form = $('#contactForm');
  function setTopic(key) {
    if (!form) return;
    var sel = form.elements.topic;
    for (var i = 0; i < sel.options.length; i++) if (sel.options[i].getAttribute('data-key') === key) { sel.selectedIndex = i; return true; }
    return false;
  }
  function prefill(key, msg) {
    if (!form) return;
    setTopic(key);
    if (msg) form.elements.message.value = msg;
    form.elements.topic.parentNode.classList.add('prefilled');
    if (msg) form.elements.message.parentNode.classList.add('prefilled');
    var n = $('#prefillNote'); if (n && msg) n.classList.add('is-on');
  }
  function goContact() {
    var c = $('#contact'); if (!c) return;
    c.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () { var f = form && form.elements.name; if (f) try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }, reduce ? 0 : 600);
  }

  /* ---------------- header / menu ---------------- */
  var header = $('.site-header'), menuBtn = $('.menu-btn'), nav = $('#navLinks');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function closeMenu() { if (!nav) return; nav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', T.menuOpen); }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuBtn.focus(); } });
    doc.addEventListener('click', function (e) { if (nav.classList.contains('is-open') && !e.target.closest('.header-inner')) closeMenu(); });
  }

  /* ---------------- reveal on scroll ---------------- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    var vh = window.innerHeight;
    $$('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < vh) { el.style.transition = 'none'; el.classList.add('is-in'); }
      else io.observe(el);
    });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---------------- DIAGNOSTIC ---------------- */
  var dx = $('#dx');
  if (dx) (function () {
    var stage = $('.dx-stage', dx), back = $('.dx-back', dx), dots = $$('.dx-dots span', dx), titleT = $('.dx-title-t', dx), live = $('#dx-live');
    var startHTML = stage.innerHTML;
    var current = [], pushed = 0, wantFocus = false;
    var chev = '<svg class="dx-chev" aria-hidden="true"><use href="#i-chev"/></svg>';
    var ico = { mkt: 'i-search', auto: 'i-zap', sys: 'i-layers' };

    function parse(h) {
      h = (h || '').replace(/^#/, '');
      if (h.indexOf('dx') !== 0) return null;
      var p = h.split('/').slice(1).filter(Boolean), out = [];
      if (p[0] && DX[p[0]] && DX.root[p[0]]) {
        out.push(p[0]);
        var path = DX[p[0]];
        for (var i = 0; i < path.qs.length && p[i + 1]; i++) {
          var ok = path.qs[i].opts.some(function (o) { return o[0] === p[i + 1]; });
          if (!ok) break; out.push(p[i + 1]);
        }
      }
      return out;
    }
    function hashOf(p) { return p.length ? '#dx/' + p.join('/') : ''; }
    function labelOf(p, i) {
      if (i === 0) return DX.root[p[0]];
      var o = DX[p[0]].qs[i - 1].opts.filter(function (x) { return x[0] === p[i]; })[0];
      return o ? o[1] : '';
    }
    function crumbs(p) {
      var h = '<div class="dx-crumbs" aria-label="' + T.youChose + '">';
      for (var i = 0; i < p.length; i++) h += '<span>' + labelOf(p, i) + '</span>';
      return h + '</div>';
    }
    function qPanel(p) {
      var path = DX[p[0]], q = path.qs[p.length - 1], h = crumbs(p);
      h += '<p class="dx-q" tabindex="-1">' + q.q + (q.sub ? '<small>' + q.sub + '</small>' : '') + '</p>';
      h += '<ul class="dx-opts' + (q.opts.length > 4 ? ' compact' : '') + (q.two ? ' two' : '') + '">';
      q.opts.forEach(function (o, i) {
        h += '<li><button type="button" class="dx-opt" data-v="' + o[0] + '" data-c="' + p[0] + '">' +
          (q.opts.length <= 4 ? '<span class="dx-ico"><svg aria-hidden="true"><use href="#' + ico[p[0]] + '"/></svg></span>' : '') +
          '<span class="dx-t"><strong>' + o[1] + '</strong><span>' + o[2] + '</span></span>' +
          (i < 9 ? '<kbd class="dx-key" aria-hidden="true">' + (i + 1) + '</kbd>' : '') + chev + '</button></li>';
      });
      return h + '</ul>';
    }
    function resultData(p) { var r = DX[p[0]].result(p.slice(1)); r.section = DX[p[0]].section; return r; }
    function resultPanel(p) {
      var r = resultData(p);
      var proof = '<div class="rproof">' + (r.proof.big ? '<span class="big">' + r.proof.big + '</span>' : '') + '<p>' + r.proof.text + '</p></div>';
      return crumbs(p) + '<div class="dx-result">' +
        '<p class="rtag"><svg aria-hidden="true"><use href="#i-spark"/></svg>' + T.rtag + '</p>' +
        '<h2 tabindex="-1" class="dx-q-r">' + r.title + '</h2>' +
        '<div class="rblocks">' +
        '<div class="rblock"><h3><i>1</i>' + T.wrong + '</h3><p>' + r.wrong + '</p></div>' +
        '<div class="rblock"><h3><i>2</i>' + T.first + '</h3><p>' + r.first + '</p>' + (r.when ? '<p class="when">' + r.when + '</p>' : '') + '</div>' +
        '<div class="rblock wide"><h3><i>3</i>' + T.proof + '</h3>' + proof + '</div>' +
        '</div>' +
        (r.note ? '<p class="rnote">' + r.note + '</p>' : '') +
        '<div class="ractions">' +
        '<a class="btn btn-primary" href="#contact" data-dx-cta>' + T.cta + ' <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
        '<a class="btn btn-ghost" href="' + CAL + '" target="_blank" rel="noopener">' + T.cal + ' <svg class="ico" aria-hidden="true"><use href="#i-out"/></svg></a>' +
        '</div>' +
        '<div class="rlinks">' +
        '<a class="link-arrow" href="' + r.section + '">' + T.more + ' <svg class="ico" aria-hidden="true"><use href="#i-down"/></svg></a>' +
        '<button type="button" data-dx-share><svg class="ico" aria-hidden="true"><use href="#i-link"/></svg>' + T.share + '</button>' +
        '<button type="button" data-dx-restart><svg class="ico" aria-hidden="true"><use href="#i-redo"/></svg>' + T.restart + '</button>' +
        '</div></div>';
    }

    function render(p, animate) {
      var dir = p.length >= current.length ? 'is-enter' : 'is-enter-back';
      var path = p.length ? DX[p[0]] : null, total = path ? path.qs.length : 2;
      var isResult = path && p.length > path.qs.length;
      var html = !p.length ? startHTML : '<div class="dx-panel" data-step="' + p.length + '">' + (isResult ? resultPanel(p) : qPanel(p)) + '</div>';
      var oldH = stage.offsetHeight;
      stage.innerHTML = p.length ? html : startHTML;
      var panel = stage.firstElementChild;
      if (animate && !reduce) {
        panel.classList.add(dir);
        var newH = stage.scrollHeight;
        stage.style.height = oldH + 'px';
        stage.offsetHeight; // reflow
        stage.style.height = newH + 'px';
        var done = function () { stage.style.height = ''; stage.removeEventListener('transitionend', done); };
        stage.addEventListener('transitionend', done); setTimeout(done, 450);
      }
      current = p.slice();
      dx.classList.toggle('has-back', p.length > 0);
      dx.classList.toggle('is-result', !!isResult);
      dots.forEach(function (d, i) { d.className = i < p.length ? 'is-done' : (i === p.length ? 'is-current' : ''); });
      if (isResult) dots.forEach(function (d) { d.className = 'is-done'; });
      titleT.textContent = !p.length ? T.title0 : (isResult ? T.titleR : T.titleQ(p.length + 1, total + 1));
      var head = $('.dx-q, .dx-q-r', stage);
      if (live && head) live.textContent = head.textContent;
      if (wantFocus && head) { try { head.focus({ preventScroll: true }); } catch (e) { head.focus(); } }
      wantFocus = false;
      if (isResult && animate) {
        var top = dx.getBoundingClientRect().top;
        if (top < 0) dx.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    }
    function same(a, b) { return a.join('/') === b.join('/'); }
    function go(p) { wantFocus = true; pushed++; location.hash = hashOf(p); }
    function goBack() {
      if (!current.length) return;
      wantFocus = true;
      var p = current.slice(0, -1);
      if (pushed > 0) { pushed--; history.back(); }
      else { history.replaceState(null, '', hashOf(p) || location.pathname + location.search); render(p, true); }
    }
    function restart() {
      wantFocus = true;
      history.pushState(null, '', location.pathname + location.search); pushed++;
      render([], true);
      var first = $('.dx-opt', stage); if (first) first.focus({ preventScroll: true });
    }

    window.addEventListener('hashchange', function () {
      var h = location.hash, p;
      if (h === '' || h === '#') p = [];
      else p = parse(h);
      if (!p || same(p, current)) return;
      render(p, true);
    });

    dx.addEventListener('click', function (e) {
      var opt = e.target.closest('.dx-opt');
      if (opt) { e.preventDefault(); opt.classList.add('is-picked'); var v = opt.getAttribute('data-v'); setTimeout(function () { go(current.concat(v)); }, reduce ? 0 : 140); return; }
      if (e.target.closest('[data-dx-restart]')) { restart(); return; }
      if (e.target.closest('[data-dx-share]')) {
        var url = location.href;
        if (navigator.share) { navigator.share({ title: doc.title, url: url }).catch(function () {}); return; }
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast(T.copied); }, function () { toast(T.copyFail); });
        else toast(T.copyFail);
        return;
      }
      var cta = e.target.closest('[data-dx-cta]');
      if (cta) {
        var r = resultData(current), path = [];
        for (var i = 0; i < current.length; i++) path.push(labelOf(current, i));
        prefill(r.topic, T.msgHead + path.join(' → ') + '\n' + T.rtag + (ZH ? '：' : ': ') + r.title + T.msgTail);
        e.preventDefault(); history.pushState(null, '', '#contact'); goContact();
      }
    });
    back.addEventListener('click', goBack);
    dx.addEventListener('keydown', function (e) {
      if (e.target.matches('input, textarea, select') || e.altKey || e.ctrlKey || e.metaKey) return;
      var opts = $$('.dx-opt', stage);
      if (/^[1-9]$/.test(e.key) && opts[+e.key - 1]) { e.preventDefault(); opts[+e.key - 1].click(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!opts.length) return;
        e.preventDefault();
        var i = opts.indexOf(doc.activeElement);
        i = e.key === 'ArrowDown' ? (i + 1) % opts.length : (i <= 0 ? opts.length - 1 : i - 1);
        opts[i].focus();
        return;
      }
      if ((e.key === 'Backspace' || e.key === 'ArrowLeft') && current.length) { e.preventDefault(); goBack(); }
    });

    var init = parse(location.hash);
    if (init && init.length) {
      render(init, false);
      setTimeout(function () { dx.scrollIntoView({ block: 'start' }); }, 60);
    }
  })();

  /* ---------------- MARKETING STORY stepper ---------------- */
  var story = $('[data-story]');
  if (story) (function () {
    var steps = $$('.story-step', story), vis = $$('.vis', story), idx = 0, timer = null, stopped = reduce, inView = false, DUR = 6500;
    function bar(i, run) {
      steps.forEach(function (s, j) {
        var b = $('.story-bar', s); if (!b) return;
        b.style.transition = 'none'; b.style.width = '0';
        if (j === i && run) { b.offsetWidth; b.style.transition = 'width ' + DUR + 'ms linear'; b.style.width = '100%'; }
      });
    }
    function show(i, user) {
      idx = i;
      steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); var b = $('.story-btn', s); if (b) b.setAttribute('aria-expanded', String(j === i)); });
      vis.forEach(function (v, j) { v.classList.toggle('is-active', j === i); v.setAttribute('aria-hidden', String(j !== i)); });
      if (user) { stopped = true; clearTimeout(timer); bar(i, false); } else schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (stopped || !inView || doc.hidden) { bar(idx, false); return; }
      bar(idx, true);
      timer = setTimeout(function () { show((idx + 1) % steps.length, false); }, DUR);
    }
    steps.forEach(function (s, i) { var b = $('.story-btn', s); if (b) b.addEventListener('click', function () { show(i, true); }); });
    show(0, false);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(story);
    }
    doc.addEventListener('visibilitychange', schedule);
  })();

  /* ---------------- SOFTWARE picker ---------------- */
  var picker = $('#picker'), out = $('#pk-out');
  if (picker && out) (function () {
    function labelFor(id) { var l = picker.querySelector('label[for="' + id + '"]'); return l ? l.textContent.trim() : id; }
    function update() {
      var needs = $$('input[name="need"]:checked', picker).map(function (i) { return i.value; });
      var users = (picker.querySelector('input[name="users"]:checked') || {}).value || 's';
      var plat = (picker.querySelector('input[name="platform"]:checked') || {}).value || 'web';
      var e = estimate(needs, users, plat);
      if (!e) { out.innerHTML = '<p class="empty">' + T.pkEmpty + '</p>'; return; }
      var onlyRescue = needs.length === 1 && needs[0] === 'rescue';
      var w = e.long ? '8–12 ' + T.weeks : e.lo + '–' + e.hi + ' ' + T.weeks;
      var h = '<p class="tier">' + T.tiers[e.tier] + '</p>';
      if (onlyRescue) h += '<p class="weeks">1–2 <small>' + T.weeks + '</small></p><p class="typ">' + T.rescueNote + '</p>';
      else if (e.long) h += '<p class="weeks">8–12 <small>' + T.weeks + '</small></p><p class="typ">' + T.phase1 + ' 8–12 ' + T.weeks + SEP + T.phased + ' ' + e.lo + '–' + e.hi + ' ' + T.weeks + SEP + T.typical + '</p>';
      else h += '<p class="weeks">' + e.lo + '–' + e.hi + ' <small>' + T.weeks + '</small></p><p class="typ">' + T.phase1 + ' ' + e.lo + '–' + e.hi + ' ' + T.weeks + SEP + T.typical + '</p>';
      h += '<h4>' + T.phasesH + '</h4><ol>' + T.ph(w).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
      h += '<h4>' + T.getH + '</h4><ul>' + needs.map(function (k) { return '<li>' + T.get[k] + '</li>'; }).join('') + '<li>' + T.own + '</li></ul>';
      h += '<a class="btn btn-primary" href="#contact" data-pk-cta>' + T.pkCta + ' <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a>';
      out.innerHTML = h;
      out._msg = T.pkMsg + needs.map(function (k) { return labelFor('n-' + k); }).join(ZH ? '、' : ', ') + (ZH ? '｜' : ' | ') + T.users[users] + (ZH ? '｜' : ' | ') + T.platform[plat] + (ZH ? '｜典型範圍：' : ' | Typical range: ') + (onlyRescue ? '1–2 ' + T.weeks : e.lo + '–' + e.hi + ' ' + T.weeks) + T.msgTail;
    }
    picker.addEventListener('change', update);
    out.addEventListener('click', function (ev) {
      if (!ev.target.closest('[data-pk-cta]')) return;
      ev.preventDefault(); prefill('software', out._msg); history.pushState(null, '', '#contact'); goContact();
    });
    update();
  })();

  /* ---------------- AI before/after ---------------- */
  var ba = $('[data-ba]');
  if (ba) (function () {
    var btns = $$('[data-ba-btn]', ba), panels = $$('[data-ba-panel]', ba), user = false;
    function set(k) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ba-btn') === k)); });
      panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-ba-panel') === k); });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { user = true; set(b.getAttribute('data-ba-btn')); }); });
    set('after');
    if (ba.getBoundingClientRect().top < window.innerHeight) { ba.classList.add('is-in', 'no-anim'); }
    else if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        o.disconnect(); ba.classList.add('is-in');
        if (reduce) return;
        set('before');
        setTimeout(function () { if (!user) set('after'); }, 3200);
      }, { threshold: 0.4 });
      o.observe(ba);
    } else ba.classList.add('is-in');
  })();

  /* ---------------- topic CTAs + ?topic= ---------------- */
  var qp = new URLSearchParams(location.search).get('topic');
  if (qp) setTopic(qp);
  $$('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); setTopic(a.getAttribute('data-topic'));
      history.pushState(null, '', '#contact'); goContact();
    });
  });

  /* ---------------- contact form (BRIEF §5) ---------------- */
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var st = $('.form-status', form), btn = $('button[type="submit"]', form);
    var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), topic = form.elements.topic.value, message = form.elements.message.value.trim();
    st.className = 'form-status';
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) { st.textContent = T.need; st.classList.add('err'); return; }
    var first = ZH ? name : name.split(/\s+/)[0];
    function ok() { form.reset(); $$('.prefilled', form).forEach(function (x) { x.classList.remove('prefilled'); }); var n = $('#prefillNote'); if (n) n.classList.remove('is-on'); st.textContent = T.sent(first); st.classList.add('ok'); }
    if (form.elements._honey.value) { ok(); return; }
    btn.disabled = true; st.textContent = T.sending;
    fetch('https://admin.shiptolive.com/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ name: name, email: email, topic: topic, message: message, lang: root.lang, page: location.pathname })
    }).then(function (r) { if (r.ok) ok(); else throw new Error(r.status); })
      .catch(function () { st.textContent = T.fail; st.className = 'form-status err'; })
      .then(function () { btn.disabled = false; });
  });
})();
