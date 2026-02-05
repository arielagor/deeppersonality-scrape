const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const OUTPUT_DIR = path.join(__dirname, '..', 'scraped-content');
const ASSETS_DIR = path.join(OUTPUT_DIR, 'assets');

// Rate limiting
const DELAY_MS = 100;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Create a hash of URL for unique filenames when needed
function hashUrl(url) {
  return crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
}

// Get clean filename from URL
function getFilenameFromUrl(url) {
  try {
    const parsed = new URL(url);
    let pathname = parsed.pathname;
    
    // Handle Next.js _next paths
    if (pathname.includes('/_next/')) {
      // Keep the structure but simplify
      const parts = pathname.split('/').filter(p => p);
      const filename = parts[parts.length - 1];
      return filename.split('?')[0];
    }
    
    // Get the last part of the path
    let filename = pathname.split('/').pop() || 'index';
    filename = filename.split('?')[0]; // Remove query string
    
    // If no extension, try to determine from content type later
    if (!filename.includes('.')) {
      filename = `${filename}_${hashUrl(url)}`;
    }
    
    return filename;
  } catch {
    return `asset_${hashUrl(url)}`;
  }
}

// Download a single asset
async function downloadAsset(url, category) {
  const filename = getFilenameFromUrl(url);
  const outputPath = path.join(ASSETS_DIR, category, filename);
  
  // Skip if already downloaded
  if (await fs.pathExists(outputPath)) {
    console.log(`  [SKIP] ${filename} (already exists)`);
    return { url, path: outputPath, status: 'skipped' };
  }
  
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    await fs.outputFile(outputPath, response.data);
    console.log(`  [OK] ${filename} (${(response.data.length / 1024).toFixed(1)} KB)`);
    
    return { url, path: outputPath, status: 'downloaded', size: response.data.length };
  } catch (error) {
    console.log(`  [FAIL] ${filename}: ${error.message}`);
    return { url, path: null, status: 'failed', error: error.message };
  }
}

async function main() {
  console.log('===========================================');
  console.log('DeepPersonality.app Asset Downloader');
  console.log('===========================================');
  console.log(`Started at: ${new Date().toISOString()}`);
  
  // Read assets manifest
  const manifestPath = path.join(OUTPUT_DIR, 'metadata', 'assets.json');
  
  if (!await fs.pathExists(manifestPath)) {
    console.error('\nError: assets.json not found!');
    console.error('Please run "node scrape.js" first to generate the asset manifest.');
    process.exit(1);
  }
  
  const manifest = await fs.readJson(manifestPath);
  console.log(`\nManifest loaded from: ${manifestPath}`);
  console.log(`Scraped at: ${manifest.scrapedAt}`);
  
  // Ensure asset directories exist
  await fs.ensureDir(path.join(ASSETS_DIR, 'css'));
  await fs.ensureDir(path.join(ASSETS_DIR, 'js'));
  await fs.ensureDir(path.join(ASSETS_DIR, 'images'));
  await fs.ensureDir(path.join(ASSETS_DIR, 'fonts'));
  
  const results = {
    downloaded: 0,
    skipped: 0,
    failed: 0,
    totalSize: 0
  };
  
  const downloadLog = [];
  
  // Download CSS
  if (manifest.css?.length > 0) {
    console.log(`\n--- Downloading CSS (${manifest.css.length} files) ---`);
    for (const url of manifest.css) {
      const result = await downloadAsset(url, 'css');
      downloadLog.push(result);
      results[result.status === 'downloaded' ? 'downloaded' : result.status === 'skipped' ? 'skipped' : 'failed']++;
      if (result.size) results.totalSize += result.size;
      await sleep(DELAY_MS);
    }
  }
  
  // Download JS
  if (manifest.js?.length > 0) {
    console.log(`\n--- Downloading JavaScript (${manifest.js.length} files) ---`);
    for (const url of manifest.js) {
      const result = await downloadAsset(url, 'js');
      downloadLog.push(result);
      results[result.status === 'downloaded' ? 'downloaded' : result.status === 'skipped' ? 'skipped' : 'failed']++;
      if (result.size) results.totalSize += result.size;
      await sleep(DELAY_MS);
    }
  }
  
  // Download Images
  if (manifest.images?.length > 0) {
    console.log(`\n--- Downloading Images (${manifest.images.length} files) ---`);
    for (const url of manifest.images) {
      const result = await downloadAsset(url, 'images');
      downloadLog.push(result);
      results[result.status === 'downloaded' ? 'downloaded' : result.status === 'skipped' ? 'skipped' : 'failed']++;
      if (result.size) results.totalSize += result.size;
      await sleep(DELAY_MS);
    }
  }
  
  // Download Fonts
  if (manifest.fonts?.length > 0) {
    console.log(`\n--- Downloading Fonts (${manifest.fonts.length} files) ---`);
    for (const url of manifest.fonts) {
      const result = await downloadAsset(url, 'fonts');
      downloadLog.push(result);
      results[result.status === 'downloaded' ? 'downloaded' : result.status === 'skipped' ? 'skipped' : 'failed']++;
      if (result.size) results.totalSize += result.size;
      await sleep(DELAY_MS);
    }
  }
  
  // Save download log
  const logPath = path.join(OUTPUT_DIR, 'metadata', 'download-log.json');
  await fs.outputJson(logPath, {
    completedAt: new Date().toISOString(),
    results,
    assets: downloadLog
  }, { spaces: 2 });
  
  // Summary
  console.log('\n===========================================');
  console.log('Download Complete!');
  console.log('===========================================');
  console.log(`Downloaded: ${results.downloaded} files`);
  console.log(`Skipped: ${results.skipped} files`);
  console.log(`Failed: ${results.failed} files`);
  console.log(`Total size: ${(results.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\nDownload log saved: ${logPath}`);
}

main().catch(console.error);
