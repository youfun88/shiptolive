# Ship to Live redesign: shared brief (2026-11-04)

Five homepage layouts, drafts only, at /pending/redesign/1 … /5. Yufan picks one later.
Read this whole file, then `research-software.md` and `research-ai.md` in this folder.

## 0. Hard rules (break none of these)

- Company: **夏裕科技股份有限公司**, brand **Ship to Live**. 繁體中文 first (Taiwan is the main market), English second. Every layout ships `index.html` (zh-Hant, `lang="zh-Hant"`) and `en/index.html` (`lang="en"`), with a visible 中文 / EN toggle linking the two.
- Voice: 「我們」 studio voice. Lead with diagnosis + delivery (we find what's wrong, then we ship the fix). **No tenure claims** (no "20 年經驗", no years-of-experience), **no headcount framing** (not "solo", "one-person", "team of N"), **no swipes at competitors or other agencies** (don't say "no agency layer" or "unlike agencies").
- **Never invent** clients, testimonials, logos, results, awards or user counts. Only real items listed in §4. Industry stats only with a linked source + year (from §2, §3 or the research files). No guarantees of rankings/results: say we measure, not promise ("沒有人能保證 AI 一定會提到你；我們量測，不打包票").
- Prices: only the ones that already exist on the site (§4). Software and AI work: 「依專案報價」/ "quoted per project". Workshop prices: "洽詢" / "Ask us". Don't invent new prices.
- Contact (reuse only these):
  - Email: `mailto:yufan@shiptolive.com`
  - Book a call: `https://calendly.com/yufansapp/20min` (免費 20 分鐘 / free 20-minute call)
  - Contact form: POSTs to `https://admin.shiptolive.com/api/contact` (see §5 for exact code). Field names `name`, `email`, `topic`, `message`, honeypot `_honey`.
  - Never publish phone numbers. Never link /card or /zh/card.
- Tadapop / Tally: at most one passing mention (e.g. "we also run our own apps on the App Store"). Never featured, no screenshots.
- Every page head: `<meta name="robots" content="noindex,nofollow,noarchive">`. Do NOT add the Google sign-in review-gate script. Do not link these drafts from any public page. Don't touch files outside your own folder (and `shared/` only to add, never to change others' files).
- Tech: static HTML/CSS/vanilla JS, no build step, no frameworks. Small CDN libs only if pinned to an exact version (prefer none). Fonts: system stack, e.g. `-apple-system, BlinkMacSystemFont, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif` (Inter from `/assets/fonts/inter-latin.woff2` is available for Latin). Use root-absolute paths (`/pending/redesign/shared/img/...`, `/assets/...`).
- Quality bar: mobile-first. Yufan reviews on an iPhone: at 390px wide no horizontal scroll, ≥16px gutters, ≥44px tap targets, readable 16px+ body text. Respect `prefers-reduced-motion` (show final states, no autoplay motion). WCAG AA contrast. No console errors. No lorem ipsum. Lighthouse-friendly (lazy-load images, width/height on images).

## 1. The three services (the page sells these)

### ① 科技行銷 Tech marketing — "讓 Google 和 AI 找得到你、說得出你的名字"
What it is today (this is the existing main offer, the /seo-aeo-geo/ page): a monthly search-visibility service for a business's website, EN + 中文: **measure → find the gaps → fix and publish → client approves → report**.

What the marketing admin (admin.shiptolive.com/marketing, owner + client login) actually tracks per site, from the real code and `content_board.py report`:
- **AI 能見度檢測 (AI check)**: asks ChatGPT, Claude, Perplexity, Gemini (with live web search) the same set of real customer questions every month (15+ on the paid plan), records whether the business is named, whether its own site is cited, who is named instead, and which websites the AIs read (e.g. directories). Flags name mix-ups.
- **Google AI 摘要 / AI 模式 (AI Overviews / AI Mode)**: for the key searches, does Google's AI summary cite the site, and who does it cite instead.
- **Microsoft Copilot citations** from Bing Webmaster Tools' AI Performance report (real usage, not a test).
- **Google Search Console**: clicks, impressions, average position, ranking distribution (top 3 / page 1 / page 2 / beyond), searches worth a page, quick wins.
- **Keyword research** with real monthly search volume.
- **Site health** (uptime, speed, SSL, domain expiry, broken links, title, description, canonical, JSON-LD, AI-crawler access in robots.txt, llms.txt, sitemap) and a **page checklist** (H1, question H2s, FAQ, answer-first, etc. per page), **PageSpeed** (mobile/desktop scores, LCP, CLS).
- **HubSpot AI brand grade** (a second opinion), **Google reviews** count/rating.
- **Leads from the site**: contact-form sends + booking clicks, per month.
- **Content board + review queue**: drafts of new pages/FAQ/structured data go to a private review page; **nothing goes live until the owner taps 核准 (Approve) on their phone** (also via LINE notification).
- **Automated improvement runs every 8 hours** (02:00 / 10:00 / 18:00 Taiwan time): the system re-checks the site, drafts the next fixes, and queues them for approval. A monthly to-do list and a plain-language report email (中文 or English). "What we changed" log so the charts show what moved them.

**Real UI screenshots (sample data, not a client)** in `/pending/redesign/shared/img/`:
- `dash-zh-overview.webp` (1180×1252) / `dash-en-overview.webp` (1180×1286): "目前狀況 / Where things stand" + monthly checklist + the six result cards with trend charts.
- `dash-zh-ai-answers.webp` (750×850): "每個問題的回答" table: question × AI engine × named/not named × who it recommends instead.
- `dash-zh-rankings.webp` (1140×430): Google ranking distribution bars by month.
- `dash-zh-mobile.webp` / `dash-en-mobile.webp` (390×1055): the dashboard on a phone. Good inside an iPhone frame.
These are the real admin running in demo mode with **sample data** for Ship to Live's own site. Always caption them: 「後台實際畫面，數字為示範資料」/ "Real dashboard, sample data". You may also rebuild parts as HTML/SVG for animation (label "示意 / illustrative").

**The story to animate** (scroll or step-through): 1 健檢 audit (ask the AIs, crawl the site) → 2 找出缺口 find the gaps (not named, competitor cited, missing FAQ/structured data) → 3 每週修正與發布 fix & publish weekly (answer-first pages, FAQ, JSON-LD, llms.txt, directory listings, bilingual) → 4 看 AI 與 Google 開始引用 watch AI + Google pick it up (named-in-answers %, Copilot citations, page-1 searches rising) → 5 老闆用手機核准 owner approves from the phone (a phone mock with a draft and a 核准 button).

**Why pick us, in plain words for a business owner**: 
- 你看得到數字：每個月同一組客戶問題問 4 家 AI，前後對照，不是感覺。
- 你說了算：所有修改先放私人審核頁，你按核准才上線。
- 中英雙語一起做（台灣 + 海外客戶）。
- 寫網站的人就是修網站的人：診斷與修改同一處完成，不用來回轉述。
- 系統每 8 小時自動檢查，問題不用等到月報才發現。
- 誠實：AI 回答幾週內可能變化，Google 排名通常要幾個月；我們量測，不保證。

**Industry stats already used on the site (sourced, OK to reuse)**:
- Brands cited in Google's AI Overview get about **2.2×** the organic clicks of uncited ones (20,700 vs 9,400 clicks per 1M searches). Seer Interactive, 2026: https://www.seerinteractive.com/blog/aio-impact-on-google-ctr-2026-update
- **45%** of US consumers use AI tools like ChatGPT for local business picks, up from 6% a year earlier. BrightLocal Local Consumer Review Survey, 2026: https://www.brightlocal.com/research/local-consumer-review-survey/
- People click a result **8%** of the time when a Google AI summary appears vs **15%** without one. Pew Research, 2025: https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/

**Real client proof (WU LAW INTL PLLC, wulawintl.com, measured October 2026; use exactly):**
- AI check named the firm in **12 of 16** answers across ChatGPT, Claude, Perplexity and Gemini (4 client questions). 16 則 AI 回答中 12 則點名這家事務所。
- Microsoft Copilot cited the site **487 times in 90 days** (156 in the last 30). Source: Bing Webmaster Tools.
- **29 searches** show the site on Google page 1. Source: Google Search Console.
- **6 paying clients from 20 consultations** in the site's first month. Owner-reported (業主提供).
- Google's AI Overview cites wulawintl.com in its first line for 「外國人繼承台灣遺產應備文件」.

Existing marketing prices (may show, must match exactly; full list on /zh/seo-aeo-geo/#pricing):
免費 AI 能見度檢測 · 能見度健檢 NT$30,000 · 修好現有網站 NT$90,000 起 · 新網站 NT$150,000 起（創始客戶 NT$75,000，需搭配網站維護至少 6 個月並提供推薦）· 每月成長方案 NT$30,000/月（至少 3 個月）· 網站維護 NT$15,000/月. EN: free check · audit US$1,500 · Foundation from US$4,000 · new site from US$6,000 (founding US$2,500) · growth US$1,500/mo · site care US$500/mo. Linking "完整方案與價格 → /zh/seo-aeo-geo/#pricing" is usually better than repeating the table.

### ② 軟體開發 Software development — "把你的流程做成一套系統"
General custom software for businesses: 內部管理系統、預約與會員系統、客戶入口網站、iOS/Android App、資料串接與自動化（CRM、LINE、ERP、Excel 退場）、AI 助理（RAG 讀你自己的文件）、救援與翻新卡住的專案（含舊 PHP）. Don't feature Tadapop/Tally; it makes us look small. Talk about the general idea, show the process, back it with sourced stats (see research-software.md). Real platform proof you may use: **LEADx EQ 360 assessment platform** (assessment engine, scoring, admin console, credit system; leadx.org) and the client sites listed in §4.

Offer design (make it something people want to buy):
- **固定範圍的探索衝刺 Discovery sprint** (1–2 週): we map the process, find what to automate vs buy vs build, and hand over a written plan + clickable prototype + fixed quote. Useful even if they don't continue.
- **分階段交付**: 2-week sprints, a working demo every sprint, they can stop after any phase.
- **你擁有一切**: code, accounts, domains, data are in their name; documentation + handover; no lock-in.
- **先用現成的**: if off-the-shelf SaaS does the job we say so; we build only the part that is unique to them.
- AI-assisted development makes it faster, but a senior engineer reviews every line (be balanced: cite the research honestly).
- **Interactive picker / estimator** ("我們能幫你做什麼？"): user picks what they need (e.g. 預約/會員, 內部管理, 客戶入口, App, 串接自動化, AI 助理) + scale (使用者數, 平台) → shows the typical scope, phases, timeline ranges as "通常 X–Y 週" (label as typical, not a quote), what they get at the end, and a CTA prefilled into the contact form topic. **No prices.**
- Process steps already on the site (keep the spirit): 1 先聊聊（免費）→ 2 規劃與報價（固定價格，一封 email；較大的 AI 專案先用真實資料做兩週試作）→ 3 開發 → 上線（權限、紀錄、交接文件；程式碼與帳號都歸你）。

### ③ AI 導入 AI adoption — "教你的團隊把 AI 變成同事"
Teach employees and individuals to improve their workflow with AI, then build the automations for them. Model it on Nate Herk's ladder (see research-ai.md) and 雷蒙's 超級 AI 個體 (AI-agent-as-employee for individuals), adapted for Taiwan:
免費資源 (YouTube / 電子報 / LINE 社群 / 範本) → 個人工作坊或線上共學班 (low cost) → **企業內訓 員工 AI 工作流程培訓** (half-day / full-day / multi-week) → **代建自動化 done-for-you** (n8n / Claude agents wired to LINE, Gmail, Google Sheets, CRM) → 持續支援.
Must include an animated **before/after workflow demo**, e.g. 週報：2 小時 → 10 分鐘 (collect data from Sheets/email → AI drafts → human reviews → sends). Label it 「示意範例，非客戶實績」/ "Illustrative example, not a client result".
Don't promise course outcomes or invent student counts. Workshop/cohort prices: 「洽詢」/ "Ask us". If a cohort date is needed write 「下一梯次：開放預約」, not a fake date. Mention data safety (what the AI can read is scoped up front, actions logged, a person approves anything costly).

## 2. Site structure, nav, CTAs

Suggested nav (adapt per design): 科技行銷 · 軟體開發 · AI 導入 · 作品 · 關於 · [聯絡我們 button] · 中文/EN.
Primary CTA: 預約免費 20 分鐘諮詢 (Calendly). Secondary: 免費 AI 能見度檢測 (form with topic preselected) or email. Every service section ends with a CTA. Footer: 夏裕科技股份有限公司（統一編號 90173045）· Taipei & San Diego · email · links to /zh/about/, /zh/seo-aeo-geo/, /zh/projects/, /tools/ (EN: /about/, /seo-aeo-geo/, /projects/, /tools/) · © 2026 Ship to Live.

## 3. SEO / GEO must-keeps (for whichever layout becomes the homepage)

Even as drafts, build the head as the real homepage would need it (it'll be promoted later), but with noindex for now:
- `<title>` and meta description per language; `link rel=canonical` → for drafts point to `https://www.shiptolive.com/` (EN draft) / `https://www.shiptolive.com/zh/` (zh draft).
- hreflang alternates: en → https://www.shiptolive.com/, zh-Hant → https://www.shiptolive.com/zh/, x-default → https://www.shiptolive.com/ .
- OG/Twitter: og:image `https://www.shiptolive.com/assets/img/og.png?v=2` (1200×630).
- Google tag: **G-5W92T6J80C** — for drafts, leave it OUT (no analytics on drafts); note in an HTML comment where it goes.
- JSON-LD `@graph`: Organization + ProfessionalService (name Ship to Live, legalName 夏裕科技股份有限公司, url, email yufan@shiptolive.com, areaServed Taiwan + United States, knowsLanguage en, zh-Hant), WebSite, WebPage, FAQPage (questions actually shown on the page), Person (Yufan Chen, founder). Copy the shape from the current `/zh/index.html` `<script type="application/ld+json">` and update service descriptions to the three services.
- One H1. Question-style H2s where natural (e.g. 「為什麼 AI 搜尋不會提到你的公司？」). An FAQ section (4–6 Qs) with answer-first paragraphs. Visible text matters for AI engines: don't hide key facts only in images/canvas.
- Facts that must stay consistent with /llms.txt: founder-led studio in Taipei & San Diego; Taiwan contracts via 夏裕科技股份有限公司 (統編 90173045, 可開統一發票), US via QY LLC (San Diego); EN/中文; contact by email or form; phone not published.

## 4. Real proof you may use (and nothing else)

- **WU LAW INTL PLLC** (wulawintl.com): bilingual site for a New York–licensed attorney in Taipei, US–Taiwan cross-border inheritance/investment/business law. SEO/AEO/GEO from day one. Numbers in §1. Image: `/assets/img/wulaw-og.jpg` (1200×630).
- **山行接駁 Go Hike** (gohike.tw): hiking-shuttle booking site, Taipei/Taichung → 玉山、雪山 trailheads, launched Sept 2026; 102 routes + prices and 22 FAQ answers in structured data, plus llms.txt. Image `/assets/img/gohike-og.jpg`.
- **Azure Waves Realty** (azwrealty.com): real-estate website (client; describe neutrally, no numbers).
- **LEADx · EQ 360** (leadx.org): assessment platform — assessment engine, scoring, admin console, credit system.
- **Travis Bradberry** (travisbradberry.com): author site for the coauthor of *Emotional Intelligence 2.0*.
- **夏恆企業顧問 SHX** (shxtraining.com): corporate ESG training site, Taiwan & California.
- **QY Property** (qyproperty.com): San Diego cross-border real-estate advisory.
- **睿律 IL Solutions** (ilsolutions.com.tw): Taiwan legal services website.
- Founder: **Yufan Chen**, founder & principal engineer; former CTO of TalentSmartEQ (assessment platforms in 26 countries; the Emotional Intelligence Appraisal taken by over 1 million people); Johns Hopkins Agentic AI certificate; UC San Diego CS. Photo `/assets/img/founder.jpg` (400×400). No years-of-experience claims.
- Our own apps: Tally, Tadapop (passing mention only).

## 5. Contact form (copy this behaviour)

```html
<form id="contactForm" novalidate>
  <input name="name" required> <input name="email" type="email" required>
  <select name="topic">…</select> <textarea name="message" required></textarea>
  <input name="_honey" type="text" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
  <button type="submit">送出</button> <p role="status" aria-live="polite"></p>
</form>
```
```js
fetch('https://admin.shiptolive.com/api/contact', { method: 'POST',
  headers: { 'Content-Type': 'text/plain' },   // simple request, no CORS preflight
  body: JSON.stringify({ name, email, topic, message, lang: document.documentElement.lang, page: location.pathname }) })
// r.ok → reset + 「謝謝您，{name}！訊息已送出，我們會在 1–2 個工作天內回覆。」 / "Thanks, {first name}! We'll reply within 1–2 business days."
// fail → 「抱歉，訊息沒有送出成功。請直接寫信到 yufan@shiptolive.com。」
// honeypot filled → pretend success, don't send.
```
Topics (zh): 免費 AI 能見度檢測 / 科技行銷（SEO・AEO・GEO）/ 軟體或 App 開發 / AI 導入・員工培訓 / AI 自動化代建 / 還不確定. (EN equivalents.) Allow `?topic=` / JS to preselect a topic from CTAs.

## 6. Research files

- `research-software.md`: software project failure/overrun stats, SaaS vs custom, Taiwan SMB digital adoption, AI-assisted dev speed (balanced), offer-design ideas.
- `research-ai.md`: Nate Herk model, 雷蒙 超級 AI 個體, Taiwan & global AI-adoption stats, proposed offer ladder, before/after workflows, workshop curriculum.
Use only stats that have a source URL there; put the source link next to the number (small text) or in a footnote list.

## 7. Stat-use rules (from the research, read before quoting anything)

- Use only items marked verified in the research files. Never use anything marked UNVERIFIED (e.g. Flyvbjerg "1 in 6", METR 2026, Nate Herk's revenue claims, the 7.4% SME figure).
- Software: good picks are McKinsey/Oxford (large IT projects 45% over budget, 56% less value than predicted), Standish CHAOS 2020 (31% succeed), 2025 中小企業白皮書 (171.6 萬家中小企業，佔全體企業 98.9%、就業 79.3%), Zylo SaaS spend/unused licenses, MuleSoft (897 apps, 29% integrated). Frame failure stats as "大專案最容易出事 → 我們切小、分階段" — not fear-mongering.
- AI-assisted dev: be balanced. Don't claim "10x" or quote 55% as a general speedup. Fine: "研究結果差異很大：簡單任務快 21–56%，在熟悉的大型程式碼上反而可能更慢（METR 2025）→ 所以我們用 AI 加速，但每一行都有資深工程師審查。"
- AI adoption: Microsoft/LinkedIn Work Trend Index 2024 (Taiwan: 84% of knowledge workers use generative AI; global 75% use AI, 78% bring their own tools, only 39% got training from their company), McKinsey State of AI 2025 (88% of organisations use AI; ~2/3 haven't scaled it), 中企署 2025 survey (92% 中小企業對 AI 不了解或僅略懂) — the last one cite as reported by news, as the research notes.
- Training subsidies (勞動部 產業人才投資方案 / 企業人力資源提升計畫 / 小型企業人力提升計畫): at most one cautious line like 「企業內訓可能適用勞動部訓練補助，我們可協助確認資格」; never state percentages or promise eligibility.
- Never name 雷蒙/shifu.tw or Nate Herk on the page; they are inspiration for the offer structure only.
