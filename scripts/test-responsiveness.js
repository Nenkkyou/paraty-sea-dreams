/**
 * Script Puppeteer para testar responsividade do Dashboard Admin
 * Testa em múltiplas resoluções e gera screenshots
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dispositivos e resoluções para testar
const viewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12 Pro', width: 390, height: 844 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Laptop Small', width: 1366, height: 768 },
  { name: 'Laptop', width: 1440, height: 900 },
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Desktop 4K', width: 2560, height: 1440 },
];

// URL do dashboard (ajuste se necessário)
const DASHBOARD_URL = 'http://localhost:8080/admin/dashboard';

async function testResponsiveness() {
  console.log('🚀 Iniciando testes de responsividade...\n');

  // Criar pasta para screenshots
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
  });

  const results = [];

  for (const viewport of viewports) {
    console.log(`📱 Testando: ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    const page = await browser.newPage();
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
    });

    try {
      // Navegar para o dashboard
      await page.goto(DASHBOARD_URL, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Aguardar o conteúdo carregar
      await page.waitForSelector('[class*="space-y"]', { timeout: 10000 });

      // Verificar overflow horizontal
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      // Verificar elementos que saem da viewport
      const overflowingElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const overflowing = [];
        const viewportWidth = window.innerWidth;

        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > viewportWidth + 5) { // 5px tolerance
            overflowing.push({
              tag: el.tagName,
              classes: el.className?.toString?.()?.slice(0, 50) || '',
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              overflow: Math.round(rect.right - viewportWidth),
            });
          }
        });

        // Return only unique elements by tag+overflow
        return overflowing.slice(0, 10);
      });

      // Capturar screenshot
      const screenshotPath = path.join(screenshotsDir, `${viewport.name.replace(/\s+/g, '-')}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      const result = {
        viewport: viewport.name,
        width: viewport.width,
        height: viewport.height,
        hasHorizontalScroll,
        overflowingElementsCount: overflowingElements.length,
        overflowingElements: overflowingElements.slice(0, 3),
        screenshot: screenshotPath,
        status: hasHorizontalScroll || overflowingElements.length > 0 ? '❌ FALHOU' : '✅ PASSOU',
      };

      results.push(result);

      console.log(`   ${result.status}`);
      if (hasHorizontalScroll) {
        console.log(`   ⚠️  Scroll horizontal detectado!`);
      }
      if (overflowingElements.length > 0) {
        console.log(`   ⚠️  ${overflowingElements.length} elementos saindo da viewport`);
        overflowingElements.slice(0, 3).forEach(el => {
          console.log(`      - ${el.tag}: overflow=${el.overflow}px`);
        });
      }
      console.log('');

    } catch (error) {
      console.error(`   ❌ Erro: ${error.message}\n`);
      results.push({
        viewport: viewport.name,
        width: viewport.width,
        height: viewport.height,
        error: error.message,
        status: '❌ ERRO',
      });
    }

    await page.close();
  }

  await browser.close();

  // Gerar relatório
  console.log('\n📊 RESUMO DOS TESTES\n');
  console.log('═'.repeat(60));
  
  const passed = results.filter(r => r.status === '✅ PASSOU').length;
  const failed = results.filter(r => r.status === '❌ FALHOU').length;
  const errors = results.filter(r => r.status === '❌ ERRO').length;

  console.log(`\n✅ Passou: ${passed}/${viewports.length}`);
  console.log(`❌ Falhou: ${failed}/${viewports.length}`);
  console.log(`❌ Erros: ${errors}/${viewports.length}\n`);

  if (failed > 0 || errors > 0) {
    console.log('Dispositivos com problemas:');
    results
      .filter(r => r.status !== '✅ PASSOU')
      .forEach(r => {
        console.log(`  - ${r.viewport} (${r.width}x${r.height})`);
        if (r.hasHorizontalScroll) console.log('    → Scroll horizontal');
        if (r.overflowingElementsCount > 0) console.log(`    → ${r.overflowingElementsCount} elementos overflow`);
        if (r.error) console.log(`    → Erro: ${r.error}`);
      });
  }

  console.log(`\n📸 Screenshots salvos em: ${screenshotsDir}\n`);
  console.log('═'.repeat(60));

  // Salvar relatório JSON
  const reportPath = path.join(screenshotsDir, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  return results;
}

// Executar testes
testResponsiveness()
  .then(() => {
    console.log('\n✅ Testes concluídos!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erro ao executar testes:', error);
    process.exit(1);
  });
