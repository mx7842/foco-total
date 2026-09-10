// Foco Total — regras do Instagram. O IG não expõe atributos estáveis
// (classes ofuscadas, sem data-testid), então usa sinais combinados
// (PRD 10.2): href estável + posição do rail + dicionário pt/en de
// aria-labels dos SVGs (limitação documentada em docs/MAPEAMENTO_ELEMENTOS.md).
"use strict";

const IG_RAIL_X = 100; // rail de navegação encosta na borda esquerda

function queryAll(root, selector, ctx) {
  return ctx?.all ? ctx.all(selector) : [...root.querySelectorAll(selector)];
}

function railLinks(root, ctx) {
  if (ctx?.railLinks) return ctx.railLinks;
  const links = queryAll(root, 'a[href]', ctx).filter((a) => {
    const r = a.getBoundingClientRect();
    return r.width > 0 && r.left < IG_RAIL_X && a.querySelector("svg, img");
  });
  if (ctx) ctx.railLinks = links;
  return links;
}

// Item de navegação por href estável (rota do IG, independe de idioma).
function navByHref(prefix) {
  return {
    dynamic(root, hide, ctx) {
      for (const a of railLinks(root, ctx)) {
        const href = a.getAttribute("href") || "";
        if (href === prefix || (prefix !== "/" && href.startsWith(prefix))) hide(a);
      }
    },
  };
}

// Item de navegação sem rota própria (href="#"): identifica pelo aria-label
// do SVG. ponytail: dicionário pt/en cobre o MVP; outros idiomas exigem
// novas entradas (limitação documentada).
function navByAria(labels) {
  return {
    dynamic(root, hide, ctx) {
      for (const a of railLinks(root, ctx)) {
        const aria = a.querySelector("svg[aria-label]")?.getAttribute("aria-label");
        if (aria && labels.includes(aria)) hide(a);
      }
    },
  };
}

// Rótulos de post sugerido / bloco de sugestões (pt-BR + en).
const SUGGESTED_POST = /^(Sugerid[oa]s? para você|Sugestões para você|Suggested for you|Suggested posts?)$/;

FocoTotal.init("instagram", {
  // Posts recomendados no feed (contas não seguidas). Conservador: só oculta
  // o article que traz o rótulo explícito de sugestão da própria plataforma.
  paraVoce: {
    dynamic(root, hide, ctx) {
      for (const span of queryAll(root, "article span", ctx)) {
        if (SUGGESTED_POST.test(span.textContent.trim())) {
          const art = span.closest("article");
          if (art) hide(art);
        }
      }
    },
  },

  // Blocos "Sugestões para você" (painel direito e carrossel no feed):
  // âncora estrutural = link "Ver tudo" para /explore/people/.
  // Guardas de segurança: nunca subir para um contêiner que engloba o app
  // (durante o carregamento as alturas ainda são 0 e uma subida sem limite
  // marcaria a raiz, apagando a página inteira).
  sugestoes: {
    dynamic(root, hide, ctx) {
      for (const a of queryAll(root, 'a[href^="/explore/people"]', ctx)) {
        let el = a;
        for (let i = 0; i < 12; i++) {
          const p = el.parentElement;
          if (!p || p === document.body) break;
          if (p.getBoundingClientRect().width > 520) break; // saiu da coluna
          if (p.querySelector("article, nav, main, [role='navigation']")) break;
          el = p;
          if (el.getBoundingClientRect().height >= 250) break;
        }
        const r = el.getBoundingClientRect();
        if (el !== a && r.height >= 150 && r.height <= 620 && r.width <= 520) {
          hide(el);
        }
        // se o bloco ainda não tem layout (altura 0), não faz nada agora;
        // o MutationObserver reavalia quando a página terminar de renderizar
      }
    },
  },

  // Feed inteiro da home: todos os posts, incluindo anúncios e contas
  // seguidas. Escopado à rota "/" para não afetar páginas de post (/p/...)
  // nem perfis.
  feedInteiro: {
    dynamic(root, hide, ctx) {
      if (location.pathname !== "/") return;
      for (const art of queryAll(root, "main article", ctx)) hide(art);
    },
  },

  // Tray de stories no topo do feed. O canvas do anel identifica avatares de
  // story (carrosséis de post usam ul/li mas não têm canvas).
  stories: {
    css: [
      'main div[role="presentation"]:has(li [role="button"] canvas)',
      'main ul:has(li [role="button"] canvas)',
    ],
  },

  // Balão flutuante "Mensagens" (canto inferior direito). Identificação
  // geométrica: elemento fixed no quadrante inferior-direito com ícone SVG.
  balaoMensagens: {
    dynamic(root, hide, ctx) {
      for (const svg of queryAll(root, "svg[aria-label]", ctx)) {
        let n = svg.parentElement;
        for (let hops = 0; n && n !== document.body && hops < 8; hops++) {
          if (getComputedStyle(n).position === "fixed") {
            const r = n.getBoundingClientRect();
            if (r.top > innerHeight * 0.6 && r.left > innerWidth * 0.5 && r.height < 150) {
              hide(n);
            }
            break;
          }
          n = n.parentElement;
        }
      }
    },
  },

  // Bloco de perfil + "Trocar" no topo do painel direito.
  // ponytail: dicionário pt/en do rótulo do botão (limitação documentada).
  painelPerfil: {
    dynamic(root, hide, ctx) {
      for (const b of queryAll(root, "button, [role='button']", ctx)) {
        const t = b.textContent.trim();
        if (t !== "Trocar" && t !== "Switch") continue;
        let n = b;
        for (let hops = 0; n && n.getBoundingClientRect().width < 250 && hops < 8; hops++) {
          n = n.parentElement;
        }
        if (n && n !== document.body) {
          const r = n.getBoundingClientRect();
          if (r.width <= 520 && r.height <= 120) hide(n);
        }
      }
    },
  },

  // Links institucionais (Sobre, Ajuda, © Meta): bloco do painel direito e
  // rodapé da página.
  rodape: {
    css: ["footer"],
    dynamic(root, hide, ctx) {
      for (const a of queryAll(root, 'a[href*="about.instagram"], a[href*="help.instagram"]', ctx)) {
        let n = a;
        for (let hops = 0; n && hops < 8 && !/instagram from meta/i.test(n.textContent); hops++) {
          n = n.parentElement;
        }
        if (n && n !== document.body && n.getBoundingClientRect().width <= 400 &&
            !n.querySelector("img, article")) {
          hide(n);
        }
      }
    },
  },

  // Logotipo do Instagram no rail (aria "Instagram" é a marca, não localiza).
  logo: {
    css: ['a[href="/"]:has(svg[aria-label="Instagram"])'],
  },

  // ===== Menu lateral (rail esquerdo) =====
  // Home: link "/" com SVG que não é o logotipo (aria "Instagram" é marca,
  // não localizada).
  navHome: {
    dynamic(root, hide, ctx) {
      for (const a of railLinks(root, ctx)) {
        if (a.getAttribute("href") !== "/") continue;
        const aria = a.querySelector("svg")?.getAttribute("aria-label");
        if (aria && aria !== "Instagram") hide(a);
      }
    },
  },
  navReels: navByHref("/reels/"),
  navMensagens: navByHref("/direct/"),
  navPesquisa: {
    dynamic(root, hide, ctx) {
      for (const a of railLinks(root, ctx)) {
        const href = a.getAttribute("href") || "";
        const aria = a.querySelector("svg[aria-label]")?.getAttribute("aria-label");
        if (href.startsWith("/explore") || ["Pesquisa", "Search"].includes(aria)) hide(a);
      }
    },
  },
  navNotificacoes: navByAria(["Notificações", "Notifications"]),
  navCriar: navByAria(["Novo post", "Nova publicação", "New post", "Create"]),
  // Perfil: link do rail com avatar (img) em vez de ícone SVG.
  navPerfil: {
    dynamic(root, hide, ctx) {
      for (const a of railLinks(root, ctx)) {
        const href = a.getAttribute("href") || "";
        if (/^\/[^/]+\/$/.test(href) && a.querySelector("img") &&
            !/^\/(reels|direct|explore|stories|accounts)\//.test(href)) {
          hide(a);
        }
      }
    },
  },
  navMais: navByAria(["Configurações", "Mais", "Settings", "More"]),
  navMeta: navByAria(["Também da Meta", "Also from Meta"]),
});
