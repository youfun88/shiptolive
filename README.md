# Ship to Live — shiptolive.com

Portfolio & business site for **Ship to Live** (by Yufan Chen) — an independent
app, website, and AI developer in San Diego. Static HTML/CSS/JS, no build step.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy (CI/CD)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the
site to **GitHub Pages** on the custom domain in [`CNAME`](./CNAME)
(`shiptolive.com`). No build step — the repo root is served as-is.

## Structure

```
index.html      single-page site
styles.css      theme + layout
script.js       scroll reveals + contact form (FormSubmit, no backend)
llms.txt        GEO content layer for AI engines
robots.txt      crawl rules (welcomes AI crawlers) + sitemap link
sitemap.xml     sitemap
assets/         favicon + images
```

## Contact form

Uses [FormSubmit](https://formsubmit.co) (no backend). The first submission from
the live domain triggers a one-time activation email to the inbox — confirm it
once and submissions flow through after that.
