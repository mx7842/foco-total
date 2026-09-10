// Foco Total — regras do YouTube. Lista de controles organizada a partir da
// extensão Unhook (referência funcional, sem copiar identidade visual —
// PRD §15), mapeada para os custom elements reais do YouTube (tags
// `ytd-*`/`ytp-*`, muito mais estáveis que classes ofuscadas).
"use strict";

// Guia lateral: seções em ordem estrutural fixa e independente de idioma
// (0=Home/Shorts, 1=Assinaturas, 2=Você, 3=Explorar, 4=Mais do YouTube,
// 5=Denúncias). Usar índice em vez do texto do título evita depender de
// tradução.
const guideSection = (i) =>
  `#guide-content ytd-guide-section-renderer:nth-of-type(${i + 1})`;
// Dentro de cada seção "simples" (0,1,3,4,5), o cabeçalho e os itens são
// irmãos diretos dentro de um único div#items — nth-child (não nth-of-type,
// pois há tags diferentes misturadas) dá a posição real na lista.
const guideItems = (i) => `${guideSection(i)} #items`;
// A seção "Você" (índice 2) usa um template diferente: um
// ytd-guide-collapsible-section-entry-renderer aninhado, com o rótulo em
// #header e os 7 itens em #section-items — não tem o mesmo formato de #items.
const youItems = `${guideSection(2)} #section-items`;

// O YouTube tem DOIS menus laterais possíveis — o expandido (com nomes,
// ytd-guide-renderer, mapeado acima) e o compacto/só ícones
// (ytd-mini-guide-renderer, 4 itens fixos: Início, Shorts, Inscrições,
// Você) — e alterna entre eles conforme o usuário clica no ☰ ou a janela
// muda de tamanho. Os controles abaixo casam os dois ao mesmo tempo por
// href (estável, independente de idioma), para funcionar não importa qual
// versão o YouTube estiver mostrando no momento.
const miniEntry = (href) => `ytd-mini-guide-entry-renderer:has(a[href="${href}"])`;

FocoTotal.init("youtube", {
  // ===== Feed inicial =====
  paraVoce: {
    dynamic(root, hide) {
      if (location.pathname === "/") {
        const grid = root.querySelector("ytd-rich-grid-renderer");
        if (grid) hide(grid.closest("ytd-browse") || grid);
      }
    },
  },
  redirecionarInscricoes: {
    observe: false,
    dynamic() {
      if (location.pathname === "/" && !location.pathname.startsWith("/feed")) {
        location.assign("/feed/subscriptions");
      }
    },
  },

  // ===== Barra lateral do vídeo (página /watch) =====
  barraLateralVideo: { css: ["#secondary"] }, // contêiner-pai
  recomendados: { css: ["ytd-watch-next-secondary-results-renderer #items"] },
  chatAoVivo: { css: ["ytd-live-chat-frame", "#chat"] },
  playlist: { css: ["ytd-playlist-panel-renderer"] },
  // ponytail: seletor de fundraiser não pôde ser validado ao vivo (nenhuma
  // live com arrecadação disponível na inspeção); mantido best-effort.
  arrecadacao: { css: ["ytd-donation-shelf-renderer"] },

  // ===== Player =====
  telaFinalFeed: {
    // O YouTube alterna entre a tela final clássica e a grade moderna em
    // tela cheia. Os seletores internos mantêm fallback para ambos os DOMs.
    css: [
      ".html5-endscreen",
      ".ytp-endscreen-content",
      ".ytp-videowall-still",
      ".ytp-fullscreen-grid",
      ".ytp-modern-videowall-still",
    ],
  },
  telaFinalCards: { css: [".ytp-ce-element"] },

  // ===== Conteúdo =====
  shorts: {
    // seletores adicionais herdados da Unhook (cobrem grade de shorts em
    // /shorts, cards de resultado de busca e prateleiras do canal).
    css: [
      `${guideItems(0)} > *:nth-child(2)`,
      "ytd-reel-shelf-renderer",
      "ytd-rich-shelf-renderer[is-shorts]",
      "ytd-rich-grid-renderer[is-shorts-grid]",
      "ytd-rich-item-renderer:has(a[href*='/shorts/'])",
      "ytd-video-renderer:has(a[href*='/shorts/'])",
      "ytd-compact-video-renderer:has(a[href*='/shorts/'])",
      miniEntry("/shorts/"),
    ],
  },
  // A busca atual usa componentes `yt-*` novos em vez de
  // ytd-reel-shelf-renderer. O grid contém título, cards e "Mostrar mais";
  // não subir ao ytd-item-section-renderer, que também contém o canal.
  shortsBusca: {
    css: ["ytd-search grid-shelf-view-model:has(a[href^='/shorts/'])"],
  },
  // Nas páginas de canal as abas são renderizadas sem href no host. A ordem
  // Home, Vídeos, Shorts é estrutural e foi confirmada ao vivo.
  abaShortsCanal: {
    css: ["ytd-tabbed-page-header #tabs [role='tab']:nth-child(3)"],
  },
  comentarios: { css: ["ytd-comments#comments", "#comments"] },
  // Fotos de perfil nos comentários (item independente, herdado da Unhook).
  // ponytail: seletor legado da Unhook + equivalente moderno como
  // fallback; não validado ao vivo (comentários não terminaram de carregar
  // na inspeção — ver LIMITACOES.md).
  fotosPerfilComentarios: {
    css: [
      ".ytd-comment-renderer yt-img-shadow",
      "ytd-comment-view-model #author-thumbnail img",
      "ytd-comment-thread-renderer #author-thumbnail img",
    ],
  },
  mixes: {
    css: [
      "ytd-radio-renderer",
      "ytd-compact-radio-renderer",
      "a[href*='start_radio=1']",
      "ytd-rich-item-renderer:has(a[href*='start_radio=1'])",
    ],
  },
  merchTicketsOfertas: {
    css: [
      "ytd-merch-shelf-renderer",
      "ytd-ticket-shelf-renderer",
      "#offer-module",
      "#clarify-box",
    ],
  },
  // Extra: prateleiras adicionais na página de busca (cartões "Pessoas
  // também assistiram" etc.) — herdado da Unhook, não é classificação de
  // conteúdo, apenas prateleiras de descoberta na busca.
  resultadosBuscaExtras: {
    css: [
      "#primary > .ytd-two-column-search-results-renderer ytd-horizontal-card-list-renderer",
      "#primary > .ytd-two-column-search-results-renderer ytd-shelf-renderer",
    ],
  },

  // ===== Informações do vídeo (contêiner + itens) =====
  infoVideo: { css: ["ytd-watch-metadata"] }, // contêiner-pai
  barraBotoesVideo: { css: ["#actions.ytd-watch-metadata", "#info > #menu-container"] },
  donoCanalVideo: { css: ["#owner.ytd-watch-metadata", "#top-row.ytd-video-secondary-info-renderer"] },
  descricaoVideo: { css: ["#description.ytd-watch-metadata", "ytd-expander.ytd-video-secondary-info-renderer"] },

  // ===== Cabeçalho (contêiner + ícones individuais) =====
  cabecalho: { css: ["#masthead-container", "ytd-masthead"] }, // contêiner-pai
  navHamburguer: { css: ["#guide-button", "tp-yt-paper-icon-button#guide-button"] },
  buscaBarra: { css: ["yt-searchbox"] },
  buscaVoz: { css: ["#voice-search-button"] },
  navCriar: { css: ["#end #buttons > ytd-button-renderer"] },
  notificacoes: { css: ["ytd-notification-topbar-button-renderer"] },
  avatarConta: { css: ["#avatar-btn"] },

  // ===== Menu lateral (guia) — contêiner e itens individuais =====
  // O CSS do YouTube reserva a largura da coluna (margin-left: 240px em
  // #page-manager) via atributo em <ytd-app>, independente de o contêiner
  // do menu estar oculto — sem resetar isso, sobra uma faixa vazia.
  menuLateral: {
    css: ["ytd-guide-renderer", "tp-yt-app-drawer#guide", "ytd-mini-guide-renderer"],
    extraCss: "#page-manager, ytd-page-manager { margin-left: 0 !important; }",
  },
  navHome: {
    css: [`${guideItems(0)} > *:nth-child(1)`, miniEntry("/")],
  },
  inscricoesNav: {
    css: [
      miniEntry("/feed/subscriptions"),
      'ytd-guide-entry-renderer:has(a#endpoint[href="/feed/subscriptions"])',
    ],
  },
  // Lista de canais inscritos (todos os itens da seção, exceto o cabeçalho
  // "Inscrições" — esse é o inscricoesNav acima). Só existe no menu
  // expandido — o compacto não lista canais individuais.
  listaCanaisInscritos: {
    css: [`${guideItems(1)} > *:not(:nth-child(1))`],
  },
  // Seção "Você" inteira (contêiner-pai dos itens abaixo). No menu
  // compacto isso é só um ícone único (sem os subitens).
  secaoVoce: {
    css: [`${guideSection(2)} ytd-guide-collapsible-section-entry-renderer`, miniEntry("/feed/you")],
  },
  navCanal: {
    // "Seu canal" tem href único por conta; identifica-se pela posição.
    css: [`${youItems} > *:nth-child(1)`],
  },
  navHistorico: {
    css: ['ytd-guide-entry-renderer:has(a#endpoint[href="/feed/history"])'],
  },
  navPlaylists: {
    css: ['ytd-guide-entry-renderer:has(a#endpoint[href="/feed/playlists"])'],
  },
  navAssistirDepois: {
    css: ['ytd-guide-entry-renderer:has(a#endpoint[href="/playlist?list=WL"])'],
  },
  navCurtidos: {
    css: ['ytd-guide-entry-renderer:has(a#endpoint[href="/playlist?list=LL"])'],
  },
  navSeusVideos: {
    css: ['ytd-guide-entry-renderer:has(a#endpoint[href^="https://studio.youtube.com"])'],
  },
  navDownloads: {
    css: ['ytd-guide-entry-renderer:has(a#endpoint[href="/feed/downloads"])'],
  },
  navDenuncias: { css: [guideSection(5)] },

  // ===== Navegação / descoberta =====
  explorarTendencias: { css: [guideSection(3)] },
  maisDoYoutube: { css: [guideSection(4)] },
  rodapeMenu: { css: ["div#footer.ytd-guide-renderer", "#guide-content div#footer"] },

  // ===== Player: comportamento =====
  // Desativa o autoplay clicando no toggle só quando ele estiver ligado
  // (idempotente — não fica clicando repetidamente).
  desativarAutoplay: {
    dynamic(root) {
      const btn = root.querySelector(".ytp-autonav-toggle-button-container");
      if (btn && btn.getAttribute("aria-checked") === "true") btn.click();
    },
  },
});
