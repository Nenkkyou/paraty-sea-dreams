/**
 * Responsive Monitor - Ferramenta de Monitoramento de Responsividade
 * 
 * Este script detecta automaticamente problemas visuais e de responsividade
 * no projeto, identificando elementos problemáticos e gerando relatórios
 * claros no console.
 * 
 * Uso:
 * - Import e chame initResponsiveMonitor() no seu App.tsx em desenvolvimento
 * - Ou execute window.runResponsiveCheck() manualmente no console do navegador
 * 
 * @author ParatyBoat Team
 * @version 1.0.0
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

interface ResponsiveIssue {
  element: HTMLElement;
  type: IssueType;
  severity: 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  suggestion?: string;
}

type IssueType = 
  | 'overflow-horizontal'
  | 'overflow-text'
  | 'fixed-size'
  | 'image-responsive'
  | 'contrast'
  | 'breakpoint-issue'
  | 'z-index'
  | 'touch-target';

interface BreakpointConfig {
  name: string;
  width: number;
}

interface MonitorConfig {
  breakpoints: BreakpointConfig[];
  enableOverlay: boolean;
  autoRun: boolean;
  logToConsole: boolean;
  minContrastRatio: number;
  minTouchTargetSize: number;
}

// ============================================
// CONFIGURAÇÃO PADRÃO
// ============================================

const DEFAULT_CONFIG: MonitorConfig = {
  breakpoints: [
    { name: 'mobile-small', width: 320 },
    { name: 'mobile', width: 480 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1024 },
    { name: 'desktop-large', width: 1440 },
  ],
  enableOverlay: true,
  autoRun: true,
  logToConsole: true,
  minContrastRatio: 4.5, // WCAG AA standard
  minTouchTargetSize: 44, // Mínimo recomendado para touch targets
};

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Obtém a cor de fundo efetiva de um elemento (considerando transparência)
 */
function getEffectiveBackgroundColor(element: HTMLElement): string {
  let el: HTMLElement | null = element;
  
  while (el) {
    const bg = window.getComputedStyle(el).backgroundColor;
    if (bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
      return bg;
    }
    el = el.parentElement;
  }
  
  return 'rgb(255, 255, 255)'; // Fallback para branco
}

/**
 * Converte cor RGB para valores numéricos
 */
function parseRGB(color: string): { r: number; g: number; b: number } | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

/**
 * Calcula luminância relativa (WCAG)
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcula ratio de contraste entre duas cores
 */
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = parseRGB(color1);
  const rgb2 = parseRGB(color2);
  
  if (!rgb1 || !rgb2) return 21; // Assume contraste máximo se não conseguir parsear
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Gera um seletor CSS único para o elemento
 */
function getElementSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`;
  }
  
  const classes = Array.from(element.classList).slice(0, 3).join('.');
  const tag = element.tagName.toLowerCase();
  
  if (classes) {
    return `${tag}.${classes}`;
  }
  
  return tag;
}

/**
 * Verifica se o elemento é visível
 */
function isElementVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
}

// ============================================
// DETECTORES DE PROBLEMAS
// ============================================

/**
 * Detecta elementos com overflow horizontal
 */
function detectHorizontalOverflow(): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  const docWidth = document.documentElement.clientWidth;
  
  document.querySelectorAll('*').forEach(el => {
    const element = el as HTMLElement;
    if (!isElementVisible(element)) return;
    
    const rect = element.getBoundingClientRect();
    
    // Elemento ultrapassa a largura da viewport
    if (rect.right > docWidth + 1 || rect.left < -1) {
      issues.push({
        element,
        type: 'overflow-horizontal',
        severity: 'error',
        message: `Elemento ultrapassa a viewport (${Math.round(rect.width)}px de largura)`,
        details: `Left: ${Math.round(rect.left)}px, Right: ${Math.round(rect.right)}px, Viewport: ${docWidth}px`,
        suggestion: 'Adicione max-width: 100%, overflow-x: hidden, ou revise o layout',
      });
    }
  });
  
  return issues;
}

/**
 * Detecta textos com overflow
 */
function detectTextOverflow(): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  
  const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, li, label, td, th');
  
  textElements.forEach(el => {
    const element = el as HTMLElement;
    if (!isElementVisible(element)) return;
    
    const style = window.getComputedStyle(element);
    
    // Ignora elementos com tratamento de overflow
    if (
      style.textOverflow === 'ellipsis' ||
      style.overflow === 'hidden' ||
      style.whiteSpace === 'nowrap'
    ) {
      return;
    }
    
    // Verifica se o texto está cortado
    if (element.scrollWidth > element.clientWidth + 5) {
      issues.push({
        element,
        type: 'overflow-text',
        severity: 'warning',
        message: `Texto ultrapassa o container (${element.scrollWidth}px > ${element.clientWidth}px)`,
        details: `Conteúdo: "${element.textContent?.slice(0, 50)}..."`,
        suggestion: 'Adicione text-overflow: ellipsis, word-break: break-word, ou aumente o container',
      });
    }
  });
  
  return issues;
}

/**
 * Detecta elementos com tamanhos fixos problemáticos
 */
function detectFixedSizes(): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  const viewportWidth = window.innerWidth;
  
  document.querySelectorAll('*').forEach(el => {
    const element = el as HTMLElement;
    if (!isElementVisible(element)) return;
    
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // Ignora elementos muito pequenos
    if (rect.width < 50 && rect.height < 50) return;
    
    // Verifica width fixo em pixels maior que viewport
    const widthValue = parseFloat(style.width);
    if (!isNaN(widthValue) && style.width.includes('px') && widthValue > viewportWidth * 0.9) {
      issues.push({
        element,
        type: 'fixed-size',
        severity: 'warning',
        message: `Width fixo de ${Math.round(widthValue)}px pode quebrar em telas menores`,
        details: `Viewport atual: ${viewportWidth}px`,
        suggestion: 'Use max-width, percentuais, ou unidades relativas (vw, rem)',
      });
    }
    
    // Verifica min-width muito grande
    const minWidth = parseFloat(style.minWidth);
    if (!isNaN(minWidth) && style.minWidth.includes('px') && minWidth > 400) {
      issues.push({
        element,
        type: 'fixed-size',
        severity: 'info',
        message: `min-width de ${Math.round(minWidth)}px pode causar overflow em mobile`,
        suggestion: 'Considere usar min-width responsivo ou media queries',
      });
    }
  });
  
  return issues;
}

/**
 * Detecta imagens sem regras de responsividade
 */
function detectNonResponsiveImages(): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  
  document.querySelectorAll('img').forEach(img => {
    const element = img as HTMLImageElement;
    if (!isElementVisible(element)) return;
    
    const style = window.getComputedStyle(element);
    
    // Verifica se tem max-width
    const hasMaxWidth = style.maxWidth !== 'none' && style.maxWidth !== '0px';
    const hasWidth100 = style.width === '100%';
    const hasObjectFit = style.objectFit !== 'fill' && style.objectFit !== '';
    
    if (!hasMaxWidth && !hasWidth100) {
      issues.push({
        element,
        type: 'image-responsive',
        severity: 'warning',
        message: 'Imagem sem max-width ou width: 100%',
        details: `Tamanho natural: ${element.naturalWidth}x${element.naturalHeight}px`,
        suggestion: 'Adicione max-width: 100% e height: auto, ou use object-fit',
      });
    }
    
    // Verifica se tem object-fit adequado para imagens de capa
    if (element.classList.contains('object-cover') || element.classList.contains('object-contain')) {
      return; // Já tem tratamento
    }
    
    const rect = element.getBoundingClientRect();
    if (rect.width > 200 && rect.height > 200 && !hasObjectFit) {
      issues.push({
        element,
        type: 'image-responsive',
        severity: 'info',
        message: 'Imagem grande sem object-fit definido',
        suggestion: 'Considere usar object-fit: cover ou object-fit: contain',
      });
    }
  });
  
  return issues;
}

/**
 * Detecta problemas de contraste
 */
function detectContrastIssues(minRatio: number): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  
  const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label, li');
  
  textElements.forEach(el => {
    const element = el as HTMLElement;
    if (!isElementVisible(element)) return;
    
    // Ignora elementos sem texto direto
    if (!element.textContent?.trim()) return;
    
    const style = window.getComputedStyle(element);
    const textColor = style.color;
    const bgColor = getEffectiveBackgroundColor(element);
    
    const contrastRatio = getContrastRatio(textColor, bgColor);
    
    // Textos pequenos precisam de mais contraste
    const fontSize = parseFloat(style.fontSize);
    const requiredRatio = fontSize < 18 ? minRatio : 3; // WCAG AA para texto grande
    
    if (contrastRatio < requiredRatio) {
      issues.push({
        element,
        type: 'contrast',
        severity: contrastRatio < 3 ? 'error' : 'warning',
        message: `Contraste insuficiente: ${contrastRatio.toFixed(2)}:1 (mínimo: ${requiredRatio}:1)`,
        details: `Cor do texto: ${textColor}, Fundo: ${bgColor}`,
        suggestion: 'Aumente o contraste entre texto e fundo para melhor legibilidade',
      });
    }
  });
  
  return issues;
}

/**
 * Detecta touch targets muito pequenos
 */
function detectSmallTouchTargets(minSize: number): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [onclick]');
  
  interactiveElements.forEach(el => {
    const element = el as HTMLElement;
    if (!isElementVisible(element)) return;
    
    const rect = element.getBoundingClientRect();
    
    if (rect.width < minSize || rect.height < minSize) {
      issues.push({
        element,
        type: 'touch-target',
        severity: 'warning',
        message: `Touch target muito pequeno: ${Math.round(rect.width)}x${Math.round(rect.height)}px`,
        details: `Tamanho mínimo recomendado: ${minSize}x${minSize}px`,
        suggestion: 'Aumente o tamanho do elemento ou adicione padding para facilitar o toque',
      });
    }
  });
  
  return issues;
}

// ============================================
// OVERLAY VISUAL
// ============================================

let overlayContainer: HTMLDivElement | null = null;

/**
 * Cria overlay visual destacando elementos problemáticos
 */
function createOverlay(issues: ResponsiveIssue[]): void {
  removeOverlay();
  
  overlayContainer = document.createElement('div');
  overlayContainer.id = 'responsive-monitor-overlay';
  overlayContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999999;
  `;
  
  issues.forEach((issue, index) => {
    const rect = issue.element.getBoundingClientRect();
    
    const highlight = document.createElement('div');
    highlight.style.cssText = `
      position: absolute;
      top: ${rect.top + window.scrollY}px;
      left: ${rect.left + window.scrollX}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid ${issue.severity === 'error' ? '#ef4444' : issue.severity === 'warning' ? '#f59e0b' : '#3b82f6'};
      background: ${issue.severity === 'error' ? 'rgba(239, 68, 68, 0.1)' : issue.severity === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
      border-radius: 4px;
      pointer-events: none;
    `;
    
    const label = document.createElement('div');
    label.style.cssText = `
      position: absolute;
      top: -20px;
      left: 0;
      background: ${issue.severity === 'error' ? '#ef4444' : issue.severity === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
      white-space: nowrap;
    `;
    label.textContent = `#${index + 1} ${issue.type}`;
    
    highlight.appendChild(label);
    overlayContainer!.appendChild(highlight);
  });
  
  document.body.appendChild(overlayContainer);
}

/**
 * Remove overlay visual
 */
function removeOverlay(): void {
  if (overlayContainer) {
    overlayContainer.remove();
    overlayContainer = null;
  }
}

// ============================================
// LOGGING E RELATÓRIOS
// ============================================

/**
 * Agrupa issues por tipo
 */
function groupIssuesByType(issues: ResponsiveIssue[]): Map<IssueType, ResponsiveIssue[]> {
  const grouped = new Map<IssueType, ResponsiveIssue[]>();
  
  issues.forEach(issue => {
    const existing = grouped.get(issue.type) || [];
    existing.push(issue);
    grouped.set(issue.type, existing);
  });
  
  return grouped;
}

/**
 * Gera log formatado no console
 */
function logIssues(issues: ResponsiveIssue[]): void {
  if (issues.length === 0) {
    console.log('%c✅ Responsive Monitor: Nenhum problema detectado!', 'color: #10b981; font-weight: bold; font-size: 14px;');
    return;
  }
  
  console.group('%c🔍 Responsive Monitor - Relatório de Problemas', 'color: #6366f1; font-weight: bold; font-size: 16px;');
  console.log(`Total de problemas encontrados: ${issues.length}`);
  console.log(`Viewport atual: ${window.innerWidth}x${window.innerHeight}px`);
  console.log('');
  
  const grouped = groupIssuesByType(issues);
  
  const typeLabels: Record<IssueType, { emoji: string; label: string }> = {
    'overflow-horizontal': { emoji: '📐', label: 'Overflow Horizontal' },
    'overflow-text': { emoji: '📝', label: 'Overflow de Texto' },
    'fixed-size': { emoji: '📏', label: 'Tamanhos Fixos' },
    'image-responsive': { emoji: '🖼️', label: 'Imagens Não Responsivas' },
    'contrast': { emoji: '🎨', label: 'Problemas de Contraste' },
    'breakpoint-issue': { emoji: '📱', label: 'Problemas de Breakpoint' },
    'z-index': { emoji: '📚', label: 'Problemas de Z-Index' },
    'touch-target': { emoji: '👆', label: 'Touch Targets Pequenos' },
  };
  
  grouped.forEach((typeIssues, type) => {
    const { emoji, label } = typeLabels[type] || { emoji: '❓', label: type };
    const errors = typeIssues.filter(i => i.severity === 'error').length;
    const warnings = typeIssues.filter(i => i.severity === 'warning').length;
    
    console.groupCollapsed(
      `%c${emoji} ${label} (${typeIssues.length})%c ${errors > 0 ? `❌ ${errors}` : ''} ${warnings > 0 ? `⚠️ ${warnings}` : ''}`,
      'font-weight: bold;',
      'font-weight: normal; color: #888;'
    );
    
    typeIssues.forEach((issue, index) => {
      const severityColors = {
        error: 'color: #ef4444;',
        warning: 'color: #f59e0b;',
        info: 'color: #3b82f6;',
      };
      
      console.log(`%c[${index + 1}] ${issue.message}`, severityColors[issue.severity]);
      console.log('   Elemento:', getElementSelector(issue.element));
      if (issue.details) console.log('   Detalhes:', issue.details);
      if (issue.suggestion) console.log('   💡 Sugestão:', issue.suggestion);
      console.log('   Referência:', issue.element);
    });
    
    console.groupEnd();
  });
  
  console.groupEnd();
  
  // Resumo rápido
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;
  
  console.log(
    `%c📊 Resumo: ${errorCount} erros, ${warningCount} avisos, ${infoCount} informações`,
    'color: #6366f1; font-weight: bold; margin-top: 10px;'
  );
}

// ============================================
// API PRINCIPAL
// ============================================

/**
 * Executa verificação completa de responsividade
 */
function runResponsiveCheck(config: Partial<MonitorConfig> = {}): ResponsiveIssue[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  console.clear();
  console.log('%c🚀 Iniciando Responsive Monitor...', 'color: #6366f1; font-weight: bold;');
  
  const allIssues: ResponsiveIssue[] = [
    ...detectHorizontalOverflow(),
    ...detectTextOverflow(),
    ...detectFixedSizes(),
    ...detectNonResponsiveImages(),
    ...detectContrastIssues(finalConfig.minContrastRatio),
    ...detectSmallTouchTargets(finalConfig.minTouchTargetSize),
  ];
  
  if (finalConfig.logToConsole) {
    logIssues(allIssues);
  }
  
  if (finalConfig.enableOverlay && allIssues.length > 0) {
    createOverlay(allIssues);
    console.log('%c💡 Overlay ativado. Use window.removeResponsiveOverlay() para remover.', 'color: #888;');
  }
  
  return allIssues;
}

/**
 * Inicializa o monitor com execução automática
 */
function initResponsiveMonitor(config: Partial<MonitorConfig> = {}): void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Expõe funções globalmente para uso no console
  (window as any).runResponsiveCheck = () => runResponsiveCheck(finalConfig);
  (window as any).removeResponsiveOverlay = removeOverlay;
  
  if (finalConfig.autoRun) {
    // Executa após o carregamento da página
    if (document.readyState === 'complete') {
      setTimeout(() => runResponsiveCheck(finalConfig), 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => runResponsiveCheck(finalConfig), 1000);
      });
    }
    
    // Re-executa no resize (com debounce)
    let resizeTimeout: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      removeOverlay();
      resizeTimeout = setTimeout(() => runResponsiveCheck(finalConfig), 500);
    });
  }
  
  console.log('%c🔧 Responsive Monitor inicializado!', 'color: #10b981; font-weight: bold;');
  console.log('%c   Use window.runResponsiveCheck() para executar manualmente', 'color: #888;');
  console.log('%c   Use window.removeResponsiveOverlay() para remover overlay', 'color: #888;');
}

// ============================================
// EXPORTS
// ============================================

export {
  initResponsiveMonitor,
  runResponsiveCheck,
  removeOverlay,
  type ResponsiveIssue,
  type IssueType,
  type MonitorConfig,
};

export default initResponsiveMonitor;
