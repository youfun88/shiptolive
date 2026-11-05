#!/usr/bin/env python3
"""Tell Bing (and Copilot, Yahoo Taiwan) and other IndexNow engines which pages changed.

The key is public by design: Bing checks it against the <key>.txt file at the site root.
Only URLs listed in sitemap.xml are sent, so /pending and other unlisted pages stay out.

Usage:  python3 scripts/indexnow.py --changed [BASE]   pages changed since commit BASE (the deploy workflow passes
                                                       the commit before the push; default: the previous commit),
                                                       or whose sitemap lastmod changed
        python3 scripts/indexnow.py --since 2026-11-02 pages with that sitemap lastmod or newer
"""
import glob
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

HOST = "www.shiptolive.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def key():
    for path in glob.glob(os.path.join(ROOT, "*.txt")):
        name = os.path.basename(path)[:-4]
        if re.fullmatch(r"[0-9a-f]{32}", name):
            return name
    sys.exit("No IndexNow key file at the site root")


def parse_sitemap(text):
    """(loc, lastmod) for every <url> block; lastmod may sit after xhtml:link lines."""
    out = []
    for block in re.findall(r"<url>(.*?)</url>", text, re.S):
        loc = re.search(r"<loc>\s*([^<\s]+)\s*</loc>", block)
        mod = re.search(r"<lastmod>\s*([^<\s]+)\s*</lastmod>", block)
        if loc:
            out.append((loc.group(1), mod.group(1) if mod else None))
    return out


def sitemap():
    with open(os.path.join(ROOT, "sitemap.xml"), encoding="utf8") as f:
        return parse_sitemap(f.read())


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)


def norm(path):
    """/courses/esg-intro.html, /courses/esg-intro and /courses/esg-intro/ are the same page."""
    path = re.sub(r"^https?://[^/]+", "", path)
    path = re.sub(r"index\.html$", "", path)
    path = re.sub(r"\.html$", "", path)
    return "/" + path.strip("/")


def changed_urls(base=None):
    """Sitemap URLs whose page or lastmod changed between base and HEAD.

    A push can hold several commits, so comparing only the last one misses pages.
    If base is missing or unknown (first push, force-push), use the previous commit.
    """
    if not base or git("cat-file", "-e", f"{base}^{{commit}}").returncode != 0:
        base = "HEAD~1"
    out = git("diff", "--name-only", base, "HEAD")
    if out.returncode != 0:
        sys.exit(f"git diff failed: {out.stderr[:200]}")
    changed = {norm(p) for p in out.stdout.split() if p.endswith(".html")}
    old = dict(parse_sitemap(git("show", f"{base}:sitemap.xml").stdout))
    return [u for u, d in sitemap() if norm(u) in changed or old.get(u) != d]


def main():
    pages = sitemap()
    if sys.argv[1:2] == ["--changed"] and len(sys.argv) <= 3:
        urls = changed_urls(sys.argv[2] if len(sys.argv) == 3 else None)
    elif len(sys.argv) == 3 and sys.argv[1] == "--since":
        urls = [u for u, d in pages if d and d >= sys.argv[2]]
    else:
        sys.exit(__doc__)
    if not urls:
        print("No sitemap pages to send")
        return
    k = key()
    body = json.dumps({"host": HOST, "key": k, "keyLocation": f"https://{HOST}/{k}.txt", "urlList": urls}).encode()
    req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body, headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            print(f"IndexNow {res.status}: sent {len(urls)} URLs")
    except urllib.error.HTTPError as e:
        sys.exit(f"IndexNow {e.code}: {e.read()[:200]!r}")


if __name__ == "__main__":
    main()
