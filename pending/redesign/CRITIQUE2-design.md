# Round 2 design critique: layouts 6–10 (2026-11-04)

Reviewed zh at 390×844 and 1440×900 (full page plus scroll-by-viewport stitches for 7 and 10), and the EN first screens. Benchmarks: apple.com/tw/iphone refs and Awwwards SOTD. The score is "premium, not template" out of 10. Work files are in `/tmp/dd/`.

**Bugs found on all five pages:** no horizontal overflow and no broken images. EN mobile runs past the 9,000px budget on 6 (9,461), 7 (9,895), 8 (10,172) and 9 (9,808). zh 8 is at 9,450.

---

## 6 · Apple product page: 6/10

It's the most disciplined of the five, and it's also the most obviously borrowed. The black 科技行銷 card in the first screen works. The page loses momentum after the carousel.

1. **Bug: `l6-ai.mp4` returns 404.** The AI card has no loop. The **AI 導入 section has no visual at all**: it's a headline, the 2小時→10分鐘 numerals and two grey boxes. This breaks rule 1 ("every service gets its own visual"). Put `l6-ai-light` full-bleed under the headline, the way the cube sits in the software section.
2. **The cube is used twice.** It appears in the carousel card and again as the hero of the black 軟體開發 section, which reads as a lack of assets. Use a different angle or a macro crop (the lit blue core, filling the whole width) in the black section.
3. **Image edges show in the mobile carousel card** (`.card.dark`, 390px): the bar-chart render sits in a visible rectangle. The grid floor stops hard at the bottom and the top band is a different black. Mask it with a bottom gradient to `#000`, or use `object-fit:cover` across the full lower 65% of the card. The bars themselves read as AI mush (overlapping and illegible), so render a cleaner 5-bar version.
4. **The "從健檢，到你按下核准" step cards** (`.step`, 5 white cards with a 72px numeral, a large empty gap, then 2 lines) are the round-1 kit in new padding. Either drop them, since the black section already has a 1-2-3 list, or make it a single Apple-style horizontal "how it works" strip with one image per step.
5. **The "為什麼選擇" cards hold tiny dashboard crops with unreadable 9px UI text.** On Apple each tile has one clear object. Use one large, legible fragment per card (one number plus one label at 40px+), or the 「中 EN」 typographic treatment, which already works.
6. **The 企業內訓 / 代建自動化 boxes** (`#f5f5f7`, small text, 費用洽詢 + link) look like pricing widgets. Replace them with two text columns, no boxes, under a full-bleed image.
7. **Type and fonts:** the stack relies on `-apple-system`, so on Windows and Android, "Ship to Live" and every Latin heading fall back to the CJK font's Latin glyphs (the screenshots look heavy and rounded, not like SF). Load Inter for Latin, as 7–10 do. `letter-spacing:-.022em` on `body` also squeezes the 繁中 body text, so apply it only to Latin or to display sizes. The desktop contact title breaks as 「聊聊 / 你的情況。」; keep it on one line.
8. **Orphans:** 「…12 則點名這家事 / 務所。」 under 12/16 at both widths. The proof row also shows three stats in one row, which goes against "one proof per screen". Give 12/16 its own screen at 160px+ and put 487 and 29 in a quieter second row. The run-on grey client list paragraph and the circular LinkedIn headshot both read cheap. Set the clients as a typographic list and crop the portrait rectangular, light and large.

Also: the nav `聯絡` pill is 28px tall (tap target), and the mobile segmented control is clipped mid-word (「系」) with no edge fade.

---

## 7 · Cinematic: 7.5/10

It has the strongest first impression of the five. The hero could sit next to an Awwwards SOTD. The middle of the page is let down by black voids and buried proof.

1. **Seams between images (bug):** at the start of every chapter, a 30–60px strip of the *previous* image shows under the nav (visible at both 390 and 1440 when the chapter top reaches the header). The `.stage` media needs `inset:0` with `overflow:clip` on the chapter, or the nav needs a solid gradient backdrop that covers 72px.
2. **Large black voids:** the sticky chapters are about 2 viewports tall, and the title cards (`.title-card`, `min-height:100vh`) hold 3 lines centred in black. The 16/12 proof screen, the 2小時→10分鐘 screen and the "我們怎麼做" lead-in are each 70–80% empty, and the desktop page is 14,700px. Cut the chapters to `150svh`, drop `.title-card` to `min-height:70svh`, and remove the empty run-out after the AI chapter.
3. **The proof is a paragraph.** 「16 則 AI 回答中，12 則…」 is the right move, but 487 and 29 then sit inside a 13px grey sentence with brackets, under a mono caption at roughly #555 on black (fails contrast). Give 487 its own title card at the same scale as 102 in the Go Hike card, and lift the captions to at least #9a9a9a.
4. **Hero punctuation:** the full-width 「，」 after 把對的事 floats about 80px from the last glyph at 140px size. Use `text-spacing-trim: trim-end` / `font-feature-settings:"halt"`, or drop the comma. The support line wraps to leave 「AI 導入。」 alone on line 2 at 1440, so narrow the measure to 30em or cut the sentence.
5. **The cream dashboard screenshot** dropped onto black is the one bright rectangle on the page, and it breaks the film grade. Put it in a dark device frame, dim it to 85% with a vignette, or show the dark-mode dashboard.
6. **Two button languages:** amber pills in the hero and booking, a cream 「送出」 pill, and an underlined text CTA in the chapters. Use amber for the primary everywhere, including 送出.
7. **The footer's ghost wordmark** ("Ship to Live" at about #141414 on #000) is invisible at normal brightness and has become a cliché. Either commit to it at #1d1d1d with a scroll-linked reveal, or remove it.
8. **The hero image** (monolith plus tiny figure) is 2001 pastiche, but it works. Check the loops on iPhone: `l7-sw.mp4` is 1.4 MB, so make sure the posters cover the first paint.

---

## 8 · Object studio: 7/10

This is the most ownable and the calmest of the five. Its type, colour and object renders are close to a real Japanese studio site. Its weakness is that it documents instead of selling.

1. **Porthole vignettes (image edges):** every object render (`No. 01/02/03` and the hero) sits inside a soft oval mask whose background is lighter than `#efebe4`. The window-light shadows stop at the oval, so you can see a disc. Regenerate or grade the renders onto the exact page colour and remove the radial mask so the shadows run out to the edges.
2. **The renders contain AI pseudo-text:** fake logos and garbled labels on the cube (02) and on the lens/disc. Studio work can't have garbage glyphs. Inpaint them clean.
3. **The spec tables are too many words.** Each service carries a 5–7 row hairline table (健檢/找缺口/每週修正…, 先期規劃/開發/你會拿到/台灣案例/價格). On mobile that's about 1,200px of small text per service and the main reason the page is long. Keep one headline, one line and one image, and move the table behind a single 「看細節」 expander or onto the sub-page.
4. **Mono labels everywhere:** `Catalog / 服務目錄 03 件`, `No. 01 Google 與 AI 搜尋`, `Plate / 後台`, `Proof / 實績`, `Index`, `Method`, `Founder`, `FAQ`, `Contact`. That's nine eyebrows, which rule 2 bans outright. Keep the 01/02/03 numerals and the Fig. caption and delete the rest.
5. **Colour clash:** the founder's blue-backdrop corporate headshot (circle crop) and the blue/green dashboard UI are the only cold colours on the page. Warm-grade the portrait and crop it as a large rectangle. Show the dashboard desaturated, or as a framed "plate" print on the paper colour.
6. **Orphan:** 「一間台北的律師事務 / 所，」 on mobile. Set it as 「一間台北的 / 律師事務所，」 with `<br>` or `word-break:keep-all` plus a wrapper.
7. **The AI before/after bars** (`.ba .bar`, 2px lines) are too thin to read as a "moment". Either make 10 分鐘 a giant numeral like 12/16, or drop it.
8. **The hero index row** (`.hidx`: 01 科技行銷 / 02 / 03 with arrows) at the bottom of the first screen looks like a table of contents. It's fine on desktop. On mobile, remove it, because the catalog follows straight after.

---

## 9 · Gradient depth: 5.5/10

The ribbon hero is attractive, but everything below it is the SaaS kit the client rejected, made glossier.

1. **Widget cards are the main unit again:** "AI 回答檢測" (G/C/P/G letter avatars, ✓有提到 pills, a progress bar), "專案進度" (stepper, v1–v5 chips) and "每週週報" (mono timers, chip arrows). They're bordered white cards inside tinted rounded panels, which is exactly cause #2 and #10 from the diagnosis. Replace them with one large, tilted shot of the real dashboard per service, with real shadow and perspective, and no fake UI.
2. **The service "icons"** are small gradient 3D knot blobs beside each heading: icon-in-a-square with better rendering, and generic AI art. Either make each render big (half the section, bleeding off the edge) or cut them.
3. **Hero collisions:** the support line runs over the ribbon at 1440 (「…做到上線。」 sits on the magenta), and in EN, "the work." lands on the ribbon. Move the ribbon right and down, or add a white feathered scrim behind the text column.
4. **The dashboard collage** in "每一個數字，你都看得到" is four overlapping screenshots, and none of them is readable. The tilt doesn't show in the static state either. One laptop and one phone at real size, with a scroll-linked `rotateX` from 12° to 0°, would do better.
5. **Mobile:** the floating 「新草稿等你核准」 card is clipped by the left screen edge. Orphans: 「…12 則點名這家事務 / 所。」 and 「一家事務所網站，上線後 / 的實測。」.
6. **Form card:** a gradient top border plus a bordered `#fbfcfe` input on a white card is pure template. Remove the stripe and use borderless filled fields.
7. **Rhythm:** the page goes white, white, white, navy, white, `#f8f9fc`. The navy proof band is the only contrast. Add a full-bleed image moment (the Go Hike mountain photo at full width would do it), and give 12/16 its own screen.

---

## 10 · Liquid Glass: 5/10

The mobile hero (Taipei 101 at dusk under glass, with the bottom tab bar) is lovely. Past the hero, it turns into frosted panels on blurred wallpaper.

1. **Bug: `l10-hero.mp4` returns 404** (the HEAD probe logs a console error). Ship the loop or remove the probe.
2. **The desktop hero loses Taipei 101.** The 1440 crop is a generic skyline, it's soft (upscaled), and the sky shows horizontal banding. Use an art-directed `<picture>` crop that keeps 101 in frame, and use a native 2400px+ source. Pin the glass panel lower, over the darker hills: at the moment it covers the best part of the sky.
3. **The floating pill nav collides with content.** With no backing bar, headlines and buttons scroll between the pills: 「教你的團隊」 is overlapped, and the mk CTA buttons sit beside the logo pill. Add a full-width glass bar with a gradient scrim, or hide the nav on scroll-down.
4. **Hard seams between photos:** the neon street ends in a flat horizontal edge, then the office, then the mountains (visible at both widths). Crossfade with tall gradient masks, or use one sticky background that swaps with opacity.
5. **Most of the "photography" is blur.** Past the hero, the backgrounds are muddy brown and blue washes, so the vivid Taiwan imagery promised in the brief never really arrives. Keep each scene's photo sharp in at least 60% of the frame and blur only behind the glass.
6. **Widgets on glass:** numbered step pills (01/02/03 black circles on white pills), the 2小時→10分鐘 progress bar with dots, the 12/16 dot matrix, and the three stat tiles. That's dashboard UI, not designed objects. Give one giant numeral per scene, set directly on the photo.
7. **Text and wrapping:** the 487 tile breaks 「來 / 源」. The FAQ wraps 「…上線 / 嗎？」 and 「…一半可 / 以停嗎？」. The 「也合作過」 list starts lines with a 「·」 bullet. Several min-height `100svh` scenes leave 400–500px of empty brown on mobile (between the founder and the FAQ, and between the FAQ and the contact section).
8. **The founder card** (circle avatar, 4 lines, inside a glass card) reads as a LinkedIn card. Use a large portrait photo with the glass caption over it.

---

## Ranking

1. **7 Cinematic**: the only one that already feels like a launch film. Fix the seams, the voids and the buried proof, and it can ship.
2. **8 Object studio**: the most ownable and trustworthy for Taiwan SMBs. Cut the spec tables and eyebrows and clean up the renders.
3. **6 Apple**: competent and clear, but derivative, and it runs out of visuals after the carousel (the AI section has none).
4. **9 Gradient depth**: the hero is nice, but the body is round-1's widget kit with a gradient on top.
5. **10 Liquid Glass**: a strong mobile hero, then blurred wallpaper, nav collisions and glass widgets. It's the furthest from premium.
