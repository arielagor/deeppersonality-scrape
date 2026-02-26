# DeepPersonality Scrape — Foundational Architecture Decisions

**Date**: 2026-02-05
**Session type**: Retroactive documentation
**Scope**: Initial project setup and architecture

---

## Context

This entry was created retroactively to document the foundational decisions
made when this project was first built. Reconstructed from codebase analysis
and git history. This project archives the deeppersonality.app website and
provides a methodology for rebuilding it.

## Decisions Made

### 1. Puppeteer for Browser-Based Scraping

- **Choice**: Puppeteer (headless Chrome) for page scraping
- **Over**: HTTP-only scraping (axios/fetch), wget, HTTrack
- **Because**: The target site is a Next.js SPA with client-side rendering. HTTP-only tools would miss JavaScript-rendered content. Puppeteer executes JavaScript and captures the fully rendered DOM.
- **Consequence**: Heavier dependency (downloads Chromium), slower scraping, but captures dynamic content accurately.

### 2. Cheerio for HTML Parsing

- **Choice**: Cheerio for post-scrape DOM manipulation and data extraction
- **Over**: Regex parsing, jsdom, raw string manipulation
- **Because**: jQuery-like API makes HTML traversal intuitive. Lightweight compared to jsdom. Pairs well with Puppeteer output.
- **Consequence**: Fast parsing but no JavaScript execution (handled by Puppeteer).

### 3. Full Asset Download (Images, CSS, JS, Fonts)

- **Choice**: Download all 300+ assets including images, stylesheets, scripts, and fonts
- **Over**: HTML-only archive, screenshot-based archive
- **Because**: A complete archive preserves the ability to reconstruct the site locally. Screenshots capture appearance but not functionality. Full assets enable a rebuild.
- **Consequence**: Large repo size due to binary assets. Metadata tracking (assets.json, urls.json, download-log.json) required.

### 4. Rebuild Guide with Andrew Wilkinson's Methodology

- **Choice**: Comprehensive REBUILD.md with "vibe coding" methodology
- **Over**: No rebuild guide, generic documentation
- **Because**: The archive isn't just for preservation — it's a blueprint for rebuilding. Andrew Wilkinson's methodology provides a structured approach to AI-assisted reconstruction.
- **Consequence**: The rebuild guide becomes the primary value artifact beyond the raw archive.

### 5. Separate Scripts from Scraped Content

- **Choice**: scripts/ directory separate from scraped-content/
- **Over**: Single flat directory, monolithic script
- **Because**: Clean separation between tooling (scraper scripts) and output (downloaded site). Makes it clear what's generated vs. authored.
- **Consequence**: Clear project structure. Scripts are reusable for other sites.

## What Was Built

- Puppeteer-based web scraper (scrape.js)
- Asset downloader (download-assets.js)
- Complete website archive: pages, CSS, JS, images, fonts
- Metadata tracking: assets.json, urls.json, download-log.json
- Comprehensive rebuild guide with implementation roadmap

## Open Questions

- No rebuild has been attempted yet — the guide is documentation only
- Scraped content represents a point-in-time snapshot (Feb 5, 2026)

## Next Session Context

> This repo now has decision documentation. Future sessions should create
> a new entry in docs/decisions/ for every session that involves substantive
> code changes. Log decisions AS they happen, not at session end.
