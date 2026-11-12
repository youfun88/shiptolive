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


def card(a):
    return (f'<a class="card acard" href="{HUB}{a["slug"]}/"><img class="card-art" src="{a["hero"]}" width="1200" height="630" alt="" loading="lazy">'
            f'<span class="acat">{a.get("category", "")}</span><h3>{a["h1"]}</h3><p>{a.get("dek", "")}</p></a>')


def run(b):
    src = b.HERE / 'bodies' / 'zh' / 'articles'
    if not src.exists():
        return
    arts = sorted((parse(f) for f in src.glob('*.html')), key=lambda a: (a['order'], a['slug']))
    if not arts:
        return
    css_v = b.V
    for a in arts:
        url = f'{HUB}{a["slug"]}/'
        mins = reading_minutes(a['body'])
        og = a.get('og') or re.sub(r'\.svg$', '.png', a['hero'])
        article_ld = {
            "@type": "Article", "@id": b.BASE + url + "#article", "headline": a['h1'], "description": a['description'],
            "inLanguage": "zh-Hant", "datePublished": a['date'], "dateModified": a.get('updated', a['date']),
            "image": b.BASE + og, "mainEntityOfPage": b.BASE + url,
            "author": {"@id": b.BASE + "/#yufan"}, "publisher": {"@id": b.BASE + "/#org"},
            "about": [{"@id": b.BASE + "/seo-aeo-geo/#service"}],
        }
        meta = {
            'title': a['title'], 'description': a['description'], 'path': url, 'zh_only': True, 'draft': a['draft'],
            'og': og, 'og_type': 'article',
            'crumbs': [('首頁', '/'), (HUB_NAME, HUB), (a['h1'], url)],
            'ld': [article_ld] + a.get('ld', []),
        }
        related = [x for x in arts if x is not a and x.get('category') == a.get('category')][:3]
        if len(related) < 3:
            related += [x for x in arts if x is not a and x not in related][:3 - len(related)]
        body = f'''<article class="post">
  <header class="post-head">
    <div class="wrap">
      <p class="crumbs"><a href="/">首頁</a> / <a href="{HUB}">{HUB_NAME}</a> / {a.get('category', '')}</p>
      <p class="eyebrow">{HUB_NAME} · {a.get('category', '')}</p>
      <h1 id="h1">{a['h1']}</h1>
      <p class="dek">{a.get('dek', '')}</p>
      <p class="post-meta">夏裕科技 · <time datetime="{a['date']}">{a['date']}</time> · 約 {mins} 分鐘閱讀</p>
    </div>
  </header>
  <figure class="post-hero"><div class="wrap"><img src="{a['hero']}" width="1200" height="630" alt="{a.get('hero_alt', '')}" fetchpriority="high"></div></figure>
  <div class="wrap post-wrap">
    <div class="post-body">
{a['body']}
      <aside class="book" aria-label="預約諮詢">
        <div><b>想直接聊聊您的情況？</b><p>預約 20 分鐘免費線上諮詢，和夏裕科技聊聊您的產業、客戶會問 AI 的問題，以及可以從哪裡開始。不推銷，先聽您的需求。</p></div>
        <a class="pill orange" href="https://calendly.com/yufansapp/20min" target="_blank" rel="noopener">預約免費諮詢 <span class="arr" aria-hidden="true">→</span></a>
      </aside>
    </div>
  </div>
</article>
<section class="sec alt post-next" aria-labelledby="rel-h">
  <div class="wrap">
    <div class="cta-box">
      <div><h3>想知道 AI 會不會推薦您的公司？</h3><p>免費檢測 ChatGPT、Gemini 等 AI 是否提到您、推薦了哪些同業，以及網站最該先改善的地方。1–2 個工作天內回覆。</p></div>
      <div class="btns"><a class="pill" href="/ai-visibility-engine/#check">立即申請免費 AI 曝光檢測 <span class="arr" aria-hidden="true">→</span></a><a class="pill ghost cta-ghost" href="https://calendly.com/yufansapp/20min" target="_blank" rel="noopener">預約 20 分鐘免費諮詢</a></div>
    </div>
    <h2 class="h2" id="rel-h" style="margin:56px 0 24px">延伸閱讀</h2>
    <div class="grid3">{''.join(card(x) for x in related)}</div>
  </div>
</section>'''
        html = b.head('zh', 'articles', meta) + b.header('zh', 'articles') + '\n<main id="main">\n' + body + '\n</main>\n' + b.footer('zh') + \
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
            groups += f'\n    <h2 class="h2 hub-cat">{c}</h2>\n    <div class="grid3">{"".join(card(a) for a in items)}</div>'
    item_list = {"@type": "ItemList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "url": f'{b.BASE}{HUB}{a["slug"]}/', "name": a['h1']} for i, a in enumerate(arts)]}
    meta = {
        'title': 'AI 搜尋優化知識庫：GEO、AEO 教學與實作｜夏裕科技',
        'description': '什麼是 GEO、AEO？怎麼讓 ChatGPT、Gemini 和 Google AI 摘要推薦您的公司？夏裕科技整理給台灣企業的 AI 搜尋優化教學、實作步驟與產業做法。',
        'path': HUB, 'zh_only': True, 'draft': all_draft, 'crumbs': [('首頁', '/'), (HUB_NAME, HUB)], 'ld': [item_list],
        'og': '/assets/v2/img/ai-search/hub.png',
    }
    body = f'''<section class="hero inner hub-hero" aria-labelledby="h1">
  <div class="wrap g"><div>
    <p class="crumbs"><a href="/">首頁</a> / {HUB_NAME}</p>
    <p class="eyebrow">AI SEARCH OPTIMIZATION · GEO · AEO</p>
    <h1 id="h1">{HUB_NAME}</h1>
    <p class="sub2">客戶開始問 AI 找廠商了。這裡整理讓 AI 找得到、也願意推薦您的方法。</p>
    <p class="lede">從 GEO、AEO 的基本觀念，到網站要改什麼、怎麼檢測、怎麼選服務商，以及不同產業的做法。每篇都先給答案，再說明怎麼做。</p>
    <div class="btns"><a class="pill orange" href="/ai-visibility-engine/#check">免費 AI 曝光檢測 <span class="arr" aria-hidden="true">→</span></a><a class="pill ghost" href="/seo-aeo-geo/">AI 搜尋優化服務</a></div>
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
<section class="sec alt hub">
  <div class="wrap">{groups}
  </div>
</section>'''
    html = b.head('zh', 'articles', meta) + b.header('zh', 'articles') + '\n<main id="main">\n' + body + '\n</main>\n' + b.footer('zh') + \
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
    rows = [(HUB, newest, '0.8')] + [(f'{HUB}{a["slug"]}/', a.get('updated', a['date']), '0.7') for a in live]
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
