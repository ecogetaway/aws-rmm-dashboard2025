# Surge.sh Backup Deployment

Fast fallback deployment for the static Next.js export in `out/`.

## Prerequisites
- Node.js 18+
- A Surge account (created on first deploy via CLI)

## One-command deploy (random subdomain)

```bash
npm run deploy:surge
```

This will:
- Build the static site to `out/` (uses `next.config.js` with `output: 'export'`)
- Deploy `out/` to Surge
- Print the deployed URL

## Deploy to a custom domain or fixed subdomain

```bash
export SURGE_DOMAIN=my-aws-rmm.surge.sh
npm run deploy:surge:domain
```

Notes:
- First run will prompt for email verification in your terminal.
- To map a custom domain (e.g., `rmm.example.com`), point DNS to Surge per their docs and use the same `SURGE_DOMAIN`.

## Local preview of the static build

```bash
npm run build:static
npx --yes serve ./out -p 4173
```

## Troubleshooting
- If images don’t load: `images.unoptimized: true` is set for static export.
- If routes 404: `trailingSlash: true` is enabled; ensure links include trailing slashes or update as needed.
- Clear old deploys: `npx --yes surge teardown <domain>`

## CI hint
```bash
npm ci
npm run deploy:surge:domain
```
