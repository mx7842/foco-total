// Foco Total — regras do TikTok, definidas pelo inventário da inspeção ao
// vivo (docs/MAPEAMENTO_ELEMENTOS.md). Estratégia: data-e2e (estável) e
// sufixos de componente ([class*="--Componente"]) quando não há data-e2e.
"use strict";

// Linha da navegação lateral que contém o item data-e2e indicado
// (os wrappers variam entre h2 e div conforme o item).
const navRow = (e2e) => `[class*="DivMainNavContainer"] > *:has([data-e2e="${e2e}"])`;

FocoTotal.init("tiktok", {
  // ===== Feed principal =====
  // Oculta o item "Para você" e, se o feed FY estiver aberto, troca para
  // "Seguindo" (preserva a alternativa de contas seguidas — PRD 9.3.2 — e
  // evita página quebrada — PRD 9.3.4).
  paraVoce: {
    css: [navRow("nav-foryou")],
    observe: false,
    dynamic(root, hide) {
      const p = location.pathname;
      if (p === "/" || p.startsWith("/foryou")) {
        root.querySelector('[data-e2e="nav-following"]')?.click();
      }
    },
  },

  // Cards de sugestão de contas (grade "Seguir" — aparece na página
  // /following e em áreas de descoberta).
  sugestoesContas: {
    css: ['[data-e2e="recommend-card"]'],
  },

  // ===== Navegação / barra lateral =====
  barraLateral: { css: ['[class*="DivSideNavContainer"]'] }, // contêiner-pai
  busca: { css: ['[data-e2e="search-box"]', navRow("nav-search")] },
  explorar: { css: [navRow("nav-explore")] },
  seguindo: { css: [navRow("nav-following")] },
  amigos: { css: [navRow("nav-friends")] },
  live: { css: [navRow("nav-live")] },
  mensagens: { css: [navRow("nav-messages")] },
  atividade: { css: [navRow("nav-activity")] },
  carregar: { css: [navRow("nav-upload")] },
  perfil: { css: [navRow("nav-profile")] },
  mais: { css: [navRow("nav-more-menu")] },
  rodape: {
    css: [
      '[class*="DivSideNavContainer"] [class*="FooterContainer"]',
      '[data-e2e="copyright"]',
    ],
  },

  // ===== Cabeçalho =====
  cabecalho: { css: ['[class*="DivFixedTopContainer"]'] },

  // ===== Interações (coluna de cada vídeo) =====
  botoesInteracao: { css: ['section[class*="SectionActionBarContainer"]'] }, // contêiner-pai
  curtidas: { css: ['button:has([data-e2e="like-icon"])'] },
  comentarios: { css: ['button:has([data-e2e="comment-icon"])'] },
  salvos: { css: ['button:has([data-e2e="favorite-icon"])'] },
  compartilhar: { css: ['button:has([data-e2e="share-icon"])'] },

  // ===== Conteúdo do vídeo =====
  infoCriador: {
    css: [
      '[class*="DivCreatorInfoContainer"]',
      '[class*="DivAvatarActionItemContainer"]',
    ],
  },
  descricao: { css: ['[class*="DivMediaCardDescriptionContainer"]'] },
  musica: { css: ['[data-e2e="video-music"]'] },
});
