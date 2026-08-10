// @ts-check
import { defineConfig } from 'astro/config';

// Update `site` to your GitHub Pages URL once the repo is published, e.g.
// https://<your-github-username>.github.io/kids-adventures
// `base` matches the repo name so links work under the GitHub Pages project path.
// If you switch to a custom domain, set base back to '/' and update `site`.
export default defineConfig({
  site: 'https://nikivanstein.github.io/kids-adventures',
  base: '/kids-adventures',
  trailingSlash: 'always',
});
