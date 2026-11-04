# Round-2 assets (shared/r2/)

All images are AI-generated illustrative renders made on the GX10 (ComfyUI, Qwen-Image-Edit-2509 text-to-image, 2026-11-04). No real people, products or logos. Use them as atmosphere and product visuals. Never present them as client work.
Naming: `<name>-<width>.webp`. `-w` = wide 16:9-ish (1664×928 source), `-p` = portrait, `-sq` = square, `icon` = square product thumbnail.
Corner colours are sampled from the source so you can match a card/section background to the image edge (for seamless edges, also use a CSS mask/gradient fade).

## Subjects
- **l6-* (Layout 6, Apple):** studio product renders. `mk` = frosted glass slab with rising light bars (科技行銷). `sw` = interlocking aluminium/ceramic modular cube with a blue glowing core (軟體開發). `ai` = glass sphere with a glowing node constellation and orbiting beads (AI 導入). Each in `dark` (black studio) and `light` (pale grey studio), `-w` and `-p`. Icons (white bg, for the product-icon row): `icon-mk`, `icon-sw`, `icon-ai`, `icon-work` (stacked glass panels → 作品/案例), `icon-price` (aluminium tag → 方案), `icon-book` (white speech bubble → 預約).
- **l7-* (Layout 7, Cinematic):** film stills, teal/amber grade. `hero` = black glass monolith in a shaft of light, tiny figure. `mk` = searchlight finding one building in a foggy night city (being found). `sw` = a giant machine assembling itself with sparks (building). `ai` = golden threads flowing between floating glass cards (work flowing). `-w` and `-p`.
- **l8-* (Layout 8, Object studio):** matte stone/clay objects on warm paper white #efebe4-ish, an orange accent. `hero` = three objects on a stone plinth. `mk` = lens disc + stone steps with an orange top block. `sw` = modular ceramic block appliance with an orange knob. `ai` = clay sphere with an orange core and orbiting beads. `-sq` and `-w`.
- **l9-* (Layout 9, Gradient depth):** iridescent glass ribbons on white (coral → magenta → violet → blue). `hero-w`, `hero-p`, and single objects `mk` (prism splitting light), `sw` (stacked glass cubes with a ribbon), `ai` (ribbon knot with a glowing core).
- **l10-* (Layout 10, Liquid Glass):** cinematic Taiwan photography (AI-generated, illustrative). `hero` = Taipei skyline at blue hour from a hillside (pink/blue). `mk` = rainy neon street bokeh (pre-blurred). `sw` = sunlit plant-filled office. `ai` = sea of clouds over mountain ridges at sunrise. `-w` and `-p` (9:16).

## Video loops (shared/r2/video/, added as they render; h264, muted, ≤ 2 MB, 5 s, + `-poster.webp`)
Final: `l7-hero`, `l7-mk`, `l7-sw`, `l7-ai`, `l6-mk`, `l6-ai`, `l10-hero` (rendered from l10-hero-xl). No l6-sw loop (the render broke apart). Wan 2.2 i2v, 1280×720, ping-pong loops.

## Files
- **l6-ai-light-p** aspect 928:1232. corners TL TR BL BR: #c6d0da #8c96a1 #b6bdc9 #afb7c4. files: l6-ai-light-p-480.webp (480x637, 6KB), l6-ai-light-p-828.webp (828x1099, 12KB)
- **l6-ai-light-w** aspect 1664:928. corners TL TR BL BR: #c8d2dd #69747f #949daa #a2acba. files: l6-ai-light-w-640.webp (640x357, 6KB), l6-ai-light-w-1080.webp (1080x602, 12KB), l6-ai-light-w-1600.webp (1600x892, 20KB)
- **l6-icon-book** aspect 1024:1024. corners TL TR BL BR: #f4f3f8 #ededf2 #fafbff #f7f5fc. files: l6-icon-book-160.webp (160x160, 0KB), l6-icon-book-320.webp (320x320, 1KB)
- **l6-icon-mk** aspect 1024:1024. corners TL TR BL BR: #f4f2f8 #f3f1f7 #f9f8ff #f7f4fc. files: l6-icon-mk-160.webp (160x160, 1KB), l6-icon-mk-320.webp (320x320, 2KB)
- **l6-icon-price** aspect 1024:1024. corners TL TR BL BR: #f0eff5 #efeef4 #f7f7fd #f8f7fc. files: l6-icon-price-160.webp (160x160, 0KB), l6-icon-price-320.webp (320x320, 2KB)
- **l6-icon-sw** aspect 1024:1024. corners TL TR BL BR: #f7f7fc #f7f7fc #f9faff #fbfafe. files: l6-icon-sw-160.webp (160x160, 1KB), l6-icon-sw-320.webp (320x320, 3KB)
- **l6-icon-work** aspect 1024:1024. corners TL TR BL BR: #faf8fd #faf8fd #fbfaff #fcf9ff. files: l6-icon-work-160.webp (160x160, 1KB), l6-icon-work-320.webp (320x320, 3KB)
- **l6-mk-light-p** aspect 928:1232. corners TL TR BL BR: #d9e1eb #8a95a5 #c0c1d0 #cac8d5. files: l6-mk-light-p-480.webp (480x637, 5KB), l6-mk-light-p-828.webp (828x1099, 10KB)
- **l6-sw-light-p** aspect 928:1232. corners TL TR BL BR: #a8b3be #8a939f #e0e3eb #e2e5ee. files: l6-sw-light-p-480.webp (480x637, 7KB), l6-sw-light-p-828.webp (828x1099, 15KB)
- **l6-sw-light-w** aspect 1664:928. corners TL TR BL BR: #a9b2be #57616a #e0e5f0 #dde2ed. files: l6-sw-light-w-640.webp (640x357, 6KB), l6-sw-light-w-1080.webp (1080x602, 12KB), l6-sw-light-w-1600.webp (1600x892, 21KB)
- **l10-ai-p** aspect 928:1664. corners TL TR BL BR: #f7efe4 #dedfe0 #0c0a07 #180f09. files: l10-ai-p-480.webp (480x861, 11KB), l10-ai-p-828.webp (828x1485, 22KB)
- **l10-ai-w** aspect 1664:928. corners TL TR BL BR: #e2e5e5 #f6eee6 #0c0a0b #0b0a09. files: l10-ai-w-640.webp (640x357, 8KB), l10-ai-w-1080.webp (1080x602, 14KB), l10-ai-w-1600.webp (1600x892, 24KB)
- **l10-hero-p** aspect 928:1664. corners TL TR BL BR: #55a4e9 #56a6ec #07070b #0b1411. files: l10-hero-p-480.webp (480x861, 15KB), l10-hero-p-828.webp (828x1485, 31KB)
- **l10-hero-w** aspect 1664:928. corners TL TR BL BR: #eaddf7 #b4c8f9 #080f11 #080d13. files: l10-hero-w-640.webp (640x357, 7KB), l10-hero-w-1080.webp (1080x602, 15KB), l10-hero-w-1600.webp (1600x892, 25KB)
- **l10-mk-p** aspect 928:1664. corners TL TR BL BR: #07151a #05090d #04060a #07080c. files: l10-mk-p-480.webp (480x861, 24KB), l10-mk-p-828.webp (828x1485, 45KB)
- **l10-mk-w** aspect 1664:928. corners TL TR BL BR: #0a0f11 #070b0e #070a0d #261b10. files: l10-mk-w-640.webp (640x357, 17KB), l10-mk-w-1080.webp (1080x602, 30KB), l10-mk-w-1600.webp (1600x892, 47KB)
- **l10-sw-p** aspect 928:1664. corners TL TR BL BR: #4a590b #6a5d4e #060402 #2f2a27. files: l10-sw-p-480.webp (480x861, 23KB), l10-sw-p-828.webp (828x1485, 43KB)
- **l10-sw-w** aspect 1664:928. corners TL TR BL BR: #11150b #707169 #0e0d08 #141312. files: l10-sw-w-640.webp (640x357, 15KB), l10-sw-w-1080.webp (1080x602, 26KB), l10-sw-w-1600.webp (1600x892, 40KB)
- **l6-ai-dark-p** aspect 928:1232. corners TL TR BL BR: #030303 #030302 #030202 #050404. files: l6-ai-dark-p-480.webp (480x637, 12KB), l6-ai-dark-p-828.webp (828x1099, 23KB)
- **l6-ai-dark-w** aspect 1664:928. corners TL TR BL BR: #030202 #030302 #040405 #09080a. files: l6-ai-dark-w-640.webp (640x357, 11KB), l6-ai-dark-w-1080.webp (1080x602, 20KB), l6-ai-dark-w-1600.webp (1600x892, 31KB)
- **l6-mk-dark-p** aspect 928:1232. corners TL TR BL BR: #020102 #020202 #08080c #0b0b0f. files: l6-mk-dark-p-480.webp (480x637, 7KB), l6-mk-dark-p-828.webp (828x1099, 15KB)
- **l6-mk-dark-w** aspect 1664:928. corners TL TR BL BR: #030203 #050505 #040306 #09080b. files: l6-mk-dark-w-640.webp (640x357, 8KB), l6-mk-dark-w-1080.webp (1080x602, 15KB), l6-mk-dark-w-1600.webp (1600x892, 25KB)
- **l6-sw-dark-p** aspect 928:1232. corners TL TR BL BR: #171a1d #141519 #0b0b0e #0d0c11. files: l6-sw-dark-p-480.webp (480x637, 9KB), l6-sw-dark-p-828.webp (828x1099, 18KB)
- **l6-sw-dark-w** aspect 1664:928. corners TL TR BL BR: #030203 #030303 #070608 #0b0a0c. files: l6-sw-dark-w-640.webp (640x357, 8KB), l6-sw-dark-w-1080.webp (1080x602, 15KB), l6-sw-dark-w-1600.webp (1600x892, 24KB)
- **l7-ai-p** aspect 832:1472. corners TL TR BL BR: #05090c #05080a #010001 #040303. files: l7-ai-p-480.webp (480x849, 25KB), l7-ai-p-828.webp (828x1465, 47KB)
- **l7-ai-w** aspect 1664:928. corners TL TR BL BR: #050706 #050605 #080401 #854c0c. files: l7-ai-w-640.webp (640x357, 16KB), l7-ai-w-1080.webp (1080x602, 28KB), l7-ai-w-1600.webp (1600x892, 43KB)
- **l7-hero-p** aspect 832:1472. corners TL TR BL BR: #040507 #040405 #020101 #040303. files: l7-hero-p-480.webp (480x849, 10KB), l7-hero-p-828.webp (828x1465, 21KB)
- **l7-hero-w** aspect 1664:928. corners TL TR BL BR: #0b1f1f #102c2e #020201 #060505. files: l7-hero-w-640.webp (640x357, 6KB), l7-hero-w-1080.webp (1080x602, 13KB), l7-hero-w-1600.webp (1600x892, 22KB)
- **l7-mk-p** aspect 832:1472. corners TL TR BL BR: #062e39 #06232c #020101 #040303. files: l7-mk-p-480.webp (480x849, 11KB), l7-mk-p-828.webp (828x1465, 23KB)
- **l7-mk-w** aspect 1664:928. corners TL TR BL BR: #072f36 #0a3841 #020101 #080c10. files: l7-mk-w-640.webp (640x357, 8KB), l7-mk-w-1080.webp (1080x602, 16KB), l7-mk-w-1600.webp (1600x892, 28KB)
- **l7-sw-p** aspect 832:1472. corners TL TR BL BR: #030508 #062e35 #010101 #030202. files: l7-sw-p-480.webp (480x849, 26KB), l7-sw-p-828.webp (828x1465, 48KB)
- **l7-sw-w** aspect 1664:928. corners TL TR BL BR: #030303 #051316 #010102 #030202. files: l7-sw-w-640.webp (640x357, 16KB), l7-sw-w-1080.webp (1080x602, 31KB), l7-sw-w-1600.webp (1600x892, 48KB)
- **l8-ai-sq** aspect 1328:1328. corners TL TR BL BR: #edebea #bfb6b1 #a9a6a9 #dfd3cd. files: l8-ai-sq-600.webp (600x600, 6KB), l8-ai-sq-1000.webp (1000x1000, 12KB)
- **l8-ai-w** aspect 1664:928. corners TL TR BL BR: #f7f6f2 #bcada2 #c1b8b7 #f2e1d6. files: l8-ai-w-640.webp (640x357, 5KB), l8-ai-w-1080.webp (1080x602, 9KB), l8-ai-w-1600.webp (1600x892, 17KB)
- **l8-hero-sq** aspect 1328:1328. corners TL TR BL BR: #f5f2ee #b6a89d #b4aca7 #aba39e. files: l8-hero-sq-600.webp (600x600, 10KB), l8-hero-sq-1000.webp (1000x1000, 20KB)
- **l8-hero-w** aspect 1664:928. corners TL TR BL BR: #b8afa4 #b4a496 #aa9e97 #a5958c. files: l8-hero-w-640.webp (640x357, 6KB), l8-hero-w-1080.webp (1080x602, 13KB), l8-hero-w-1600.webp (1600x892, 22KB)
- **l8-mk-sq** aspect 1328:1328. corners TL TR BL BR: #f3f4f6 #bbb0aa #b5b2b2 #b2a9a5. files: l8-mk-sq-600.webp (600x600, 8KB), l8-mk-sq-1000.webp (1000x1000, 17KB)
- **l8-mk-w** aspect 1664:928. corners TL TR BL BR: #f2f3f2 #8e7d6c #c4bbb9 #c5b3a8. files: l8-mk-w-640.webp (640x357, 6KB), l8-mk-w-1080.webp (1080x602, 13KB), l8-mk-w-1600.webp (1600x892, 23KB)
- **l8-sw-sq** aspect 1328:1328. corners TL TR BL BR: #a79a90 #fdfcfb #a09793 #b3aeae. files: l8-sw-sq-600.webp (600x600, 7KB), l8-sw-sq-1000.webp (1000x1000, 14KB)
- **l8-sw-w** aspect 1664:928. corners TL TR BL BR: #c7b9b0 #b9a89b #bab0af #c5b0a3. files: l8-sw-w-640.webp (640x357, 5KB), l8-sw-w-1080.webp (1080x602, 11KB), l8-sw-w-1600.webp (1600x892, 19KB)
- **l9-ai** aspect 1024:1024. corners TL TR BL BR: #edeff7 #eff0f9 #f2f1fa #f2f1fa. files: l9-ai-600.webp (600x600, 10KB), l9-ai-1000.webp (1000x1000, 19KB)
- **l9-hero-p** aspect 928:1232. corners TL TR BL BR: #fdbb98 #f4f2f7 #f5f2f8 #f6f2f9. files: l9-hero-p-480.webp (480x637, 10KB), l9-hero-p-828.webp (828x1099, 19KB)
- **l9-hero-w** aspect 1664:928. corners TL TR BL BR: #f2f2fa #f6f4fc #e67bd9 #f7f4fd. files: l9-hero-w-640.webp (640x357, 10KB), l9-hero-w-1080.webp (1080x602, 21KB), l9-hero-w-1600.webp (1600x892, 33KB)
- **l9-mk** aspect 1024:1024. corners TL TR BL BR: #f5f3f7 #f6f4fa #f8edf4 #eeecf8. files: l9-mk-600.webp (600x600, 12KB), l9-mk-1000.webp (1000x1000, 22KB)
- **l9-sw** aspect 1024:1024. corners TL TR BL BR: #f4f3f7 #f5f3f9 #f1eff6 #f6f4fa. files: l9-sw-600.webp (600x600, 9KB), l9-sw-1000.webp (1000x1000, 17KB)

## Added during review
- `l10-hero-xl-{1080,1600,2304}.webp`: sharper Taipei hero with Taipei 101 at about x=79%.
- `l8-*` renders were cleaned of AI pseudo-text (Qwen edit), same filenames.
- `l6x-sw-core-*` (macro crop, layout 6), `l7-gohike-*` (graded Go Hike photo, layout 7): added by designers.
