# Checklist de testes (matriz do PRD §21)

Status: ✅ passou · ⏳ pendente · ❌ falhou

## Rodada 1 — validação de seletores por injeção (2026-07-12, Chrome autenticado)

- ✅ X, Instagram e TikTok: todos os seletores casam exatamente os elementos
  esperados; testes visuais sem efeitos colaterais de layout.

## Rodada 2 — extensão instalada (2026-07-12, Chrome autenticado, pt-BR + X em EN)

Executada ao vivo via ponte de QA temporária (removida do build final);
alterações de storage idênticas às produzidas pelo popup.

### X (16 verificações + reload + SPA)
- ✅ AC-01: nada oculto por padrão
- ✅ barraLateral oculta/reexibe a coluna inteira
- ✅ busca, notícias, tendências, sugestões, premium: ocultação individual com pai visível
- ✅ paraVoce: aba FY oculta + troca automática para "Seguindo"
- ✅ AC-03: desligar geral remove a style tag e reexibe tudo
- ✅ AC-04: religar reaplica as regras salvas
- ✅ AC-02 (parcial): regras persistem após reload da página
- ✅ AC-07: regras persistem em navegação SPA (/notifications → /home)
- ⚠️ Correção aplicada durante o QA: pós-reload o X rende notícias fora do
  `news_sidebar`; regra ampliada com `div[aria-label]:has([data-testid^="news_sidebar_article"])`
  (validada ao vivo; revalidar após recarga da extensão)

### Instagram
- ✅ Rail completo visível sem regras (10 itens)
- ✅ Independência: ocultar Reels não afeta os outros 8 itens (PRD 9.2.3)
- ✅ Todos os 9 itens ocultos simultaneamente → resta só o logo; layout íntegro
- ✅ Sugestões de perfis ocultas (painel direito)
- ✅ AC-08: reversão total, zero marcas residuais no DOM
- ✅ AC-07: regra persiste em navegação SPA (feed → perfil → voltar)

### TikTok
- ✅ paraVoce: item de nav oculto + troca automática para /following
- ✅ Independência: live oculto ≠ explorar oculto
- ✅ 9 itens de nav + busca ocultos, "Seguindo" preservado
- ✅ Interações individuais (comentários, compartilhar) com curtidas/salvos visíveis
- ✅ Grupo botoesInteracao oculta a coluna inteira
- ✅ infoCriador, descrição, música ocultos individualmente
- ✅ AC-07: novos cards após scroll obedecem às regras
- ✅ PRD 9.3.4: combinação pesada (sidebar+cabeçalho+interações+conteúdo) mantém o vídeo utilizável
- ✅ PRD §17: reexibir barraLateral preserva estado dos filhos (live continua oculto)

### Globais
- ✅ AC-05: restauração zera as três plataformas e reexibe tudo
- ✅ AC-06: alterações no Instagram não afetam regras ativas do X
- ✅ AC-08: reversibilidade em todas as plataformas
- ✅ AC-10: extensão sem chamadas de rede (sem fetch/XHR no código; sem service worker)
- ✅ Popup: 22 toggles TikTok/5 grupos, contador, confirmação de restauração,
  navegação por teclado nas abas (validado em pré-visualização com stub)

## Rodada 11 — liga/desliga por site, aba automática, menu compacto do YouTube (2026-07-13)

Pedido do usuário: toggle individual por rede (mantendo o geral), popup
abrir direto na aba da rede que está sendo visitada, corrigir o menu
lateral compacto do YouTube (só ícones) que não respondia aos toggles
existentes, e simplificar os nomes dos controles.

- ➕ **Liga/desliga por site**: novo `state.siteEnabled = {x,instagram,
  tiktok,youtube}` no storage. Cada aba do popup ganhou um toggle "Ativado
  no <Rede>" no topo, independente do botão geral (que continua tendo
  prioridade — PRD §17.1). `engine.js` ganhou `isActive()` combinando os
  dois níveis. Testado: desligar YouTube não mexe no toggle geral nem nas
  outras abas.
- ➕ **Aba automática**: popup detecta a URL da aba ativa via
  `chrome.tabs.query` (sem permissão nova — coberto pelo `host_permissions`
  já existente) e abre direto na aba certa. Testado com stub simulando aba
  do YouTube — popup abriu na aba YouTube automaticamente.
- 🐛 **Bug do menu compacto corrigido**: o YouTube tem dois menus laterais
  (expandido com nomes / compacto só ícones) e os controles antigos só
  cobriam o expandido. Corrigido mesclando seletores do menu compacto
  (`ytd-mini-guide-entry-renderer`, por href) direto nos controles
  existentes (navHome, shorts, inscricoesNav, secaoVoce, menuLateral) — sem
  duplicar toggles. Validado ao vivo nos dois modos: alternar para o menu
  compacto (clicando no ☰) e confirmar que os 4 itens (Início, Shorts,
  Inscrições, Você) somem individualmente sem sobra de espaço.
- ✏️ **Nomes simplificados**: revisão de todos os labels do YouTube para
  linguagem simples (ex.: "Ocultar cards da tela final" → "Ocultar cards
  clicáveis durante o vídeo"; "Ocultar dono do canal" → "Ocultar nome e
  foto do canal"; títulos de grupo com contexto extra, como "Menu lateral
  (funciona nas duas versões: com nomes ou só ícones)").
- ⏳ Smoke test manual pós-recarga.

## Rodada 10 — YouTube: ícones do cabeçalho, bug de layout, paridade Unhook (2026-07-13)

Pedido do usuário: controles para os ícones do cabeçalho (☰, busca, voz,
Criar, avatar); corrigir bug em que a barra lateral não recolhia com todas
as opções ativas; reaproveitar a extensão Unhook real (pasta `yt/` copiada
pelo usuário) para implementar seus itens que ainda faltavam.

- 🐛 **Bug de layout corrigido**: `menuLateral` ocultava o contêiner do
  menu, mas o CSS do YouTube reserva `margin-left:240px` em `#page-manager`
  via atributo em `<ytd-app>`, independente da visibilidade do contêiner —
  sobrava uma faixa vazia. Causa raiz confirmada ao vivo (`pageManagerMarginLeft:
  "240px"` mesmo com o menu já oculto). Corrigido com `extraCss` resetando
  a margem; validado visualmente — feed pula para a borda esquerda, sem
  faixa residual.
- ➕ **5 novos controles de cabeçalho**: navHamburguer, buscaBarra, buscaVoz,
  navCriar, avatarConta — todos testados individualmente e em conjunto
  (screenshot: cabeçalho reduzido só ao logo).
- ➕ **Paridade com a extensão Unhook real** (pasta `yt/`, código de
  produção): reaproveitados seletores CSS validados de
  `barraBotoesVideo`, `donoCanalVideo`, `descricaoVideo` (subitens de
  informações do vídeo), `fotosPerfilComentarios`, `resultadosBuscaExtras`,
  e ampliação dos seletores de `shorts` e `mixes` com variantes adicionais
  (grade de shorts, links de rádio) presentes no CSS de produção da Unhook.
- 🔍 **Decisão registrada**: Não portada a automação de "Disable
  Annotations" da Unhook. Inspecionado ao vivo o menu de configurações do
  player — o item "Annotations" não existe mais (removido pelo YouTube em
  2019); a heurística da Unhook ("último checkbox que não é Ambient mode")
  hoje selecionaria "Voice boost" por engano. Implementar isso seria
  replicar um bug, não uma feature — documentado em LIMITACOES.md.
- ⏳ `fotosPerfilComentarios` e `arrecadacao` seguem best-effort (não
  validados ao vivo — condições não reproduzidas na inspeção).
- ⏳ Smoke test manual pós-recarga.

## Rodada 9 — YouTube: nova plataforma (2026-07-13)

Pedido do usuário: adicionar YouTube usando a lista da extensão Unhook como
referência funcional.

- 🐛 **Bug pego durante o próprio QA, corrigido antes de entregar**: os
  seletores baseados em `nth-of-type` para itens do guia lateral (navHome,
  shorts, listaCanaisInscritos, secaoVoce, navCanal) casavam com o elemento
  errado. Causa: a seção "Você" usa um template DOM diferente das demais
  seções (collapsible aninhado com `#header`/`#section-items`), e as demais
  seções misturam tags diferentes como irmãos (quebra `nth-of-type`, que
  conta só entre irmãos do mesmo tipo de tag). Corrigido trocando para
  `:nth-child` escopado a `#items`/`#section-items`. Todos os 12 seletores
  de posição revalidados após a correção — cada um casou com o texto
  esperado.
- ✅ 30 controles em 8 grupos, todos validados ao vivo (feed, barra lateral
  do vídeo, tela final do player, conteúdo, cabeçalho, menu lateral inteiro,
  seção "Você" completa, navegação, comportamento do autoplay).
- ✅ Teste visual: com Shorts, canais inscritos, seção "Você" e denúncias
  ocultos, a página inicial (rota /feed/subscriptions, que é a home real
  desta conta) permaneceu íntegra e navegável.
- ✅ Página /watch: barra lateral, recomendados, comentários, informações do
  vídeo, offer-module e botão de autoplay confirmados presentes e únicos.
- ⏳ telaFinalFeed/telaFinalCards e arrecadacao (fundraiser) não puderam ser
  testados visualmente ao vivo (exigem vídeo terminando / live com doação);
  mantidos como best-effort, documentado em LIMITACOES.md.
- ⏳ Smoke test manual pós-recarga da extensão.

## Rodada 8 — toggles sem resposta em abas antigas (2026-07-13)

- 🐛 Causa raiz: recarregar a extensão (↻) orfana os content scripts das
  abas já abertas — elas param de ouvir o storage até um F5. Com os vários
  reloads do desenvolvimento, abas do TikTok ficaram "surdas".
- ✅ Fix 1: service worker mínimo reinjeta os content scripts nas abas
  abertas em `onInstalled` (novas permissões: scripting + host_permissions).
- ✅ Fix 2: engine detecta contexto invalidado e desconecta o observer do
  script órfão (evita disputa de marcações com o script novo).
- ⚠️ Transição: após ESTA recarga, dar um último F5 nas abas abertas (as
  órfãs atuais não têm o guard); das próximas atualizações em diante, F5
  não será mais necessário.

## Rodada 7 — X: centralização e flutuantes (2026-07-13)

- ➕ **engine.extraCss**: regras podem injetar CSS adicional além de
  display:none (usado para layout).
- ✨ **barraEsquerda agora centraliza o feed**: `main { align-items: center }`
  quando o menu esquerdo está oculto. ✅ validado ao vivo (margens 341/354px).
- ➕ **flutuantes**: oculta GrokDrawer + chat-drawer-root (botões do canto
  inferior direito). ✅ validado ao vivo.
- ⏳ Smoke test manual pós-recarga.

## Rodada 6 — Instagram: ocultar feed inteiro (2026-07-13)

- ➕ **feedInteiro**: oculta todos os posts da home (contas seguidas e
  anúncios), escopado à rota `/`. ✅ validado ao vivo: 4 articles (incl.
  anúncio) ocultos, página íntegra, posts inseridos dinamicamente cobertos
  pelo observer.
- ⏳ Smoke test manual pós-recarga.

## Rodada 5 — novos controles do Instagram (2026-07-13)

Pedido do usuário: opções para os elementos restantes com tudo oculto.

- ➕ **stories**: tray do topo do feed (canvas do anel como assinatura).
  ✅ validado ao vivo; carrosséis de post intactos.
- ➕ **balaoMensagens**: balão flutuante inferior-direito (detecção
  geométrica, sem dependência de idioma). ✅ validado ao vivo.
- ➕ **painelPerfil**: bloco perfil + "Trocar" do painel direito. ✅ validado.
- ➕ **rodape**: links institucionais (painel direito + footer da página).
  ✅ validado.
- ➕ **logo**: logotipo do rail. ✅ validado.
- ✅ Feed e demais elementos permanecem intactos com os 5 ativos.
- ⏳ Smoke test manual pós-recarga.

## Rodada 4 — correções e novos controles (2026-07-13)

Origem: feedback do usuário em uso real.

- 🐛 **Instagram/sugestoes corrigido**: com a regra ativa ao abrir o site, a
  heurística de subida rodava antes do layout estabilizar (alturas 0), subia
  até um contêiner raiz e apagava a página inteira. Corrigido com guardas de
  largura (≤520px), conteúdo (não sobe para quem contém article/nav/main) e
  faixa de altura válida (150–620px). ✅ validado no feed; /explore/people
  nem contém o link-âncora (risco zero).
- ➕ **X/abaSeguindo**: oculta a 2ª aba da timeline. ✅ validado ao vivo.
- ➕ **X/barraEsquerda**: oculta o menu esquerdo (`header[role="banner"]`).
  ✅ validado ao vivo (feed permanece visível).
- ➕ **TikTok/sugestoesContas**: oculta os 19 cards `recommend-card` da
  página /following (caso da imagem reportada). ✅ validado ao vivo, sidebar
  intacta.
- ⏳ Smoke test manual pós-recarga da extensão.

### Rodada 3 — validação manual do usuário (2026-07-12)
- ✅ Smoke test do popup real pós-recarga, incluindo a regra corrigida de
  notícias do X e o toggle geral
- ✅ AC-09: extensão carregada e testada no Brave
- ✅ AC-02 (completo): persistência garantida por `chrome.storage.local`
  (validada em reload de página; sobrevive a reinício do navegador por
  design da API — reconfirmar casualmente no uso diário)

## Rodada 12 - otimizacao profunda de CPU/popup (2026-07-20)

Pedido do usuario: reduzir CPU, bateria e tempo de abertura do popup sem
remover funcionalidades, medindo antes/depois e evitando otimizacoes por
suposicao.

- Baseline estatica antes: ZIP de producao tinha 25.080 bytes; fonte runtime
  empacotavel somava 59.397 bytes. O motor mantinha MutationObserver ativo
  para qualquer plataforma com regra dinamica, mesmo sem regra dinamica
  ligada, e clearMarks() varria o documento para regras desligadas a cada
  rodada. O popup renderizava todos os paineis em toda abertura.
- Motor otimizado: observer agora so existe quando ha regra dinamica ativa e
  observavel; regras observe:false rodam em init/estado/rota sem observar
  mutacoes; regras desligadas nao consultam DOM; marcas sao limpas apenas em
  transicao ativo -> inativo; mutacoes processam apenas addedNodes conectados
  em lote por requestAnimationFrame.
- SPA: patch unico de history.pushState, replaceState, popstate e
  yt-navigate-finish; sem polling e sem reiniciar listeners por rota.
- Inicializacao duplicada: removido service worker de reinjecao e a permissao
  scripting; background.js removido. O motor usa singleton global versionado
  e reinstala no maximo um listener de storage/rota por pagina.
- Instagram: railLinks() agora e calculado uma vez por ciclo e as regras usam
  ctx.all() para limitar buscas a documentos completos apenas em
  init/rota/ativacao, ou ao no adicionado em mutacoes. Guardas geometricas de
  sugestoes preservadas.
- TikTok: paraVoce marcado como observe:false; segue rodando ao ativar a regra
  e em mudanca de rota, sem observar feed continuamente.
- YouTube: regras de menu baseadas apenas em href convertidas para CSS
  :has(...); redirecionarInscricoes marcado como observe:false; shorts ganhou
  seletor CSS para ytd-rich-shelf-renderer[is-shorts].
- Popup: renderizacao lazy por aba, DocumentFragment, delegacao de eventos,
  gravacao parcial no storage por toggle e reset completo apenas no comando de
  restauracao. Em teste automatizado com aba ativa YouTube, apenas o painel
  YouTube foi renderizado inicialmente (44 toggles de painel, 0 nos outros
  paineis).
- Smoke automatizado em Chrome headless instalado: node --check passou para
  content/*.js e popup/popup.js; CSS-only aplica estilo sem regra dinamica;
  dinamica liga, oculta, desliga e remove a marca; popup lazy, troca de abas,
  gravacao parcial e reset validados com stubs de chrome.storage/chrome.tabs.
- Validacao ao vivo Chrome/Brave: NAO EXECUTADA nesta sessao porque nao havia
  conector de controle do Chrome/Brave autenticado exposto. Chrome instalado
  foi usado para smoke headless via Playwright. Brave nao foi encontrado nos
  caminhos padrao.
## Rodada 13 — Shorts, organização e backup local (2026-07-24)

Pedido do usuário: controles específicos para Shorts de pesquisa e canais,
cards de sugestão ao fim do vídeo, organização do popup por finalidade e
importação/exportação de configurações.

- ✅ **Shorts na pesquisa**: confirmado ao vivo que a prateleira “Latest
  Shorts from...” atual usa `grid-shelf-view-model`, não o antigo
  `ytd-reel-shelf-renderer`. O seletor escopado encontrou 1 prateleira e a
  página preservou 2 resultados de vídeo normais.
- ✅ **Aba Shorts dos canais**: confirmado ao vivo em
  `@HojenoMundoMilitar` que a barra contém Home, Vídeos, Shorts, Live,
  Playlists e Posts; o seletor do 3º `[role=tab]` encontrou somente Shorts.
- ✅ **Cards no final do vídeo**: em página `/watch`, o player expôs 12
  cards `.ytp-videowall-still` e 1 contêiner `.ytp-endscreen-content`; ambos
  são cobertos pelo controle “Ocultar sugestões de vídeos no final”.
- ✅ **Popup**: controles de Shorts reunidos na seção própria; demais grupos
  receberam títulos funcionais. Engrenagem abre opções locais de exportação e
  importação; backup usa JSON versionado, valida formato/tipos/chaves,
  completa padrões e exige confirmação antes de substituir o estado.
- ✅ `node --check` passou em `content/youtube.js` e `popup/popup.js`.
- ⏳ Smoke manual pós-recarga da extensão: abrir uma nova aba do YouTube
  depois de recarregar a extensão em `chrome://extensions` (ritual F5).

## Rodada 14 — correção de escopo na pesquisa e tela final (2026-07-24)

Feedback do usuário: `shortsBusca` ocultava também o resultado do canal, e
os cards mostrados ao terminar o vídeo precisavam de cobertura explícita.

- 🐛 **Causa confirmada ao vivo**: o seletor anterior subia até
  `ytd-item-section-renderer`; esse único contêiner possuía tanto o canal
  quanto `grid-shelf-view-model`. Removida a subida e mantido somente o grid.
- ✅ **Seletividade confirmada**: 1 grid de Shorts encontrado; o grid não
  contém `ytd-channel-renderer`, enquanto o contêiner antigo contém o canal.
- ✅ **Tela final confirmada**: vídeo encerrado expôs 1 `.html5-endscreen`,
  1 `.ytp-endscreen-content` e 12 `.ytp-videowall-still`. O controle agora
  oculta o pai inteiro e mantém os dois seletores internos como fallback.
- ✅ Chaves `shortsBusca` e `telaFinalFeed` preservadas; nenhuma migração de
  preferências. Label da tela final esclarecido no popup.
- ⏳ Smoke manual de liga/desliga após recarregar a extensão.

## Rodada 15 — controle visível dos cards finais (2026-07-24)

Feedback do usuário: o controle dos cards ao final do vídeo não era fácil de
encontrar no popup.

- ✏️ **Organização do popup**: `telaFinalFeed` foi movido para logo após
  “Feed inicial”, no grupo “Quando o vídeo termina”, com o texto direto
  “Ocultar cards de recomendação no fim do vídeo”.
- ✏️ **Separação de contexto**: `telaFinalCards` foi mantido no grupo
  independente “Durante o vídeo”; não há mais dois controles de natureza
  diferente no mesmo grupo.
- ✅ A regra e a chave persistida `telaFinalFeed` permanecem inalteradas:
  `.html5-endscreen`, `.ytp-endscreen-content` e
  `.ytp-videowall-still` continuam cobertos.
- ⏳ Smoke manual após recarregar a extensão: confirmar que o primeiro grupo
  após Feed inicial aparece sem rolagem e alterna os cards finais.

## Rodada 16 — tela final moderna do YouTube (2026-07-24)

Feedback do usuário: os cards continuavam visíveis em uma tela final moderna.

- 🐛 **Causa confirmada ao vivo**: os três cards visíveis eram
  `.ytp-modern-videowall-still`, dentro de `.ytp-fullscreen-grid`; não eram
  descendentes de `.html5-endscreen`.
- ✅ **Cobertura adicionada**: `telaFinalFeed` agora inclui a grade moderna e
  seus cards, além do formato clássico já suportado. A chave persistida e o
  toggle no topo do popup foram preservados.
- ⏳ Smoke manual após recarregar a extensão: encerrar o vídeo e alternar
  “Ocultar cards de recomendação no fim do vídeo”.
