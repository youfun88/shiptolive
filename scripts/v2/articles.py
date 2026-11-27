"""AI 搜尋優化知識庫 (/ai-search/): article pages and the hub, built from scripts/v2/bodies/zh/articles/*.html.

Each article file starts with a front-matter comment, one `key: value` per line:
<!--
slug: what-is-geo                      (URL: /ai-search/<slug>/)
title: <title tag, ~30 zh chars + ｜夏裕科技>
description: <meta description, ~80 zh chars>
h1: <page heading>
dek: <one-sentence answer shown under the heading>
category: 入門 | 實作 | 選擇服務商 | 產業應用 | 成效與費用
order: <number, hub order>
date: 2026-11-13
hero: /assets/v2/img/ai-search/<slug>.svg
hero_alt: <alt text>
draft: true                            (noindex, kept out of sitemap; remove the line to publish)
section: line                          (optional: an article that belongs to another service, see SECTIONS: own URL via
path: /line-ai/guide/                   `path`, that service's breadcrumb, related links and CTA; `pair` = the other
pair: /en/line-ai/guide/                language's path, for hreflang and the language switch)
ld: [ ...extra JSON-LD objects, e.g. FAQPage... ]
-->
then the article body HTML (sections with <h2>, paragraphs, figures, tables, the FAQ <section class="faq">).
The page header (breadcrumbs, H1, dek, date, hero image), the Article JSON-LD, related links and the CTA are added here.
"""
import json
import re

HUB = '/ai-search/'
HUB_NAME = 'AI 搜尋優化知識庫'
CATS = ['入門', '實作', '選擇服務商', '產業應用', '成效與費用']


def parse(path):
    raw = path.read_text()
    m = re.match(r'\s*<!--(.*?)-->\s*', raw, re.S)
    meta = {}
    for line in m.group(1).strip().splitlines():
        k, _, v = line.partition(':')
        k, v = k.strip(), v.strip()
        if not k:
            continue
        meta[k] = json.loads(v) if k == 'ld' else v
    meta['body'] = raw[m.end():].strip()
    meta['draft'] = meta.get('draft', '').lower() == 'true'
    meta['order'] = float(meta.get('order', 99))
    return meta


def reading_minutes(html):
    text = re.sub(r'<[^>]+>', '', html)
    cjk = len(re.findall(r'[一-鿿]', text))
    words = len(re.findall(r'[A-Za-z]+', text))
    return max(3, round(cjk / 450 + words / 220))


# Articles about another service (front-matter `section:`): breadcrumb parent, Article "about", related links, end CTA.
_LINE_BTN = '<a class="pill" href="{demo}">{try_} <span class="arr" aria-hidden="true">→</span></a><a class="pill cta-ghost" href="https://line.me/R/ti/p/@680uqtou" target="_blank" rel="noopener">{line}</a>'
SECTIONS = {
    'line': {
        'zh': dict(parent=('LINE 官方帳號＋AI 客服', '/line-ai/'), about='/line-ai/#service',
                   related=[('/line-ai/', 'LINE 官方帳號＋AI 24 小時客服', '方案、價格、AI 會做與不會做的事，以及 LINE 內建 AI 和我們的比較。'),
                            ('/line-ai/demo/', '免費體驗 LINE AI 客服', '選您的行業，拿一組體驗碼，用 LINE 或網頁問 AI。不用留資料。'),
                            ('/ai-search/clinics/', '診所怎麼讓 AI 推薦？', '病患問 ChatGPT 找診所時，怎麼讓 AI 找到您。')],
                   cta=('想先看看 AI 怎麼回答 <span class="you-tag">您的客人</span>？', '用免費體驗輸入您的問答，拿體驗碼在 LINE 上直接問 AI；或加我們的 LINE 官方帳號 @680uqtou，問問看我們自己的 AI 客服。',
                        _LINE_BTN.format(demo='/line-ai/demo/', try_='免費體驗 LINE AI 客服', line='加 LINE @680uqtou'))),
        'en': dict(parent=('LINE AI customer service', '/en/line-ai/'), about='/line-ai/#service',
                   related=[('/en/line-ai/', 'LINE Official Account + 24/7 AI customer service', 'Plans, prices, what the AI does and doesn\'t do, and how it compares with LINE\'s built-in AI.'),
                            ('/en/line-ai/demo/', 'Try the LINE AI assistant free', 'Pick your industry, get a code, and ask the AI on LINE or on the page. No sign-up.'),
                            ('/en/ai-search/geo-for-small-business/', 'Get recommended by ChatGPT', 'How a small business gets named by AI assistants and Google AI Overviews.')],
                   cta=('See how the AI would answer <span class="you-tag">your customers</span>', 'Enter your own Q&amp;A in the free demo and ask the AI on LINE, or add our LINE Official Account @680uqtou and try our own assistant.',
                        _LINE_BTN.format(demo='/en/line-ai/demo/', try_='Try it free', line='Add us on LINE @680uqtou'))),
    },
}


def url_of(a, lang='zh'):
    return a.get('path') or (f'{HUB}{a["slug"]}/' if lang == 'zh' else f'/en/ai-search/{a["slug"]}/')


def row(a):
    return f'<li><a href="{url_of(a)}"><b>{a["h1"]}</b><span>{a.get("dek", "")}</span></a></li>'


def card(a):
    return (f'<a class="card acard" href="{url_of(a)}"><img class="card-art" src="{a["hero"]}" width="1200" height="630" alt="" loading="lazy">'
            f'<span class="acat">{a.get("category", "")}</span><h3>{a["h1"]}</h3><p>{a.get("dek", "")}</p></a>')


EN_RELATED = [  # en has no knowledge-base hub yet, so en articles point at the en service pages
    ('/en/seo-aeo-geo/', 'AI Search Optimization (AEO/GEO)', 'How we get businesses named and cited by ChatGPT, Gemini and Google AI Overviews.'),
    ('/en/ai-visibility-engine/', 'AI Visibility Engine', 'Our own system that checks AI answers every month, and Google search and site health every day.'),
    ('/en/about/', 'About Ship to Live', 'Who we are, where we work, and how we work with clients.'),
]


def run_en(b):
    """English articles: scripts/v2/bodies/en/articles/*.html -> /en/ai-search/<slug>/ (same front-matter as zh; hero optional)."""
    src = b.HERE / 'bodies' / 'en' / 'articles'
    if not src.exists():
        return
    arts = sorted((parse(f) for f in src.glob('*.html')), key=lambda a: (a['order'], a['slug']))
    for a in arts:
        url = url_of(a, 'en')
        sec = SECTIONS.get(a.get('section', ''), {}).get('en')
        mins = reading_minutes(a['body'])
        og = a.get('og') or (re.sub(r'\.svg$', '-og.png', a['hero']) if a.get('hero') else '/assets/img/og-en.png?v=1')
        article_ld = {
            "@type": "Article", "@id": b.BASE + url + "#article", "headline": a['h1'], "description": a['description'],
            "inLanguage": "en", "datePublished": a['date'], "dateModified": a.get('updated', a['date']),
            "image": b.BASE + og.split('?')[0], "mainEntityOfPage": b.BASE + url,
            "author": {"@id": b.BASE + "/#yufan"}, "publisher": {"@id": b.BASE + "/#org"},
            "about": [{"@id": b.BASE + (sec['about'] if sec else "/seo-aeo-geo/#service")}],
        }
        parent = sec['parent'] if sec else ('AI Search Optimization', '/en/seo-aeo-geo/')
        meta = {
            'title': a['title'], 'description': a['description'], 'path': url, 'en_only': True, 'draft': a['draft'],
            'og': og, 'og_type': 'article', 'pair': a.get('pair'),
            'crumbs': [('Home', '/en/'), parent, (a['h1'], url)],
            'ld': [article_ld] + a.get('ld', []),
        }
        body_html = a['body']
        toc_m = re.search(r'\s*<nav class="toc"[^>]*>.*?</nav>\s*', body_html, re.S)
        toc_items = ''
        if toc_m:
            body_html = body_html[:toc_m.start()] + '\n' + body_html[toc_m.end():]
            ol = re.search(r'<ol>.*?</ol>', toc_m.group(0), re.S)
            toc_items = ol.group(0) if ol else ''
        if a.get('hero'):
            hero_fig = f'<figure class="art-fig"><img src="{a["hero"]}" width="1200" height="630" alt="{a.get("hero_alt", "")}" loading="lazy"></figure>\n'
            h2s = [m.start() for m in re.finditer(r'\n<h2 ', body_html)]
            if len(h2s) >= 2:
                body_html = body_html[:h2s[1]] + '\n' + hero_fig + body_html[h2s[1]:]
        rail = (f'<aside class="post-rail" aria-label="On this page"><details class="rail-toc" id="rail-toc"><summary>On this page</summary>{toc_items}</details></aside>'
                if toc_items else '')
        d = a['date'] if not a.get('updated') else a['updated']
        import datetime
        dtxt = datetime.date.fromisoformat(d).strftime('%B %-d, %Y')
        # related: other published en articles in the same section (next in hub order, wrapping), then the service pages
        sib = [x for x in arts if x.get('section', '') == a.get('section', '') and not x['draft']]
        if a in sib:
            i = sib.index(a)
            sib = sib[i + 1:] + sib[:i]
        rel_rows = [(url_of(x, 'en'), x['h1'], re.split(r'(?<=[.?!])\s', x.get('dek', ''), maxsplit=1)[0]) for x in sib]
        rel_rows = (sec['related'][:2] + rel_rows[:2]) if sec else (rel_rows[:3] + EN_RELATED[:1])
        rel = ''.join(f'<li><a href="{u}"><b>{n}</b><span>{s}</span></a></li>' for u, n, s in rel_rows)
        cta_h, cta_p, cta_btns = sec['cta'] if sec else (
            'Does AI recommend <span class="you-tag">your business</span>?',
            "A free check: we ask ChatGPT, Gemini and other AI assistants your customers' questions and tell you whether they name you, which competitors they recommend, and what to fix first. Reply in 1–2 business days, or book a 20-minute call.",
            '<a class="pill" href="/en/ai-visibility-engine/#check">Request a free AI visibility check <span class="arr" aria-hidden="true">→</span></a><a class="pill cta-ghost" href="https://calendly.com/yufansapp/20min" target="_blank" rel="noopener">Book a free 20-minute call</a>')
        body = f'''<div class="readbar" aria-hidden="true"><i></i></div>
<script>(function(){{var b=document.querySelector('.readbar i'),a=document.querySelector('.post-body');if(!b||!a)return;var t=0;function u(){{t=0;var r=a.getBoundingClientRect(),h=r.height-innerHeight*.6,p=h>0?Math.min(1,Math.max(0,-r.top/h)):1;b.style.transform='scaleX('+p+')';}}addEventListener('scroll',function(){{if(!t)t=requestAnimationFrame(u);}},{{passive:true}});u();}})();</script>
<article class="post">
  <div class="wrap post-grid">
    <header class="post-head">
      <p class="crumbs"><a href="/en/">Home</a> / <a href="{parent[1]}">{parent[0]}</a> / {a.get('category', '')}</p>
      <h1 id="h1">{a['h1']}</h1>
      <p class="dek">{a.get('dek', '')}</p>
      <p class="post-meta"><time datetime="{d}">Updated {dtxt}</time> · {mins} min read</p>
    </header>
    {rail}
    <div class="post-body">
{body_html}
    </div>
    <footer class="post-end">
      <h2 class="h2" id="rel-h">Related</h2>
      <ul class="aindex">{rel}</ul>
      <div class="cta-box end-cta">
        <div><h3>{cta_h}</h3><p>{cta_p}</p></div>
        <div class="btns">{cta_btns}</div>
      </div>
    </footer>
  </div>
</article>
<script>(function(){{var d=document.getElementById('rail-toc');if(d){{var mq=matchMedia('(min-width: 1100px)');var s=function(){{d.open=mq.matches;}};s();mq.addEventListener&&mq.addEventListener('change',s);d.addEventListener('click',function(e){{if(e.target.tagName==='A'&&!mq.matches)d.open=false;}});}}
var f=document.querySelector('.post-body .faq'),pb=document.querySelector('.post-body'),t=0;function u(){{t=0;var m=document.querySelector('.mcta');if(!m||!pb)return;var r=pb.getBoundingClientRect(),h=r.height,p=h>0?(-r.top+innerHeight)/h:1,ok=p>=.6||(f&&f.getBoundingClientRect().top<innerHeight);m.classList.toggle('late-ok',!!ok);}}addEventListener('scroll',function(){{if(!t)t=requestAnimationFrame(u);}},{{passive:true}});addEventListener('load',u);}})();</script>'''
        html = b.head('en', 'articles', meta) + b.header('en', 'articles', a.get('pair')) + '\n<main id="main">\n' + body + '\n</main>\n' + b.footer('en', {'legal': a.get('section')}) + \
            f'\n<script src="/assets/v2/all.js?v={b.V}" defer></script>\n</body>\n</html>\n'
        out = b.ROOT / url.strip('/') / 'index.html'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html)
        print('wrote', out)
    run_en_hub(b, [a for a in arts if not a['draft']])


EN_HUB = '/en/ai-search/'


def run_en_hub(b, arts):
    """/en/ai-search/: plain list of the published English articles (2026-11-27), paired with the zh hub /ai-search/."""
    if not arts:
        return
    groups = ''
    for name, key in (('AI search for small businesses', ''), ('LINE AI customer service', 'line')):
        items = [a for a in arts if a.get('section', '') == key]
        if items:
            groups += (f'\n    <h2 class="h2 hub-cat">{name}</h2>\n    <ul class="aindex">' +
                       ''.join(f'<li><a href="{url_of(a, "en")}"><b>{a["h1"]}</b><span>{a.get("dek", "")}</span></a></li>' for a in items) + '</ul>')
    item_list = {"@type": "ItemList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "url": b.BASE + url_of(a, 'en'), "name": a['h1']} for i, a in enumerate(arts)]}
    name = 'AI search guides for small businesses'
    meta = {
        'title': 'AI Search Guides for Small Businesses: GEO and AEO | Ship to Live',
        'description': 'How to get ChatGPT, Gemini and Google AI Overviews to recommend your business: guides on GEO and AEO, checking where you stand, costs and choosing an agency.',
        'path': EN_HUB, 'en_only': True, 'pair': HUB, 'draft': False, 'crumbs': [('Home', '/en/'), (name, EN_HUB)], 'ld': [item_list],
        'og': '/assets/img/og-en.png?v=1',
    }
    body = f'''<section class="hero inner" aria-labelledby="h1">
  <div class="wrap">
    <p class="crumbs"><a href="/en/">Home</a> / {name}</p>
    <h1 id="h1">{name}</h1>
    <p class="sub2">Customers now ask AI which business to hire. These guides show how to make sure AI can find you and recommend you.</p>
    <p class="lede">From what GEO and AEO mean, to what to change on your website, how to check where you stand, and how to choose an agency. Each guide gives the answer first, then how to do it.</p>
    <div class="btns"><a class="pill orange" href="/en/ai-visibility-engine/#check">Free AI visibility check</a><a class="pill ghost" href="/en/seo-aeo-geo/">AI search optimization service</a></div>
  </div>
</section>
<section class="sec alt hub">
  <div class="wrap">{groups}
  </div>
</section>'''
    html = b.head('en', 'articles', meta) + b.header('en', 'articles', HUB) + '\n<main id="main">\n' + body + '\n</main>\n' + b.footer('en') + \
        f'\n<script src="/assets/v2/all.js?v={b.V}" defer></script>\n</body>\n</html>\n'
    out = b.ROOT / EN_HUB.strip('/') / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    print('wrote', out, f'({len(arts)} en articles)')


# Hub FAQ (2026-11-26): visible on /ai-search/ and the same text as its FAQPage JSON-LD. Each answer is
# the short version of that article; keep them in step when an article's answer changes.
HUB_FAQ = [
    ('what-is-geo', 'GEO（生成式引擎優化）是什麼？',
     'GEO 是讓 ChatGPT、Gemini、Claude 等 AI 在回答客戶問題時，提到並推薦您的公司。它和 SEO 相輔相成：SEO 讓您出現在搜尋結果，GEO 讓 AI 在回答裡直接說出您的名字。'),
    ('get-recommended-by-chatgpt', '怎麼讓 ChatGPT 推薦我的公司？',
     '先確認 ChatGPT 搜尋讀得到您的網站，再把服務、地區與價格寫清楚，並在 AI 常引用的外部網站（例如名錄與推薦文章）建立正確資料，最後定期檢測 AI 有沒有提到您。'),
    ('google-ai-overviews', '怎麼讓公司出現在 Google 的 AI 摘要裡？',
     '依 Google 的說明，AI 摘要沒有額外的特殊條件：網頁要能被 Google 索引、能出現在一般搜尋結果，內容清楚回答使用者的問題。重點是寫好直接回答問題的內容，並讓 Google 讀得到。'),
    ('check-ai-visibility', '怎麼檢查 ChatGPT、Gemini 有沒有提到我的公司？',
     '用沒有登入紀錄的新對話，問 5 個客戶真正會問的問題，記錄 AI 有沒有提到您、推薦了哪些同業。也可以申請夏裕科技的免費 AI 曝光檢測，一次問多個 AI 平台。'),
    ('geo-cost', 'AI 搜尋優化（GEO）費用怎麼算？',
     '主要看檢測的問題數、AI 平台數，以及是否由服務商動手改網站。夏裕科技公開月費：監測 NT$3,900、成長 NT$9,900、進階 NT$19,900（6 個月合約）。'),
]


def run(b):
    run_en(b)
    src = b.HERE / 'bodies' / 'zh' / 'articles'
    if not src.exists():
        return
    arts = sorted((parse(f) for f in src.glob('*.html')), key=lambda a: (a['order'], a['slug']))
    if not arts:
        return
    css_v = b.V
    for a in arts:
        url = url_of(a)
        sec = SECTIONS.get(a.get('section', ''), {}).get('zh')
        mins = reading_minutes(a['body'])
        og = a.get('og') or re.sub(r'\.svg$', '-og.png', a['hero'])  # og keeps the titled render; on-page SVG has no title text
        article_ld = {
            "@type": "Article", "@id": b.BASE + url + "#article", "headline": a['h1'], "description": a['description'],
            "inLanguage": "zh-Hant", "datePublished": a['date'], "dateModified": a.get('updated', a['date']),
            "image": b.BASE + og, "mainEntityOfPage": b.BASE + url,
            "author": {"@id": b.BASE + "/#yufan"}, "publisher": {"@id": b.BASE + "/#org"},
            "about": [{"@id": b.BASE + (sec['about'] if sec else "/seo-aeo-geo/#service")}],
        }
        parent = sec['parent'] if sec else (HUB_NAME, HUB)
        meta = {
            'title': a['title'], 'description': a['description'], 'path': url, 'zh_only': True, 'draft': a['draft'],
            'og': og, 'og_type': 'article', 'pair': a.get('pair'),
            'crumbs': [('首頁', '/'), parent, (a['h1'], url)],
            'ld': [article_ld] + a.get('ld', []),
        }
        geo = [x for x in arts if not x.get('section')]  # related links stay within the AI search guides
        related = [x for x in geo if x is not a and x.get('category') == a.get('category')][:3]
        if len(related) < 3:
            related += [x for x in geo if x is not a and x not in related][:3 - len(related)]
        rel_html = (''.join(f'<li><a href="{u}"><b>{n}</b><span>{s}</span></a></li>' for u, n, s in sec['related']) if sec
                    else ''.join(row(x) for x in related))
        cta_h, cta_p, cta_btns = sec['cta'] if sec else (
            'AI 會推薦 <span class="you-tag">您的公司</span> 嗎？',
            '免費檢測 ChatGPT、Gemini 等 AI 是否提到您、推薦了哪些同業，以及網站最該先改善的地方。1–2 個工作天內回覆；也可以直接預約 20 分鐘線上諮詢。',
            '<a class="pill" href="/ai-visibility-engine/#check">申請免費 AI 曝光檢測 <span class="arr" aria-hidden="true">→</span></a><a class="pill cta-ghost" href="https://calendly.com/yufansapp/20min" target="_blank" rel="noopener">預約 20 分鐘免費諮詢</a>')
        # TOC moves out of the body into a rail (sticky on desktop, collapsed on phones)
        body_html = a['body']
        toc_m = re.search(r'\s*<nav class="toc"[^>]*>.*?</nav>\s*', body_html, re.S)
        toc_items = ''
        if toc_m:
            body_html = body_html[:toc_m.start()] + '\n' + body_html[toc_m.end():]
            ol = re.search(r'<ol>.*?</ol>', toc_m.group(0), re.S)
            toc_items = ol.group(0) if ol else ''
        # hero art sits after the first section instead of above the first paragraph
        hero_fig = (f'<figure class="art-fig"><img src="{a["hero"]}" width="1200" height="630" alt="{a.get("hero_alt", "")}" loading="lazy"></figure>\n')
        h2s = [m.start() for m in re.finditer(r'\n<h2 ', body_html)]
        if len(h2s) >= 2:
            body_html = body_html[:h2s[1]] + '\n' + hero_fig + body_html[h2s[1]:]
        rail = (f'<aside class="post-rail" aria-label="本文目錄"><details class="rail-toc" id="rail-toc"><summary>本文目錄</summary>{toc_items}</details></aside>'
                if toc_items else '')
        body = f'''<div class="readbar" aria-hidden="true"><i></i></div>
<script>(function(){{var b=document.querySelector('.readbar i'),a=document.querySelector('.post-body');if(!b||!a)return;var t=0;function u(){{t=0;var r=a.getBoundingClientRect(),h=r.height-innerHeight*.6,p=h>0?Math.min(1,Math.max(0,-r.top/h)):1;b.style.transform='scaleX('+p+')';}}addEventListener('scroll',function(){{if(!t)t=requestAnimationFrame(u);}},{{passive:true}});u();}})();</script>
<article class="post">
  <div class="wrap post-grid">
    <header class="post-head">
      <p class="crumbs"><a href="/">首頁</a> / <a href="{parent[1]}">{parent[0]}</a> / {a.get('category', '')}</p>
      <h1 id="h1">{a['h1']}</h1>
      <p class="dek">{a.get('dek', '')}</p>
      <p class="post-meta"><time datetime="{a['date']}">{int(a['date'][:4])} 年 {int(a['date'][5:7])} 月 {int(a['date'][8:10])} 日更新</time>・約 {mins} 分鐘</p>
    </header>
    {rail}
    <div class="post-body">
{body_html}
    </div>
    <footer class="post-end">
      <h2 class="h2" id="rel-h">延伸閱讀</h2>
      <ul class="aindex">{rel_html}</ul>
      <div class="cta-box end-cta">
        <div><h3>{cta_h}</h3><p>{cta_p}</p></div>
        <div class="btns">{cta_btns}</div>
      </div>
    </footer>
  </div>
</article>
<script>(function(){{var d=document.getElementById('rail-toc');if(d){{var mq=matchMedia('(min-width: 1100px)');var s=function(){{d.open=mq.matches;}};s();mq.addEventListener&&mq.addEventListener('change',s);d.addEventListener('click',function(e){{if(e.target.tagName==='A'&&!mq.matches)d.open=false;}});}}
var f=document.querySelector('.post-body .faq'),pb=document.querySelector('.post-body'),t=0;function u(){{t=0;var m=document.querySelector('.mcta');if(!m||!pb)return;var r=pb.getBoundingClientRect(),h=r.height,p=h>0?(-r.top+innerHeight)/h:1,ok=p>=.6||(f&&f.getBoundingClientRect().top<innerHeight);m.classList.toggle('late-ok',!!ok);}}addEventListener('scroll',function(){{if(!t)t=requestAnimationFrame(u);}},{{passive:true}});addEventListener('load',u);}})();</script>'''
        html = b.head('zh', 'articles', meta) + b.header('zh', 'articles', a.get('pair')) + '\n<main id="main">\n' + body + '\n</main>\n' + b.footer('zh', {'legal': a.get('section')}) + \
            f'\n<script src="/assets/v2/all.js?v={css_v}" defer></script>\n</body>\n</html>\n'
        out = b.ROOT / url.strip('/') / 'index.html'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html)
        print('wrote', out)

    # hub
    all_draft = all(a['draft'] for a in arts)
    groups = ''
    for c in CATS + sorted({a.get('category', '') for a in arts} - set(CATS)):
        items = [a for a in arts if a.get('category', '') == c]
        if items:
            groups += f'\n    <h2 class="h2 hub-cat">{c}</h2>\n    <ul class="aindex">{"".join(row(a) for a in items)}</ul>'
    faq_items = [(s, q, a) for s, q, a in HUB_FAQ if any(x['slug'] == s for x in arts)]
    faq_ld = {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for _, q, a in faq_items]}
    faq_html = ''.join(
        f'<details{" open" if i == 0 else ""}><summary>{q}</summary><p>{a} <a class="tlink" href="{HUB}{s}/">閱讀全文</a></p></details>'
        for i, (s, q, a) in enumerate(faq_items))
    item_list = {"@type": "ItemList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "url": b.BASE + url_of(a), "name": a['h1']} for i, a in enumerate(arts)]}
    meta = {
        'title': 'AI 搜尋優化知識庫：GEO、AEO 教學與實作｜夏裕科技',
        'description': '什麼是 GEO、AEO？怎麼讓 ChatGPT、Gemini 和 Google AI 摘要推薦您的公司？夏裕科技整理給台灣企業的 AI 搜尋優化教學、實作步驟與產業做法。',
        'path': HUB, 'zh_only': True, 'pair': EN_HUB, 'draft': all_draft, 'crumbs': [('首頁', '/'), (HUB_NAME, HUB)], 'ld': [item_list, faq_ld],
        'og': '/assets/v2/img/ai-search/hub.png',
    }
    body = f'''<section class="hero inner hub-hero" aria-labelledby="h1">
  <div class="wrap g"><div>
    <p class="crumbs"><a href="/">首頁</a> / {HUB_NAME}</p>
    <h1 id="h1">{HUB_NAME}</h1>
    <p class="sub2">客戶開始問 AI 找廠商了。這裡整理讓 AI 找得到、也願意推薦您的方法。</p>
    <p class="lede">從 GEO、AEO 的基本觀念，到網站要改什麼、怎麼檢測、怎麼選服務商，以及不同產業的做法。每篇都先給答案，再說明怎麼做。</p>
    <div class="btns"><a class="pill orange" href="/ai-visibility-engine/#check">免費 AI 曝光檢測</a><a class="pill ghost" href="/seo-aeo-geo/">AI 搜尋優化服務</a></div>
  </div>
    <div class="hero-art hub-art" role="img" aria-label="插圖：知識庫的文章卡片，與 AI 回答引用這些文章">
      <svg viewBox="0 0 560 470" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs><filter id="hsh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#161513" flood-opacity=".16"/></filter></defs>
        <g class="fl fl1" filter="url(#hsh)">
          <rect x="24" y="30" width="300" height="250" rx="16" fill="#fff" stroke="#d9d3cb"/>
          <text x="48" y="68" font-size="13" font-weight="700" fill="#b44c1c" letter-spacing="2">AI 搜尋優化知識庫</text>
          <g font-size="15" fill="#161513">
            <rect x="44" y="86" width="260" height="50" rx="10" fill="#f7f5f2"/><rect x="56" y="98" width="26" height="26" rx="6" fill="#d7612a"/><text x="94" y="117" font-weight="700">GEO 是什麼？</text>
            <rect x="44" y="146" width="260" height="50" rx="10" fill="#f7f5f2"/><rect x="56" y="158" width="26" height="26" rx="6" fill="#161513"/><text x="94" y="177" font-weight="700">FAQ 怎麼寫？</text>
            <rect x="44" y="206" width="260" height="50" rx="10" fill="#f7f5f2"/><rect x="56" y="218" width="26" height="26" rx="6" fill="#161513"/><text x="94" y="237" font-weight="700">GEO 費用怎麼算？</text>
          </g>
        </g>
        <g class="fl fl2" filter="url(#hsh)">
          <rect x="286" y="104" width="250" height="226" rx="16" fill="#161513"/>
          <text x="310" y="138" font-size="13" font-weight="700" fill="#f08a55" letter-spacing="2">20 篇 · 5 個主題</text>
          <g font-size="14" fill="#efebe6">
            <text x="310" y="170">入門</text><rect x="410" y="160" width="100" height="10" rx="5" fill="#d7612a"/>
            <text x="310" y="200">實作</text><rect x="410" y="190" width="88" height="10" rx="5" fill="#d7612a"/>
            <text x="310" y="230">選擇服務商</text><rect x="410" y="220" width="52" height="10" rx="5" fill="#6d6862"/>
            <text x="310" y="260">產業應用</text><rect x="410" y="250" width="88" height="10" rx="5" fill="#6d6862"/>
            <text x="310" y="290">成效與費用</text><rect x="410" y="280" width="52" height="10" rx="5" fill="#6d6862"/>
          </g>
        </g>
        <g class="fl fl3" filter="url(#hsh)">
          <rect x="60" y="300" width="330" height="150" rx="16" fill="#fff" stroke="#e3ddd5"/>
          <path d="M86 318 l3.2 8.3 8.3 3.2 -8.3 3.2 -3.2 8.3 -3.2 -8.3 -8.3 -3.2 8.3 -3.2 z" fill="#d7612a"/>
          <text x="104" y="334" font-size="13" font-weight="700" fill="#161513">AI 助理</text>
          <rect x="150" y="348" width="222" height="32" rx="11" fill="#efebe6"/><text x="360" y="369" font-size="12.5" fill="#161513" text-anchor="end">怎麼讓 ChatGPT 推薦我的公司？</text>
          <rect x="76" y="390" width="262" height="44" rx="11" fill="#fbeee6"/><text x="90" y="417" font-size="13" fill="#161513">參考：<tspan font-weight="800" fill="#d7612a">夏裕科技 知識庫</tspan></text>
          <circle cx="360" cy="412" r="13" fill="#d7612a"/><path d="M354 412 l4 4 8 -9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>
    </div>
  </div>
</section>
<section class="sec hub-start" aria-labelledby="start-h">
  <div class="wrap">
    <div class="sec-head"><h2 class="h2" id="start-h">第一次接觸 AI 搜尋優化，該先讀哪 3 篇？</h2></div>
    <ol class="start-path">
      <li><a href="{HUB}what-is-geo/"><span class="n">1</span><b>先懂觀念</b><span>GEO 是什麼？讓 AI 推薦您的公司</span></a></li>
      <li><a href="{HUB}check-ai-visibility/"><span class="n">2</span><b>再看現況</b><span>怎麼檢查 ChatGPT、Gemini 有沒有提到您</span></a></li>
      <li><a href="{HUB}sme-30-day-plan/"><span class="n">3</span><b>開始動手</b><span>中小企業 AI 搜尋優化 30 天行動清單</span></a></li>
    </ol>
    <h2 class="h2" style="margin:56px 0 18px">依您的問題找文章</h2>
    <div class="qmap">
      <a href="{HUB}choose-geo-agency/"><span class="q">台北有哪些公司在做 AI 搜尋優化（GEO）？</span><span class="go">台北 GEO 公司怎麼選</span></a>
      <a href="{HUB}get-recommended-by-chatgpt/"><span class="q">想讓 ChatGPT 推薦我的公司，該怎麼做？</span><span class="go">怎麼讓 ChatGPT 推薦我的公司</span></a>
      <a href="{HUB}google-ai-overviews/"><span class="q">怎麼讓公司出現在 Google 的 AI 摘要裡？</span><span class="go">Google AI 摘要的做法</span></a>
      <a href="{HUB}seo-company-ai/"><span class="q">找台北 SEO 公司，要不要一起做 AEO、GEO？</span><span class="go">找 SEO 公司前先問這些</span></a>
      <a href="{HUB}sme-30-day-plan/"><span class="q">中小企業要怎麼提升在 AI 搜尋的曝光？</span><span class="go">30 天行動清單</span></a>
      <a href="{HUB}geo-cost/"><span class="q">AI 搜尋優化（GEO）費用大概怎麼算？</span><span class="go">影響報價的因素</span></a>
    </div>
  </div>
</section>
<section class="sec faq" id="faq" aria-labelledby="faq-h">
  <div class="wrap faqx">
    <div class="faq-l"><div class="sec-head"><h2 class="h2" id="faq-h">常見問題</h2></div><p class="faq-lead">最常被問到的 5 個問題，先看簡短答案，想了解再點進全文。</p></div>
    <div class="faq-r">{faq_html}</div>
  </div>
</section>
<section class="sec alt hub">
  <div class="wrap">{groups}
  </div>
</section>'''
    html = b.head('zh', 'articles', meta) + b.header('zh', 'articles', EN_HUB) + '\n<main id="main">\n' + body + '\n</main>\n' + b.footer('zh') + \
        f'\n<script src="/assets/v2/all.js?v={css_v}" defer></script>\n</body>\n</html>\n'
    out = b.ROOT / HUB.strip('/') / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    print('wrote', out, f'({len(arts)} articles, draft={all_draft})')


def publish_entries(b=None, base='https://www.shiptolive.com'):
    """Sitemap <url> blocks for the hub and every non-draft article (zh only, hreflang zh-Hant + x-default).
    Usage at publish time, from the repo root:
        python3 -c "import sys; sys.path.insert(0,'scripts/v2'); import articles; print(articles.publish_entries())"
    then paste the output before </urlset> in sitemap.xml (skip any URL already there)."""
    import pathlib
    src = pathlib.Path(__file__).parent / 'bodies' / 'zh' / 'articles'
    arts = sorted((parse(f) for f in src.glob('*.html')), key=lambda a: (a['order'], a['slug']))
    live = [a for a in arts if not a['draft']]
    if not live:
        return ''
    newest = max(a.get('updated', a['date']) for a in live)
    rows = [(HUB, newest, '0.8')] + [(url_of(a), a.get('updated', a['date']), '0.7') for a in live]
    out = []
    for path, mod, pri in rows:
        u = base + path
        out.append(f"""  <url>
    <loc>{u}</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="{u}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="{u}" />
    <lastmod>{mod}</lastmod>
    <priority>{pri}</priority>
  </url>""")
    return '\n'.join(out)
