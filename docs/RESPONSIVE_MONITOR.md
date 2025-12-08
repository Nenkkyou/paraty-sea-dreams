# 🔍 Responsive Monitor - Guia de Uso

## Visão Geral

O **Responsive Monitor** é uma ferramenta de desenvolvimento que detecta automaticamente problemas visuais e de responsividade no projeto ParatyBoat. Ele identifica elementos problemáticos e gera relatórios claros no console do navegador.

## 🚀 Como Usar

### Comandos no Console do Navegador

1. **Executar verificação completa:**
   ```javascript
   window.runResponsiveCheck()
   ```

2. **Remover overlay visual:**
   ```javascript
   window.removeResponsiveOverlay()
   ```

### Inicialização Automática

O monitor é inicializado automaticamente em modo de desenvolvimento (`npm run dev`). Por padrão, ele não executa automaticamente - você precisa chamar `window.runResponsiveCheck()` manualmente.

Para ativar execução automática, edite o `App.tsx`:

```typescript
initResponsiveMonitor({
  autoRun: true,  // Mude para true
  enableOverlay: true,
  logToConsole: true,
});
```

## 🔎 Tipos de Problemas Detectados

### 1. 📐 Overflow Horizontal
Detecta elementos que ultrapassam a largura da viewport.
- **Severidade:** Error
- **Sugestão:** Adicione `max-width: 100%`, `overflow-x: hidden`, ou revise o layout

### 2. 📝 Overflow de Texto
Identifica textos que ultrapassam seu container.
- **Severidade:** Warning
- **Sugestão:** Use `text-overflow: ellipsis`, `word-break: break-word`, ou aumente o container

### 3. 📏 Tamanhos Fixos
Sinaliza elementos com `width` ou `min-width` fixos que podem quebrar em telas menores.
- **Severidade:** Warning/Info
- **Sugestão:** Use `max-width`, percentuais, ou unidades relativas (`vw`, `rem`)

### 4. 🖼️ Imagens Não Responsivas
Detecta imagens sem regras adequadas de responsividade.
- **Severidade:** Warning
- **Sugestão:** Adicione `max-width: 100%` e `height: auto`, ou use `object-fit`

### 5. 🎨 Problemas de Contraste
Identifica textos com contraste insuficiente (WCAG AA).
- **Severidade:** Error (< 3:1) / Warning (< 4.5:1)
- **Sugestão:** Aumente o contraste entre texto e fundo

### 6. 👆 Touch Targets Pequenos
Detecta elementos interativos menores que 44x44px.
- **Severidade:** Warning
- **Sugestão:** Aumente o tamanho ou adicione padding

## 📊 Formato do Relatório

O relatório é exibido no console agrupado por tipo de problema:

```
🔍 Responsive Monitor - Relatório de Problemas
   Total de problemas encontrados: 5
   Viewport atual: 375x667px

📐 Overflow Horizontal (2) ❌ 1 ⚠️ 1
   [1] Elemento ultrapassa a viewport (450px de largura)
       Elemento: div.card-container
       Detalhes: Left: -10px, Right: 440px, Viewport: 375px
       💡 Sugestão: Adicione max-width: 100%...

📝 Overflow de Texto (1) ⚠️ 1
   ...

📊 Resumo: 1 erros, 3 avisos, 1 informações
```

## 🎯 Overlay Visual

Quando há problemas detectados, um overlay visual é criado destacando os elementos:

- **🔴 Borda vermelha:** Erros críticos
- **🟠 Borda laranja:** Avisos
- **🔵 Borda azul:** Informações

Cada elemento problemático recebe um número e label indicando o tipo de problema.

## ⚙️ Configuração

```typescript
interface MonitorConfig {
  breakpoints: BreakpointConfig[];  // Breakpoints para testar
  enableOverlay: boolean;            // Ativar overlay visual
  autoRun: boolean;                  // Executar automaticamente
  logToConsole: boolean;             // Exibir logs no console
  minContrastRatio: number;          // Ratio mínimo (padrão: 4.5)
  minTouchTargetSize: number;        // Tamanho mínimo touch (padrão: 44)
}
```

### Breakpoints Padrão

| Nome | Largura |
|------|---------|
| mobile-small | 320px |
| mobile | 480px |
| tablet | 768px |
| desktop | 1024px |
| desktop-large | 1440px |

## 🛠️ Exemplo de Uso Personalizado

```typescript
import { runResponsiveCheck } from '@/utils/responsiveMonitor';

// Executar verificação com configuração customizada
const issues = runResponsiveCheck({
  enableOverlay: true,
  minContrastRatio: 7, // WCAG AAA
  minTouchTargetSize: 48,
});

// Processar resultados programaticamente
issues.forEach(issue => {
  console.log(`${issue.type}: ${issue.message}`);
});
```

## 📱 Testando Diferentes Viewports

1. Abra o DevTools (F12)
2. Ative o Device Toolbar (Ctrl+Shift+M)
3. Selecione diferentes dispositivos ou dimensões
4. Execute `window.runResponsiveCheck()` em cada viewport
5. Compare os resultados

## ⚠️ Nota Importante

Esta ferramenta é apenas para **desenvolvimento**. Ela é automaticamente desativada em produção (`import.meta.env.DEV`).

## 📝 Changelog

### v1.0.0
- Detecção de overflow horizontal
- Detecção de overflow de texto
- Detecção de tamanhos fixos
- Verificação de imagens responsivas
- Análise de contraste (WCAG)
- Verificação de touch targets
- Overlay visual interativo
- Relatórios agrupados no console
