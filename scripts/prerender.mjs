#!/usr/bin/env node
/**
 * Pre-rendering skript pro generování statického HTML z React SPA.
 * Spouští se po npm run build a generuje HTML pro každou stránku.
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const PORT = 5555;

// Seznam všech stránek k pre-renderování
const ROUTES = [
  '/',
  '/galerie',
  '/blog',
  '/objednat',
  '/o-mne',
  '/ochrana-soukromi',
  '/obchodni-podminky',
];

// Jednoduchý statický server
function createStaticServer() {
  return createServer((req, res) => {
    let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Pro SPA routing - pokud soubor neexistuje, vrať index.html
    if (!existsSync(filePath) || !filePath.includes('.')) {
      filePath = join(DIST_DIR, 'index.html');
    }
    
    try {
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      const contentTypes = {
        'html': 'text/html',
        'js': 'application/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'svg': 'image/svg+xml',
      };
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(content);
    } catch (err) {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

async function prerender() {
  console.log('🚀 Spouštím pre-rendering...\n');
  
  // Spustit lokální server
  const server = createStaticServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`📡 Server běží na http://localhost:${PORT}`);
  
  // Spustit Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    for (const route of ROUTES) {
      console.log(`\n📄 Pre-rendering: ${route}`);
      
      const page = await browser.newPage();
      
      // Nastavit user-agent jako Googlebot pro správné meta tagy
      await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
      
      // Navigovat na stránku a počkat na načtení
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
      
      // Počkat na hydrataci React
      await page.waitForSelector('#root > *:not([style*="position: fixed"])', {
        timeout: 10000,
      }).catch(() => {
        console.log(`   ⚠️  React hydratace trvá déle, čekám...`);
      });
      
      // Dodatečné čekání pro jistotu
      await new Promise(r => setTimeout(r, 2000));
      
      // Odstranit loading state
      await page.evaluate(() => {
        const loader = document.querySelector('#root > div[style*="position: fixed"]');
        if (loader) loader.remove();
      });
      
      // Získat HTML
      const html = await page.content();
      
      // Určit cestu k souboru
      const outputPath = route === '/' 
        ? join(DIST_DIR, 'index.html')
        : join(DIST_DIR, route.slice(1), 'index.html');
      
      // Vytvořit adresář pokud neexistuje
      const outputDir = dirname(outputPath);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      
      // Uložit HTML
      writeFileSync(outputPath, html);
      console.log(`   ✅ Uloženo: ${outputPath.replace(DIST_DIR, 'dist')}`);
      
      await page.close();
    }
    
    console.log('\n✨ Pre-rendering dokončen!\n');
    
  } finally {
    await browser.close();
    server.close();
  }
}

prerender().catch(err => {
  console.error('❌ Chyba při pre-renderingu:', err);
  process.exit(1);
});
