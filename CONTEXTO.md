# Contexto do projeto — Foco Total

Histórico de decisões e estado do desenvolvimento. Para regras de trabalho,
ver [CLAUDE.md](CLAUDE.md). Para a especificação original, ver o PRD em
`C:\Users\User\Downloads\foco-total-prd\foco-total-prd\PRD_Foco_Total.md`.

## Linha do tempo

**2026-07-12 — Construção inicial (Fases 1–6 do plano aprovado)**
- Estrutura MV3 criada do zero: manifest, `content/engine.js` (motor
  compartilhado), regras por plataforma, popup dark + verde-neon (mockups do
  usuário misturados livremente), ícones originais gerados via
  `System.Drawing`.
- Inspeção ao vivo das 3 redes via Claude in Chrome (sessão real do usuário,
  já logada) — X em inglês, Instagram/TikTok em pt-BR, janela 1920×855.
  Resultado documentado em `docs/MAPEAMENTO_ELEMENTOS.md`.
- Inventário do TikTok construído do zero via `data-e2e` (61 atributos
  encontrados na home) → 22 controles em 5 grupos.
- QA automatizado via **ponte de QA temporária** injetada em `engine.js`
  (permitia postMessage → chrome.storage.local.set, contornando o fato de
  `chrome-extension://` não ser navegável pelas ferramentas de automação).
  Encontrado e corrigido durante essa rodada: regra `noticias` do X
  quebrava após reload (X passou a renderizar os artigos fora do
  `news_sidebar`). Ponte removida do build final.
- Build inicial entregue: `foco-total-v1.0.0.zip`.
- Versão atual distribuível: `foco-total-v1.0.1.zip`.

## Atualização 2026-10-14 — publicação 1.0.1

- O Facebook passou a ser uma plataforma suportada no manifesto, com regras
  em `content/facebook.js` e controles no popup.
- A cobertura inclui barra de postagem, feed Para você/Foryou com bloqueio de
  rolagem, stories, sugestões de grupos, placeholders, patrocinados, ações da
  conta, ícones superiores, busca, rodapé, botão flutuante e menu lateral
  individual ou completo.
- A home atual usa `div[role="main"]` e controles `div[role="button"]`; as
  regras foram ajustadas para esses landmarks sem depender das classes
  ofuscadas do Facebook.
- A versão 1.0.1 foi validada ao vivo no Chrome e publicada com imagens
  públicas da interface no README.

**2026-07-13 — Correções e expansão via feedback do usuário**

1. **Bug crítico do Instagram**: com "Ocultar sugestões de perfis" já
   ativado ao abrir o site, a heurística de subida no DOM rodava antes do
   layout estabilizar (alturas ainda em 0px), subia sem limite e marcava um
   contêiner raiz — apagando a página inteira. Corrigido com guardas
   explícitas: não sobe para contêiner >520px de largura, não sobe para quem
   contém article/nav/main, só oculta blocos com altura entre 150–620px.
   **Lição**: qualquer heurística geométrica/estrutural que "sobe" no DOM
   precisa desses limites — ver regra em CLAUDE.md.

2. **Controles novos por pedido direto do usuário** (todos validados ao vivo
   antes de entregar):
   - X: `abaSeguindo` (oculta a 2ª aba da timeline), `barraEsquerda` (menu
     esquerdo inteiro, com `extraCss` centralizando o feed quando oculto),
     `flutuantes` (botões Grok/Chat do canto inferior direito).
   - Instagram: `stories`, `balaoMensagens` (detecção geométrica, sem
     depender de idioma), `painelPerfil`, `rodape`, `logo`, e por fim
     `feedInteiro` (oculta todos os posts da home, incluindo anúncios e
     contas seguidas — escopado à rota `/` para não afetar posts/perfis
     abertos diretamente).
   - TikTok: `sugestoesContas` (grade de cards "Seguir" da página
     /following, que não tinha controle).

3. **Motor estendido**: `engine.js` ganhou suporte a `extraCss` por regra
   (CSS além de display:none — usado para a centralização do X). Ver
   `buildCss()`.

4. **Bug de responsividade ("site não responde na hora")**: causa raiz —
   recarregar a extensão em `chrome://extensions` órfão os content scripts
   das abas já abertas (storage.onChanged para de disparar até F5). Como o
   dia teve muitos reloads incrementais, abas antigas do TikTok ficaram
   "surdas". Corrigido em duas frentes:
   - `background.js` (novo): service worker mínimo que reinjeta os content
     scripts em todas as abas abertas no evento `onInstalled`. Exigiu
     permissões novas: `scripting` + `host_permissions` dos 4 domínios.
   - `engine.js`: guard `!chrome.runtime?.id` desconecta o observer do
     script zumbi para não disputar marcações com o script reinjetado.
   - Transição única: um F5 manual foi necessário nas abas que já estavam
     abertas antes da correção. Da atualização seguinte em diante, não é
     mais necessário.

**2026-07-13 (continuação) — Quarta plataforma: YouTube**
- Adicionado por pedido direto do usuário, usando a lista de controles da
  extensão Unhook (screenshots) como referência **funcional** — organização
  dos toggles, não identidade visual (permitido pelo PRD §15).
- YouTube usa custom elements (`ytd-*`, `ytp-*`), muito mais estáveis que
  classes ofuscadas — mapeamento mais confiável que Instagram/TikTok.
- **Bug pego e corrigido no próprio QA, antes de entregar**: seletores de
  posição no guia lateral (navHome, shorts, listaCanaisInscritos, secaoVoce,
  navCanal) inicialmente usavam `:nth-of-type`, que conta só entre irmãos do
  mesmo nome de tag. A seção "Você" do guia usa um template completamente
  diferente das demais (um `ytd-guide-collapsible-section-entry-renderer`
  aninhado com `#header`/`#section-items`, em vez do `#items` simples das
  outras seções), e mesmo dentro do `#items` simples há tags diferentes
  misturadas (ex.: o item "Downloads" vem embrulhado em
  `ytd-guide-downloads-entry-renderer`). Corrigido trocando para
  `:nth-child` escopado ao contêiner certo de cada seção — revalidado ao
  vivo, os 12 seletores de posição bateram com o texto esperado.
- 30 controles em 8 grupos: feed inicial (+ redirecionar para inscrições),
  barra lateral do vídeo (recomendados/chat/playlist/arrecadação), tela
  final do player, conteúdo (shorts/comentários/mixes/merch/info), menu
  lateral inteiro com item-a-item (Início, lista de canais, toda a seção
  "Você" com 6 subitens, denúncias), navegação (Explorar, Mais do YouTube,
  rodapé) e comportamento do player (desativar autoplay).
- Não implementado, por falta de marcador confiável: "ocultar resultados de
  busca inapropriados" (contrário à postura conservadora do PRD §6.1) e
  "desativar anotações" (recurso removido pelo YouTube há anos).

**2026-07-13 (continuação 2) — YouTube: cabeçalho, bug de layout, paridade Unhook real**
- Usuário revelou que havia copiado a extensão Unhook real (não só
  screenshots) para uma pasta `yt/` na raiz do projeto —
  `yt/css/content.css` contém os seletores CSS de produção completos,
  `yt/js/unhook-yt.js` a lógica de autoplay/anotações, `yt/popup.html` a
  lista canônica de todas as configurações. Isso foi tratado como fonte de
  referência técnica para validar/completar nosso mapeamento (não copiamos
  identidade visual — PRD §15 permanece respeitado).
- **Bug de layout real corrigido**: `menuLateral` só escondia o contêiner
  do menu (`display:none`), mas o próprio CSS do YouTube reserva
  `margin-left: 240px` em `#page-manager` via atributo
  `guide-persistent-and-visible` no `<ytd-app>` — independente da
  visibilidade do elemento. Resultado: faixa vazia permanente à esquerda.
  Fix: `extraCss` (mecanismo já existente desde a centralização do X)
  resetando a margem quando `menuLateral` está ativo.
- 5 controles novos para os ícones do cabeçalho (hamburguer, busca, busca
  por voz, Criar, avatar) — pedido explícito do usuário via screenshot com
  setas apontando os ícones.
- Reaproveitados seletores reais da Unhook para itens que faltavam:
  barra de botões do vídeo, dono do canal, descrição, fotos de perfil nos
  comentários, prateleiras extras de busca, e ampliação de shorts/mixes.
- **Decisão deliberada de não portar tudo**: a automação de "Disable
  Annotations" da Unhook foi inspecionada e descartada — o item de menu que
  ela busca (`.ytp-menuitem[role=menuitemcheckbox]` "Annotations") não
  existe mais na UI do YouTube desde 2019; a heurística de fallback da
  Unhook hoje mira "Voice boost" por engano. Replicar teria introduzido um
  bug real (alterar configuração de áudio do usuário sem ele saber), indo
  contra a postura conservadora do PRD — julgamento de engenharia, não
  preguiça.

**2026-07-13 (continuação 3) — Liga/desliga por site, aba automática, menu compacto**
- Novo nível de controle: `state.siteEnabled` no storage, um toggle "Ativado
  no <Rede>" por aba do popup, mantendo o botão geral com prioridade (PRD
  §17.1) — `engine.js` combina os dois via `isActive()`.
- Popup agora detecta a aba ativa (`chrome.tabs.query`, sem permissão nova
  — já coberto pelo `host_permissions`) e abre direto na rede certa.
- **Bug real corrigido**: o YouTube tem dois menus laterais (expandido com
  nomes / compacto só ícones, alternando conforme o usuário clica no ☰ ou
  redimensiona a janela) — os controles anteriores (Rodada 9) só cobriam o
  expandido. Usuário reportou explicitamente "faltou ocultar o Home" no
  modo compacto. Corrigido **mesclando** seletores do menu compacto
  (`ytd-mini-guide-entry-renderer`, por href) direto nos mesmos controles
  já existentes, em vez de criar toggles duplicados — decisão deliberada
  para manter a lista de controles simples.
- Revisão de nomenclatura: labels do YouTube reescritos em linguagem mais
  simples, títulos de grupo com contexto extra quando ajuda a entender o
  efeito.

**2026-07-24 — Shorts, backup local e telas finais modernas do YouTube**
- Reorganizado o popup das quatro redes por finalidade. No YouTube, os
  controles de Shorts ficaram juntos e o controle de cards do fim do vídeo
  foi movido para o topo, logo após “Feed inicial”, com o nome “Ocultar cards
  de recomendação no fim do vídeo”. Cards clicáveis durante a reprodução
  permaneceram em grupo independente.
- Adicionados dois controles de Shorts: `shortsBusca`, para a prateleira de
  Shorts nos resultados de pesquisa, e `abaShortsCanal`, para a aba Shorts
  da página de canais. A primeira implementação de `shortsBusca` subia até
  `ytd-item-section-renderer` e ocultava também o card do canal; corrigida
  para mirar somente `grid-shelf-view-model`, confirmado ao vivo sem afetar
  os resultados comuns.
- Popup ganhou engrenagem com exportação/importação local de configurações.
  O backup é JSON versionado, contém ativação global, por site e regras; a
  importação valida formato/tipos/chaves, completa padrões e pede confirmação
  antes de substituir o estado. Não há rede envolvida.
- A tela final do YouTube hoje tem dois DOMs. O formato clássico usa
  `.html5-endscreen`/`.ytp-videowall-still`; o moderno usa
  `.ytp-fullscreen-grid`/`.ytp-modern-videowall-still`. `telaFinalFeed`
  cobre ambos. O formato moderno foi descoberto após o primeiro fix parecer
  não funcionar e validado ao vivo com 12 cards; o usuário confirmou a
  correção após recarregar a extensão e a aba.
- Novo lembrete operacional: após alterações em content/popup, é necessário
  recarregar a extensão e então a página da rede para que a aba deixe de usar
  o content script anterior ("F5 ritual").

## Estado atual

- **X**: 10 controles (paraVoce, abaSeguindo, barraEsquerda, barraLateral,
  busca, noticias, tendencias, premium, sugestoes, flutuantes).
- **Instagram**: 17 controles (feedInteiro, paraVoce, sugestoes, stories,
  balaoMensagens, painelPerfil, rodape, logo + 9 itens de menu lateral).
- **TikTok**: 23 controles em 5 grupos (feed principal + sugestões de
  contas, barra lateral com 11 itens, cabeçalho, interações, conteúdo do
  vídeo).
- **YouTube**: 45 controles em 13 grupos, incluindo Shorts de pesquisa/aba
  de canal, importação/exportação local no popup e cobertura das telas finais
  clássica e moderna.
- **Facebook**: controles para barra de postagem, feed/Foryou com bloqueio de
  rolagem, stories, sugestões de grupos, skeletons do feed, patrocinados,
  ações da conta, cinco ícones superiores, menu lateral inteiro ou 15 itens
  individuais, busca e botão flutuante.
- Todas as regras novas ou corrigidas foram validadas ao vivo via Codex no
  Chrome; regras históricas mantêm o registro original no checklist.
- `docs/CHECKLIST_TESTES.md` tem 21 rodadas registradas cronologicamente —
  é o log de QA mais confiável para saber o que já foi testado e quando.

## Decisões de design que não são óbvias pelo código

- **Por que uma única `<style>` tag em vez de manipular `element.style`
  diretamente**: reversibilidade trivial (remover a tag restaura tudo de
  uma vez) e idempotência (reescrever o mesmo CSS não duplica nada) — ambos
  requisitos explícitos do PRD §12.
- **Por que `data-foco-total-hide` além do CSS puro**: algumas regras
  precisam de lógica JS para decidir *quais* elementos ocultar (ex.:
  distinguir post recomendado de post seguido no Instagram) — CSS puro não
  alcança essa distinção, então a regra marca o nó via JS e o CSS só
  consome a marca.
- **Por que o dicionário pt/en em vez de i18n completo**: o PRD explicitou
  pt-BR como idioma do MVP com "pelo menos uma validação em inglês" — não
  cobertura completa de idiomas. Onde o Instagram não expõe rota/atributo
  estável (poucos casos), um dicionário pt/en é a solução mais barata que
  atende esse requisito sem virar um sistema de i18n.

**2026-07-20 - Otimizacao profunda de performance**
- Motor refeito para observar DOM apenas quando houver regra dinamica ativa e
  observavel; regras inativas nao varrem o documento e clearMarks() roda so em
  transicao ativo -> inativo.
- SPA agora e tratado por patch unico de history/popstate/yt-navigate-finish,
  sem polling.
- Service worker de reinjecao e permissao scripting removidos para evitar boot
  duplicado; background.js removido.
- Popup passou a renderizar paineis sob demanda e salvar apenas a chave
  alterada.
