// Foco Total — regras do Facebook.
// Os sinais principais são roles/aria e hrefs confirmados na home autenticada.
"use strict";

const FB_NAV = 'div[role="navigation"][aria-label="Facebook"]';
const FB_ACCOUNT = 'div[role="navigation"][aria-label="Configurações e controles da conta"]';
const FB_SHORTCUTS = 'div[role="navigation"][aria-label="Atalhos"]';
const FB_POST_HIDE = 'a[aria-label^="Ocultar post de"], a[aria-label^="Hide post from"]';
const FB_POST_ACTIONS = '[aria-label^="Ações para este post"], [aria-label^="Actions for this post"]';
const FB_SPONSORED_ACTIONS = '[aria-label^="Abrir menu do conteúdo patrocinado"], [aria-label^="Open menu for sponsored content"]';
const FB_STORY_LINKS = 'a[href*="/stories/"], a[aria-label*="story" i], a[aria-label*="história" i]';
const FB_STORY_TRAY = 'main table[aria-label*="story" i], [role="main"] table[aria-label*="story" i], main table[aria-label*="história" i], [role="main"] table[aria-label*="história" i], main [role="table"][aria-label*="story" i], [role="main"] [role="table"][aria-label*="story" i], main [role="table"][aria-label*="história" i], [role="main"] [role="table"][aria-label*="história" i]';
const FB_COMPOSER_REGION = 'main [role="region"][aria-label="Criar um post"], [role="main"] [role="region"][aria-label="Criar um post"], main [role="region"][aria-label="Create a post"], [role="main"] [role="region"][aria-label="Create a post"], main [aria-label="Criar um post"], [role="main"] [aria-label="Criar um post"], main [aria-label="Create a post"], [role="main"] [aria-label="Create a post"]';
const FB_HOME_MARKER = 'main button[aria-label^="No que você está pensando"], [role="main"] button[aria-label^="No que você está pensando"], main [role="button"][aria-label^="No que você está pensando"], [role="main"] [role="button"][aria-label^="No que você está pensando"], main button[aria-label^="What\'s on your mind"], [role="main"] button[aria-label^="What\'s on your mind"], main [role="button"][aria-label^="What\'s on your mind"], [role="main"] [role="button"][aria-label^="What\'s on your mind"], main [role="region"][aria-label="Criar um post"], [role="main"] [role="region"][aria-label="Criar um post"], main [role="region"][aria-label="Create a post"], [role="main"] [role="region"][aria-label="Create a post"]';
const FB_PROFILE_TABS = {
  perfilAbaTudo: /^Tudo$|^Posts$|^All$/i,
  perfilAbaSobre: /^Sobre$|^About$/i,
  perfilAbaAmigos: /^Amigos$|^Friends$/i,
  perfilAbaFotos: /^Fotos$|^Photos$/i,
  perfilAbaReels: /^Reels$/i,
  perfilAbaMais: /^Mais(?:\s|$)|^More(?:\s|$)/i,
};
const FB_ACCOUNT_ACTIONS = {
  contaMenu: /Menu do Facebook|Facebook menu|^Menu$/i,
  contaMessenger: /^Messenger$|^Mensagens$|^Messages$/i,
  contaNotificacoes: /Notifica|Notification/i,
};
const FB_RESERVED_ROUTES = new Set([
  "home", "friends", "groups", "reel", "reels", "watch", "marketplace", "events",
  "gaming", "messages", "notifications", "settings", "privacy", "help", "bookmarks",
  "saved", "feeds", "ads", "adsmanager", "business", "search", "photo", "photos",
]);

function all(root, selector, ctx) {
  if (ctx?.root === root && ctx.all) return ctx.all(selector);
  return [...(root.querySelectorAll?.(selector) || [])];
}

function visible(element) {
  if (!element || !element.isConnected) return false;
  const box = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return box.width > 0 && box.height > 0 && style.display !== "none" && style.visibility !== "hidden";
}

function rect(element) {
  return element?.getBoundingClientRect?.() || { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
}

function labelOf(element) {
  return [element?.getAttribute?.("aria-label"), element?.textContent]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function accessibleContent(element) {
  const labels = [...(element?.querySelectorAll?.("[aria-label], button") || [])]
    .map(labelOf)
    .filter(Boolean)
    .join(" ");
  return `${element?.textContent || ""} ${labels}`.replace(/\s+/g, " ").trim();
}

function isPageRoot(element) {
  return !element || element.matches?.("html, body, main, [role=main]");
}

function mainScope(root, ctx) {
  return ctx?.one?.("main") || root.closest?.("main, [role=main]") || root.querySelector?.("main, [role=main]") || root;
}

function shortcutNav(root, ctx) {
  return ctx?.one?.(FB_SHORTCUTS) || root.closest?.(FB_SHORTCUTS) || root.querySelector?.(FB_SHORTCUTS);
}

function boundedAncestor(start, predicate, maxHops = 12) {
  let node = start;
  for (let hops = 0; node && node.parentElement && hops < maxHops; hops++) {
    node = node.parentElement;
    if (isPageRoot(node)) break;
    const box = rect(node);
    if (predicate(node, box)) return node;
  }
  return null;
}

function postContainer(anchor, actionSelector = FB_POST_ACTIONS, requireHideLink = true) {
  return boundedAncestor(anchor, (node, box) => {
    const actions = node.matches?.(actionSelector) || node.querySelector?.(actionSelector);
    const ownHideLinks = node.querySelectorAll?.(FB_POST_HIDE).length || 0;
    const hasMain = node.matches?.("main, [role=main]") || node.querySelector?.(":scope > main, :scope > [role=main]");
    return actions && (!requireHideLink || ownHideLinks === 1) && !hasMain &&
      box.width >= 450 && box.width <= 900 && box.height >= 160 && box.height <= 5000;
  });
}

function hidePosts(root, hide, selector, ctx, actionSelector = FB_POST_ACTIONS, requireHideLink = true) {
  for (const anchor of all(root, selector, ctx)) {
    const post = postContainer(anchor, actionSelector, requireHideLink);
    if (post && visible(post)) hide(post);
  }
}

function findComposer(root, ctx) {
  const scope = mainScope(root, ctx);
  const regions = all(scope, FB_COMPOSER_REGION, ctx);
  if (regions.length) return regions;
  const buttons = all(scope, 'button, [role="button"]', ctx).filter((button) =>
    /No que você está pensando|What's on your mind/i.test(labelOf(button))
  );
  const result = [];
  for (const button of buttons) {
    const content = accessibleContent(button.parentElement || button);
    const candidate = boundedAncestor(button, (node, box) =>
      box.width >= 450 && box.width <= 1000 && box.height >= 55 && box.height <= 220 &&
      /Vídeo ao vivo|Live video/i.test(accessibleContent(node) || content) &&
      /Foto\/vídeo|Photo\/video/i.test(accessibleContent(node) || content)
    );
    if (candidate && !result.includes(candidate)) result.push(candidate);
  }
  return result;
}

function findStories(root, ctx) {
  const scope = mainScope(root, ctx);
  const result = [];
  const starts = [...all(scope, FB_STORY_LINKS, ctx), ...all(scope, FB_STORY_TRAY, ctx)];
  for (const start of starts) {
    const candidate = boundedAncestor(start, (node, box) => {
      const links = node.querySelectorAll?.(FB_STORY_LINKS).length || 0;
      const text = (node.textContent || "").slice(0, 1800);
      const hasCreate = /Criar story|Create story/i.test(text);
      const hasComposer = /No que você está pensando|What's on your mind/i.test(text);
      return !hasComposer && links >= 1 && (hasCreate || links >= 3) &&
        box.width >= 450 && box.width <= 1100 && box.height >= 60 && box.height <= 420;
    });
    if (candidate && !result.includes(candidate)) result.push(candidate);
  }
  return result;
}

function findGroupSuggestions(root, ctx) {
  const scope = mainScope(root, ctx);
  const headings = all(scope, 'h1, h2, h3, [role="heading"], span, div', ctx)
    .filter((element) => /^Suas sugestões de grupos$|^Group suggestions$/i.test(labelOf(element)));
  const result = [];
  for (const heading of headings) {
    const candidate = boundedAncestor(heading, (node, box) => {
      const text = node.textContent || "";
      const cards = node.querySelectorAll?.('button, a').length || 0;
      return /Participar do grupo|Join group/i.test(text) && /Remover|Remove/i.test(text) && cards >= 2 &&
        box.width >= 450 && box.width <= 1200 && box.height >= 220 && box.height <= 900;
    });
    if (candidate && !result.includes(candidate)) result.push(candidate);
  }
  return result;
}

function isProfilePage() {
  const path = decodeURIComponent(location.pathname).replace(/^\/+|\/+$/g, "");
  if (path === "profile.php") return true;
  if (!path || path.includes("/")) return false;
  return !FB_RESERVED_ROUTES.has(path.toLowerCase());
}

function profileScope(root, ctx) {
  if (!isProfilePage()) return null;
  return mainScope(root, ctx);
}

function profileSection(root, ctx, headingPattern, contentPattern, options = {}) {
  const scope = profileScope(root, ctx);
  if (!scope) return [];
  const headings = all(scope, 'h1, h2, h3, [role="heading"], span, div', ctx)
    .filter((element) => headingPattern.test(labelOf(element)));
  const result = [];
  for (const heading of headings) {
    const candidate = boundedAncestor(heading, (node, box) => {
      const text = (node.textContent || "").slice(0, 2400);
      const links = node.querySelectorAll?.("a").length || 0;
      const images = node.querySelectorAll?.("img").length || 0;
      return contentPattern.test(text) && links >= (options.minLinks || 1) &&
        images >= (options.minImages || 0) &&
        box.width >= (options.minWidth || 380) && box.width <= (options.maxWidth || 1300) &&
        box.height >= (options.minHeight || 100) && box.height <= (options.maxHeight || 900) &&
        !node.matches?.("main, [role=main]");
    }, options.maxHops || 14);
    if (candidate && !result.includes(candidate)) result.push(candidate);
  }
  return result;
}

function findProfileBlocks(root, ctx) {
  return [
    ...profileSection(root, ctx, /^Pessoas que talvez você conheça$|^People you may know$/i,
      /Adicionar aos amigos|Add friend|Ver tudo|See all/i, { minLinks: 2, minImages: 2, minHeight: 180, maxHeight: 520 }),
    ...profileSection(root, ctx, /^Amigos$|^Friends$/i,
      /Ver todos os amigos|See all friends|\d+\s+amigos|\d+\s+friends/i, { minLinks: 2, minImages: 2, minHeight: 120, maxHeight: 520 }),
    ...profileSection(root, ctx, /^Fotos$|^Photos$/i,
      /Ver todas as fotos|See all photos/i, { minLinks: 1, minImages: 3, minHeight: 160, maxHeight: 800 }),
  ].filter((element, index, list) => list.indexOf(element) === index);
}

function profileTabRow(scope, ctx) {
  const controls = all(scope, 'a, button, [role="tab"], [role="button"]', ctx)
    .filter((element) => Object.values(FB_PROFILE_TABS).some((pattern) => pattern.test(labelOf(element))));
  if (controls.length < 2) return null;
  const first = controls[0];
  return boundedAncestor(first, (node, box) => {
    const matches = [...(node.querySelectorAll?.('a, button, [role="tab"], [role="button"]') || [])]
      .filter((element) => Object.values(FB_PROFILE_TABS).some((pattern) => pattern.test(labelOf(element))));
    return matches.length >= 2 && box.width >= 350 && box.width <= 1200 && box.height >= 32 && box.height <= 120;
  }, 8) || null;
}

function findProfileTabs(root, ctx, key) {
  const scope = profileScope(root, ctx);
  if (!scope) return [];
  const row = profileTabRow(scope, ctx);
  if (!row) return [];
  return [...(row.querySelectorAll?.('a, button, [role="tab"], [role="button"]') || [])]
    .filter((element) => FB_PROFILE_TABS[key]?.test(labelOf(element)));
}

function accountNav(root, ctx) {
  return ctx?.one?.(FB_ACCOUNT) || root.matches?.(FB_ACCOUNT) || root.closest?.(FB_ACCOUNT) || root.querySelector?.(FB_ACCOUNT);
}

function accountControls(root, ctx) {
  const nav = accountNav(root, ctx);
  if (!nav) return [];
  return [...(nav.querySelectorAll?.('a, button, [role="button"]') || [])]
    .filter((element) => {
      const box = rect(element);
      return box.width >= 28 && box.width <= 100 && box.height >= 28 && box.height <= 100;
    });
}

function findAccountAction(root, ctx, key) {
  const controls = accountControls(root, ctx);
  if (key === "contaPerfil") {
    const labeled = controls.filter((element) => {
      const label = labelOf(element);
      return /Conta|Account|Perfil|Profile/i.test(label) ||
        (element.querySelector?.("img, [role=img]") && !/Messenger|Notifica|Menu/i.test(label));
    });
    return labeled.length ? [labeled[labeled.length - 1]] : controls.slice(-1);
  }
  const pattern = FB_ACCOUNT_ACTIONS[key];
  return controls.filter((element) => pattern?.test(labelOf(element)));
}

function findSkeletons(root, ctx) {
  const scope = mainScope(root, ctx);
  const candidates = [
    ...all(scope, '[aria-busy="true"], [aria-label*="Carregando"], [aria-label*="Loading"]', ctx),
    ...all(scope, "span, div", ctx).filter((element) => /^Carregando\.\.\.$|^Loading\.\.\.$/i.test(labelOf(element))),
  ];
  const result = [];
  for (const start of candidates) {
    const candidate = boundedAncestor(start, (node, box) => {
      const text = (node.textContent || "").slice(0, 1200);
      const excluded = /No que você está pensando|What's on your mind|Criar story|Create story|Suas sugestões de grupos|Group suggestions/i.test(text);
      return !excluded && box.width >= 450 && box.width <= 1000 && box.height >= 120 && box.height <= 5000;
    });
    if (candidate && !result.includes(candidate)) result.push(candidate);
  }
  return result;
}

function shortcutRow(link, nav) {
  const row = boundedAncestor(link, (node, box) => {
    if (!nav.contains(node)) return false;
    const links = [...(node.querySelectorAll?.("a") || [])];
    return links.length === 1 && links[0] === link &&
      box.width >= 180 && box.width <= 420 && box.height >= 28 && box.height <= 100;
  }, 8);
  return row || link;
}

const SHORTCUT_MATCHERS = {
  menuPerfil: { first: true },
  menuMetaAi: { text: /Meta AI/i, href: /meta\.ai/i },
  menuAmigos: { text: /^Amigos$|^Friends$/i, href: /\/friends\//i },
  menuLembrancas: { text: /^Lembranças$|^Memories$/i, href: /onthisday/i },
  menuSalvos: { text: /^Salvos$|^Saved$/i, href: /\/saved\//i },
  menuGrupos: { text: /^Grupos$|^Groups$/i, href: /\/groups\//i },
  menuReels: { text: /^Reels$/i, href: /\/reel\//i },
  menuMarketplace: { text: /^Marketplace$/i, href: /marketplace/i },
  menuFeeds: { text: /^Feeds$|^Feed$/i, href: /\/feeds?\//i },
  menuEventos: { text: /^Eventos$|^Events$/i, href: /\/events\/(?:\?|$)/i },
  menuAnuncios: { text: /Gerenciador de Anúncios|Ads Manager/i, href: /adsmanager|business\.facebook/i },
  menuAniversarios: { text: /^Aniversários$|^Birthdays$/i, href: /birthdays/i },
  menuJogar: { text: /^Jogar$|^Gaming$/i, href: /\/gaming\//i },
  menuMessenger: { text: /^Messenger$/i, href: /\/messages\//i },
  menuMessengerKids: { text: /Messenger Kids/i, href: /messenger.?kids/i },
  menuConverseIAs: { text: /^Converse com IAs$|^Chat with AIs$|^Chat with AI$/i, href: /(?:^|\/)ai(?:\/|$)/i },
  menuPaginas: { text: /^Páginas$|^Pages$/i, href: /(?:^|\/)pages?(?:\/|$)/i },
  menuPedidosPagamentos: { text: /^Pedidos e pagamentos$|^Orders and payments$/i, href: /orders|payments/i },
  menuAtividadeAnuncios: { text: /^Sua atividade de anúncios$|^Your ad activity$/i, href: /ad.?activity|ads?.?activity/i },
  menuVideoJogos: { text: /^Vídeo de jogos$|^Gaming video$/i, href: /gaming.*video|video.*gaming/i },
};

const SHORTCUT_CONTROL_MATCHERS = {
  menuVerMais: /^Ver mais(?:\s|$)|^See more(?:\s|$)/i,
  menuVerMenos: /^Ver menos(?:\s|$)|^See less(?:\s|$)/i,
};

function shortcutLinks(nav, matcher) {
  const links = [...(nav?.querySelectorAll?.("a") || [])];
  if (matcher.first) return links.slice(0, 1);
  return links.filter((link) => {
    const text = labelOf(link);
    const href = link.getAttribute("href") || "";
    return matcher.text?.test(text) || matcher.href?.test(href);
  });
}

function shortcutRule(key) {
  return {
    dynamic(root, hide, ctx) {
      const nav = shortcutNav(root, ctx);
      for (const link of shortcutLinks(nav, SHORTCUT_MATCHERS[key])) {
        const row = shortcutRow(link, nav);
        if (visible(row)) hide(row);
      }
    },
  };
}

function shortcutControlRule(key) {
  return {
    dynamic(root, hide, ctx) {
      const nav = shortcutNav(root, ctx);
      if (!nav) return;
      const pattern = SHORTCUT_CONTROL_MATCHERS[key];
      for (const control of [...(nav.querySelectorAll?.('button, [role="button"]') || [])]) {
        if (!pattern?.test(labelOf(control))) continue;
        const row = boundedAncestor(control, (node, box) => {
          if (!nav.contains(node)) return false;
          const controls = [...(node.querySelectorAll?.('button, [role="button"]') || [])];
          return controls.length === 1 && controls[0] === control &&
            box.width >= 180 && box.width <= 420 && box.height >= 28 && box.height <= 100;
        }, 8) || control;
        if (visible(row)) hide(row);
      }
    },
  };
}

function findSearch(root, ctx) {
  const inputs = all(root, 'input[aria-label="Pesquisar no Facebook"], input[aria-label="Search Facebook"]', ctx);
  const result = [];
  for (const input of inputs) {
    const candidate = boundedAncestor(input, (node, box) => {
      const hasInput = node.querySelector?.('input[aria-label="Pesquisar no Facebook"], input[aria-label="Search Facebook"]');
      return hasInput && box.width >= 180 && box.width <= 420 && box.height >= 28 && box.height <= 80;
    }, 6);
    const target = candidate || input;
    if (!result.includes(target)) result.push(target);
  }
  return result;
}

function findFloatingAction(root, ctx) {
  const candidates = all(root, 'button, a, [role="button"]', ctx);
  const result = [];
  for (const element of candidates) {
    const box = rect(element);
    const style = getComputedStyle(element);
    const label = labelOf(element);
    const semantic = /Criar|Escrever|Publicar|Nova mensagem|New message|Create|Compose|Write|Post/i.test(label);
    const lowerRight = box.right >= window.innerWidth - 150 && box.bottom >= window.innerHeight - 150;
    const circular = box.width >= 32 && box.width <= 90 && Math.abs(box.width - box.height) <= 12;
    const floating = style.position === "fixed" || style.position === "absolute" || style.position === "sticky";
    const explicitMessageButton = /Nova mensagem|New message/i.test(label);
    if ((floating || explicitMessageButton) && lowerRight && circular && semantic && visible(element)) result.push(element);
  }
  return result;
}

function hideFound(root, hide, finder, ctx) {
  for (const element of finder(root, ctx)) {
    if (visible(element)) hide(element);
  }
}

FocoTotal.init("facebook", {
  barraPostagem: {
    dynamic(root, hide, ctx) {
      hideFound(root, hide, findComposer, ctx);
    },
  },

  feedInteiro: {
    extraCss: `
      html:has(${FB_HOME_MARKER}), body:has(${FB_HOME_MARKER}) {
        overflow: hidden !important;
        overscroll-behavior: none !important;
      }
    `,
    dynamic(root, hide, ctx) {
      if (location.pathname !== "/") return;
      hidePosts(root, hide, FB_POST_ACTIONS, ctx, FB_POST_ACTIONS, false);
    },
  },

  stories: {
    css: [FB_STORY_TRAY],
    dynamic(root, hide, ctx) {
      hideFound(root, hide, findStories, ctx);
    },
  },

  sugestoesGrupos: {
    dynamic(root, hide, ctx) {
      hideFound(root, hide, findGroupSuggestions, ctx);
    },
  },

  carregamentoFeed: {
    dynamic(root, hide, ctx) {
      hideFound(root, hide, findSkeletons, ctx);
    },
  },

  patrocinados: {
    css: ['#right_rail_container[role="complementary"]'],
    dynamic(root, hide, ctx) {
      if (location.pathname !== "/") return;
      for (const element of all(root, '[aria-label*="Patrocinado"], [aria-label*="Sponsored"]', ctx)) {
        const post = postContainer(element, `${FB_POST_ACTIONS}, ${FB_SPONSORED_ACTIONS}`, false);
        if (post && visible(post)) hide(post);
      }
      const scope = mainScope(root, ctx);
      for (const element of scope.querySelectorAll?.("span, div") || []) {
        if (element.children.length > 0 || !/^(Patrocinado|Sponsored)$/i.test(labelOf(element))) continue;
        const post = postContainer(element, `${FB_POST_ACTIONS}, ${FB_SPONSORED_ACTIONS}`, false);
        if (post && visible(post)) hide(post);
      }
    },
  },

  acoesConta: { css: [FB_ACCOUNT] },

  perfilSugestoesAmigosFotos: {
    dynamic(root, hide, ctx) {
      for (const element of findProfileBlocks(root, ctx)) {
        if (visible(element)) hide(element);
      }
    },
  },

  ...Object.fromEntries(Object.keys(FB_PROFILE_TABS).map((key) => [key, {
    dynamic(root, hide, ctx) {
      for (const element of findProfileTabs(root, ctx, key)) {
        if (visible(element)) hide(element);
      }
    },
  }])),

  ...Object.fromEntries(Object.keys(FB_ACCOUNT_ACTIONS).concat("contaPerfil").map((key) => [key, {
    dynamic(root, hide, ctx) {
      for (const element of findAccountAction(root, ctx, key)) {
        if (visible(element)) hide(element);
      }
    },
  }])),

  navHome: { css: [`${FB_NAV} a[href="/"]`] },
  navReels: { css: [`${FB_NAV} a[href^="/reel/"]`] },
  navAmigos: { css: [`${FB_NAV} a[href^="/friends/"]`] },
  navGrupos: { css: [`${FB_NAV} a[href^="/groups/"]`] },
  navMarketplace: { css: [`${FB_NAV} a[href^="/marketplace/"]`, `${FB_NAV} a[href="/marketplace"]`] },
  navJogos: { css: [`${FB_NAV} a[href^="/gaming/"]`] },

  ...Object.fromEntries(Object.keys(SHORTCUT_MATCHERS).map((key) => [key, shortcutRule(key)])),
  ...Object.fromEntries(Object.keys(SHORTCUT_CONTROL_MATCHERS).map((key) => [key, shortcutControlRule(key)])),

  menuTodos: { css: [FB_SHORTCUTS] },

  buscaFacebook: {
    dynamic(root, hide, ctx) {
      hideFound(root, hide, findSearch, ctx);
    },
  },

  acaoFlutuante: {
    dynamic(root, hide, ctx) {
      hideFound(root, hide, findFloatingAction, ctx);
    },
  },

  rodape: {
    css: [
      `${FB_SHORTCUTS} footer[role="contentinfo"]`,
      'footer[role="contentinfo"][aria-label="Facebook"]',
    ],
  },
});
