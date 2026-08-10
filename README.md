# Kids Adventures

A bilingual (Dutch/English) website of short, choose-your-own-path mini-adventures
for kids aged 4-8, played out with their own toys. Adventures are grouped into
**campaigns** within a shared **world** (e.g. "Playmobil FunPark").

Built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Adding adventures

See [CONTRIBUTING.md](./CONTRIBUTING.md) — content is plain Markdown/YAML under
`content/worlds/`, editable directly on GitHub.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321/kids-adventures/
npm run build    # type-checks content + builds to dist/
npm run preview  # preview the production build
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages. Enable Pages in the repo settings with
**Source: GitHub Actions** the first time.
