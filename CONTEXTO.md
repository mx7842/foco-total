# Contexto do projeto — Foco Total

Estado atual: **v1.0.6**. A extensão é uma extensão MV3 local para Chrome e
Brave que oculta seletivamente elementos de distração em X, Instagram, TikTok,
YouTube e Facebook.

## Arquitetura atual

- `manifest.json` declara apenas `storage` e os hosts das cinco plataformas.
- `content/engine.js` é o motor compartilhado. Cada plataforma registra seu
  conjunto de regras por meio de `FocoTotal.init(nome, rules)`.
- O motor monta uma única folha `#foco-total-style`, mantém no máximo um
  `MutationObserver` por página e marca ocultações dinâmicas com
  `data-foco-total-hide`.
- O popup é HTML/CSS/JS puro, sem framework, build step ou chamadas de rede.
- Não há service worker, backend, conta, telemetria ou sincronização remota.
- `icons/` contém os PNGs distribuíveis e o pacote atual é
  `foco-total-v1.0.6.zip`.

## Plataformas e controles

- **X:** navegação lateral, busca, notícias, tendências, sugestões, Premium,
  feed Para você e ações de posts.
- **Instagram:** navegação, recomendações, stories, sugestões, publicações e
  elementos do rail.
- **TikTok:** navegação, busca, feed Para você, interações e metadados de
  vídeos.
- **YouTube:** guia lateral, Shorts, recomendações, comentários, anúncios e
  controles adicionais disponíveis na interface observada.
- **Facebook:** feed e publicação, stories, sugestões, patrocinados, busca,
  rodapé, menu lateral, cabeçalho, ações da conta, controles adicionais e
  blocos do perfil.

No perfil do Facebook, os blocos têm controles independentes para **Pessoas
que talvez você conheça**, **Dados pessoais**, **Amigos** e **Fotos**. A aba de
navegação **Amigos** continua separada. No cabeçalho, menu, Messenger,
notificações e perfil/conta também são controles independentes; não existe mais
um controle agregado que oculte a barra inteira. Os resets também são independentes:
o botão do painel restaura somente a rede selecionada e o botão no cabeçalho,
ao lado da engrenagem, restaura todas as redes.

## Armazenamento e migrações

- As preferências ficam em `chrome.storage.local`, separadas por plataforma.
- O estado global da extensão e o estado de ativação por site são preservados
  nos resets conforme o escopo escolhido.
- A chave antiga `perfilSugestoesAmigosFotos` continua sendo aceita apenas
  para migração; ao abrir/salvar o popup, seu valor é distribuído para os
  quatro controles novos e a chave antiga deixa de ser exportada.
- A antiga chave agregada `acoesConta` é descartada na migração e não é
  convertida para os controles individuais, evitando ocultações inesperadas.
- Backups usam `BACKUP_VERSION = 1`, que é o formato do backup e não a versão
  da extensão.

## Ciclo de vida do motor

- O motor verifica o runtime com tratamento seguro para contexto invalidado;
  se a extensão foi recarregada, remove estilo, atributos, observer e tarefas
  pendentes sem lançar erro para a página.
- Mudanças de estado no `chrome.storage.onChanged` reconstroem o CSS e fazem
  uma varredura completa imediata. Desligar extensão ou site limpa tudo.
- Mudanças de rota limpam as marcas antigas e executam novamente as regras;
  em mutações incrementais, raízes aninhadas são compactadas e apenas a área
  adicionada ou seu ancestral relevante é processada.
- CSS e `extraCss` podem ser funções dependentes de `{ platform, pathname,
  href }`, permitindo que uma regra exista somente na rota correta.
- O observer só é conectado quando há regra dinâmica observável ativa. Não há
  polling nem reinjeção automática em abas antigas.

## Facebook: rotas e segurança

O perfil reconhece a página principal e subrotas como `reels`, `photos`,
`friends`, `about` e `posts`, mas rejeita rotas globais como `/friends/`,
`/groups/`, `/reels/`, `/marketplace/` e `/watch/`. As heurísticas de perfil
priorizam headings semânticos, texto pt-BR/en, links, imagens e ações do card,
com limites dimensionais e sem subir até `main`, `[role="main"]` ou o
contêiner geral do perfil.

As regras de feed inteiro e patrocinados da home também possuem escopo de rota
no CSS; assim, não bloqueiam rolagem nem ocultam a lateral em perfil, Reels,
Fotos ou rotas globais.

## Limitações conhecidas

- Redes sociais mudam DOM, rótulos e landmarks. Quando não há atributo estável,
  as regras usam sinais combinados e falham de forma conservadora.
- Alguns controles dependem de textos pt-BR/en e podem não atuar em outros
  idiomas.
- O Instagram usa heurísticas geométricas delimitadas e o TikTok tem classes
  com sufixos de componentes que podem mudar.
- YouTube possui controles best-effort para arrecadação e comentários de
  fotos; recursos removidos ou sem marcador estrutural não são simulados.
- Conteúdo dinâmico pode piscar brevemente antes de existir no DOM.
- Depois de atualizar a extensão em `chrome://extensions`, abas já abertas
  precisam de reload manual para receber o novo content script.

## Histórico resumido

- `v1.0.0`: arquitetura MV3, motor compartilhado e regras iniciais para X,
  Instagram e TikTok.
- `v1.0.1`: Facebook entrou no manifesto e no catálogo.
- `v1.0.2–v1.0.4`: expansão do Facebook, controles de perfil, migração dos
  controles individuais, sincronização por rota e restauração por rede.
- `v1.0.5`: auditoria do motor e das regras, limpeza de artefatos antigos,
  CSS dependente de rota no Facebook, tratamento de contexto invalidado,
  documentação consolidada e release distribuível atual.
- `v1.0.6`: remoção do controle agregado de ações da conta do Facebook,
  migração segura da chave antiga e publicação dos controles independentes.

## QA e publicação

As validações estáticas ficam em [docs/CHECKLIST_TESTES.md](docs/CHECKLIST_TESTES.md).
O mapeamento de seletores e fragilidades fica em
[docs/MAPEAMENTO_ELEMENTOS.md](docs/MAPEAMENTO_ELEMENTOS.md). O ZIP oficial é
gerado somente com `manifest.json`, `popup/`, `content/` e `icons/`; releases
anteriores permanecem recuperáveis pelo histórico Git e pelas releases do
GitHub, não no branch de trabalho.
