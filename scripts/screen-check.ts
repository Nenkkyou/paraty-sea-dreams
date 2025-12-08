/**
 * Screen Check - Ferramenta de Verificação de Responsividade
 * 
 * Este script verifica automaticamente problemas visuais e de responsividade
 * em todas as páginas do projeto, testando múltiplos breakpoints.
 * 
 * Uso: npm run screen:check
 * 
 * @author ParatyBoat Team
 * @version 1.0.0
 */

import puppeteer, { Browser, Page } from 'puppeteer';

// ============================================
// CONFIGURAÇÃO
// ============================================

interface Breakpoint {
  name: string;
  width: number;
  height: number;
}

interface PageConfig {
  name: string;
  path: string;
}

interface Issue {
  page: string;
  breakpoint: string;
  type: string;
  severity: 'error' | 'warning' | 'info';
  element: string;
  message: string;
  details?: string;
}

const CONFIG = {
  baseUrl: 'http://localhost:5199',
  timeout: 30000,
  breakpoints: [
    { name: 'mobile-small', width: 320, height: 568 },
    { name: 'mobile', width: 480, height: 854 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1024, height: 768 },
    { name: 'desktop-large', width: 1440, height: 900 },
  ] as Breakpoint[],
  pages: [
    { name: 'Home', path: '/' },
    { name: 'Roteiros', path: '/roteiros' },
    { name: 'Contato', path: '/contato' },
    { name: 'Admin Login', path: '/admin' },
    { name: 'Admin Dashboard', path: '/admin/dashboard' },
    { name: 'Admin Solicitações', path: '/admin/solicitacoes' },
    { name: 'Admin Reservas', path: '/admin/reservas' },
    { name: 'Admin Clientes', path: '/admin/clientes' },
    { name: 'Admin Monitor', path: '/admin/monitor' },
    { name: 'Admin Configurações', path: '/admin/configuracoes' },
  ] as PageConfig[],
};

// ============================================
// CORES PARA CONSOLE
// ============================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

function log(message: string, color: string = colors.white): void {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message: string): void {
  console.log();
  console.log(`${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  ${message}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}`);
}

function logSection(message: string): void {
  console.log();
  console.log(`${colors.bright}${colors.blue}▶ ${message}${colors.reset}`);
  console.log(`${colors.dim}${'─'.repeat(50)}${colors.reset}`);
}

function logSuccess(message: string): void {
  console.log(`${colors.green}  ✓ ${message}${colors.reset}`);
}

function logWarning(message: string): void {
  console.log(`${colors.yellow}  ⚠ ${message}${colors.reset}`);
}

function logError(message: string): void {
  console.log(`${colors.red}  ✗ ${message}${colors.reset}`);
}

function logInfo(message: string): void {
  console.log(`${colors.dim}  ℹ ${message}${colors.reset}`);
}

// ============================================
// FUNÇÕES DE VERIFICAÇÃO
// ============================================

/**
 * Script que será injetado na página para detectar problemas
 */
const checkScript = `
(() => {
  const issues = [];
  const docWidth = document.documentElement.clientWidth;
  const docHeight = document.documentElement.clientHeight;

  // Função auxiliar para obter seletor do elemento
  function getSelector(el) {
    if (el.id) return '#' + el.id;
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.split(' ').filter(c => c && !c.includes('[')).slice(0, 2).join('.');
      if (classes) return el.tagName.toLowerCase() + '.' + classes;
    }
    return el.tagName.toLowerCase();
  }

  // Função para verificar se elemento é visível
  function isVisible(el) {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           el.offsetWidth > 0 && 
           el.offsetHeight > 0;
  }

  // Ignora elementos de carrossel/slider (comportamento esperado)
  function isCarouselElement(el) {
    const selector = getSelector(el);
    const classes = el.className || '';
    
    // Verifica se o próprio elemento é de carrossel
    if (selector.includes('embla') || 
        selector.includes('carousel') || 
        selector.includes('slider') ||
        selector.includes('swiper') ||
        classes.includes('embla') ||
        classes.includes('carousel') ||
        classes.includes('min-w-0') || // Slides usam min-w-0
        classes.includes('shrink-0')) { // Slides usam shrink-0
      return true;
    }
    
    // Verifica ancestrais
    let parent = el.parentElement;
    while (parent) {
      const parentClasses = parent.className || '';
      if (parentClasses.includes('embla') || 
          parentClasses.includes('carousel') ||
          parentClasses.includes('overflow-hidden') ||
          parent.getAttribute('data-carousel') !== null) {
        return true;
      }
      parent = parent.parentElement;
    }
    
    return false;
  }

  // Ignora elementos estruturais básicos
  function isStructuralElement(el) {
    const tag = el.tagName.toLowerCase();
    return ['html', 'body', 'main', 'header', 'footer', 'nav', 'section', 'article'].includes(tag) ||
           el.id === 'root' ||
           el.classList.contains('min-h-screen') ||
           el.classList.contains('container');
  }

  // 1. Detectar overflow horizontal (ignorando carrosséis)
  document.querySelectorAll('*').forEach(el => {
    if (!isVisible(el)) return;
    if (isCarouselElement(el)) return;
    if (isStructuralElement(el)) return;
    
    const rect = el.getBoundingClientRect();
    // Só reporta se ultrapassar significativamente (mais de 20px)
    if (rect.right > docWidth + 20) {
      issues.push({
        type: 'overflow-horizontal',
        severity: 'error',
        element: getSelector(el),
        message: 'Elemento ultrapassa a viewport',
        details: 'Width: ' + Math.round(rect.width) + 'px, Right: ' + Math.round(rect.right) + 'px, Viewport: ' + docWidth + 'px'
      });
    }
  });

  // 2. Detectar textos com overflow
  document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, li, label, td, th, button').forEach(el => {
    if (!isVisible(el)) return;
    const style = window.getComputedStyle(el);
    if (style.textOverflow === 'ellipsis' || style.overflow === 'hidden' || style.whiteSpace === 'nowrap') return;
    // Só reporta se diferença for significativa (mais de 20px)
    if (el.scrollWidth > el.clientWidth + 20) {
      issues.push({
        type: 'overflow-text',
        severity: 'warning',
        element: getSelector(el),
        message: 'Texto ultrapassa o container',
        details: 'ScrollWidth: ' + el.scrollWidth + 'px, ClientWidth: ' + el.clientWidth + 'px'
      });
    }
  });

  // 3. Detectar tamanhos fixos problemáticos (só reporta se maior que viewport)
  document.querySelectorAll('div, section, article, aside').forEach(el => {
    if (!isVisible(el)) return;
    if (isStructuralElement(el)) return;
    if (isCarouselElement(el)) return;
    
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    
    // Só reporta se width fixo for maior que a viewport atual
    const widthValue = parseFloat(style.width);
    if (!isNaN(widthValue) && style.width.includes('px') && widthValue > docWidth) {
      issues.push({
        type: 'fixed-size',
        severity: 'warning',
        element: getSelector(el),
        message: 'Width fixo de ' + Math.round(widthValue) + 'px maior que viewport',
        details: 'Viewport: ' + docWidth + 'px'
      });
    }
    
    // Reporta min-width muito grande apenas se causar overflow
    const minWidth = parseFloat(style.minWidth);
    if (!isNaN(minWidth) && style.minWidth.includes('px') && minWidth > docWidth) {
      issues.push({
        type: 'fixed-size',
        severity: 'error',
        element: getSelector(el),
        message: 'min-width de ' + Math.round(minWidth) + 'px causa overflow',
        details: 'Viewport: ' + docWidth + 'px'
      });
    }
  });

  // 4. Verificar imagens sem responsividade
  document.querySelectorAll('img').forEach(img => {
    if (!isVisible(img)) return;
    if (isCarouselElement(img)) return;
    
    const style = window.getComputedStyle(img);
    const hasMaxWidth = style.maxWidth !== 'none' && style.maxWidth !== '0px';
    const hasWidth100 = style.width === '100%';
    const rect = img.getBoundingClientRect();
    
    // Só reporta imagens grandes que podem causar problemas
    if (!hasMaxWidth && !hasWidth100 && 
        !img.classList.contains('object-cover') && 
        !img.classList.contains('object-contain') &&
        rect.width > docWidth) {
      issues.push({
        type: 'image-responsive',
        severity: 'warning',
        element: getSelector(img),
        message: 'Imagem maior que viewport sem responsividade',
        details: 'Size: ' + Math.round(rect.width) + 'x' + Math.round(rect.height) + 'px'
      });
    }
  });

  // 5. Verificar touch targets pequenos (apenas mobile e tablet)
  if (docWidth <= 768) {
    document.querySelectorAll('button, a[href], input, select, textarea, [role="button"]').forEach(el => {
      if (!isVisible(el)) return;
      if (isCarouselElement(el)) return;
      
      // Ignora indicadores de carrossel (comportamento comum)
      if (el.classList.contains('w-2') || el.classList.contains('h-2')) return;
      // Ignora botões de navegação do carrossel (são pequenos por design)
      if (el.classList.contains('absolute') && 
          (el.classList.contains('left-4') || 
           el.classList.contains('right-4') || 
           el.classList.contains('left-2') || 
           el.classList.contains('right-2'))) return;
      // Ignora ícones SVG que são clicáveis
      if (el.tagName.toLowerCase() === 'svg') return;
      // Ignora botões dentro de formulários de navegação
      if (el.closest('[role="navigation"]')) return;
      
      const rect = el.getBoundingClientRect();
      // Só reporta se ambas dimensões forem menores que 40px e não for muito pequeno (links inline ok)
      if (rect.width > 10 && rect.height > 10 && rect.width < 40 && rect.height < 40) {
        issues.push({
          type: 'touch-target',
          severity: 'warning',
          element: getSelector(el),
          message: 'Touch target pequeno: ' + Math.round(rect.width) + 'x' + Math.round(rect.height) + 'px',
          details: 'Mínimo recomendado: 44x44px'
        });
      }
    });
  }

  return issues;
})();
`;

/**
 * Verifica uma página em um breakpoint específico
 */
async function checkPage(
  page: Page,
  pageConfig: PageConfig,
  breakpoint: Breakpoint
): Promise<Issue[]> {
  const issues: Issue[] = [];

  try {
    // Define o viewport
    await page.setViewport({
      width: breakpoint.width,
      height: breakpoint.height,
    });

    // Navega para a página
    const url = `${CONFIG.baseUrl}${pageConfig.path}`;
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: CONFIG.timeout 
    });

    // Aguarda um pouco para animações (usando setTimeout em vez de waitForTimeout)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Executa o script de verificação
    const pageIssues = await page.evaluate(checkScript) as Omit<Issue, 'page' | 'breakpoint'>[];

    // Adiciona contexto às issues
    for (const issue of pageIssues) {
      issues.push({
        ...issue,
        page: pageConfig.name,
        breakpoint: breakpoint.name,
      });
    }

  } catch (error) {
    issues.push({
      page: pageConfig.name,
      breakpoint: breakpoint.name,
      type: 'page-error',
      severity: 'error',
      element: 'N/A',
      message: `Erro ao carregar página: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    });
  }

  return issues;
}

/**
 * Agrupa issues por tipo
 */
function groupIssuesByType(issues: Issue[]): Map<string, Issue[]> {
  const grouped = new Map<string, Issue[]>();
  
  for (const issue of issues) {
    const existing = grouped.get(issue.type) || [];
    existing.push(issue);
    grouped.set(issue.type, existing);
  }
  
  return grouped;
}

/**
 * Gera relatório final
 */
function generateReport(allIssues: Issue[]): void {
  logHeader('📊 RELATÓRIO DE RESPONSIVIDADE');

  if (allIssues.length === 0) {
    logSuccess('Nenhum problema encontrado! 🎉');
    return;
  }

  // Contadores
  const errorCount = allIssues.filter(i => i.severity === 'error').length;
  const warningCount = allIssues.filter(i => i.severity === 'warning').length;
  const infoCount = allIssues.filter(i => i.severity === 'info').length;

  console.log();
  log(`  Total de problemas: ${allIssues.length}`, colors.white);
  if (errorCount > 0) logError(`Erros críticos: ${errorCount}`);
  if (warningCount > 0) logWarning(`Avisos: ${warningCount}`);
  if (infoCount > 0) logInfo(`Informações: ${infoCount}`);

  // Agrupa por tipo
  const grouped = groupIssuesByType(allIssues);

  const typeLabels: Record<string, string> = {
    'overflow-horizontal': '📐 Overflow Horizontal',
    'overflow-text': '📝 Overflow de Texto',
    'fixed-size': '📏 Tamanhos Fixos',
    'image-responsive': '🖼️  Imagens Não Responsivas',
    'contrast': '🎨 Problemas de Contraste',
    'touch-target': '👆 Touch Targets Pequenos',
    'page-error': '❌ Erros de Página',
  };

  grouped.forEach((issues, type) => {
    logSection(typeLabels[type] || type);
    
    // Limita a 10 issues por tipo para não poluir
    const displayIssues = issues.slice(0, 10);
    
    for (const issue of displayIssues) {
      const color = issue.severity === 'error' ? colors.red : 
                    issue.severity === 'warning' ? colors.yellow : colors.dim;
      
      console.log(`${color}  [${issue.page}][${issue.breakpoint}] ${issue.element}${colors.reset}`);
      console.log(`${colors.dim}    └─ ${issue.message}${colors.reset}`);
      if (issue.details) {
        console.log(`${colors.dim}       ${issue.details}${colors.reset}`);
      }
    }
    
    if (issues.length > 10) {
      logInfo(`... e mais ${issues.length - 10} problemas do mesmo tipo`);
    }
  });

  // Resumo por página
  logSection('📄 Resumo por Página');
  
  const pageIssues = new Map<string, number>();
  for (const issue of allIssues) {
    pageIssues.set(issue.page, (pageIssues.get(issue.page) || 0) + 1);
  }
  
  pageIssues.forEach((count, page) => {
    const color = count > 10 ? colors.red : count > 5 ? colors.yellow : colors.green;
    console.log(`${color}  ${page}: ${count} problema(s)${colors.reset}`);
  });

  // Resumo por breakpoint
  logSection('📱 Resumo por Breakpoint');
  
  const breakpointIssues = new Map<string, number>();
  for (const issue of allIssues) {
    breakpointIssues.set(issue.breakpoint, (breakpointIssues.get(issue.breakpoint) || 0) + 1);
  }
  
  breakpointIssues.forEach((count, bp) => {
    const color = count > 10 ? colors.red : count > 5 ? colors.yellow : colors.green;
    console.log(`${color}  ${bp}: ${count} problema(s)${colors.reset}`);
  });
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

async function main(): Promise<void> {
  logHeader('🔍 SCREEN CHECK - Verificação de Responsividade');
  log(`  Iniciando verificação em ${CONFIG.pages.length} páginas...`, colors.dim);
  log(`  Testando ${CONFIG.breakpoints.length} breakpoints por página...`, colors.dim);
  
  let browser: Browser | null = null;
  const allIssues: Issue[] = [];
  
  try {
    // Inicia o browser
    log('\n  Iniciando navegador...', colors.dim);
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    // Testa cada página
    for (const pageConfig of CONFIG.pages) {
      logSection(`Verificando: ${pageConfig.name}`);
      
      for (const breakpoint of CONFIG.breakpoints) {
        process.stdout.write(`${colors.dim}  ├─ ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})... ${colors.reset}`);
        
        const issues = await checkPage(page, pageConfig, breakpoint);
        allIssues.push(...issues);
        
        if (issues.length === 0) {
          console.log(`${colors.green}✓${colors.reset}`);
        } else {
          const errors = issues.filter(i => i.severity === 'error').length;
          const warnings = issues.filter(i => i.severity === 'warning').length;
          console.log(`${colors.yellow}${issues.length} problema(s)${colors.reset}${errors > 0 ? ` ${colors.red}(${errors} erros)${colors.reset}` : ''}`);
        }
      }
    }

    // Gera relatório
    generateReport(allIssues);

    // Resultado final
    console.log();
    console.log(`${colors.bright}${'═'.repeat(60)}${colors.reset}`);
    
    const hasErrors = allIssues.some(i => i.severity === 'error');
    if (hasErrors) {
      logError(`Verificação concluída com ${allIssues.filter(i => i.severity === 'error').length} erro(s) crítico(s)`);
      process.exit(1);
    } else if (allIssues.length > 0) {
      logWarning(`Verificação concluída com ${allIssues.length} aviso(s)`);
      process.exit(0);
    } else {
      logSuccess('Verificação concluída sem problemas! 🎉');
      process.exit(0);
    }

  } catch (error) {
    logError(`Erro fatal: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    
    if (error instanceof Error && error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.log();
      logWarning('O servidor de desenvolvimento não está rodando!');
      logInfo('Execute primeiro: npm run dev');
      logInfo('Depois execute: npm run screen:check');
    }
    
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Executa
main();
