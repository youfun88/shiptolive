# CRITIQUE 2: layouts 6–10, same skeptical SMB owner

Persona: I own a 30-person trading company in 台中 (or a small 台北 accounting firm). I'm not technical and agencies have burned me before. Our orders live in Excel and LINE groups, and my staff use ChatGPT however they like. I'm reading on my iPhone.

Method (2026-11-04): headless Chrome at 390×844 with an iPhone UA. For 7 and 10 I took scrolled viewport shots, because their full-page captures stretch. I also read the zh text stripped from each index.html. Page heights: **L6 9.0k · L7 9.5k · L8 9.5k · L9 9.0k · L10 8.5k px**. Round 1 ran 15–31k, so all five are now about half as long. There's no horizontal overflow and robots is noindex on all five. Bugs: L6 and L10 each request a hero/section video that 404s (`shared/r2/video/l6-ai.mp4`, `l10-hero.mp4`). L6 has 19 tap targets under 44 px (the inline client list and the McKinsey source link).

## Round-1 issues: status

| Round-1 issue | 6–10 |
|---|---|
| SEO・AEO・GEO, JSON-LD, sprint, RAG in headings | **Fixed.** Leftovers: 「Copilot 引用」 everywhere, 「結構化資料」 (L7), 「CRM」, 「Agentic AI 證書」 |
| 「探索衝刺」 | **Fixed** → 「先期規劃，1–2 週，固定費用」 |
| 「答案先行」 | **Fixed** → 「一打開就直接回答客人問題的頁面」 |
| Who answers the call | **Fixed** in all five. L8, L9 and L10 put it near the hero. L6 and L7 only put it at the bottom. |
| Go Hike as the Taiwan case | **Fixed** in all five |
| US stats first | **Mostly fixed.** L6 still cites McKinsey **2012**, which reads as stale. |
| Free resources that don't exist | **Fixed** (removed) |
| Unreadable dashboard | **Half fixed.** It's now in a phone frame, but the text is still about 7 px and the caption says 「數字為示範資料」, so to me it's decoration. |
| 「接案中」 | **Fixed** |

## New problems shared by all five

1. **No LINE.** I run my business on LINE, and the only ways to reach you are email and a form. Add a LINE 官方帳號 button next to every 「預約」. It will get more of my inquiries than the form.
2. **No price anchor.** All I see is 「依專案報價」「費用洽詢」「洽詢」. I need a floor before I spend 20 minutes: 「先期規劃 NT$__ 起」, 「企業內訓半天 NT$__ 起」. Without one I assume it's expensive.
3. **No customer like me, and no customer quote.** The cases are a law firm and a hiking shuttle. Nobody says, in their own words, 「他幫我們…」. One quote from WU LAW's lawyer would beat all three numbers.
4. **The one AI example I care about is fake.** 「每週週報 2 小時→10 分鐘」 is labelled 「示意範例，非客戶實績」. I'm glad it's honest, but it's the AI part of the page and it isn't real. Replace it with one real internal or client workflow, even a small one.
5. **「科技行銷」 sounds like marketing for tech companies.** Say 「網路行銷：讓客人在 Google 和 AI 找到你」.
6. **「台北 × 聖地牙哥」 and 「美國業務由 QY LLC 承接」** make me wonder whether anyone is in Taiwan and why there's a second company. Move QY LLC to the EN page. Add 「台北為主，可到台中／新竹拜訪」 or say plainly that meetings are online.
7. **The best business number appears only in L7:** 「上線第一個月 20 次諮詢、6 位付費客戶（業主提供）」. That's the number I understand. 「Copilot 引用 487 次」 means nothing to me. Lead with clients and inquiries.
8. **Translated or mainland-sounding words that repeat across layouts:** 「AI 能見度檢測」 → 「免費檢查：AI 有沒有提到你」. 「代建自動化」 (代建 is a 建案 word) → 「自動化幫你做好」. 「多週陪跑」 → 「多週陪同輔導」. 「測評平台」 → 「線上測驗平台」. 「客戶入口」 → 「客戶專區」. 「點名這家事務所」 → 「提到這家事務所」. 「我們也在 App Store 上經營自己的 App」: name the app or cut the line.

Trust signals that work in every layout: 「統一編號 90173045，可開統一發票」, 「沒有人能保證 AI 一定會提到你；我們量測，不打包票」, 「程式碼與帳號都歸你」, 「做到一半可以停嗎？」, the FAQ 「導入 AI 會不會讓公司資料外流？」, and the founder's real photo.

---

## Layout 6: Apple Store clone

**5-second test:** Partly. The giant headline is 「Ship to Live」, an English name that tells me nothing. The subline 「找出卡住的地方，再把解法做到上線。」 is vague. The icon row (科技行銷／軟體開發／AI 導入／作品) is what tells me what you do.

**Book?** Maybe. The software section is the best of the five: 先期規劃, 每兩週, 交接, plus the 6–10 週 picker with 「不是報價」. But the page feels like an Apple product page, not a company I'd hand my order system to.

**Trust vs. salesy:** Trust: the 6–10 週 estimator, 「不繼續，這份規劃也歸你」, and 「AI 幫我們加速，每一行仍由資深工程師審查」. Salesy or fake: the 「新」 badge on AI 導入, 「為什麼選擇 Ship to Live。」 (pure ad copy), and a glowing glass bar chart that means nothing.

**Jargon:** 「網站健康」 → 「網站體檢」, 「Copilot 引用」, 「CRM」.

**Phone:** Too much sideways swiping. The hero carousel, the 健檢 steps and the 「為什麼選擇」 cards each hide content off the right edge, and I won't swipe three carousels. The lone 「預約」 button on each slide doesn't say what I'm booking.

**Top 5 fixes:** 1) Replace the 「Ship to Live」 H1 with a Chinese sentence about what you do. 2) Turn the carousels into vertical lists. 3) Add a price floor next to the 6–10 週 picker. 4) Put 「由創辦人 Yufan 本人接」 under the first CTA. 5) Drop the McKinsey 2012 stat, fix the 404 video, and enlarge the small links.

## Layout 7: cinematic

**5-second test:** No. 「把對的事，做到上線。」 sits over a black obelisk with a tiny man under a light beam. It looks like a film poster. I only learn the three services from the grey line below.

**Book?** No. The proof is the strongest on any page: 「16 則 AI 回答中，12 則點名了我們的客戶」 as one huge sentence, plus the 20 consultations and 6 paying clients. But the mood says crypto launch or game trailer, not a reliable vendor.

**Trust vs. salesy:** Trust: the business-outcome line and the clean client list with industries (「美台跨境法律」「登山接駁預約」). Fake: exploding sparks on skyscrapers, cards flying through lightning, and the obelisk. The footer admits 「章節大圖為 AI 生成的示意影像」, which made me ask why you used them at all.

**Jargon:** 「路線與價格、22 則常見問題都寫進結構化資料」 → 「Google 看得懂每條路線的價格」.

**Phone:** The source and detail lines are tiny monospace grey on black, which I can't read in daylight. Each chapter is a full screen of mostly picture, so there's a lot of scrolling for a few words.

**Top 5 fixes:** 1) Replace the renders with real work: Go Hike screens, the dashboard, Yufan with a client. 2) Use a concrete hero line, e.g. 「讓客人找得到你，讓系統替你做事。」 3) Raise the grey text to readable contrast at 15 px or larger. 4) Keep the giant 12/16 sentence and the 20/6 line, the best idea on this page. 5) Use the founder photo in true colour; the sepia tint looks staged.

## Layout 8: Japanese catalogue

**5-second test:** Yes. 「找出問題，做到上線。」 plus 「科技行銷、軟體開發、AI 導入」 is right there, and the founder line is in the hero.

**Book?** Maybe, leaning yes. It's calm and readable, and the spec tables (「先期規劃｜開發｜你會拿到｜台灣案例｜價格」) answer my questions in order. 「1–2 個工作天內回覆」 is the most useful line on any of the five pages. The accounting-firm version of me likes this one best.

**Trust vs. salesy:** Trust: the tables, the 「價格」 row even when it says 依專案報價, 「現成工具夠用，我們會直說」, and the eight clients each with a one-line description. Fake or pretentious: English section labels like 「Catalog / Plate / Index / Method / Colophon / Fig. 00」. My staff would never guess what Colophon means. The beige ceramic objects with orange buttons look like a design-shop product, not my problem.

**Jargon:** 「三件工具，各把一件事做好。」 These are services, not tools → 「三件事，各做到上線。」 「開始引用」 → 「AI 開始提到你」.

**Phone:** Good. Light background, large type, 44 px targets. The label column of the tables is narrow but readable.

**Top 5 fixes:** 1) Make the section labels Chinese only. 2) Replace the ceramic renders with real screenshots or photos (see Visuals). 3) Fix the 「三件工具」 heading. 4) Put a number in the 價格 rows. 5) Add LINE and copy 「1–2 個工作天內回覆」 into the other layouts.

## Layout 9: SaaS product page

**5-second test:** Best. 「客人找得到你，系統替你做事。」 is the only hero line that says what I get. The founder line sits right under the button.

**Book?** Yes. 「怎麼開始合作？ 先聊 20 分鐘 → 規劃與固定報價 → 分階段做到上線」 is exactly what I want to know. The AI check mock with a real customer question, 「台北有推薦的跨國繼承律師嗎？」 (ChatGPT ✓, Perplexity —, 3/4), makes "AI visibility" clear in one glance. Go Hike has a real photo of the mountains. The form placeholder 「例如：客人都在 LINE 預約，常常漏接。」 sounds like my company.

**Trust vs. salesy:** Trust: 「做什麼、多久、多少錢，一封 email 寫清楚」, 「台灣合約由夏裕科技簽約，可開統一發票」, and 「台灣有 84% 的知識工作者已在用生成式 AI」 (a Taiwan stat, finally; make sure the link really says Taiwan). Salesy: the purple gradient ribbon and glossy 3D blobs look like every AI startup, and the 2:00:00 → 0:10:00 timer is back from round 1 and still illustrative.

**Jargon:** 「AI 摘要」 is OK. 「自然點擊約為未被引用者的 2.2 倍」 → 「從 Google 點進來的客人約多一倍」.

**Phone:** The hero text sits on top of the ribbon, so 「卡住的地方」 is hard to read over the orange. Source links are small. Otherwise it's the clearest page.

**Top 5 fixes:** 1) Move the ribbon so it doesn't sit behind the text (or put it above the headline). 2) Replace the purple blobs next to section titles with one real screen each. 3) Swap the 週報 timer for a real case. 4) Add a price floor to step 02 of 「怎麼開始合作」. 5) Add LINE beside 「預約免費 20 分鐘諮詢」.

## Layout 10: Liquid Glass over Taiwan scenes

**5-second test:** No. 「被看見，也被用上。」 is a slogan that could be on a perfume ad. The services line under it saves it.

**Book?** Maybe. The only Taiwan-specific money hook on any page is 「企業內訓可能適用勞動部訓練補助，我們可協助確認資格」, which would actually make me call. The bottom tab bar (科技行銷／軟體開發／AI 導入／聯絡) feels like an iPhone app and is easy to use.

**Trust vs. salesy:** Trust: the 勞動部 line, 「台灣合約由夏裕科技股份有限公司簽訂，可開統一發票」 beside the form, and 「現成工具就能解決的，我們會直說」. Fake: a Taipei 101 dusk postcard, a blurred neon street and a sunlit office with an empty chair. They're generated scenes, and to someone in 台中, 101 means tourism, not "they know my business".

**Jargon:** 「12/16 則 AI 回答點名這家事務所」 → 「16 次問 AI，12 次提到這家事務所」. Name the subsidy correctly (勞動力發展署「小型企業人力提升計畫」／「企業人力資源提升計畫」) so I can look it up.

**Phone:** White and grey text on frosted glass over busy photos is low-contrast in places, e.g. the grey 「近 30 天 156 次。來源…」. The fixed tab bar covers the last line of every section and part of the form while I scroll.

**Top 5 fixes:** 1) Use a concrete headline instead of 「被看見，也被用上」. 2) Replace the generated Taipei scenes with real photos: a real client office or Yufan at a real meeting. 3) Make the glass panels more opaque behind text. 4) Copy the 勞動部 line into the other layouts and name the program. 5) Add bottom padding so the tab bar never covers content, and fix the 404 hero video.

---

## Visuals: do they make it feel less real?

Yes, for 7, 8 and 10, and somewhat for 6 and 9.

- **L7 renders** (obelisk, sparks, lightning cards) feel like a crypto or game ad. That's the opposite of "I'll fix your order system". The footer disclaimer makes it worse, because it confirms nothing on screen is real.
- **L8 ceramic objects** are pretty, but they're abstract and labelled 「示意渲染」. I can't connect them to anything you do.
- **L10 Taipei 101 and city scenes** read as stock postcards and Taipei-centric. Being generated, they also have that too-perfect look, and an owner who notices will trust you less.
- **L6 and L9 glossy blobs and icons** are less harmful but still generic.

**What would help:** real things, lit well. Go Hike's real mountain photo in L9 is the most trusted image across the five pages. Use real product screens in a phone frame, cropped to one large readable number. Use a real photo of Yufan at a client's desk or a whiteboard, not only the studio headshot. Show real client logos or storefronts (with permission), or a phone showing an actual LINE notification from a system you built. If there's no real photo for a section, use a large readable screen of the real product instead.

---

## Ranking (most likely to make me book)

1. **L9.** It's the only hero that says what I get, and it shows the work and the 3-step 「怎麼開始合作」 in my own words.
2. **L8.** Calm, readable, honest spec tables and 「1–2 個工作天內回覆」, held back by English labels and meaningless ceramics.
3. **L10.** The 勞動部 subsidy line and the iPhone-like tab bar are great, but it has a vague slogan and postcard renders.
4. **L6.** It has the best software explanation and estimator, but it's buried under an English H1 and three sideways carousels.
5. **L7.** It has the best proof sentence, but it looks like a film trailer and the grey-on-black text is unreadable on a phone.

**If combining:** L9's hero, AI-check mock, 怎麼開始合作 and form placeholder. L8's spec tables and 「1–2 個工作天內回覆」. L6's 6–10 週 estimator with a price floor added. L10's 勞動部 line and bottom tab bar. L7's giant single-sentence proof with the 「20 次諮詢、6 位付費客戶」 line. Add LINE everywhere.
