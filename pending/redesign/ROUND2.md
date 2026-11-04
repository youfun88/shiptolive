# Round 2: why layouts 1–5 read as cheap, and what 6–10 do instead (2026-11-04)

Yufan rejected all five round-1 layouts: "looks cheap / template-y". Same business, same three services, same rules
(BRIEF.md §0 still applies word for word). This file is the diagnosis and the art direction for layouts 6–10.
Every designer reads it before touching code.

## 1. Diagnosis: what made 1–5 look cheap

I looked at the round-1 screenshots (`shared/img/pick-*-m.webp` / `pick-*-d.webp`) next to apple.com/tw/iphone at 390 and 1440 px.

1. **There are no pictures.** Every first screen is text plus outlined boxes. The only image on the page is a small UI screenshot. Apple's first screen is 70% image: a big, lit object. Without one, the page looks like a component library demo. This is the main cause.
2. **It's built from the default SaaS kit.** 1px grey borders, 12–20px radius cards, pill chips, small emoji or line icons in tinted squares, "eyebrow · eyebrow · eyebrow" labels above every heading. This is exactly what Tailwind/shadcn templates and AI site builders output, so the eye files it as "template" right away.
3. **There are too many words on every screen.** The heroes have a headline, a 2–3 line subhead, two buttons, a reassurance line and a three-tile row, all in one viewport. Premium sites put one idea on each screen: about 2 to 12 words of display type and one line of support.
4. **The type is timid.** Headlines are 40–56px on desktop and the body text is 15–16px grey. There is no real scale contrast. Apple uses 80px titles next to 17px body text, and 48px card titles next to 21px taglines. Contrast in scale reads as confidence.
5. **The density is uniform.** Every section has the same padding, the same card grid and the same weight, so the page feels like a list of boxes. Premium pages give each section its own rhythm: full-bleed, then narrow, then full-bleed.
6. **Proof is shown as small widgets.** The 12/16, 487 and 29 figures appear as small stat boxes beside text. Proof should be one big number per screen, with the source in small type.
7. **Motion is decoration.** Fade-up on everything, counters and timers. None of it is physical: no momentum, no parallax depth, no scroll-linked reveal tied to an object.
8. **The colour is mixed.** Each layout used 2–4 accent colours (purple, green and amber chips). Premium means one accent and neutrals.
9. **The mobile pages are 15–30k px long because every detail is visible.** Detail belongs behind "了解更多" and in sub-pages. The homepage sells. It doesn't document.
10. **Picker estimators and quizzes look like forms.** Interactive pieces were styled like admin UI (select pills, bordered panels) instead of being part of a designed object.

## 2. The rules for 6–10 (each fixes a cause above)

- **Image first (fixes 1).** Every layout opens with a large, high-production visual: our own generated 3D renders or film stills (ComfyUI, in `shared/r2/`) and/or the real dashboard in a properly lit device frame. Every service gets its own visual. No emoji, no icon-in-a-square, no decorative SVG blobs.
- **No default-kit chrome (fixes 2).** No 1px grey bordered cards as the main unit. No chip rows in heroes. No "eyebrow · eyebrow" labels. Cards, where they exist, are large (≥ 24px radius, full-bleed or near), filled (colour or image), with no border.
- **Word budget (fixes 3 and 9).** Hero: a title of ≤ 12 繁中 characters or ≤ 8 English words, one support line, at most 2 buttons. Each section: 1 headline, ≤ 2 short lines, 1 visual. Target mobile page length: ≤ 9,000px (zh). Detail lives in the FAQ, on /zh/seo-aeo-geo/ and the other existing sub-pages, and behind expanders.
- **Type scale (fixes 4).** Display ≥ 64px desktop / ≥ 40px mobile, tight leading (1.05–1.15), weight 600–700. Body 17px (desktop 19–21px for lead lines). Big jumps in size.
- **Rhythm (fixes 5).** Alternate full-bleed visual sections with narrow text sections. Vary the backgrounds deliberately (e.g. Apple's white → #f5f5f7 → black).
- **Proof as a moment (fixes 6).** One proof per screen, giant numeral, source in 12–13px under it. WU LAW's numbers are the only client numbers.
- **One accent (fixes 8).** Each layout picks one accent colour and uses it only for the primary action and one highlight.
- **Expensive motion (fixes 7).** Scroll-linked transforms on the visual (scale, parallax, clip reveal) using `transform`/`opacity` only. Spring-like easing (`cubic-bezier(.16,1,.3,1)`). Video loops muted/playsinline with poster. Everything off under `prefers-reduced-motion`. 60fps on iPhone: no layout-triggering animation and no scroll handlers without rAF.
- **Interactive pieces are designed objects (fixes 10).** If a layout keeps a picker, it looks like product UI (e.g. Apple's segmented control), not a form.
- Copy rules from BRIEF.md and the CRITIQUE.md fixes still apply (no jargon in headings, 「由創辦人 Yufan 本人接」 line near the booking button, Go Hike as the Taiwan software example, free resources marked 陸續推出 or omitted, no 「接案中」).

## 3. Research: what premium sites look like in 2025–26

- **apple.com/tw/iphone** (captured 2026-11-04 at 390 and 1440 px): a 48px-tall translucent nav. A huge title: "iPhone" at ~80px, SF Pro Display semibold, -0.015em tracking. A horizontal row of product thumbnails (≈ 50px tall) with 12px labels and a small orange 「全新」 tag. Then a full-width card (28px radius, #f5f5f7 or black) with a 48px product name and a 21px tagline, outline + filled pill buttons (980px radius, ~17px), and a product render filling the lower 70%. A horizontal carousel with a translucent pill pager and a play/pause button. Sections are separated by 100–160px of air. Body text is #1d1d1f on white, secondary #6e6e73, links #0066cc, and the CTA is the blue #0071e3.
- **Awwwards 2025–26** (SOTD/SOTY winners, e.g. Lando Norris by OFF+BRAND as reported Site of the Year 2025): cinematic, full-bleed imagery and video, kinetic oversized type, WebGL/shader glow, scroll-driven narrative. The lesson: *one hero object, clear material (glass, metal, stone), deliberate light, minimal background*.
- **Linear / Vercel / Raycast:** dark, monochrome, one product image of enormous size fading into black, 1px light hairlines, mono micro-labels, glow from below.
- **Stripe:** light, animated gradient mesh, product UI tilted in 3D perspective, crisp layered cards with real shadows, very calm blue-violet palette.
- **Apple Liquid Glass (iOS 26, 2025):** translucent, refractive glass panels floating over vivid imagery. The web is moving towards blur, transparency and depth. Watch the contrast: no long body copy on glass.
- **Japanese studio sites (Takram, Nendo, good 2025 course/corporate sites) and Nothing / Teenage Engineering:** warm paper-white, matte objects photographed like museum pieces, monospaced indices, vast margins, small precise type plus huge numerals.
- Sources: [digidop 2026 trends](https://www.digidop.com/blog/5-web-design-trends-2025/index.md), [svilenkovic SOTD 2026 3D](https://www.svilenkovic.com/3d/sotd-2026-3d), [muz.li landing trends 2026](https://store.muz.li/articles/landing-page-design-trends-2026), [theplusaddons 2026](https://theplusaddons.com/blog/web-design-trends-2026/), apple.com/tw/iphone.

## 4. The five directions (none repeats bento, scroll story, editorial, quiz or academy)

| # | Name | Look | Why it fits Ship to Live |
|---|------|------|------|
| 6 | **Apple product page** | White / #f5f5f7 / black, SF/PingFang type, huge title 「Ship to Live」, a product-icon row (科技行銷 / 軟體開發 / AI 導入 / 作品 / 方案 / 預約), service cards in a carousel (28px radius, one black), pill buttons 預約 + 了解更多, then Apple-style "為什麼選擇我們" feature sections. Accent #0071e3. | Yufan asked for it. Taiwan buyers know Apple's pages, so this design language reads as "serious product company" right away. Services become "products". |
| 7 | **Cinematic** | Black, full-bleed film-still renders and short video loops, oversized kinetic headlines over the image, each service a full-screen chapter with a slow scroll-linked zoom, a single warm amber accent. | Awwwards 2025–26. Makes a small studio feel like a launch film. Good for "做到上線" drama. Mobile: full-height chapters with the poster image, short copy. |
| 8 | **Object studio** | Warm paper-white #efebe4, matte ceramic/clay objects (one per service, small orange accent part), mono indices 01/02/03, huge numerals, wide margins, precise small type. Japanese studio / Nothing aesthetic. | Calm, crafted and trustworthy for Taiwanese SMB owners and law/accounting firms. It's premium without being "tech bro" dark. |
| 9 | **Gradient depth (Stripe-like)** | White, a flowing iridescent ribbon hero render plus a subtle animated CSS gradient, the real dashboard tilted in 3D perspective with layered floating cards, deep navy text, accent violet #635bff-ish (our own hue, not Stripe's brand). | It sells software and data. Showing the real product UI with depth is the strongest proof that we build real systems. |
| 10 | **Liquid Glass** | Vivid full-bleed Taiwan photography (Taipei at blue hour, rainy neon street, sunlit office, sea of clouds) behind frosted refractive glass panels with specular edges. Few words per panel. | iOS 26's language is the newest "premium" signal in 2026. The Taiwan imagery is local and warm, which none of 1–5 had. |

## 5. Assets (shared/r2/)

Generated on the GX10 with ComfyUI (Qwen-Image-Edit-2509, lightning, text-to-image) and Wan 2.2 i2v for loops. Prompts are in `~/askgx-jobs/1104-150302/batch1.py`.
Naming: `l{layout}-{subject}-{variant}-{width}.webp`. Video loops: `*.mp4` (h264, muted, ≤ 2 MB) + poster. All images are illustrative renders (no real people, no logos).
The real dashboard screenshots from round 1 stay in `shared/img/dash-*.webp` (caption: 後台實際畫面，數字為示範資料).
