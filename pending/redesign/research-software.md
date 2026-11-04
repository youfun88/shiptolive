# Research: custom software for SMBs (Ship to Live redesign)

Compiled 2026-11-04. Status labels:
- **VERIFIED**: confirmed on the primary source page or document.
- **VERIFIED (secondary)**: confirmed through reputable coverage, but the primary PDF was not opened.
- **UNVERIFIED**: could not be confirmed. Don't publish these as-is.

Rule for the site: put the source and year next to every number, and link it.

---

## 1. Software project failure and overruns

| # | Number | Exact claim | Source, year | URL | Status |
|---|---|---|---|---|---|
| 1a | 45% / 7% / 56% | Large IT projects (initial budget > US$15M) run on average **45% over budget and 7% over time, and deliver 56% less value than predicted**. 17% go so badly they threaten the company's existence. Based on 5,400+ projects. | McKinsey & University of Oxford (BT Centre for Major Programme Mgmt), "Delivering large-scale IT projects on time, on budget, and on value", 2012 | https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/delivering-large-scale-it-projects-on-time-on-budget-and-on-value | VERIFIED (old, 2012, still the standard citation) |
| 1b | 75% / 46% / 39% | Across 6,000+ public and private IT projects (2001–2017) of all sizes: **budget overrun 75%, schedule overrun 46%, 39% less value than predicted**. | McKinsey & Oxford Global Projects, "Unlocking the potential of public-sector IT projects", 2022 | https://www.mckinsey.com/industries/public-sector/our-insights/unlocking-the-potential-of-public-sector-it-projects | VERIFIED (secondary: numbers taken from the search snippet of the McKinsey page) |
| 1c | 31% / 50% / 19% | Standish CHAOS 2020: **31% of projects succeeded, 50% were "challenged" (late, over budget or missing features), 19% failed**. Small projects succeed far more often than large ones (reported as ~90% vs <10%). | Standish Group, CHAOS 2020 "Beyond Infinity" | https://opencommons.org/CHAOS_Report_on_IT_Project_Outcomes (summary; the original report is paywalled) | VERIFIED (secondary). The size split is UNVERIFIED. No public 2024–2026 CHAOS edition found. |
| 1d | 70% | **70% of digital transformations fall short of their objectives.** This is "fall short", not "fail". Based on 825 executive self-assessments plus 70 client engagements. | BCG, "Flipping the Odds of Digital Transformation Success", 2020 | https://www.bcg.com/publications/2020/increasing-odds-of-success-in-digital-transformation | VERIFIED (secondary). URL slug not opened. |
| 1e | 1 in 6 / 200% | In 1,471 IT projects, **one in six had a cost overrun of 200% on average** and a schedule overrun of almost 70%. | Flyvbjerg & Budzier, Harvard Business Review, Sept 2011 | https://hbr.org/2011/09/why-your-it-project-may-be-riskier-than-you-think | UNVERIFIED this session (from memory; re-check before use) |

**Takeaway for the copy:** every one of these sources finds that **big projects are where things go wrong**. Small scope, short phases and early working software is the strategy the data supports, and it fits a small studio.

繁中說法:
- 「大型 IT 專案平均超支 45%、延誤 7%，實際價值比預期少 56%」（McKinsey × 牛津大學，2012）
- 「僅約 31% 的軟體專案準時、在預算內、功能完整地交付」（Standish CHAOS 2020）
- 「70% 的數位轉型未達原訂目標」（BCG，2020）
- 「專案越大越容易失控；小範圍、分階段交付是降低風險最有效的方法」

---

## 2. Off-the-shelf SaaS vs custom software

| # | Number | Exact claim | Source, year | URL | Status |
|---|---|---|---|---|---|
| 2a | US$4,830 / +21.9% | Average SaaS spend per employee is **$4,830, up 21.9% year on year**. | Zylo, 2025 SaaS Management Index (Jan 16, 2025) | https://zylo.com/news/2025-saas-management-index | VERIFIED (secondary) |
| 2b | US$21M | Organisations waste an average of **$21M a year on unused SaaS licenses** (+14.2% YoY). | Zylo, 2025 SaaS Management Index | same as 2a | VERIFIED (secondary). These are mostly large companies, so don't present it as an SMB number. |
| 2c | US$9,455 median | Median SaaS spend per employee: **$9,455** (mean reported as $11,530). | Zylo, 2026 SaaS Management Index | https://zylo.com/blog/saas-stats-it-strategy | VERIFIED (secondary). The methodology changed, so it isn't comparable with 2a. |
| 2d | 46% | **46% of SaaS licenses go unused in a given 30-day period** (orgs use 54% of provisioned licenses). | Zylo, 2026 SaaS Management Index | same as 2c | VERIFIED (secondary). Other summaries say 36% on a different measure. Quote 46% and say "in a 30-day period". |
| 2e | 897 apps / 29% | The average enterprise runs **897 applications, and only 29% of them are integrated**. Based on 1,050 IT leaders. | MuleSoft (Salesforce), 2025 Connectivity Benchmark Report | https://www.salesforce.com/blog/mulesoft-connectivity-benchmark-2025/ | VERIFIED (secondary) |
| 2f | 342 apps | Average SaaS portfolio is 342 apps, down from 374. | Productiv, State of SaaS | — | UNVERIFIED (secondary attribution only; numbers conflict between sources) |
| 2g | 106 apps | Companies use 106 SaaS apps on average in 2024, down from 112 in 2023. | BetterCloud, State of SaaSOps 2024 | — | UNVERIFIED |

**Honest framing:** these figures come from enterprises, not Taiwan SMBs. The site shouldn't say "SaaS is a waste". What it can fairly say:
1. Per-seat SaaS costs grow every year.
2. Many licences go unused.
3. **Getting tools to talk to each other is the hard part** (2e).

The pitch then writes itself: keep the SaaS that works, and build the missing piece (the glue, or the workflow nobody sells) that you own outright.

繁中說法:
- 「企業平均每位員工每年 SaaS 支出約 4,830 美元，年增 21.9%」（Zylo 2025）
- 「在任一 30 天內，46% 的 SaaS 授權沒有被使用」（Zylo 2026）
- 「企業平均使用 897 套應用程式，但只有 29% 彼此串接」（MuleSoft 2025）

---

## 3. Taiwan SMBs: scale and digital adoption

| # | Number | Exact claim | Source, year | URL | Status |
|---|---|---|---|---|---|
| 3a | 171.6萬家 / 98.9% | 2024 年中小企業 **171.6 萬家，占全體企業 98.9%**（政府簡報標示為「占全體企業比例」；媒體多寫「98%以上」） | 經濟部《2025中小企業白皮書》（2025-12-26 發布，2024 年資料）；引自行政院第4020次院會簡報 | 簡報：https://www.ey.gov.tw/File/69F6592E605F8238?A=C ／白皮書：https://www.sme.gov.tw/list-tw-2345 | VERIFIED (I read the slide PDF. I didn't open the sme.gov.tw page.) |
| 3b | 79.3% / 919.4萬人 | 中小企業就業人口 **約 919.4 萬人，占全國就業 79.3%（近 8 成）** | same | same | VERIFIED |
| 3c | 52% | 中小企業銷售額 **占全體企業銷售額 52%** | same | same | VERIFIED |
| 3d | 60% ≈ 102.9萬家 | 中小微企業中 **60%（約 102.9 萬家）為獨資、合夥等微型店家** | 同上簡報 | same | VERIFIED |
| 3e | 0.7% | 《2025年中小企業AI運用現況調查》（中企署委託工研院，199 人以下企業，有效樣本 1,207 家）：**尚未數位化的中小企業僅占 0.7%**；約 15% 關鍵營運資料已達「可視化／可預測模擬／數據加值」程度 | 經濟部中小及新創企業署 × 工研院, 2025 | https://wantrich.chinatimes.com/news/20251226900494-420501 (news; I didn't find the official report) | VERIFIED (secondary) |
| 3f | 92% | 同調查：**約 9 成 2 中小企業不了解或僅大致了解 AI**（「完全不了解」6.5%） | same | same | VERIFIED (secondary) |
| 3g | 15% / 近7成 | 同調查：**僅 1 成 5 有 AI 人才**；工具面以**生成式 AI 導入率近 7 成**最高 | same | same | VERIFIED (secondary). Unclear whether the ~70% is out of all firms or only firms already using AI, so word it carefully. |
| 3h | Top barrier | 同調查：AI 導入最大障礙依序為**「尚無明確應用需求」**、不了解 AI、導入成本高、人才短缺、成效難以評估 | same | same | VERIFIED (secondary) |
| 3i | 100萬家 / 250億元 | 「支持及壯大中小微企業方案」：**協助至少 100 萬家中小微企業數位轉型及導入人工智慧；每年 250 億元**協助轉型 | 經濟部（報告人：中企署李冠志署長），行政院第4020次院會，115年9月10日（2026-09-10） | https://www.ey.gov.tw/File/69F6592E605F8238?A=C | VERIFIED |
| 3j | 25萬元起 | 同方案：轉型設備投抵（產創 §18）擬**納入適合服務業的「數位管理系統」，門檻由 100 萬降至新台幣 25 萬元以上**；研發支出投抵擬擴大納入**委外研發支出** | same | same | VERIFIED as a proposal. It depends on 「中小微企業轉型升級發展條例」 passing, which CNA (2026-08-26) said was going to the Legislative Yuan in September. **Not law yet. Don't promise clients the tax credit.** |
| 3k | 7.4萬家 / 41萬人次 | 多元振興計畫 114/1–115/8：數位轉型策略**諮詢輔導 7.4 萬家、培育 41 萬人次** | same | same | VERIFIED |

數位發展部 (moda): I found no moda statistic from 2024–2026 on SMB cloud or AI adoption rates. Treat any "X% of Taiwan SMBs use cloud" figure as **UNVERIFIED**. One older figure, PwC Taiwan (2022) saying 91% of SMBs had started transformation, is also UNVERIFIED and not recommended.

**Takeaway for the copy:** almost every Taiwan SMB is already "digital" (only 0.7% aren't), but most don't know what to do with AI, and the top barrier is **"no clear use case yet" (尚無明確應用需求)**. That is a direct argument for a discovery sprint and a "what could we build for you" picker. The pending 25萬 tax-credit threshold (3j) is worth watching. Mention it only once the law passes.

繁中說法:
- 「台灣 171.6 萬家中小企業，占全體企業 98.9%，提供近 8 成就業」（2025 中小企業白皮書）
- 「只有 0.7% 的中小企業尚未數位化，但 9 成 2 對 AI 只有粗淺認識」（中企署 2025 AI 運用現況調查）
- 「中小企業導入 AI 最大的障礙不是錢，而是『還不知道要用在哪』」（同上：尚無明確應用需求居首）

---

## 4. AI-assisted development: balanced evidence

| # | Number | Exact claim | Source, year | URL | Status |
|---|---|---|---|---|---|
| 4a | 55.8% faster | In an RCT with 95 developers writing an HTTP server in JavaScript, the Copilot group finished **55.8% faster** (95% CI 21–89%). **One small, well-defined greenfield task.** | Peng, Kalliamvakou, Cihon, Demirer (Microsoft Research / GitHub / MIT), arXiv 2302.06590, 2023 | https://arxiv.org/abs/2302.06590 | VERIFIED |
| 4b | ~21% faster | RCT with 96 Google engineers on an enterprise-grade task: about **21% less time with AI** (96 vs 114 min). The authors stress the CI is wide. | Paradis et al. (Google), ICSE 2025 SEIP, arXiv 2410.12944, 2024 | https://arxiv.org/abs/2410.12944 | VERIFIED |
| 4c | up to 2x | In a lab with 40+ developers, some tasks (documentation, new code, refactoring) took **up to half the time**. **Gains were much smaller on complex tasks.** | McKinsey, "Unleashing developer productivity with generative AI", June 2023 | https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/unleashing-developer-productivity-with-generative-ai | VERIFIED (secondary) |
| 4d | 19% slower | RCT with 16 experienced OSS developers on their own mature repos (246 tasks, Feb–Jun 2025): with AI they took **19% longer**, yet believed AI had made them ~20% faster. | METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity", 2025-07-10 | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ | VERIFIED |
| 4e | (no clean number) | METR's 2026 follow-up was **compromised by selection effects**: many developers declined to work without AI. Secondary sources report a ~18% speedup for returning developers with a CI spanning a slowdown. METR itself calls the signal unreliable and is redesigning the study. | METR, 2026-02-24 | https://metr.org/blog/2026-02-24-uplift-update/ | VERIFIED (that the redesign exists). The 18% is UNVERIFIED. |
| 4f | 1.4–2x (self-report) | Survey of 349 technical workers: median **self-reported** value of work up 1.4–2x from AI. The authors themselves are skeptical of the magnitude. | METR, 2026-05-11 | https://metr.org/blog/2026-05-11-ai-usage-survey/ | VERIFIED |
| 4g | −1.5% / −7.2% | Each 25% increase in AI adoption was associated with an estimated **−1.5% delivery throughput and −7.2% delivery stability** (correlational; ~39k respondents). The 2025 DORA report found throughput turned positive, but stability was still worse. | Google Cloud DORA, Accelerate State of DevOps 2024 | https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report | VERIFIED (secondary) |

**Honest read:**
- AI clearly speeds up well-scoped, greenfield work: prototypes, CRUD screens, boilerplate. That is much of what an SMB project is.
- AI does not reliably speed up deep work in big, complex codebases. It can also hurt stability unless there is review and testing.
- Perceived speed is not measured speed (METR).

**Suggested site claim:** "AI 讓我們更快做出可試用的原型；但每一行程式仍由工程師審查、測試，交付前跑過自動化測試。" Do **not** claim "10x faster" or quote 55% as a general speedup.

繁中說法:
- 「在單一明確任務上，使用 Copilot 的開發者快了 55.8%」（GitHub/微軟研究院 RCT，2023）
- 「Google 內部實驗：AI 讓企業級任務約快 21%」（Google，2024）
- 「資深開發者在熟悉的大型專案中用 AI 反而慢了 19%，卻自認快了 20%」（METR，2025）

---

## 5. How small studios sell custom software to SMBs

These patterns come from common agency practice (paid discovery, fixed-scope phases). None of the claims below are statistics.

### Offer-design ideas

1. **Paid, fixed-price discovery sprint (1–2 weeks) with a deliverable the client keeps.**
   - Output: a clickable prototype, a scoped feature list split into must/should/later, and a phase-1 quote.
   - Rationale: this fixes the #1 barrier in the Taiwan survey (「尚無明確應用需求」) and turns the risky estimate into a small, low-risk yes.
   - If the client goes ahead, credit part of the fee to phase 1. If they don't, the spec is theirs to take anywhere, so there is no lock-in from day one.
2. **Phase 1 = smallest useful version (MVP), fixed scope, live in ~6–8 weeks.**
   - Rationale: section 1 shows failure grows with size. A small first release proves value before the client spends more. The 「小範圍先上線」 message comes straight from the data.
3. **Ownership and no lock-in as a headline promise.**
   - The client owns the source code, repo, domain, cloud accounts and data from day one. We provide documentation and a handover session.
   - Rationale: SMB owners fear being held hostage by a vendor. This directly counters the SaaS "rent forever" model (section 2).
4. **Optional monthly care plan (維護方案), not a forced retainer.**
   - Covers hosting/OS updates, security patches, small changes, and a response-time promise. The client can cancel and still keep everything.
   - Rationale: predictable recurring revenue for the studio, peace of mind for the client. Being optional makes it credible.
5. **"Build alongside your SaaS" integration offers.**
   - Fixed-scope connectors, e.g. LINE / 綠界 / 電子發票 / Google Sheets → internal dashboard.
   - Rationale: most SMBs already use SaaS, and the gap is integration (only 29% of apps are integrated, MuleSoft). These are small and fast, and a natural first project.

Also worth considering: show a sprint demo every 2 weeks; offer a satisfaction checkpoint after discovery; show real case studies with the numbers each client got (time saved, orders handled).

### Sample process (for a 「合作流程」 section)
1. **免費諮詢 30 分鐘**: understand the problem, and say so honestly if custom software isn't the right fit.
2. **探索期 Discovery (1–2 週，固定費用)**: interviews, workflow map, clickable prototype, scope and phase-1 quote.
3. **第一階段開發 (2 週一個 sprint)**: a working demo every sprint, and the client tests on real data early.
4. **上線 & 交接**: deploy, training, documentation. Code and accounts transfer to the client.
5. **持續優化 (選擇性維護方案)**: updates, monitoring, next-phase features.

### Interactive "我們能幫你做什麼？" picker (no prices)

**Step 1: Pick what hurts (multi-select cards).**

| Card | Example problem |
|---|---|
| 內部管理系統 | 「訂單、庫存、排班還在用 Excel 傳來傳去」 |
| 預約／會員系統 | 「客人用 LINE 預約，常漏接、重複」 |
| 客戶入口網站 | 「客戶一直打電話問進度」 |
| App（iOS／Android） | 「想讓熟客有自己的 App」 |
| 資料串接／自動化 | 「三套系統資料要人工重打」 |
| AI 助理 | 「客服、文件整理想用 AI 但不知從何開始」 |

**Step 2: Three quick questions** (chips, not text fields):
- How many people use it: 1–5 / 6–30 / 30+
- Current tools: Excel / LINE / 現成 SaaS / 紙本
- Timeline: 盡快 / 3 個月內 / 只是先了解

**Step 3: Result card.** Show:
- A typical **scope tier**: 小型串接 / 標準系統 / 多端平台
- A **typical phase-1 timeline range** in weeks, not prices
- 1–2 relevant case studies
- A suggested first step, e.g. 「建議從 1 週探索期開始」
- A CTA that pre-fills the contact form with the selections

**Why it works:**
- It lowers the 「不知道要做什麼」 barrier.
- It qualifies leads.
- It gives the sales call context.
- It avoids price anchoring.

**Implementation notes:**
- Plain JS on a static page.
- Store selections in a URL query so links can be shared.
- Bilingual labels.

---

## Sources not usable / gaps
- Standish CHAOS: no public 2024–2026 edition found. Some sites say 2020 was the last. Self-hosted "CHAOS 2024 PDF" sites are spam.
- Productiv and BetterCloud app counts: only conflicting secondary attributions.
- moda / 中企署 cloud-adoption %: nothing verifiable found for 2024–2026.
- The 2025 AI survey report itself (中企署/工研院): only news coverage found, not the official PDF. Try sme.gov.tw before publishing.
