// Foco Total — regras do X. Seletores confirmados na inspeção ao vivo
// (docs/MAPEAMENTO_ELEMENTOS.md). Todos independentes de idioma.
"use strict";

FocoTotal.init("x", {
  // Aba "Para você" da home: oculta a aba (primeira do tablist) e, se ela
  // estiver ativa, troca para "Seguindo" — conservador: conteúdo de contas
  // seguidas permanece intocado.
  paraVoce: {
    dynamic(root, hide, ctx) {
      if (location.pathname !== "/home" && location.pathname !== "/") return;
      const scope = ctx?.one('[data-testid="primaryColumn"]') || root;
      const tabs = scope.querySelectorAll('[role="tablist"] [role="tab"]');
      if (tabs.length < 2) return;
      hide(tabs[0].parentElement); // wrapper role="presentation" da aba
      if (tabs[0].getAttribute("aria-selected") === "true") tabs[1].click();
    },
  },
  // Aba "Seguindo" da timeline (2ª aba do tablist da home).
  abaSeguindo: {
    dynamic(root, hide, ctx) {
      if (location.pathname !== "/home" && location.pathname !== "/") return;
      const scope = ctx?.one('[data-testid="primaryColumn"]') || root;
      const tabs = scope.querySelectorAll('[role="tablist"] [role="tab"]');
      if (tabs.length >= 2) hide(tabs[1].parentElement);
    },
  },
  // Menu lateral esquerdo inteiro (navegação principal do X). Com o menu
  // oculto, centraliza o conteúdo (main é flex-column; align-items é o
  // eixo horizontal).
  barraEsquerda: {
    css: ['header[role="banner"]'],
    extraCss: 'main[role="main"] { align-items: center !important; }',
  },
  // Botões flutuantes do canto inferior direito (Grok e Chat).
  flutuantes: {
    css: ['[data-testid="GrokDrawer"]', '[data-testid="chat-drawer-root"]'],
  },
  // Coluna lateral direita inteira (contêiner completo — PRD 9.1.1).
  barraLateral: {
    css: ['[data-testid="sidebarColumn"]'],
  },
  // Submódulos da barra lateral (PRD 9.1.2 — desejáveis, seletores estáveis).
  busca: {
    css: ['[data-testid="sidebarColumn"] form[role="search"]'],
  },
  noticias: {
    css: [
      '[data-testid="sidebarColumn"] [data-testid="news_sidebar"]',
      // pós-reload o X rende os artigos fora do news_sidebar, dentro de um
      // div rotulado (aria-label localizado; casamos pela presença do rótulo)
      '[data-testid="sidebarColumn"] div[aria-label]:has([data-testid^="news_sidebar_article"])',
    ],
  },
  tendencias: {
    css: ['[data-testid="sidebarColumn"] section:has([data-testid="trend"])'],
  },
  premium: {
    css: ['[data-testid="sidebarColumn"] aside:has(a[href^="/i/premium"])'],
  },
  sugestoes: {
    css: ['[data-testid="sidebarColumn"] aside:has([data-testid$="-follow"])'],
  },
});
