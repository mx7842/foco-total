# Checklist de testes — Foco Total v1.0.5

Status: ✅ passou · ⚠️ limitação/validação manual · ❌ falhou

## Verificações automatizadas

- ✅ `node --check` em todos os scripts de `content/` e `popup/`.
- ✅ `git diff --check` sem erros de whitespace.
- ✅ Manifesto válido; versão `1.0.5`; todos os arquivos de content scripts,
  ícones e páginas referenciados existem.
- ✅ IDs do popup são únicos e todas as chaves catalogadas possuem regra.
- ✅ O catálogo não expõe a chave legada
  `perfilSugestoesAmigosFotos`.
- ✅ O ZIP contém `manifest.json`, `popup/`, `content/` e `icons/`, e o
  manifesto interno também informa `1.0.5`.
- ✅ O branch mantém somente `foco-total-v1.0.5.zip`; pacotes anteriores ficam
  no histórico/release.

## Popup, armazenamento e restauração

- ✅ O reset da rede selecionada limpa somente suas regras e preserva as outras
  redes e o estado global.
- ✅ O reset global, ao lado da engrenagem, limpa todas as redes e o estado
  global.
- ✅ A migração da chave `perfilSugestoesAmigosFotos` inicializa os quatro
  controles de perfil sem sobrescrever valores novos já existentes.
- ✅ Novos backups não exportam a chave legada; backups antigos podem ser
  importados e convertidos.
- ⚠️ A confirmação visual final do popup depende de abrir a interface da
  extensão no Chrome; páginas `chrome://` não são controláveis pelo debugger.

## Motor compartilhado

- ✅ Alternar extensão ou site remove imediatamente estilo, atributos,
  observer e tarefas pendentes.
- ✅ Reativar faz varredura completa e reconecta somente o observer necessário.
- ✅ Contexto invalidado após reload é tratado sem erro e sem marcas órfãs.
- ✅ Mudanças em `chrome.storage.onChanged` aplicam toggles sem reload da aba.
- ✅ Existe um único observer; mutações incrementais processam raízes
  compactadas em vez de varrer a página inteira.
- ✅ Regras e CSS dependentes de rota são reconstruídos em navegação SPA.

## Facebook — matriz de rotas

- ✅ Perfil principal e subrotas reconhecidas: raiz do usuário, `reels`,
  `photos`, `friends`, `about` e `posts`.
- ✅ Rotas globais rejeitadas: `/friends/`, `/groups/`, `/reels/`,
  `/marketplace/` e `/watch/`.
- ✅ Os quatro blocos do perfil usam controles independentes: sugestões, dados
  pessoais, Amigos e Fotos.
- ✅ `perfilAbaAmigos` permanece separado do card Amigos.
- ✅ `feedInteiro` só aplica bloqueio de rolagem na home.
- ✅ `patrocinados` só oculta a lateral na home; o detector de patrocinados do
  feed continua dinâmico.
- ✅ Guardas semânticas e dimensionais impedem capturar `main`, `[role="main"]`
  ou o contêiner geral do perfil.
- ⚠️ A estrutura do Facebook é dinâmica; o smoke visual deve ser repetido em
  uma sessão autenticada após recarregar a extensão e a aba.

## Outras plataformas

- ✅ X, Instagram, TikTok e YouTube continuam declarados no manifesto e no
  catálogo, sem alteração de chaves ou permissões.
- ✅ Não foram encontrados arquivos de código/documentação mortos; os únicos
  artefatos removidos foram ZIPs históricos substituídos pelo pacote atual.
- ⚠️ Controles best-effort do YouTube para arrecadação e comentários de fotos
  continuam dependentes de conteúdo que nem sempre está disponível para teste.

## Release

- ✅ Versão `1.0.5` alinhada em manifesto, popup, motor, README e docs.
- ✅ Commit, tag `v1.0.5`, release e ZIP publicados no GitHub.
- ✅ Notas da release descrevem plataformas, resets, correções, privacidade,
  permissões, limitações, instalação e validações.
