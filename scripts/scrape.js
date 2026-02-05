const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const BASE_URL = 'https://deeppersonality.app';
const OUTPUT_DIR = path.join(__dirname, '..', 'scraped-content');

// Pages to scrape - includes authenticated pages (Option B)
const PAGES = [
  // Public pages
  { url: '/', filename: 'index.html', requiresAuth: false },
  { url: '/privacy', filename: 'privacy.html', requiresAuth: false },
  { url: '/terms', filename: 'terms.html', requiresAuth: false },
  // Authenticated pages
  { url: '/assessment', filename: 'assessment.html', requiresAuth: true },
  { url: '/results', filename: 'results.html', requiresAuth: true },
  { url: '/profile', filename: 'profile.html', requiresAuth: true }
];

// Store all discovered assets
const assets = {
  css: new Set(),
  js: new Set(),
  images: new Set(),
  fonts: new Set(),
  other: new Set()
};

function categorizeAsset(url) {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.match(/\.css(\?|$)/)) return 'css';
  if (lowerUrl.match(/\.js(\?|$)/)) return 'js';
  if (lowerUrl.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)(\?|$)/)) return 'images';
  if (lowerUrl.match(/\.(woff|woff2|ttf|eot|otf)(\?|$)/)) return 'fonts';
  return 'other';
}

function extractAssets($, pageUrl) {
  // CSS files
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) assets.css.add(new URL(href, pageUrl).href);
  });

  // JavaScript files
  $('script[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src) assets.js.add(new URL(src, pageUrl).href);
  });

  // Images
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src) assets.images.add(new URL(src, pageUrl).href);
  });

  // Background images in style attributes
  $('[style*="url("]').each((_, el) => {
    const style = $(el).attr('style');
    const matches = style.match(/url\(['"]?([^'")]+)['"]?\)/g);
    if (matches) {
      matches.forEach(match => {
        const url = match.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');
        if (url && !url.startsWith('data:')) {
          assets.images.add(new URL(url, pageUrl).href);
        }
      });
    }
  });

  // Favicon and other link resources
  $('link[href]').each((_, el) => {
    const href = $(el).attr('href');
    const rel = $(el).attr('rel') || '';
    if (href && (rel.includes('icon') || rel.includes('apple-touch'))) {
      assets.images.add(new URL(href, pageUrl).href);
    }
  });
}

async function scrapePage(browser, pageInfo) {
  console.log(`\nScraping: ${BASE_URL}${pageInfo.url}`);
  
  const page = await browser.newPage();
  
  // Set a reasonable viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Set user agent to avoid bot detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    // Navigate to the page
    await page.goto(`${BASE_URL}${pageInfo.url}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait a bit for any lazy-loaded content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Scroll down to trigger any lazy loading
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });
    
    // Wait for any final content to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get the full rendered HTML
    const html = await page.content();
    
    // Parse with cheerio to extract assets
    const $ = cheerio.load(html);
    extractAssets($, `${BASE_URL}${pageInfo.url}`);
    
    // Save the HTML
    const outputPath = path.join(OUTPUT_DIR, 'pages', pageInfo.filename);
    await fs.outputFile(outputPath, html);
    console.log(`  Saved: ${outputPath}`);
    
    // Take a screenshot for reference
    const screenshotPath = path.join(OUTPUT_DIR, 'pages', pageInfo.filename.replace('.html', '.png'));
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`  Screenshot: ${screenshotPath}`);
    
  } catch (error) {
    console.error(`  Error scraping ${pageInfo.url}:`, error.message);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('===========================================');
  console.log('DeepPersonality.app Web Scraper');
  console.log('===========================================');
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  
  // Ensure output directories exist
  await fs.ensureDir(path.join(OUTPUT_DIR, 'pages'));
  await fs.ensureDir(path.join(OUTPUT_DIR, 'metadata'));
  
  // Launch browser
  console.log('\nLaunching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Scrape each page
    for (const pageInfo of PAGES) {
      await scrapePage(browser, pageInfo);
    }
    
    // Save assets manifest
    const assetsManifest = {
      scrapedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      css: Array.from(assets.css),
      js: Array.from(assets.js),
      images: Array.from(assets.images),
      fonts: Array.from(assets.fonts),
      other: Array.from(assets.other)
    };
    
    const manifestPath = path.join(OUTPUT_DIR, 'metadata', 'assets.json');
    await fs.outputJson(manifestPath, assetsManifest, { spaces: 2 });
    console.log(`\nAssets manifest saved: ${manifestPath}`);
    
    // Save URL list
    const urlsPath = path.join(OUTPUT_DIR, 'metadata', 'urls.json');
    await fs.outputJson(urlsPath, {
      scrapedAt: new Date().toISOString(),
      pages: PAGES.map(p => ({ ...p, fullUrl: `${BASE_URL}${p.url}` }))
    }, { spaces: 2 });
    console.log(`URLs saved: ${urlsPath}`);
    
    // Summary
    console.log('\n===========================================');
    console.log('Scraping Complete!');
    console.log('===========================================');
    console.log(`Pages scraped: ${PAGES.length}`);
    console.log(`CSS files found: ${assets.css.size}`);
    console.log(`JS files found: ${assets.js.size}`);
    console.log(`Images found: ${assets.images.size}`);
    console.log(`Fonts found: ${assets.fonts.size}`);
    console.log('\nRun "node download-assets.js" to download all assets.');
    
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
