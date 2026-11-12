#!/usr/bin/env python3
"""Ship to Live 2026-11 redesign: wraps page bodies (bodies/<lang>/<slug>.html) in the shared
head, header and footer and writes them into the site repo. Run: python3 build.py <site-root>

Each body file starts with a front-matter block:
<!--
title: ...
description: ...
crumb: ...            (optional; breadcrumb label, omitted on home)
ld: {...json...}      (optional; extra JSON-LD objects as a JSON list on one line)
-->
"""
import json, re, sys, pathlib

HERE = pathlib.Path(__file__).parent
ROOT = pathlib.Path(sys.argv[1])
BASE = 'https://www.shiptolive.com'
V = '20'

PAGES = {  # slug -> (zh path, en path)
    'home': ('/', '/en/'),
    'website': ('/website/', '/en/website/'),
    'software': ('/software/', '/en/software/'),
    'seo-aeo-geo': ('/seo-aeo-geo/', '/en/seo-aeo-geo/'),
    'engine': ('/ai-visibility-engine/', '/en/ai-visibility-engine/'),
    'about': ('/about/', '/en/about/'),
}
L = {
    'zh': dict(htmllang='zh-Hant', brand='夏裕科技', brand_sub='SHIP TO LIVE', place='TAIPEI · SAN DIEGO', home='首頁', services='服務項目',
               web='網站建置與數位行銷', web_s='企業網站、SEO、多語言網站', sw='客製化軟體開發', sw_s='企業系統、App、系統整合',
               ai='AI 搜尋優化（AEO／GEO）', ai_s='讓 ChatGPT、Gemini 提到您', engine='夏裕 AI 曝光引擎', about='關於我們',
               contact='聯絡我們', cta='免費 AI 曝光檢測', other='EN', other_label='English version', menu='選單', skip='跳到主要內容',
               f_company='夏裕科技股份有限公司 Ship to Live', f_tax='統一編號 90173045・可開統一發票', f_loc='總部：台北・服務台灣與美國',
               f_svc='服務', f_more='更多', f_guide='AI 搜尋優化指南', f_work='過往作品', f_tools='免費工具', f_privacy='隱私權政策',
               f_book='預約免費諮詢', motto='敢想。敢作。敢創新。', locale='zh_TW', alt_locale='en_US'),
    'en': dict(htmllang='en', brand='Ship to Live', brand_sub='夏裕科技 · TAIPEI', place='TAIPEI · SAN DIEGO', home='Home', services='Services',
               web='Websites & Digital Marketing', web_s='Company sites, SEO, multilingual', sw='Custom Software Development', sw_s='Business systems, apps, integration',
               ai='AI Search Optimization (AEO/GEO)', ai_s='Get named by ChatGPT and Gemini', engine='AI Visibility Engine', about='About',
               contact='Contact', cta='Free AI visibility check', other='中文', other_label='中文版', menu='Menu', skip='Skip to content',
               f_company='Ship to Live (夏裕科技股份有限公司)', f_tax='Taiwan tax ID 90173045', f_loc='Headquartered in Taipei, serving Taiwan and the US',
               f_svc='Services', f_more='More', f_guide='AI search optimization guide', f_work='Past work', f_tools='Free tools', f_privacy='Privacy policy',
               f_book='Book a free consultation', motto='Dare to think. Dare to build. Dare to innovate.', locale='en_US', alt_locale='zh_TW'),
}
MARK = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="20" y="16" width="38" height="12" rx="6" fill="currentColor"/><rect x="6" y="36" width="31" height="12" rx="6" fill="currentColor"/><circle cx="49" cy="42" r="7.5" fill="#d7612a"/></svg>'


def p(lang, slug):
    return PAGES[slug][0 if lang == 'zh' else 1]


def header(lang, slug):
    t = L[lang]
    other = 'en' if lang == 'zh' else 'zh'
    cur = lambda s: ' aria-current="page"' if s == slug else ''
    return f'''<a class="skip" href="#main">{t['skip']}</a>
<header class="hdr">
  <div class="wrap">
    <a class="brand" href="{p(lang,'home')}" aria-label="{t['brand']} {t['home']}">{MARK}<span>{t['brand']}</span></a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="{t['menu']}"><span></span></button>
    <nav class="nav" id="nav" aria-label="{t['menu']}">
      <a href="{p(lang,'home')}"{cur('home')}>{t['home']}</a>
      <div class="dd"><button type="button" aria-expanded="false" aria-haspopup="true">{t['services']}</button>
        <div class="menu">
          <a href="{p(lang,'seo-aeo-geo')}"{cur('seo-aeo-geo')}>{t['ai']}<small>{t['ai_s']}</small></a>
          <a href="{p(lang,'website')}"{cur('website')}>{t['web']}<small>{t['web_s']}</small></a>
          <a href="{p(lang,'software')}"{cur('software')}>{t['sw']}<small>{t['sw_s']}</small></a>
        </div>
      </div>
      <a href="{p(lang,'engine')}"{cur('engine')}>{t['engine']}</a>
      <a href="{p(lang,'about')}"{cur('about')}>{t['about']}</a>
      <a href="{p(lang,'home')}#contact">{t['contact']}</a>
      <a class="lang" href="{p(other,slug)}" hreflang="{L[other]['htmllang']}" lang="{L[other]['htmllang']}" aria-label="{t['other_label']}">{t['other']}</a>
      <a class="pill sm orange cta-m" href="{p(lang,'engine')}#check">{t['cta']}</a>
    </nav>
    <a class="pill sm orange cta" href="{p(lang,'engine')}#check">{t['cta']}</a>
  </div>
</header>'''


def footer(lang):
    t = L[lang]
    pre = '/en' if lang == 'en' else ''
    return f'''<footer class="foot">
  <div class="wrap">
    <div class="cols">
      <div><b>{t['brand']}</b>{t['f_company']}<br>{t['f_tax']}<br>{t['f_loc']}<p class="motto">{t['motto']}</p></div>
      <nav aria-label="{t['f_svc']}"><b>{t['f_svc']}</b><a href="{p(lang,'seo-aeo-geo')}">{t['ai']}</a><a href="{p(lang,'website')}">{t['web']}</a><a href="{p(lang,'software')}">{t['sw']}</a><a href="{p(lang,'engine')}">{t['engine']}</a></nav>
      <nav aria-label="{t['f_more']}"><b>{t['f_more']}</b><a href="{p(lang,'about')}">{t['about']}</a><a href="{pre}/geo-guide/">{t['f_guide']}</a><a href="{pre}/projects/">{t['f_work']}</a><a href="/tools/">{t['f_tools']}</a><a href="{pre}/privacy/">{t['f_privacy']}</a></nav>
      <nav aria-label="{t['contact']}"><b>{t['contact']}</b><a href="mailto:yufan@shiptolive.com">yufan@shiptolive.com</a><a href="https://calendly.com/yufansapp/20min" target="_blank" rel="noopener">{t['f_book']}</a><a href="{p(lang,'engine')}#check">{t['cta']}</a></nav>
    </div>
    <div class="legal"><span>© 2026 {t['f_company']}</span><span><a href="{'/en/' if lang=='zh' else '/'}" style="display:inline">{t['other_label']}</a></span></div>
  </div>
</footer>'''


def head(lang, slug, meta):
    t = L[lang]
    url = BASE + p(lang, slug)
    zh_url, en_url = BASE + p('zh', slug), BASE + p('en', slug)
    org = {
        "@type": "Organization", "@id": BASE + "/#org", "name": "夏裕科技股份有限公司", "alternateName": ["Ship to Live", "夏裕科技"],
        "legalName": "夏裕科技股份有限公司", "taxID": "90173045", "foundingDate": "2022", "url": BASE + "/", "email": "yufan@shiptolive.com",
        "logo": BASE + "/assets/logo/logo-512.png", "slogan": "敢想。敢作。敢創新。",
        "address": {"@type": "PostalAddress", "addressLocality": "Taipei", "addressCountry": "TW"},
        "areaServed": [{"@type": "Country", "name": "Taiwan"}, {"@type": "Country", "name": "United States"}],
        "founder": {"@type": "Person", "@id": BASE + "/#yufan", "name": "Yufan Chen", "jobTitle": "Founder & CTO"},
    }
    graph = [org, {"@type": "WebPage", "@id": url + "#page", "url": url, "name": meta['title'], "description": meta['description'],
                   "inLanguage": t['htmllang'], "isPartOf": {"@type": "WebSite", "@id": BASE + "/#site", "url": BASE + "/", "name": "夏裕科技 Ship to Live"},
                   "publisher": {"@id": BASE + "/#org"}}]
    if slug != 'home':
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": t['home'], "item": BASE + p(lang, 'home')},
            {"@type": "ListItem", "position": 2, "name": meta.get('crumb', meta['title']), "item": url}]})
    graph += meta.get('ld', [])
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1)
    og = BASE + '/assets/img/og.png?v=5'
    return f'''<!doctype html>
<html lang="{t['htmllang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{meta['title']}</title>
<meta name="description" content="{meta['description']}">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="zh-Hant" href="{zh_url}">
<link rel="alternate" hreflang="en" href="{en_url}">
<link rel="alternate" hreflang="x-default" href="{zh_url}">
<meta name="theme-color" content="#efebe6">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{t['brand']}">
<meta property="og:title" content="{meta['title']}">
<meta property="og:description" content="{meta['description']}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{og}">
<meta property="og:locale" content="{t['locale']}">
<meta property="og:locale:alternate" content="{t['alt_locale']}">
<meta name="twitter:card" content="summary_large_image">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5W92T6J80C"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-5W92T6J80C');</script>
<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/v2/site.css?v={V}">
<script type="application/ld+json">
{ld}
</script>
</head>
<body>
'''


def build(lang, slug):
    src = HERE / 'bodies' / lang / f'{slug}.html'
    if not src.exists():
        return None
    raw = src.read_text()
    m = re.match(r'\s*<!--(.*?)-->\s*', raw, re.S)
    meta = {}
    for line in m.group(1).strip().splitlines():
        k, _, v = line.partition(':')
        v = v.strip()
        meta[k.strip()] = json.loads(v) if k.strip() == 'ld' else v
    body = raw[m.end():]
    html = head(lang, slug, meta) + header(lang, slug) + '\n<main id="main">\n' + body.strip() + '\n</main>\n' + footer(lang) + \
        f'\n<script src="/assets/v2/site.js?v={V}" defer></script>\n</body>\n</html>\n'
    out = ROOT / p(lang, slug).strip('/') / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    return out


if __name__ == '__main__':
    for lang in ('zh', 'en'):
        for slug in PAGES:
            o = build(lang, slug)
            print(('wrote ' + str(o)) if o else f'skip {lang}/{slug} (no body)')
