# DeepPersonality.app - Scraped Website Archive

This repository contains a complete scrape of [deeppersonality.app](https://deeppersonality.app/) for future site recreation.

## 📅 Scrape Details

- **Date Scraped**: February 5, 2026
- **Original URL**: https://deeppersonality.app/
- **Technology Stack**: Next.js, Tailwind CSS, Vercel

## 📁 Directory Structure

```
deeppersonality-scrape/
├── scraped-content/
│   ├── pages/              # HTML pages
│   │   ├── index.html      # Homepage
│   │   ├── privacy.html    # Privacy Policy
│   │   └── terms.html      # Terms of Service
│   ├── assets/             # Static assets
│   │   ├── css/            # Stylesheets
│   │   ├── js/             # JavaScript bundles
│   │   ├── images/         # Images and icons
│   │   └── fonts/          # Web fonts
│   └── metadata/           # Scraping metadata
│       ├── assets.json     # Asset manifest
│       ├── urls.json       # Scraped URLs
│       └── download-log.json
├── scripts/                # Scraping scripts
│   ├── scrape.js           # Main scraper
│   ├── download-assets.js  # Asset downloader
│   └── package.json
└── recreation-guide/
    └── REBUILD.md          # Reconstruction guide
```

## 🚀 Viewing Locally

1. Navigate to the `scraped-content/pages/` directory
2. Open `index.html` in your browser
3. Note: Some assets may not load correctly if they reference CDN URLs

## 🔄 Re-running the Scrape

If you need to re-scrape the website:

```bash
cd scripts
npm install
npm run scrape        # Scrape pages
npm run download-assets  # Download all assets
```

## ⚠️ Important Notes

- This scrape only includes **public pages** (not authenticated content)
- The assessment and profile features require user authentication
- Some dynamic content may not be captured in the static HTML
- Review the Terms of Service before any commercial use

## 🛠️ Rebuilding the Site

See [recreation-guide/REBUILD.md](./recreation-guide/REBUILD.md) for detailed instructions on recreating this site.
