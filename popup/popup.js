"use strict";

// Catálogo de controles por plataforma (chaves = regras nos content scripts).
const CATALOG = {
  x: [
    {
      title: "Feed",
      items: [
        { key: "paraVoce", label: 'Ocultar "Para você"' },
        { key: "abaSeguindo", label: 'Ocultar aba "Seguindo"' },
      ],
    },
    {
      title: "Menu lateral esquerdo",
      items: [{ key: "barraEsquerda", label: "Ocultar menu esquerdo inteiro" }],
    },
    {
      title: "Ações flutuantes",
      items: [
        { key: "flutuantes", label: "Ocultar botões flutuantes (Grok/Chat)" },
      ],
    },
    {
      title: "Barra lateral direita",
      items: [
        { key: "barraLateral", label: "Ocultar barra lateral inteira" },
        { key: "busca", label: "Ocultar busca" },
        { key: "noticias", label: "Ocultar notícias" },
        { key: "tendencias", label: "Ocultar tendências" },
        { key: "sugestoes", label: "Ocultar sugestões de perfis" },
        { key: "premium", label: "Ocultar convite Premium" },
      ],
    },
  ],
  instagram: [
    {
      title: "Feed e recomendações",
      items: [
        { key: "feedInteiro", label: "Ocultar feed inteiro (posts e anúncios)" },
        { key: "paraVoce", label: 'Ocultar recomendações "Para você"' },
        { key: "sugestoes", label: "Ocultar sugestões de perfis" },
        { key: "stories", label: "Ocultar stories" },
      ],
    },
    {
      title: "Perfil, marca e rodapé",
      items: [
        { key: "balaoMensagens", label: "Ocultar balão de mensagens" },
        { key: "painelPerfil", label: "Ocultar perfil / trocar conta" },
        { key: "rodape", label: "Ocultar links institucionais" },
        { key: "logo", label: "Ocultar logotipo" },
      ],
    },
    {
      title: "Menu lateral",
      items: [
        { key: "navHome", label: "Ocultar Página inicial" },
        { key: "navReels", label: "Ocultar Reels" },
        { key: "navMensagens", label: "Ocultar Mensagens" },
        { key: "navPesquisa", label: "Ocultar Pesquisa" },
        { key: "navNotificacoes", label: "Ocultar Notificações" },
        { key: "navCriar", label: "Ocultar Criar" },
        { key: "navPerfil", label: "Ocultar Perfil" },
        { key: "navMais", label: "Ocultar Mais" },
        { key: "navMeta", label: 'Ocultar "Também da Meta"' },
      ],
    },
  ],
  youtube: [
    {
      title: "Cabeçalho (topo da página)",
      items: [
        { key: "cabecalho", label: "Ocultar cabeçalho inteiro" },
        { key: "navHamburguer", label: "Ocultar botão de menu (☰)" },
        { key: "buscaBarra", label: "Ocultar barra de pesquisa" },
        { key: "buscaVoz", label: "Ocultar pesquisa por voz (microfone)" },
        { key: "navCriar", label: "Ocultar botão Criar" },
        { key: "notificacoes", label: "Ocultar sino de notificações" },
        { key: "avatarConta", label: "Ocultar foto de perfil da conta" },
      ],
    },
    {
      title: "Página inicial",
      items: [
        { key: "paraVoce", label: "Ocultar feed inicial" },
        { key: "redirecionarInscricoes", label: 'Redirecionar Início para "Inscrições"' },
      ],
    },
    {
      title: "Menu lateral (funciona nas duas versões: com nomes ou só ícones)",
      items: [
        { key: "menuLateral", label: "Ocultar menu lateral inteiro" },
        { key: "navHome", label: "Ocultar Início" },
        { key: "inscricoesNav", label: "Ocultar link Inscrições" },
        { key: "listaCanaisInscritos", label: "Ocultar lista de canais inscritos (só no menu com nomes)" },
      ],
    },
    {
      title: "Menu lateral — Sua conta",
      items: [
        { key: "secaoVoce", label: 'Ocultar seção "Você" inteira' },
        { key: "navCanal", label: "Ocultar Seu canal" },
        { key: "navHistorico", label: "Ocultar Histórico" },
        { key: "navPlaylists", label: "Ocultar Playlists" },
        { key: "navAssistirDepois", label: "Ocultar Assistir mais tarde" },
        { key: "navCurtidos", label: "Ocultar Vídeos curtidos" },
        { key: "navSeusVideos", label: "Ocultar Seus vídeos" },
        { key: "navDownloads", label: "Ocultar Downloads" },
      ],
    },
    {
      title: "Explorar e descoberta",
      items: [
        { key: "explorarTendencias", label: "Ocultar Explorar / Em alta" },
        { key: "maisDoYoutube", label: "Ocultar mais do YouTube" },
        { key: "navDenuncias", label: "Ocultar histórico de denúncias" },
        { key: "rodapeMenu", label: "Ocultar links institucionais (Sobre, Termos...)" },
      ],
    },
    {
      title: "Shorts",
      items: [
        { key: "shorts", label: "Ocultar Shorts (em qualquer lugar)" },
        { key: "shortsBusca", label: "Ocultar prateleiras de Shorts na pesquisa" },
        { key: "abaShortsCanal", label: "Ocultar aba Shorts dos canais" },
      ],
    },
    {
      title: "Pesquisa e recomendações",
      items: [
        { key: "mixes", label: "Ocultar mixes (playlists automáticas)" },
        { key: "merchTicketsOfertas", label: "Ocultar produtos, ingressos e ofertas" },
        { key: "resultadosBuscaExtras", label: "Ocultar sugestões extras na busca" },
      ],
    },
    {
      title: "Página do vídeo — informações",
      items: [
        { key: "infoVideo", label: "Ocultar tudo abaixo do vídeo" },
        { key: "barraBotoesVideo", label: "Ocultar botões (curtir, compartilhar, salvar)" },
        { key: "donoCanalVideo", label: "Ocultar nome e foto do canal" },
        { key: "descricaoVideo", label: "Ocultar descrição do vídeo" },
      ],
    },
    {
      title: "Página do vídeo — barra lateral",
      items: [
        { key: "barraLateralVideo", label: "Ocultar barra lateral inteira" },
        { key: "recomendados", label: "Ocultar recomendados" },
        { key: "chatAoVivo", label: "Ocultar chat ao vivo" },
        { key: "playlist", label: "Ocultar playlist" },
        { key: "arrecadacao", label: "Ocultar arrecadação (fundraiser)" },
      ],
    },
    {
      title: "Comentários",
      items: [
        { key: "comentarios", label: "Ocultar comentários" },
        { key: "fotosPerfilComentarios", label: "Ocultar fotos de perfil nos comentários" },
      ],
    },
    {
      title: "Durante o vídeo",
      items: [
        { key: "telaFinalCards", label: "Ocultar cards clicáveis durante o vídeo" },
      ],
    },
    {
      title: "Quando o vídeo termina",
      items: [
        { key: "telaFinalFeed", label: "Ocultar cards de recomendação no fim do vídeo" },
      ],
    },
    {
      title: "Comportamento do player",
      items: [{ key: "desativarAutoplay", label: "Desligar reprodução automática do próximo vídeo" }],
    },
  ],
  tiktok: [
    {
      title: "Feed principal",
      items: [
        { key: "paraVoce", label: 'Ocultar "Para você"' },
        { key: "sugestoesContas", label: "Ocultar sugestões de contas" },
      ],
    },
    {
      title: "Barra lateral",
      items: [
        { key: "barraLateral", label: "Ocultar barra lateral inteira" },
        { key: "busca", label: "Ocultar busca" },
        { key: "explorar", label: "Ocultar Explorar" },
        { key: "seguindo", label: "Ocultar Seguindo" },
        { key: "amigos", label: "Ocultar Amigos" },
        { key: "live", label: "Ocultar LIVE" },
        { key: "mensagens", label: "Ocultar Mensagens" },
        { key: "atividade", label: "Ocultar Atividade" },
        { key: "carregar", label: "Ocultar Carregar" },
        { key: "perfil", label: "Ocultar Perfil" },
        { key: "mais", label: "Ocultar Mais" },
        { key: "rodape", label: "Ocultar links institucionais" },
      ],
    },
    {
      title: "Cabeçalho",
      items: [{ key: "cabecalho", label: "Ocultar cabeçalho" }],
    },
    {
      title: "Interações",
      items: [
        { key: "botoesInteracao", label: "Ocultar botões de interação" },
        { key: "curtidas", label: "Ocultar curtidas" },
        { key: "comentarios", label: "Ocultar comentários" },
        { key: "salvos", label: "Ocultar salvos" },
        { key: "compartilhar", label: "Ocultar compartilhamento" },
      ],
    },
    {
      title: "Conteúdo do vídeo",
      items: [
        { key: "infoCriador", label: "Ocultar informações do criador" },
        { key: "descricao", label: "Ocultar descrição do vídeo" },
        { key: "musica", label: "Ocultar música do vídeo" },
      ],
    },
  ],
  facebook: [
    {
      title: "Página inicial — Feed e publicação",
      items: [
        { key: "barraPostagem", label: "Ocultar barra de postagem" },
        { key: "feedInteiro", label: "Ocultar feed Para você / Foryou e travar rolagem" },
        { key: "stories", label: "Ocultar stories" },
        { key: "sugestoesGrupos", label: "Ocultar sugestões de grupos" },
        { key: "carregamentoFeed", label: "Ocultar elementos de carregamento" },
      ],
    },
    {
      title: "Página inicial — Publicidade",
      items: [
        { key: "patrocinados", label: "Ocultar patrocinados (lateral e feed)" },
      ],
    },
    {
      title: "Cabeçalho e navegação",
      items: [
        { key: "navHome", label: "Ocultar ícone Página inicial" },
        { key: "navReels", label: "Ocultar ícone Reels" },
        { key: "navAmigos", label: "Ocultar ícone Amigos" },
        { key: "navGrupos", label: "Ocultar ícone Grupos" },
        { key: "navMarketplace", label: "Ocultar ícone Marketplace" },
        { key: "navJogos", label: "Ocultar ícone Jogos" },
        { key: "contaMenu", label: "Ocultar ícone de menu/aplicativos" },
        { key: "contaMessenger", label: "Ocultar ícone do Messenger" },
        { key: "contaNotificacoes", label: "Ocultar ícone de notificações" },
        { key: "contaPerfil", label: "Ocultar ícone do perfil/conta" },
      ],
    },
    {
      title: "Página inicial — Menu lateral esquerdo",
      items: [
        { key: "menuTodos", label: "Ocultar todos os itens do menu lateral" },
        { key: "menuPerfil", label: "Ocultar Perfil" },
        { key: "menuMetaAi", label: "Ocultar Meta AI" },
        { key: "menuAmigos", label: "Ocultar Amigos" },
        { key: "menuLembrancas", label: "Ocultar Lembranças" },
        { key: "menuSalvos", label: "Ocultar Salvos" },
        { key: "menuGrupos", label: "Ocultar Grupos" },
        { key: "menuReels", label: "Ocultar Reels" },
        { key: "menuMarketplace", label: "Ocultar Marketplace" },
        { key: "menuFeeds", label: "Ocultar Feeds" },
        { key: "menuEventos", label: "Ocultar Eventos" },
        { key: "menuAnuncios", label: "Ocultar Gerenciador de Anúncios" },
        { key: "menuAniversarios", label: "Ocultar Aniversários" },
        { key: "menuJogar", label: "Ocultar Jogar" },
        { key: "menuMessenger", label: "Ocultar Messenger" },
        { key: "menuMessengerKids", label: "Ocultar Messenger Kids" },
        { key: "menuConverseIAs", label: "Ocultar Converse com IAs" },
        { key: "menuPaginas", label: "Ocultar Páginas" },
        { key: "menuPedidosPagamentos", label: "Ocultar Pedidos e pagamentos" },
        { key: "menuAtividadeAnuncios", label: "Ocultar Sua atividade de anúncios" },
        { key: "menuVideoJogos", label: "Ocultar Vídeo de jogos" },
        { key: "menuVerMais", label: "Ocultar botão Ver mais" },
        { key: "menuVerMenos", label: "Ocultar botão Ver menos" },
      ],
    },
    {
      title: "Página inicial — Controles adicionais",
      items: [
        { key: "buscaFacebook", label: "Ocultar busca do Facebook" },
        { key: "acaoFlutuante", label: "Ocultar botão flutuante do canto inferior direito" },
      ],
    },
    {
      title: "Página inicial — Rodapé",
      items: [{ key: "rodape", label: "Ocultar texto e links do rodapé" }],
    },
    {
      title: "Perfil do Facebook",
      items: [
        { key: "perfilSugestoes", label: "Ocultar Pessoas que talvez você conheça" },
        { key: "perfilDadosPessoais", label: "Ocultar dados pessoais" },
        { key: "perfilAmigos", label: "Ocultar Amigos do perfil" },
        { key: "perfilFotos", label: "Ocultar Fotos do perfil" },
      ],
    },
    {
      title: "Abas do perfil",
      items: [
        { key: "perfilAbaTudo", label: "Ocultar aba Tudo" },
        { key: "perfilAbaSobre", label: "Ocultar aba Sobre" },
        { key: "perfilAbaAmigos", label: "Ocultar aba Amigos" },
        { key: "perfilAbaFotos", label: "Ocultar aba Fotos" },
        { key: "perfilAbaReels", label: "Ocultar aba Reels" },
        { key: "perfilAbaMais", label: "Ocultar aba Mais" },
      ],
    },
  ],
};

const PLATFORMS = ["x", "instagram", "tiktok", "youtube", "facebook"];
const BACKUP_VERSION = 1;
const PLATFORM_NAMES = {
  x: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
};
const PLATFORM_HOSTS = {
  "x.com": "x",
  "twitter.com": "x",
  "www.instagram.com": "instagram",
  "www.tiktok.com": "tiktok",
  "www.youtube.com": "youtube",
  "facebook.com": "facebook",
  "www.facebook.com": "facebook",
};
const LEGACY_FACEBOOK_PROFILE_KEY = "perfilSugestoesAmigosFotos";
const LEGACY_FACEBOOK_ACCOUNT_BAR_KEY = "acoesConta";
const FACEBOOK_PROFILE_RULE_KEYS = [
  "perfilSugestoes",
  "perfilDadosPessoais",
  "perfilAmigos",
  "perfilFotos",
];

function defaultState() {
  return {
    enabled: true,
    siteEnabled: { x: true, instagram: true, tiktok: true, youtube: true, facebook: true },
    x: {},
    instagram: {},
    tiktok: {},
    youtube: {},
    facebook: {},
  };
}

let state = defaultState();
let selectedPlatform = "x";
const renderedPanels = new Set();
let pendingImport = null;

function knownRuleKeys(platform) {
  return new Set(CATALOG[platform].flatMap((group) => group.items.map((item) => item.key)));
}

function migrateFacebookProfileRules(profile) {
  const next = { ...(profile || {}) };
  const legacy = next[LEGACY_FACEBOOK_PROFILE_KEY];
  if (typeof legacy !== "boolean") return { state: next, changed: false };

  if (legacy) {
    for (const key of FACEBOOK_PROFILE_RULE_KEYS) {
      if (typeof next[key] !== "boolean") next[key] = true;
    }
  }
  delete next[LEGACY_FACEBOOK_PROFILE_KEY];
  return { state: next, changed: true };
}

function migrateFacebookSettings(profile) {
  const migratedProfile = migrateFacebookProfileRules(profile);
  const next = migratedProfile.state;
  const hadLegacyAccountBar = Object.prototype.hasOwnProperty.call(next, LEGACY_FACEBOOK_ACCOUNT_BAR_KEY);
  if (hadLegacyAccountBar) delete next[LEGACY_FACEBOOK_ACCOUNT_BAR_KEY];
  return {
    state: next,
    changed: migratedProfile.changed || hadLegacyAccountBar,
  };
}

function normalizedState(candidate) {
  const source = candidate?.settings;
  if (!source || typeof source !== "object" || candidate.format !== "foco-total" || candidate.version !== BACKUP_VERSION) return null;

  const next = defaultState();
  if (typeof source.enabled === "boolean") next.enabled = source.enabled;
  if (source.siteEnabled && typeof source.siteEnabled === "object") {
    for (const platform of PLATFORMS) {
      if (typeof source.siteEnabled[platform] === "boolean") {
        next.siteEnabled[platform] = source.siteEnabled[platform];
      }
    }
  }
  for (const platform of PLATFORMS) {
    if (!source[platform] || typeof source[platform] !== "object") continue;
    for (const key of knownRuleKeys(platform)) {
      if (typeof source[platform][key] === "boolean") next[platform][key] = source[platform][key];
    }
  }
  const legacyFacebook = source.facebook?.[LEGACY_FACEBOOK_PROFILE_KEY];
  if (typeof legacyFacebook === "boolean") {
    next.facebook = migrateFacebookSettings({
      ...next.facebook,
      [LEGACY_FACEBOOK_PROFILE_KEY]: legacyFacebook,
    }).state;
  }
  return next;
}

function showSettingsMessage(message) {
  const note = document.getElementById("settings-message");
  note.textContent = message;
  note.hidden = false;
}

function applyImportedState(next) {
  state = next;
  renderedPanels.clear();
  document.getElementById("master-toggle").setAttribute("aria-checked", String(state.enabled));
  for (const platform of PLATFORMS) document.getElementById(`panel-${platform}`).textContent = "";
  renderPanel(selectedPlatform);
  updateCount();
  persist(state);
}

function exportSettings() {
  const backup = {
    format: "foco-total",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    settings: state,
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "foco-total-configuracoes.json";
  link.click();
  URL.revokeObjectURL(url);
  showSettingsMessage("Configurações exportadas.");
}

async function readImport(file) {
  try {
    const next = normalizedState(JSON.parse(await file.text()));
    if (!next) throw new Error("invalid");
    pendingImport = next;
    document.getElementById("import-confirm").hidden = false;
    showSettingsMessage("Arquivo válido. Confirme para substituir as configurações.");
  } catch {
    pendingImport = null;
    showSettingsMessage("Arquivo inválido. Selecione um backup exportado pelo Foco Total.");
  }
}

function persist(partial) {
  chrome.storage.local.set(partial);
}

function updateCount() {
  let n = 0;
  for (const p of PLATFORMS) n += Object.values(state[p]).filter(Boolean).length;
  document.getElementById("hidden-count").textContent =
    n === 1 ? "1 item oculto" : `${n} itens ocultos`;
}

function makeToggle(checked, label, dataset) {
  const btn = document.createElement("button");
  btn.className = "toggle";
  btn.type = "button";
  btn.setAttribute("role", "switch");
  btn.setAttribute("aria-checked", String(checked));
  btn.setAttribute("aria-label", label);
  Object.assign(btn.dataset, dataset);
  return btn;
}

function makeRow(label, toggle) {
  const row = document.createElement("label");
  row.className = "row";
  const span = document.createElement("span");
  span.className = "row-label";
  span.textContent = label;
  row.append(span, toggle);
  return row;
}

function renderPanel(platform) {
  if (renderedPanels.has(platform)) return;
  renderedPanels.add(platform);

  const panel = document.getElementById(`panel-${platform}`);
  const fragment = document.createDocumentFragment();
  const siteLabel = `Ativado no ${PLATFORM_NAMES[platform]}`;
  const siteCard = document.createElement("section");
  siteCard.className = "card master-card";
  siteCard.appendChild(makeRow(
    siteLabel,
    makeToggle(state.siteEnabled[platform] !== false, siteLabel, { scope: "site", platform })
  ));
  fragment.appendChild(siteCard);

  const platformReset = document.createElement("button");
  platformReset.className = "platform-reset-btn";
  platformReset.type = "button";
  platformReset.textContent = `↻ Restaurar configurações do ${PLATFORM_NAMES[platform]}`;
  platformReset.dataset.scope = "platform-reset";
  platformReset.dataset.platform = platform;
  fragment.appendChild(platformReset);

  const platformConfirm = document.createElement("div");
  platformConfirm.className = "confirm platform-reset-confirm";
  platformConfirm.hidden = true;
  const confirmText = document.createElement("p");
  confirmText.textContent = `Desligar todas as regras do ${PLATFORM_NAMES[platform]}?`;
  const confirmActions = document.createElement("div");
  confirmActions.className = "confirm-actions";
  const confirmYes = document.createElement("button");
  confirmYes.className = "btn-danger";
  confirmYes.type = "button";
  confirmYes.textContent = "Restaurar";
  confirmYes.dataset.action = "platform-reset-yes";
  confirmYes.dataset.platform = platform;
  const confirmNo = document.createElement("button");
  confirmNo.className = "btn-ghost";
  confirmNo.type = "button";
  confirmNo.textContent = "Cancelar";
  confirmNo.dataset.action = "platform-reset-no";
  confirmNo.dataset.platform = platform;
  confirmActions.append(confirmYes, confirmNo);
  platformConfirm.append(confirmText, confirmActions);
  fragment.appendChild(platformConfirm);

  for (const group of CATALOG[platform]) {
    const title = document.createElement("h2");
    title.className = "group-title";
    title.textContent = group.title;
    fragment.appendChild(title);

    const card = document.createElement("section");
    card.className = "card";
    for (const item of group.items) {
      card.appendChild(makeRow(
        item.label,
        makeToggle(!!state[platform][item.key], item.label, {
          scope: "rule",
          platform,
          key: item.key,
        })
      ));
    }
    fragment.appendChild(card);
  }

  panel.textContent = "";
  panel.appendChild(fragment);
}

function selectTab(platform) {
  selectedPlatform = platform;
  renderPanel(platform);
  for (const p of PLATFORMS) {
    document.getElementById(`tab-${p}`).setAttribute("aria-selected", String(p === platform));
    document.getElementById(`panel-${p}`).hidden = p !== platform;
  }
}

function handleToggleClick(btn) {
  const next = btn.getAttribute("aria-checked") !== "true";
  btn.setAttribute("aria-checked", String(next));

  if (btn.dataset.scope === "master") {
    state.enabled = next;
    persist({ enabled: next });
    return;
  }

  const platform = btn.dataset.platform;
  if (btn.dataset.scope === "site") {
    state.siteEnabled[platform] = next;
    persist({ siteEnabled: state.siteEnabled });
    return;
  }

  if (btn.dataset.scope === "rule") {
    state[platform][btn.dataset.key] = next;
    persist({ [platform]: state[platform] });
    updateCount();
  }
}

function resetAll() {
  state = defaultState();
  renderedPanels.clear();
  document.getElementById("master-toggle").setAttribute("aria-checked", "true");
  for (const p of PLATFORMS) document.getElementById(`panel-${p}`).textContent = "";
  renderPanel(selectedPlatform);
  updateCount();
  document.getElementById("reset-confirm").hidden = true;
  persist(state);
}

function resetPlatform(platform) {
  if (!PLATFORMS.includes(platform)) return;
  state[platform] = {};
  renderedPanels.delete(platform);
  const panel = document.getElementById(`panel-${platform}`);
  panel.textContent = "";
  renderPanel(platform);
  updateCount();
  persist({ [platform]: state[platform] });
}

function initEvents() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    if (btn.classList.contains("toggle")) handleToggleClick(btn);
    else if (btn.id === "reset-all-btn") document.getElementById("reset-confirm").hidden = false;
    else if (btn.id === "reset-no") document.getElementById("reset-confirm").hidden = true;
    else if (btn.id === "reset-yes") resetAll();
    else if (btn.dataset.scope === "platform-reset") {
      const panel = btn.parentElement;
      panel.querySelector(".platform-reset-confirm").hidden = false;
      btn.disabled = true;
    }
    else if (btn.dataset.action === "platform-reset-no") {
      const panel = btn.closest('[role="tabpanel"]');
      panel.querySelector(".platform-reset-confirm").hidden = true;
      panel.querySelector('.platform-reset-btn').disabled = false;
    }
    else if (btn.dataset.action === "platform-reset-yes") {
      resetPlatform(btn.dataset.platform);
    }
    else if (btn.id === "settings-btn") {
      const panel = document.getElementById("settings-panel");
      panel.hidden = !panel.hidden;
      btn.setAttribute("aria-expanded", String(!panel.hidden));
    }
    else if (btn.id === "export-btn") exportSettings();
    else if (btn.id === "import-btn") document.getElementById("import-file").click();
    else if (btn.id === "import-no") {
      pendingImport = null;
      document.getElementById("import-confirm").hidden = true;
    }
    else if (btn.id === "import-yes" && pendingImport) {
      applyImportedState(pendingImport);
      pendingImport = null;
      document.getElementById("import-confirm").hidden = true;
      showSettingsMessage("Configurações importadas.");
    }
    else if (btn.classList.contains("tab")) selectTab(btn.id.replace("tab-", ""));
  });

  document.getElementById("import-file").addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) readImport(file);
    event.target.value = "";
  });

  document.querySelector(".tabs").addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const current = PLATFORMS.indexOf(selectedPlatform);
    const next = (current + (event.key === "ArrowRight" ? 1 : -1) + PLATFORMS.length) % PLATFORMS.length;
    document.getElementById(`tab-${PLATFORMS[next]}`).focus();
    selectTab(PLATFORMS[next]);
  });
}

async function detectActivePlatform() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const host = tab?.url ? new URL(tab.url).hostname : null;
    return PLATFORM_HOSTS[host] || null;
  } catch {
    return null;
  }
}

async function main() {
  initEvents();

  const activePromise = detectActivePlatform();
  const data = await chrome.storage.local.get(["enabled", "siteEnabled", ...PLATFORMS]);
  state.enabled = data.enabled !== false;
  state.siteEnabled = { ...state.siteEnabled, ...(data.siteEnabled || {}) };
  for (const p of PLATFORMS) state[p] = data[p] || {};
  const migratedFacebook = migrateFacebookSettings(state.facebook);
  state.facebook = migratedFacebook.state;
  if (migratedFacebook.changed) persist({ facebook: state.facebook });

  const master = document.getElementById("master-toggle");
  master.dataset.scope = "master";
  master.setAttribute("aria-checked", String(state.enabled));
  selectedPlatform = (await activePromise) || selectedPlatform;
  selectTab(selectedPlatform);
  updateCount();
}

main();
