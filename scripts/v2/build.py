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
V = '81'
# LINE AI demo (/line-ai/demo/, /en/line-ai/demo/): the demo LINE Official Account 「夏裕 AI 客服體驗」 and the admin API it talks to.
DEMO_OA_ID = '@372xwcta'
DEMO_API = 'https://admin.shiptolive.com'
CSS = ''

PAGES = {  # slug -> (zh path, en path)
    'home': ('/', '/en/'),
    'website': ('/website/', '/en/website/'),
    'software': ('/software/', '/en/software/'),
    'seo-aeo-geo': ('/seo-aeo-geo/', '/en/seo-aeo-geo/'),
    'engine': ('/ai-visibility-engine/', '/en/ai-visibility-engine/'),
    'line-ai': ('/line-ai/', '/en/line-ai/'),
    'line-demo': ('/line-ai/demo/', '/en/line-ai/demo/'),  # try-it-yourself demo of the LINE AI service (x-line-demo.js reads <html lang>)
    'line-terms': ('/line-ai/terms/', '/en/line-ai/terms/'),  # LINE AI 服務條款 (online subscription terms; not in the main nav)
    'line-refund': ('/line-ai/refund/', '/en/line-ai/refund/'),  # LINE AI 退款與取消
    'crm': ('/crm/', '/en/crm/'),  # 網站後台與 CRM 建置 (Payload CMS); /crm/namyang/ is a separate client demo redirect
    'articles': ('/ai-search/', '/en/'),
    'about': ('/about/', '/en/about/'),
}
L = {
    'zh': dict(htmllang='zh-Hant', brand='夏裕科技', brand_sub='SHIP TO LIVE', place='TAIPEI · SAN DIEGO', home='首頁', services='服務項目',
               web='網站建置與數位行銷', web_s='企業網站、SEO、多語言網站', sw='客製化軟體開發', sw_s='企業系統、App、系統整合',
               ai='AI 搜尋優化（AEO／GEO）', ai_s='讓 ChatGPT、Gemini 提到您', engine='夏裕 AI 曝光引擎', line='LINE 官方帳號＋AI 客服', line_s='AI 24 小時回覆客人訊息', crm='網站後台與 CRM 建置', crm_s='Payload CMS、會員與客戶管理', about='關於我們',
               contact='聯絡我們', cta='免費 AI 曝光檢測', other='EN', other_label='English version', menu='選單', skip='跳到主要內容',
               f_company='夏裕科技股份有限公司 Ship to Live', f_tax='統一編號 90173045・可開統一發票', f_loc='總部：台北・服務台灣與歐美',
               f_svc='服務', f_more='更多', f_guide='AI 搜尋優化指南', f_work='過往作品', f_tools='免費工具', f_privacy='隱私權政策',
               f_book='預約免費諮詢', motto='敢想。敢作。敢創新。', locale='zh_TW', alt_locale='en_US'),
    'en': dict(htmllang='en', brand='Ship to Live', brand_sub='夏裕科技 · TAIPEI', place='TAIPEI · SAN DIEGO', home='Home', services='Services',
               web='Website Design & Digital Marketing', web_s='Company sites, SEO, multilingual', sw='Custom Software Development', sw_s='Business systems, apps, integration',
               ai='AI Search Optimization (AEO/GEO)', ai_s='Get named by ChatGPT and Gemini', engine='AI Visibility Engine', line='LINE AI customer service', line_s='AI answers customer messages 24/7', crm='CMS and CRM setup', crm_s='Payload CMS, customer data', about='About',
               contact='Contact', cta='Free AI visibility check', other='中文', other_label='中文版', menu='Menu', skip='Skip to content',
               f_company='Ship to Live (夏裕科技股份有限公司)', f_tax='Taiwan tax ID 90173045', f_loc='Headquartered in Taipei, serving Taiwan, Europe and North America',
               f_svc='Services', f_more='More', f_guide='AI search optimization guide', f_work='Past work', f_tools='Free tools', f_privacy='Privacy policy',
               f_book='Book a free consultation', motto='Dare to think. Dare to build. Dare to innovate.', locale='en_US', alt_locale='zh_TW'),
}
MARK = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="20" y="16" width="38" height="12" rx="6" fill="currentColor"/><rect x="6" y="36" width="31" height="12" rx="6" fill="currentColor"/><circle cx="49" cy="42" r="7.5" fill="#d7612a"/></svg>'


def p(lang, slug):
    return PAGES[slug][0 if lang == 'zh' else 1]


def header(lang, slug, other_href=None):
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
          <a href="{p(lang,'line-ai')}"{cur('line-ai')}>{t['line']}<small>{t['line_s']}</small></a>
          <a href="{p(lang,'crm')}"{cur('crm')}>{t['crm']}<small>{t['crm_s']}</small></a>
        </div>
      </div>
      <a href="{p(lang,'engine')}"{cur('engine')}>{t['engine']}</a>
      {'<a href="/ai-search/"' + (' aria-current="page"' if slug == 'articles' else '') + '>知識庫</a>' if lang == 'zh' else ''}
      <a href="{p(lang,'about')}"{cur('about')}>{t['about']}</a>
      <a href="{p(lang,'home')}#contact">{t['contact']}</a>
      <a class="lang" href="{other_href or p(other,slug)}" hreflang="{L[other]['htmllang']}" lang="{L[other]['htmllang']}" aria-label="{t['other_label']}">{t['other']}</a>
      <a class="pill sm orange cta-m" href="{p(lang,'engine')}#check">{t['cta']}</a>
    </nav>
    <a class="pill sm orange cta" href="{p(lang,'engine')}#check">{t['cta']}</a>
  </div>
</header>'''


LINE_URL = 'https://line.me/R/ti/p/@680uqtou'
LINE_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11.1c0 4 3.6 7.4 8.4 8 .3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s5.9-3.5 8-6c1.5-1.6 2.2-3.2 2.2-4.9C22 6.6 17.5 3 12 3zM8.3 13.4H6.3c-.3 0-.5-.2-.5-.5V9c0-.3.2-.5.5-.5s.5.2.5.5v3.4h1.5c.3 0 .5.2.5.5s-.2.5-.5.5zm2.1-.5c0 .3-.2.5-.5.5s-.5-.2-.5-.5V9c0-.3.2-.5.5-.5s.5.2.5.5v3.9zm4.8 0c0 .2-.1.4-.3.5h-.2c-.2 0-.3-.1-.4-.2l-2-2.7v2.4c0 .3-.2.5-.5.5s-.5-.2-.5-.5V9c0-.2.1-.4.3-.5h.2c.2 0 .3.1.4.2l2 2.7V9c0-.3.2-.5.5-.5s.5.2.5.5v3.9zm3.2-2.5c.3 0 .5.2.5.5s-.2.5-.5.5h-1.5v.9h1.5c.3 0 .5.2.5.5s-.2.5-.5.5h-2c-.3 0-.5-.2-.5-.5V9c0-.3.2-.5.5-.5h2c.3 0 .5.2.5.5s-.2.5-.5.5h-1.5v.9h1.5z"/></svg>'

# Hatchy (養成蛋), Yufan's kids app test project on admin: one quiet footer link, kept out of the link graph (nofollow), not in nav, llms.txt or the sitemap.
HATCHY = {lang: f'<a href="https://admin.shiptolive.com/hatchy" rel="nofollow noopener">{label}</a>'
          for lang, label in (('zh', '養成蛋 Hatchy'), ('en', 'Hatchy (kids app, beta)'))}


def footer(lang, meta=None):
    t = L[lang]
    pre = '/en' if lang == 'en' else ''
    chk = p(lang, 'engine') + '#check'
    # A page may swap the phone bar's first button with front-matter "mcta: label|href" (e.g. the LINE AI pages).
    m1, _, m2 = ((meta or {}).get('mcta') or '').partition('|')
    a1_label, a1_href = (m1.strip(), m2.strip()) if m1 and m2 else (t['cta'], chk)
    a1_ext = ' target="_blank" rel="noopener"' if a1_href.startswith('http') else ''
    # ...and the second one with "mcta2: label|href" (default: book a free call on Calendly).
    n1, _, n2 = ((meta or {}).get('mcta2') or '').partition('|')
    a2_label, a2_href = (n1.strip(), n2.strip()) if n1 and n2 else ("預約免費諮詢" if lang == "zh" else "Book a free call", 'https://calendly.com/yufansapp/20min')
    a2_ext = ' target="_blank" rel="noopener"' if a2_href.startswith('http') else ''
    mcta = (f'<div class="mcta" aria-label="{a1_label}"><a class="a1" href="{a1_href}"{a1_ext}>{a1_label}</a>'
            f'<a class="a2" href="{a2_href}"{a2_ext}>{a2_label}</a></div>')
    # LINE Official Account 夏裕科技 (@680uqtou, free basic ID): floating button on the Chinese pages.
    fab = (f'<a class="line-fab" href="{LINE_URL}" target="_blank" rel="noopener" aria-label="加 LINE 好友，用 LINE 聯絡我們">{LINE_ICON}<span>LINE 聯絡</span></a>'
           if lang == 'zh' else '')
    # LINE AI pages (front-matter "legal: line", and the LINE AI guide) also link the service terms and the refund policy.
    legal = (f'<a href="{p(lang,"line-terms")}">{"LINE AI 服務條款" if lang == "zh" else "LINE AI terms of service"}</a>'
             f'<a href="{p(lang,"line-refund")}">{"退款與取消" if lang == "zh" else "Refunds and cancellation"}</a>') if (meta or {}).get('legal') == 'line' else ''
    return fab + mcta + f'''<footer class="foot">
  <div class="wrap">
    <div class="cols">
      <div><b>{t['brand']}</b>{t['f_company']}<br>{t['f_tax']}<br>{t['f_loc']}<p class="motto">{t['motto']}</p></div>
      <nav aria-label="{t['f_svc']}"><b>{t['f_svc']}</b><a href="{p(lang,'seo-aeo-geo')}">{t['ai']}</a><a href="{p(lang,'website')}">{t['web']}</a><a href="{p(lang,'software')}">{t['sw']}</a><a href="{p(lang,'line-ai')}">{t['line']}</a><a href="{p(lang,'crm')}">{t['crm']}</a><a href="{p(lang,'engine')}">{t['engine']}</a></nav>
      <nav aria-label="{t['f_more']}"><b>{t['f_more']}</b><a href="{p(lang,'about')}">{t['about']}</a><a href="{pre}/geo-guide/">{t['f_guide']}</a>{'<a href="/ai-search/">AI 搜尋優化知識庫</a>' if lang == 'zh' else ''}<a href="{pre}/privacy/">{t['f_privacy']}</a>{legal}{HATCHY[lang]}</nav>
      <nav aria-label="{t['contact']}"><b>{t['contact']}</b><a href="mailto:yufan@shiptolive.com">yufan@shiptolive.com</a>{f'<a href="{LINE_URL}" target="_blank" rel="noopener">LINE 官方帳號</a>' if lang == 'zh' else ''}<a href="https://calendly.com/yufansapp/20min" target="_blank" rel="noopener">{t['f_book']}</a><a href="https://admin.shiptolive.com/card{'?lang=en' if lang == 'en' else ''}">{'電子名片' if lang == 'zh' else 'Business card'}</a><a href="{p(lang,'engine')}#check">{t['cta']}</a></nav>
    </div>
    <div class="legal"><span>© 2026 {t['f_company']}</span><span><a href="{'/en/' if lang=='zh' else '/'}" style="display:inline">{t['other_label']}</a></span></div>
  </div>
</footer>'''


def head(lang, slug, meta):
    t = L[lang]
    url = BASE + meta.get('path', p(lang, slug))
    zh_url, en_url = BASE + p('zh', slug), BASE + p('en', slug)
    if meta.get('path'):
        zh_url = url
    org = {
        "@type": "Organization", "@id": BASE + "/#org", "name": "夏裕科技股份有限公司",
        "alternateName": ["Ship to Live", "夏裕科技", "Xiayu Technology"],
        "legalName": "夏裕科技股份有限公司", "taxID": "90173045", "foundingDate": "2022", "url": BASE + "/", "email": "yufan@shiptolive.com",
        "logo": BASE + "/assets/logo/logo-512.png", "slogan": "敢想。敢作。敢創新。",
        "description": "Taipei software company serving Taiwan, Europe and North America: websites and digital marketing, custom software development, and AI search optimization (AEO/GEO) on its own Ship to Live AI Visibility Engine (夏裕 AI 曝光引擎).",
        "address": {"@type": "PostalAddress", "addressLocality": "Taipei", "addressRegion": "Taipei City", "addressCountry": "TW"},
        "areaServed": [{"@type": "Country", "name": "Taiwan"}, {"@type": "Place", "name": "Europe"}, {"@type": "Country", "name": "United States"}, {"@type": "Country", "name": "Canada"}],
        "knowsLanguage": ["zh-Hant", "en"],
        "knowsAbout": ["Website design and development", "Search engine optimization (SEO)", "Answer engine optimization (AEO)",
                       "Generative engine optimization (GEO)", "AI search visibility", "Custom software development", "App development",
                       "Booking and membership platforms", "API and system integration", "AI workflow automation", "Multilingual websites"],
        "founder": {"@type": "Person", "@id": BASE + "/#yufan", "name": "Yufan Chen", "jobTitle": "Founder & CTO",
                    "sameAs": ["https://www.linkedin.com/in/yufanchen8/"]},
        "contactPoint": {"@type": "ContactPoint", "contactType": "sales", "email": "yufan@shiptolive.com", "availableLanguage": ["zh-Hant", "en"],
                         "url": BASE + "/#contact"},
        "sameAs": [LINE_URL],
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": "夏裕科技 services", "itemListElement": [
            {"@type": "Offer", "itemOffered": {"@type": "Service", "@id": BASE + "/seo-aeo-geo/#service", "name": "AI 搜尋優化（AEO／GEO）",
                                                "alternateName": "AI Search Optimization (AEO/GEO)", "url": BASE + "/seo-aeo-geo/"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "@id": BASE + "/website/#service", "name": "網站建置與數位行銷",
                                                "alternateName": "Websites and Digital Marketing", "url": BASE + "/website/"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "@id": BASE + "/software/#service", "name": "客製化軟體開發",
                                                "alternateName": "Custom Software Development", "url": BASE + "/software/"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "@id": BASE + "/line-ai/#service", "name": "LINE 官方帳號＋AI 24 小時客服",
                                                "alternateName": "LINE Official Account with a 24/7 AI customer service assistant", "url": BASE + "/line-ai/"}},
            {"@type": "Offer", "itemOffered": {"@type": "SoftwareApplication", "@id": BASE + "/ai-visibility-engine/#product",
                                                "name": "夏裕 AI 曝光引擎", "alternateName": "Ship to Live AI Visibility Engine",
                                                "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
                                                "url": BASE + "/ai-visibility-engine/"}},
        ]},
    }
    graph = [org, {"@type": "WebPage", "@id": url + "#page", "url": url, "name": meta['title'], "description": meta['description'],
                   "inLanguage": t['htmllang'], "isPartOf": {"@type": "WebSite", "@id": BASE + "/#site", "url": BASE + "/", "name": "夏裕科技 Ship to Live"},
                   "publisher": {"@id": BASE + "/#org"}}]
    if meta.get('updated'):
        graph[1]["dateModified"] = meta['updated']
    if meta.get('crumbs'):
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": BASE + u} for i, (n, u) in enumerate(meta['crumbs'])]})
    elif slug != 'home':
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": t['home'], "item": BASE + p(lang, 'home')},
            {"@type": "ListItem", "position": 2, "name": meta.get('crumb', meta['title']), "item": url}]})
    graph += meta.get('ld', [])
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1)
    og = BASE + meta.get('og', f"/assets/img/og-{'en' if lang == 'en' else 'zh'}.png?v=1")
    if meta.get('pair'):  # a page with its own zh/en counterpart outside PAGES (e.g. /line-ai/guide/ and /en/line-ai/guide/)
        zh_url, en_url = (url, BASE + meta['pair']) if lang == 'zh' else (BASE + meta['pair'], url)
    alts = (f'<link rel="alternate" hreflang="zh-Hant" href="{zh_url}">\n<link rel="alternate" hreflang="x-default" href="{zh_url}">' if meta.get('zh_only') and not meta.get('pair') else
            f'<link rel="alternate" hreflang="en" href="{url}">\n<link rel="alternate" hreflang="x-default" href="{url}">' if meta.get('en_only') and not meta.get('pair') else
            f'<link rel="alternate" hreflang="zh-Hant" href="{zh_url}">\n<link rel="alternate" hreflang="en" href="{en_url}">\n<link rel="alternate" hreflang="x-default" href="{zh_url}">')
    robots = '<meta name="robots" content="noindex, nofollow">\n' if meta.get('draft') else ''
    # Page-only stylesheet (front-matter css: x-line-demo.css), so one page's styles don't ride along in every page's inline CSS.
    extra_css = f'<link rel="stylesheet" href="/assets/v2/{meta["css"]}?v={V}">\n' if meta.get('css') else ''
    return f'''<!doctype html>
<html lang="{t['htmllang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{meta['title']}</title>
<meta name="description" content="{meta['description']}">
{robots}<link rel="canonical" href="{url}">
{alts}
<meta name="theme-color" content="#efebe6">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta property="og:type" content="{meta.get('og_type', 'website')}">
<meta property="og:site_name" content="{t['brand']}">
<meta property="og:title" content="{meta['title']}">
<meta property="og:description" content="{meta['description']}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{og}">
<meta property="og:locale" content="{t['locale']}">
<meta property="og:locale:alternate" content="{t['alt_locale']}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{og}">
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-5W92T6J80C');
addEventListener('load',function(){{setTimeout(function(){{var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=G-5W92T6J80C';document.head.appendChild(s);}},1500);}});</script>
<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>{CSS}</style>
{extra_css}<script type="application/ld+json">
{ld}
</script>
<script>if(/[?&]embed=1/.test(location.search)&&window.top!==window.self){{document.documentElement.classList.add('embed');document.write('<base target="_blank">');}}</script>
<script src="https://admin.shiptolive.com/stl-track.js" data-site="shiptolive" defer></script>
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
        meta[k.strip()] = json.loads(v) if k.strip() in ('ld', 'crumbs') else v
    body = raw[m.end():]
    # Placeholders a body may use: {{DEMO_OA_ID}}, {{DEMO_API}}, {{V}}.
    body = body.replace('{{DEMO_OA_ID}}', DEMO_OA_ID).replace('{{DEMO_API}}', DEMO_API).replace('{{V}}', V)
    html = head(lang, slug, meta) + header(lang, slug) + '\n<main id="main">\n' + body.strip() + '\n</main>\n' + footer(lang, meta) + \
        f'\n<script src="/assets/v2/all.js?v={V}" defer></script>\n' + \
        (f'<script src="/assets/v2/{meta["js"]}?v={V}" defer></script>\n' if meta.get('js') else '') + '</body>\n</html>\n'
    out = ROOT / p(lang, slug).strip('/') / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    return out


def bundle():
    a = ROOT / 'assets' / 'v2'
    css = '\n'.join((a / f).read_text() for f in ('site.css', 'x-a.css', 'x-b.css', 'x-c.css', 'x-post.css', 'x-aipage.css', 'x-line.css', 'zz-fixes.css'))
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};:,>])\s*', r'\1', css).replace(';}', '}')
    (a / 'all.css').write_text(css)
    global CSS
    CSS = css
    (a / 'all.js').write_text('\n;\n'.join((a / f).read_text() for f in ('site.js', 'x-a.js', 'x-b.js', 'x-c.js')))


if __name__ == '__main__':
    bundle()
    for lang in ('zh', 'en'):
        for slug in PAGES:
            o = build(lang, slug)
            print(('wrote ' + str(o)) if o else f'skip {lang}/{slug} (no body)')
    import articles
    articles.run(sys.modules[__name__])
