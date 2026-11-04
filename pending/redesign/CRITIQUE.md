# CRITIQUE: 5 homepage drafts, from the seat of a skeptical Taiwanese SMB owner

Reviewer persona: owner of a 30-person trading company in 台中 (or a small 台北 accounting/law firm). I'm not technical. My nephew "does our website", my staff already use ChatGPT however they like, and orders still live in Excel and LINE groups. Agencies have burned me before.

Method (2026-11-04): headless Chrome at 390 px wide. Full-page captures after a scripted scroll so scroll-reveal content shows. Layout 3 needed viewport-chunk capture because the full-page capture hung. I read all the visible zh text extracted from HTML, skimmed EN heroes, and clicked through layout 4's quiz. The automated check found no horizontal overflow, no console errors, no broken images, one H1 each, and robots noindex on all five.

Page lengths at 390 px: **L1 22,057 · L2 21,198 · L3 31,726 · L4 17,891 · L5 15,568** (L5 is short only because half its content is hidden behind a tab on mobile; see below).

---

## Problems shared by all five (fix these whichever layout wins)

1. **Jargon.** Every layout puts 「SEO・AEO・GEO」 in eyebrows, chips and the form's topic list. I don't know what AEO or GEO is, and seeing it makes me feel sold to. The same goes for 「JSON-LD」「llms.txt」「結構化資料」「Copilot 引用」「sprint」「SaaS」「n8n」「Claude agents／代理」, and 「RAG」 in L3. Keep them in the step details, which is proof you know the craft. Remove them from headings, eyebrows, chips and the hero. Replace 「科技行銷 · SEO・AEO・GEO」 with 「科技行銷 · Google 與 AI 搜尋」. In the form `<select name="topic">` use 「科技行銷（Google／AI 搜尋曝光）」.
2. **「探索衝刺」 is translated English** ("discovery sprint"). No 台灣老闆 says that. Use 「先期規劃（1–2 週，固定費用）」 or 「需求盤點」. Also change 「兩週一個 sprint」 to 「每兩週交一版可以操作的進度」.
3. **「先給答案的頁面／答案先行」 is also translated.** Use 「一打開就直接回答客人問題的頁面」.
4. **Nobody tells me who picks up the call or what happens on it.** Under every 「預約免費 20 分鐘諮詢」 button, add one line: 「由創辦人 Yufan 本人接，中文或英文都可以；不適合就直說，不推銷。」 This would do more for trust than any stat.
5. **Proof is one law firm with US credentials.** WU LAW is the only numbers case, and it's a 紐約執照律師, not a company like mine. **山行接駁 Go Hike** is a real Taiwan booking site. Use it as the software case under 軟體開發 in every layout: 「台北、台中到玉山、雪山的接駁預約，102 條路線與價格」. It's closer to my world than LEADx.
6. **Too many US stats for a Taiwan buyer.** BrightLocal 45% is **美國** consumers, and so is Pew. Under the marketing section, lead with the Seer 2.2× stat, or move the US stats below the "how we work" steps. Never show three stat cards before you've told me what you do.
7. **Free resources that may not exist.** 「YouTube 教學、電子報、LINE 社群、範本下載」 appears in every AI ladder. If those channels aren't live yet, I'll check, find nothing, and stop trusting the rest. Either link real channels or rename tier 0 to 「免費資源（陸續上線）」. L5's 「加入名單」 button links to `#contact` with topic "unsure", which is misleading.
8. **Dashboard screenshots are unreadable at 390 px.** The `dash-*-overview` and `ai-answers` images render 300 px wide with 6 px text, so on a phone they read as decoration. On mobile, show only `dash-zh-mobile.webp` in a phone frame, or crop to one card.
9. **「接案中／目前接案中」 (L1, L4) reads like a freelancer.** For a 30-person company owner that lowers trust. Remove it, or say 「本月可安排新專案」.

---

## Layout 1: dark "bento" (`/pending/redesign/1/`)

**5-second test:** Clear. 「找出生意卡住的地方，再把解法做到上線。」 plus a subhead naming the three services, and the 12/16 · 487 · 29 proof appears in the first card below the fold. Understood in about 5 seconds. "For whom" is only 「中小企業」, which is fine.

**Would I book?** Maybe. The hero is good, and the proof card with sources is the strongest early proof of the five. But the dark neon look reads as "crypto / startup", not "someone who will fix my company's system". By the second screen I'm reading the same three services a second time.

**Confusing / too long / salesy:**
- **Every service appears twice**: once as a summary tile in `.hero` (`.tile.t-mk`, `.t-sw`, `.t-ai`), then again as the full `#marketing`, `#software` and `#ai` sections. That's the main reason the page runs 22k px.
- The hero preview estimator says 「第一階段通常 6–10 週」, but the real estimator below shows 「通常 7–12 週」 for the default selection. That inconsistency looks careless.
- Two extra illustrative cases with numbers (「客服 1–2 小時→20–30 分鐘／天」, 「會議記錄 1.5 小時→15 分鐘／次」). They're labelled 示意範例, but three invented time savings in a row starts to feel like a course ad.
- 「<title>Ship to Live 上線工作室」: 「上線工作室」 isn't a name anyone uses. Use 「Ship to Live 夏裕科技」.
- 「每天用的就是幫客戶做的同一套方法」 is OK.

**Mobile:**
- Stat carousels (`.stat` rows) cut the second card at the right edge ("45" and "39" peek in). Fine as a carousel hint, but there's no visible swipe cue.
- Grey-on-near-black body text in cards is about 14 px and low-contrast in the tiles (`.tile p`). Run it through an AA check.
- Footer links are 36 px tall (below the 44 px rule): 「SEO・AEO・GEO 方案」, 「作品」, 「English」, and so on. The 「重播」 button is 39 px tall.
- The countdown timer 2:00:00 → 0:10:00 is a nice touch, but the strikethrough red-on-dark is hard to read.

**Top 5 fixes:**
1. Delete the three hero service tiles' body content (`.hero .tile.t-mk`, `.t-sw`, `.t-ai`). Replace them with a three-row text index linking to `#marketing`, `#software` and `#ai`, the way L2/L3 do it. Keep the WU LAW proof card as its own block. This saves about 3,000 px and the déjà vu.
2. Switch to a light theme, or at least a light `#marketing` section. The 「看每月怎麼做」 storyline and the founder card would look more like a firm.
3. Make the hero estimator and the main estimator use the same numbers for the same selection (one shared data source in `app.js`), or remove the hero preview.
4. Remove the two extra 示意 cases (客服, 會議記錄) and keep only the 週報 demo, which is the one the brief asks for.
5. Raise footer links and `.replay` to at least 44 px; raise `.tile p` to 16 px with AA contrast.

---

## Layout 2: warm editorial with scroll-story (`/pending/redesign/2/`)

**5-second test:** Very clear. 「先找出哪裡卡住，再把修正做到上線。」, then three numbered services (01/02/03), then a dark card 「實績 · WU LAW 12/16 · 487 · 29 · 看案例」, all within about 1.5 screens. Best hero of the five for me.

**Would I book?** Yes, probably. It feels like a real Taiwanese firm (warm paper colours, red accent), and I see proof before I'm asked to do anything. 「每一次修改都由你核准」 in the subhead is exactly what a burned owner wants to hear. I'd trust it more with the "who answers the call" line and one Taiwan case next to WU LAW.

**Confusing / too long / salesy:**
- The scroll-story in `#marketing` (5 steps) and the `#software` / `#ai` stories (4 steps each) dim inactive steps to 38–40% opacity (`html.anim .chap:not(.now){opacity:.38}`). On a phone most of the text I'm reading is pale grey on beige. It fails contrast and looks broken.
- Each story step has about 300–400 px of empty space before the next step, waiting for the sticky visual. On a phone that's a lot of thumb-scrolling past nothing.
- The step-2 and step-4 dashboard mock is rebuilt in HTML (「10 則沒提到你」, 「17% AI 回答提到」, 「+12」, 「36」) but captioned 「後台實際畫面 · 示範資料」. Per the brief, rebuilt parts must be labelled 「示意」.
- 「測評平台／測評引擎」 is the mainland term. Taiwan says 「評量平台」 (as L4/L5 do).
- 「第一階段上線，通常週」 is the estimator's empty static fallback. With JS slow or off, the user sees broken text. Put real default numbers in the HTML.
- The 171.6 萬家中小企業 line under software works as a positioning line (「大多數不需要大系統，需要的是剛好合用的那一塊」). Keep it.

**Mobile:**
- Opacity-dimmed story text (above) is the biggest problem.
- The service index links in the hero nav strip and the source links are 30–37 px tall (`.src a`, nav chips 「01 科技行銷」).
- The before/after weekly-report graphic text is about 11 px inside the card (`.wk` boxes).

**Top 5 fixes:**
1. On widths below 760 px, disable the sticky scroll-story: set `.chap:not(.now)` to opacity 1, remove the spacer padding between `.chap` blocks, and place each step's visual inline under its text. (Or keep sticky only at ≥ 960 px.)
2. Change the captions on the rebuilt dashboard steps (`.rg2`, `.rg4`) from 「後台實際畫面 · 示範資料」 to 「示意畫面（依後台實際欄位重畫）」. Keep 「後台實際畫面」 only on real screenshots.
3. Under the hero buttons, add 「由創辦人 Yufan 本人接聽・中文／English・不適合會直說」.
4. Replace 「測評」 with 「評量」 everywhere (3 occurrences). Hard-code a default in the estimator result (e.g. 「第一階段上線，通常 6–12 週」) so it isn't empty before JS runs.
5. Move `#work` (作品與實績) from between marketing and software to right after AI, or keep only the WU LAW case under marketing and the grid later. Right now the software section starts at about 12k px.

---

## Layout 3: serif "annual report" with footnotes (`/pending/redesign/3/`)

**5-second test:** Clear. 「先找出問題，再把解法做到上線。」, an intro paragraph that names the company (「我們是 Ship to Live（夏裕科技）」), and a three-chapter index. It's the most "law firm / accounting firm" in tone, and as a 台北 accountant I'd like that.

**Would I book?** I'd *trust* it the most and *read* it the least. Numbered footnotes plus a 資料來源 list is the most honest-looking proof of the five, and the 創始客戶 NT$75,000 condition is spelled out. But it's **31,700 px, about 37 phone screens**. I'd never reach the contact section. I'd bounce at chapter 01 step 3.

**Confusing / too long / salesy:**
- Length. Each chapter has a 「先回答」 essay, 3–4 stat rows, a 5-step process, two "principle" lists, a case, a price table, and more.
- 「編按：AI 讓開發變快了嗎？」: 編按 is magazine language. The content is good; the label is odd.
- 「從題目到報告，一個團隊用得起來的系統」 is awkward phrasing.
- 「10–40 人的團隊」 for 企業內訓 is a product spec not in the brief. Confirm with Yufan before committing.
- 「AI 助理讀你自己的文件回答問題（RAG）」: drop "(RAG)".
- Software chapter footnote: 「上列數字多來自大型企業，引用是為了說明風險從哪裡來。」 Honest, good. Keep it.

**Mobile:**
- **Count-up animations on proof numbers** (`countUp()` in `app.js`, 1.4 s). Mid-scroll I saw 「10/16」, 「421」, 「40%」, 「2.0×」, 「7% 對 13%」, 「27%」, 「77%」. If someone screenshots or skims mid-animation, the client numbers are *wrong*. Don't animate real proof numbers.
- Horizontal-scroll figures (圖 1, 圖 2) with 「← 左右滑動看完整表格 →」. Readable, but nobody swipes them.
- The before/after demo starts at 「1 分鐘 / 0 分鐘」 until played, so it looks broken if animation hasn't run.
- Tap targets: only 「作品」 at 29×40 px. Otherwise the best of the five.

**Top 5 fixes:**
1. Cut to at most 18k px. Remove the 「我們的工作原則／六個你可以拿來檢查我們的原則」 grid (it duplicates the 5 steps), the separate 「我們怎麼合作？」 four cards (they duplicate 「從第一次聊到上線」), and one of the two dashboard figures (keep 圖 4, the mobile one).
2. Remove `countUp` from WU LAW and the stat rows: render final values in HTML and drop the `.count` class. If motion is wanted, keep it to a fade.
3. Rename 「編按：」 to 「老實說：AI 讓開發變快了嗎？」. Delete 「（RAG）」. Rewrite 「從題目到報告，一個團隊用得起來的系統」 as 「從出題、作答到報告，整套都在線上完成」.
4. Make the 週報 demo render its final state (120 → 10 分鐘) in static HTML; animate only on 「重播」.
5. Add a sticky bottom 「預約 20 分鐘」 bar on mobile after the first chapter (one 44 px button). With this length, the CTA is otherwise 30 screens away.

---

## Layout 4: "你現在最卡的是？" diagnostic quiz (`/pending/redesign/4/`)

**5-second test:** Clear in a different way. It doesn't tell me what they sell first; it asks about *my* problem: 「客戶找不到你／流程太手動／需要一套系統」. Those are exactly the three sentences I'd say. I tapped through (客戶找不到你 → AI 不會提到我 → 台灣) and got a result card: 可能的問題 / 我們會先做 / 12/16 proof / 「沒有人能保證…」 / 「帶著這份結果聯絡我們」 (pre-filled). That's the first time any of these pages felt like a consultant talking to me.

**Would I book?** Yes, most likely of the five. The quiz gives me something useful before asking for anything, and the CTA carries my answers, so I don't have to explain myself on the call. It's also the shortest real page (17.9k px).

**Confusing / too long / salesy:**
- **On mobile the hero's direct CTA and proof are hidden.** `.hero-proof { display:none }` and `.hero-side-cta { display:none }` apply below 720 px. The 12/16 · 487 · 29 numbers and the 「預約免費 20 分鐘諮詢」 button exist only on desktop. A phone user who doesn't want the quiz only gets an underlined text link 「直接預約 20 分鐘，跟我們聊」.
- The estimator result text mixes half-width punctuation: 「第一階段通常 6–10 週. 典型範圍，不是報價…」 (`app.js` lines ~556–557 join with `'. '`). In zh it should be 「週。」.
- 「選一個，30 秒告訴你問題可能在哪」 is good. 「我們找出卡住的地方，再把修好的東西上線。」 is slightly clumsy; use 「我們先找出卡住的地方，再把解法做到上線。」.
- The marketing step accordion buttons (`1健檢…` through `5你用手機核准`) are 30 px tall.
- The 「方案」 price chips are fine and exact, and they include 新網站 NT$150,000 起 without the founding-client line. That's OK.

**Mobile:**
- Hidden hero proof/CTA (above).
- Estimator checkbox inputs are visually hidden at 1×1 px. That's fine because the label is the target, but make sure each label is ≥ 44 px (they look about 44 px in the capture).
- The dark estimator and AI blocks are good contrast. Nice compact 「之前／之後」 toggle.

**Top 5 fixes:**
1. Show `.hero-proof` and `.hero-side-cta` on mobile. Place them under the quiz card (not above, so the quiz stays the first thing), as a 3-number row plus a full-width 「預約免費 20 分鐘諮詢」 button.
2. In `app.js` (lines ~556–557, plus the `T.typical` join), use 「。」 instead of `'. '` when `ZH`.
3. Raise the marketing step buttons (`.steps button` / accordion headers) to a 44 px minimum height.
4. On the quiz start panel, add the "who answers" line: 「結果由系統產生；想談細節，Yufan 本人接電話。」
5. Remove 「接案中」 from the hero eyebrow. Change the hero sub to 「選一個最接近的狀況，30 秒告訴你問題可能在哪、我們會先做什麼。」

---

## Layout 5: "AI 學院 + 工作室" (`/pending/redesign/5/`)

**5-second test:** Clear but **wrong for me**. 「把 AI 從工具，變成團隊的同事」 says this is an AI training company. If I came because my website doesn't show up on Google, or I need an order system, the hero only gives me two small pill links (「工作室 科技行銷…」, 「工作室 軟體開發…」).

**Would I book?** Only for AI training. For training it's actually the best page: 「適合你／可能不適合，如果你想要『一鍵賺錢』的 AI 課」 is honest and memorable, and the seven-module syllabus with 「你會帶走：」 is concrete. But overall it looks like a 補習班 / course seller, and that undermines the 軟體開發 credibility.

**Confusing / too long / salesy:**
- **On mobile, the whole 工作室 view (科技行銷 + 軟體開發, including the 12/16 WU LAW case section) is `hidden`** until I tap the 學院/工作室 toggle (`applyViews()` in `app.js`, `.view[data-view=studio]`). Most phone users won't. The site's existing main offer (SEO) is invisible by default. Hiding key facts is also bad for AI crawlers that render JS.
- Invented product specs not in BRIEF: 「4 週 × 每週 2 小時直播」, 「約 3 小時／約 6 小時」, 「10–40 人」, 「一天版七個單元」. Not a rule break as such, but Yufan must confirm he'll deliver exactly this.
- 「持續支援 … 依專案報價」 and 「加入名單」 → `#contact` (no list exists).
- 「學院／工作室」 framing plus 「01–03 學院：教你做 / 04–05 工作室：幫你做」 is clever but needs explaining. 「學院」 also suggests an accredited school.
- 「教課的人，也是實際把自動化和系統做出來的人」: good line.

**Mobile:**
- The hidden studio view (above).
- 「聊聊」 links are 27×44 px (narrow). The honeypot label 「請留空」 shows up in the text output; make sure it's `aria-hidden` and visually off-screen (it is off-screen, but give the label `aria-hidden="true"` too).
- The before/after demo and course cards look good, and spacing is comfortable.

**Top 5 fixes:**
1. Remove the mobile view-switching: in `applyViews()` never set `v.hidden = true`. Render 學院 and 工作室 stacked, with the segmented control acting only as jump links (`#academy` / `#studio`).
2. Rebalance the hero to the three services. Use H1 「先找出卡住的地方，再把解法做到上線」, keep 「把 AI 變成團隊的同事」 as the AI section's H2, and show the three services as equal cards.
3. Move the WU LAW proof numbers (12/16 · 487 · 29) above the fold or right under the hero, not only inside the studio view.
4. Mark the course specs as drafts for Yufan's sign-off (「4 週 × 2 小時」, 「約 3／6 小時」, 「10–40 人」), or soften them to 「時數與人數依需求安排」.
5. Rename 「加入名單」 to 「索取範本」 (opens the contact form with topic training) until a real newsletter/LINE exists; rename 「學院」 to 「AI 課程」 if it might read as an accredited school.

---

## Rule-check summary

| Rule | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| Invented clients/testimonials/logos | none | none | none | none | none |
| Tenure / headcount claims | none (「接案中」 borderline) | none | none | none (「接案中」 borderline) | none |
| Guarantees | none, has 「我們量測，不打包票」 | ok | ok | ok | ok |
| Prices match §4 | yes | yes (subset) | yes, incl. 創始客戶 terms | yes | links only, ok |
| Tadapop/Tally featured | one passing line, ok | ok | ok | ok | ok |
| Illustrative labelled | yes, but 2 extra invented time-savings | **rebuilt mocks captioned as 「後台實際畫面」** | yes | yes | yes |
| Stats sourced + year | yes | yes | yes, with footnotes | yes | yes |
| Unconfirmed offer specs | – | – | 「10–40 人」 | – | 「4 週×2 小時」「約 3/6 小時」「10–40 人」 |
| ≥ 44 px targets | footer links 36 px, 重播 39 px | nav chips/source links 30–37 px | ok | step buttons 30 px | 「聊聊」 27 px wide |
| Key content hidden on mobile | – | text dimmed to 38% | count-up shows wrong interim numbers | hero proof + CTA hidden | whole studio view hidden |

---

## Ranking: most likely to make me book a call

1. **Layout 4.** It asks about *my* problem in my words and gives a useful diagnosis with real proof before asking for anything; the CTA carries my answers. Fix the hidden mobile CTA/proof and it wins clearly.
2. **Layout 2.** Clearest hero, and proof is visible in the first 1.5 screens; it feels like a Taiwanese firm. The dimmed scroll-story text on mobile is the one thing dragging it down.
3. **Layout 3.** The most trustworthy and best-sourced, but at 37 phone screens I'd never reach the contact form, and the proof numbers count up through wrong values.
4. **Layout 1.** Good hero and early proof, but the dark startup styling and every service shown twice make it feel long and not like a firm I'd hand my ERP to.
5. **Layout 5.** Best AI-training page, but it reads as a course seller, and on mobile it hides marketing and software (the main offer) behind a tab.

**If combining:** L4's quiz hero and result card + L2's warm visual style and hero proof card + L3's footnoted sources and honest asides + L5's 「適合／不適合」 block and syllabus inside the AI section.
