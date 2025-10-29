# GitHub Pages Deployment (Next.js static export)

This project is configured to deploy a static export of the Next.js app to GitHub Pages on every push to `main`.

## What’s included
- Conditional `basePath`/`assetPrefix` in `next.config.js` when building for GitHub Pages
- GitHub Actions workflow that builds to `out/` and publishes to `gh-pages` branch
- SPA-friendly export with `404.html` already handled by Next.js export

## One-time setup
1. Create a GitHub repository (if not already):
   - Repo name: `aws-rmm-frontend-demo` (matches GH Pages path)

2. Push code to GitHub:
   ```bash
   git remote add origin git@github.com:<YOUR_USERNAME>/aws-rmm-frontend-demo.git
   git push -u origin main
   ```

3. Enable GitHub Pages in repo settings:
   - Settings → Pages → Build and deployment → Deploy from: `GitHub Actions`

No extra secrets are required; the workflow uses the default `GITHUB_TOKEN`.

## How it works
- On push to `main`, the workflow runs:
  - `npm ci`
  - `npm run build` with `GITHUB_PAGES=true` and `REPO_NAME=aws-rmm-frontend-demo`
  - Publishes `./out` to the `gh-pages` branch

## Local build for verification (optional)
You can simulate a GitHub Pages build locally:
```bash
GITHUB_PAGES=true REPO_NAME=aws-rmm-frontend-demo npm run build
npx serve out
```
Then open `http://localhost:3000/aws-rmm-frontend-demo/` if your server base path isn’t auto-handled.

## Visit your site
After the workflow completes, your site will be available at:
- `https://<YOUR_USERNAME>.github.io/aws-rmm-frontend-demo/`

## Notes
- The app is configured with `output: 'export'`, `trailingSlash: true`, and `images.unoptimized: true` for static exports.
- Netlify/Surge deployments continue to work; the GH Pages base path only applies when `GITHUB_PAGES=true`.
