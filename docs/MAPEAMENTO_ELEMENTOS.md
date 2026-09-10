# Mapeamento de elementos por plataforma

Registro técnico da inspeção ao vivo (PRD §10.3), realizada em 2026-07-12 com
sessão autenticada no Chrome desktop (X em inglês, Instagram e TikTok em
pt-BR), janela 1920×855.

## Estratégia geral

- Ocultação por CSS injetado numa única `<style id="foco-total-style">`;
  regras dinâmicas marcam nós com `data-foco-total-hide` via um único
  `MutationObserver` por página.
- Ordem de preferência de seletor: `data-testid`/`data-e2e` → roles/aria
  estruturais → `href` de rotas → sufixo de componente em classes ofuscadas →
  dicionário de texto pt/en (último recurso, documentado).

## X (x.com)

| Controle | Seletor / estratégia | Fragilidade |
|---|---|---|
| paraVoce | Dinâmico: em `/home`, oculta a 1ª aba de `[data-testid="primaryColumn"] [role="tablist"]` (wrapper `role="presentation"`); se ela estiver selecionada, clica na 2ª ("Seguindo") | Baixa. Depende da ordem das abas (FY sempre 1ª) |
| abaSeguindo | Dinâmico: em `/home`, oculta a 2ª aba do mesmo tablist | Baixa (mesma base do paraVoce) |
| barraEsquerda | `header[role="banner"]` + extraCss `main { align-items: center }` para centralizar o conteúdo quando o menu some | Baixa (landmark semântico) |
| flutuantes | `[data-testid="GrokDrawer"]`, `[data-testid="chat-drawer-root"]` (botões flutuantes inferiores-direitos) | Baixa |
| barraLateral | `[data-testid="sidebarColumn"]` | Baixa. testid estável há anos |
| busca | `[data-testid="sidebarColumn"] form[role="search"]` | Baixa (role semântico) |
| noticias | `[data-testid="sidebarColumn"] [data-testid="news_sidebar"]` | Baixa |
| tendencias | `[data-testid="sidebarColumn"] section:has([data-testid="trend"])` | Média (estrutura section) |
| premium | `... aside:has(a[href^="/i/premium"])` | Baixa (rota estável) |
| sugestoes | `... aside:has([data-testid$="-follow"])` | Média (sufixo do testid dos botões follow) |

Dependência: `barraLateral` é contêiner-pai de busca/noticias/tendencias/
premium/sugestoes — ocultar o pai já oculta os filhos; estados dos filhos são
preservados no storage (PRD §17).

Observação: a timeline "Para você" não marca posts recomendados
individualmente de forma estável; a abordagem conservadora adotada é ocultar
a aba FY e manter o usuário em "Seguindo" (conteúdo seguido preservado).

## Instagram (instagram.com)

Sem atributos de teste; classes ofuscadas e aria-labels localizados.
Estratégia: **sinais combinados** — `href` de rota (estável entre idiomas) +
posição geométrica do rail (borda esquerda, `left < 100px`) + dicionário
pt/en de `aria-label` dos SVGs apenas para itens sem rota.

| Controle | Estratégia | Fragilidade |
|---|---|---|
| paraVoce | `article` cujo span de cabeçalho = "Sugestões/Sugerido para você" / "Suggested for you/posts" | Alta em outros idiomas (dicionário pt/en) |
| sugestoes | Sobe do link `a[href^="/explore/people"]` ("Ver tudo") até o bloco ≥250px, com guardas: nunca sobe para contêiner >520px de largura ou que contenha article/nav/main, e só oculta blocos entre 150–620px de altura (evita apagar o app durante o carregamento, quando as alturas ainda são 0) | Média (heurística com guardas) |
| feedInteiro | Dinâmico: na rota `/`, oculta todos os `main article` (posts, anúncios e contas seguidas); não afeta /p/... nem perfis | Baixa |
| stories | `main div[role="presentation"]:has(li [role="button"] canvas)` — o canvas do anel distingue stories de carrosséis de post | Média (estrutura) |
| balaoMensagens | Dinâmico geométrico: ancestral `position:fixed` de um SVG rotulado, no quadrante inferior-direito, altura < 150px | Baixa (sem texto) |
| painelPerfil | Botão com texto {Trocar, Switch} → sobe até bloco de 250–520px de largura e ≤120px de altura | Média (dicionário) |
| rodape | `footer` (página) + subida de `a[href*="about/help.instagram"]` até o bloco com "instagram from meta" (≤400px, sem img/article) | Média |
| logo | `a[href="/"]:has(svg[aria-label="Instagram"])` (aria da marca, não localizada) | Baixa |
| navHome | Rail: `a[href="/"]` com SVG cujo aria ≠ "Instagram" (o logo usa a marca, não localizada) | Baixa |
| navReels | Rail: `a[href^="/reels/"]` | Baixa |
| navMensagens | Rail: `a[href^="/direct/"]` | Baixa |
| navPesquisa | Rail: `a[href^="/explore"]` OU aria ∈ {Pesquisa, Search} | Baixa/média |
| navNotificacoes | aria ∈ {Notificações, Notifications} | Média (dicionário) |
| navCriar | aria ∈ {Novo post, Nova publicação, New post, Create} | Média |
| navPerfil | Rail: `a` com `href=/usuario/` (regex `^/[^/]+/$`) contendo `img` (avatar) | Baixa |
| navMais | aria ∈ {Configurações, Mais, Settings, More} | Média |
| navMeta | aria ∈ {Também da Meta, Also from Meta} | Média |

Variações: na janela inspecionada (1920px) o rail fica recolhido (só ícones);
as regras atuam no `<a>` do item, que nas variações expandidas contém ícone +
rótulo juntos — atende PRD 9.2.3 ("ícone, rótulo e área clicável juntos").

## TikTok (tiktok.com) — inventário (PRD 9.3.1)

O TikTok expõe `data-e2e` (61 chaves na home) — base principal. Para
contêineres sem data-e2e, usa-se o sufixo do styled-component
(`[class*="DivSideNavContainer"]`), que sobrevive a re-hash de classes.

Classificação do inventário:

- **Controles individuais**: itens de navegação (`nav-*`), busca, botões de
  interação, descrição, música, informações do criador, cabeçalho, rodapé.
- **Grupos lógicos**: barra lateral inteira; coluna de interações inteira.
- **Essenciais (não ocultáveis)**: o player de vídeo em si e a lista do feed
  (`recommend-list-item-container`) — ocultá-los quebraria a página.
- **Dinâmicos/instáveis**: anúncios in-feed (sem marcador identificável na
  sessão inspecionada — ver LIMITACOES.md).

| Controle | Seletor | Fragilidade |
|---|---|---|
| paraVoce | linha de `[data-e2e="nav-foryou"]` + auto-troca p/ "Seguindo" quando na rota `/` ou `/foryou` | Baixa |
| sugestoesContas | `[data-e2e="recommend-card"]` (grade de cards "Seguir" — /following e descoberta) | Baixa |
| barraLateral | `[class*="DivSideNavContainer"]` | Média (nome de componente) |
| busca | `[data-e2e="search-box"]` + linha de `nav-search` | Baixa |
| explorar…mais | `[class*="DivMainNavContainer"] > *:has([data-e2e="nav-X"])` (wrappers variam entre h2/div; seletor cobre ambos) | Baixa |
| rodape | `[class*="FooterContainer"]` na sidebar + `[data-e2e="copyright"]` | Média |
| cabecalho | `[class*="DivFixedTopContainer"]` (Obter Moedas, Obter app, avatar) | Média |
| botoesInteracao | `section[class*="SectionActionBarContainer"]` | Média |
| curtidas/comentarios/salvos/compartilhar | `button:has([data-e2e="like/comment/favorite/share-icon"])` | Baixa |
| infoCriador | `[class*="DivCreatorInfoContainer"]` + `[class*="DivAvatarActionItemContainer"]` | Média |
| descricao | `[class*="DivMediaCardDescriptionContainer"]` | Média |
| musica | `[data-e2e="video-music"]` | Baixa |

Dependências (PRD 9.3.4 / §17):
- `barraLateral` ⊃ busca, explorar, seguindo, amigos, live, mensagens,
  atividade, carregar, perfil, mais, rodape.
- `botoesInteracao` ⊃ curtidas, comentarios, salvos, compartilhar e o avatar
  do criador na coluna (parte de infoCriador).
- `paraVoce` + `seguindo` ativos juntos: a auto-troca usa `element.click()`
  programático, que funciona mesmo com o item oculto — a página nunca fica
  sem feed. Navegação mínima permanece via Explorar/Perfil.

## YouTube (youtube.com)

Adicionado por pedido do usuário, usando a lista de controles da extensão
Unhook como referência **funcional** (organização dos toggles), não visual
— identidade e nomes traduzidos são originais (PRD §15). YouTube usa custom
elements (`ytd-*`, `ytp-*`) muito mais estáveis que classes ofuscadas.

Descoberta importante da inspeção: o guia lateral (`ytd-guide-renderer`) usa
**dois templates diferentes** para suas seções. As seções simples (Início,
Inscrições, Explorar, Mais do YouTube, Denúncias) têm cabeçalho + itens como
irmãos diretos dentro de um único `div#items`. A seção "Você" é renderizada
como um `ytd-guide-collapsible-section-entry-renderer` aninhado, com o
rótulo em `#header` e os 7 itens em `#section-items` — um formato totalmente
diferente. Usar `:nth-of-type` ingenuamente nessas listas falha porque os
itens não são todos irmãos do mesmo tipo; a correção usa `:nth-child`
escopado ao `#items`/`#section-items` correto de cada seção.

| Controle | Seletor / estratégia | Fragilidade |
|---|---|---|
| paraVoce | Dinâmico: em `/`, oculta `ytd-rich-grid-renderer` (grade de vídeos da home) | Baixa |
| redirecionarInscricoes | Dinâmico: em `/`, navega para `/feed/subscriptions` | Baixa |
| barraLateralVideo | `#secondary` (contêiner-pai, página /watch) | Baixa |
| recomendados | `ytd-watch-next-secondary-results-renderer #items` | Baixa |
| chatAoVivo | `ytd-live-chat-frame`, `#chat` | Baixa |
| playlist | `ytd-playlist-panel-renderer` | Baixa |
| arrecadacao | `ytd-donation-shelf-renderer` | Alta — não validado ao vivo (nenhuma live com arrecadação disponível na inspeção); best-effort baseado em nome de tag conhecido |
| telaFinalFeed | Formato clássico: `.html5-endscreen` + `.ytp-endscreen-content`/`.ytp-videowall-still`; formato moderno: `.ytp-fullscreen-grid` + `.ytp-modern-videowall-still` | Baixa — ambos os formatos foram confirmados ao vivo em vídeos encerrados |
| telaFinalCards | `.ytp-ce-element` | Baixa |
| shorts | `#items` da seção 0 do guia, 2º filho + `ytd-rich-shelf-renderer[is-shorts]` (prateleira de shorts em outras páginas) | Baixa |
| shortsBusca | `ytd-search grid-shelf-view-model:has(a[href^='/shorts/'])` | Média — componente novo `yt-*`; o grid contém título/cards/“Mostrar mais” e não sobe ao `ytd-item-section-renderer`, que também contém o resultado do canal |
| abaShortsCanal | 3º `[role=tab]` de `ytd-tabbed-page-header #tabs` | Média — o host atual não expõe href; ordem Home/Vídeos/Shorts validada ao vivo e deve ser revalidada se o YouTube mudar as abas de canal |
| comentarios | `ytd-comments#comments`, `#comments` | Baixa |
| mixes | `ytd-radio-renderer` | Baixa |
| merchTicketsOfertas | `ytd-merch-shelf-renderer`, `ytd-ticket-shelf-renderer`, `#offer-module` | Baixa/Média (offer-module validado; merch/ticket não testados ao vivo) |
| infoVideo | `ytd-watch-metadata` | Baixa |
| cabecalho | `#masthead-container`, `ytd-masthead` | Baixa |
| notificacoes | `ytd-notification-topbar-button-renderer` | Baixa |
| menuLateral | `ytd-guide-renderer`, `tp-yt-app-drawer#guide` (contêiner-pai) | Baixa |
| navHome | `#items` da seção 0, 1º filho | Baixa |
| inscricoesNav | `a#endpoint[href="/feed/subscriptions"]` → sobe até o `ytd-guide-entry-renderer` | Baixa |
| listaCanaisInscritos | `#items` da seção 1, todos os filhos exceto o 1º (cabeçalho) | Baixa |
| secaoVoce | `ytd-guide-collapsible-section-entry-renderer` dentro da seção 2 | Baixa |
| navCanal | `#section-items` da seção "Você", 1º filho (href varia por conta, por isso posição) | Média |
| navHistorico/navPlaylists/navAssistirDepois/navCurtidos/navSeusVideos/navDownloads | `a#endpoint[href="..."]` exato (rotas fixas: `/feed/history`, `/feed/playlists`, `/playlist?list=WL`, `/playlist?list=LL`, `studio.youtube.com/...`, `/feed/downloads`) → sobe até o `ytd-guide-entry-renderer` | Baixa |
| navDenuncias | Seção 5 inteira do guia (item único: "Denunciar histórico") | Baixa |
| explorarTendencias | Seção 3 inteira do guia (Música/Filmes/Ao vivo) | Baixa |
| maisDoYoutube | Seção 4 inteira do guia (YouTube Music/Kids) | Baixa |
| rodapeMenu | `div#footer.ytd-guide-renderer` (links institucionais + copyright) | Baixa |
| desativarAutoplay | Dinâmico: clica no toggle `.ytp-autonav-toggle-button-container` só quando `aria-checked="true"` (idempotente) | Baixa |

**Controles da tela do player**: no popup, `telaFinalFeed` aparece no topo
da aba YouTube como “Ocultar cards de recomendação no fim do vídeo”. Ele
controla somente a tela exibida após encerrar a reprodução. `telaFinalCards`
permanece separado como “Ocultar cards clicáveis durante o vídeo”, pois atua
nos cards sobrepostos ao player durante a reprodução.

### Menu lateral compacto (Rodada 11)

O YouTube tem **dois menus laterais possíveis**: o expandido, com nomes
(`ytd-guide-renderer`, mapeado acima) e o compacto, só com ícones
(`ytd-mini-guide-renderer`, 4 itens fixos: Início, Shorts, Inscrições,
Você) — alterna entre os dois conforme o usuário clica no ☰ ou a janela
muda de tamanho. Descoberto ao vivo que os toggles antigos (navHome,
shorts, inscricoesNav, secaoVoce) só cobriam a versão expandida — no modo
compacto eles não tinham efeito nenhum (bug relatado pelo usuário, "faltou
ocultar o Home").

Corrigido **mesclando** os seletores do menu compacto direto nos mesmos
controles existentes (por `href`, estável e independente de idioma —
`ytd-mini-guide-entry-renderer:has(a[href="..."])`), em vez de criar
toggles duplicados. Assim "Ocultar Início" funciona não importa qual versão
o YouTube estiver mostrando no momento — decisão de design para manter a
lista de controles simples de entender.

| Controle | Seletor adicionado para o menu compacto |
|---|---|
| navHome | `ytd-mini-guide-entry-renderer:has(a[href="/"])` |
| shorts | `ytd-mini-guide-entry-renderer:has(a[href="/shorts/"])` |
| inscricoesNav | `ytd-mini-guide-entry-renderer:has(a[href="/feed/subscriptions"])` |
| secaoVoce | `ytd-mini-guide-entry-renderer:has(a[href="/feed/you"])` |
| menuLateral | `ytd-mini-guide-renderer` adicionado ao contêiner-pai |

`listaCanaisInscritos` não tem equivalente no menu compacto (ele não lista
canais individuais, só o ícone de "Inscrições").

### Controles adicionados na Rodada 10 (ícones do cabeçalho + paridade Unhook)

Reaproveitados seletores CSS de produção da extensão Unhook (pasta `yt/`
copiada pelo usuário — `yt/css/content.css`), validados ao vivo antes de
adotar.

| Controle | Seletor | Fragilidade |
|---|---|---|
| navHamburguer | `#guide-button`, `tp-yt-paper-icon-button#guide-button` | Baixa |
| buscaBarra | `yt-searchbox` (tag atual; versões antigas usavam `ytd-searchbox`) | Baixa |
| buscaVoz | `#voice-search-button` | Baixa |
| navCriar | `#end #buttons > ytd-button-renderer` (escopado — a tag genérica sozinha casa com 3 elementos, incluindo entradas ocultas) | Média |
| avatarConta | `#avatar-btn` | Baixa |
| barraBotoesVideo | `#actions.ytd-watch-metadata`, `#info > #menu-container` (curtir/compartilhar/perguntar/salvar) | Baixa |
| donoCanalVideo | `#owner.ytd-watch-metadata`, `#top-row.ytd-video-secondary-info-renderer` | Baixa |
| descricaoVideo | `#description.ytd-watch-metadata`, `ytd-expander.ytd-video-secondary-info-renderer` | Baixa |
| fotosPerfilComentarios | `.ytd-comment-renderer yt-img-shadow` + fallback moderno (`ytd-comment-view-model #author-thumbnail img`) | Alta — não validado ao vivo (comentários não terminaram de carregar na inspeção) |
| resultadosBuscaExtras | `#primary > .ytd-two-column-search-results-renderer ytd-horizontal-card-list-renderer/ytd-shelf-renderer` | Baixa (seletor de produção da Unhook) |
| shorts (ampliado) | + `ytd-reel-shelf-renderer`, `ytd-rich-grid-renderer[is-shorts-grid]`, itens de vídeo com link `/shorts/` em grade/busca/canal | Baixa |
| mixes (ampliado) | + `ytd-compact-radio-renderer`, links `start_radio=1` | Baixa |

**Correção de layout (menuLateral)**: o CSS do próprio YouTube reserva
`margin-left: 240px` em `#page-manager` através de um atributo
(`guide-persistent-and-visible`) no `<ytd-app>`, independente de o
contêiner do menu estar com `display:none`. Sem resetar isso, ocultar o
menu lateral deixava uma faixa vazia (bug relatado pelo usuário). Corrigido
com `extraCss: "#page-manager, ytd-page-manager { margin-left: 0 !important; }"`.

**Decisão: não implementado "Desativar anotações"** (item da Unhook).
Inspecionado ao vivo o menu de configurações do player: o item "Annotations"
não existe mais na interface atual do YouTube (recurso descontinuado desde
2019). O código da Unhook usa uma heurística ("o último item checkbox que
não é Ambient mode") que hoje aponta para "Voice boost" — implementá-lo
alteraria silenciosamente uma configuração de áudio do usuário, um bug, não
uma feature. Também não implementado: "ocultar resultados de busca
inapropriados" (sem marcador confiável de classificação de conteúdo,
contrário à postura conservadora do PRD §6.1) — distinto de
`resultadosBuscaExtras` acima, que é apenas prateleiras de descoberta.

## Pontos mais suscetíveis a quebra

1. Renomeação de componentes do TikTok (`Div*Container`) em refactors.
2. Mudança dos rótulos aria do Instagram ou uso em idiomas fora de pt/en.
3. Reordenação das abas da home do X (FY deixar de ser a 1ª).
4. Instagram mover o rail da borda esquerda (limiar geométrico de 100px).

## Atualizacao 2026-07-20 - seletores otimizados

- YouTube: controles do menu lateral baseados em href estavel foram movidos
  para CSS com :has(a#endpoint[href=...]) quando o alvo e um
  ytd-guide-entry-renderer direto. Isso remove varreduras dinamicas em
  mudancas de feed/comentarios sem alterar a estrategia original por href.
- YouTube: Shorts inclui agora ytd-rich-shelf-renderer[is-shorts] em CSS,
  cobrindo a prateleira que antes exigia marcacao dinamica.
- Instagram: regras dinamicas continuam com os mesmos sinais e guardas, mas
  railLinks() e compartilhado por ciclo e consultas incrementais usam apenas o
  no adicionado e seus descendentes quando acionadas por MutationObserver.
