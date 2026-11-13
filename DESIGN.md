# shiptolive.com design system

Source of truth for the v2 site (generated pages in `scripts/v2/`). If CSS drifts from this file, this file wins.

## Discovery

- **Artifact:** marketing site + content hub (knowledge base) for a Taipei software studio. Primary action: request the free AI visibility check (`/ai-visibility-engine/#check`); secondary: book a 20-minute call (Calendly).
- **Audience:** Taiwan SMB owners (Traditional Chinese first), plus English-speaking clients in Europe and North America.
- **Positioning:** technical and credible, not agency-glossy. AI search optimization (AEO/GEO) is the lead service.
- **Adjectives:** clear, grounded, technical, warm, honest.
- **Essence:** "proof, not promises".

## Committed aesthetic

Warm paper + ink + one orange, flat illustration and real product UI. Brand colors and Inter are fixed by the 2026-11 spec (`夏裕科技_網站改版工程說明`), so cream and Inter are deliberate, not reflex.

**Signature move: the "your company" tag.** An orange pill (`.you-tag`, `.tag.you` in demos) marks the thing AI names. It appears in the hero illustration, the AI demo console, section headings that ask "will AI name you?", and the CTA box. Use it only where the point is "AI recommends you"; never as general decoration.

## Tokens

| Role | Value |
|---|---|
| bg | `#efebe6` (cream) |
| surface | `#f7f5f2` (cards), `#e6e1da` (alt section) |
| fg | `#161513` |
| muted | `#4a4743` (body secondary), `#625e58` (captions) |
| border | `rgba(22,21,19,.14)` |
| accent | `#d7612a` (graphics, lines) |
| accent for text/fills with white text | `#b8501d` (passes AA) |
| accent-ink (orange text on light) | `#a3441a` |
| success | `#2c7a4b` on `#dcefe0` |
| dark section | `#161513`, cards `#201e1b` |

- **Fonts:** Inter (Latin) + PingFang TC / Noto Sans TC (CJK). Mono (`ui-monospace`) only for small data labels.
- **Type scale:** home H1 52, inner H1 44 (EN 40), H2 34, H3 18–21, lede 17–18, body 16–17, captions 12.5–13.5 (px, clamped down on phones).
- **Radius:** 14px cards (`--r`), 999px pills/buttons only.
- **Edges:** defined 1px border; no large diffuse shadow on bordered elements.
- **Spacing:** section padding `clamp(64px, 9vw, 120px)`; tight within groups, generous between sections.

## Craft rules

- **Headings:** no English all-caps kicker above every heading. Use one only where it adds information (e.g. 示範案例).
- **Layouts:** do not stack identical 3-card grids back to back; vary with split layouts (statement left, list right), timelines, and real UI.
- **Numbers:** 01/02/03 markers only for real sequences (process steps).
- **Proof:** real product UI (dashboards, the monthly-check chart) over illustration. Demo data is always labeled 示範資料 / 示範案例; client names and numbers only with written consent.
- **Motion:** entrance motion only on key visuals (demo console, dashboard, charts, loop). Text and cards are visible at rest. No marquees. Respect `prefers-reduced-motion`.
- **CTAs:** one primary (orange `#b8501d`) per block; secondary is outlined.
- **Accessibility:** WCAG AA contrast, visible focus, 44px targets on phones, labels on every input.

## Slop audit

- 2026-11-13 homepage review (frontend-design-deslop): 5.5/10 before. Fixed: kicker labels removed, why-us section turned into a split list (no 01/02/03), engine section de-duplicated from the AI demo, side-bar note removed, border + shadow doubling removed, logo marquee replaced by a static name row, entrance motion limited to key visuals, signature tag introduced. Remaining by choice: cream + Inter (brand spec), hand-drawn SVG illustrations (to be replaced by real photos or product screens over time).

## Changelog

- 2026-11-13: created.
