# AGENTS.md — Foco Total

Instruções de projeto para trabalhar neste repositório. Ver também
[CONTEXTO.md](CONTEXTO.md) para histórico de decisões e estado atual.

## O que é

Extensão MV3 (Chrome/Brave) que oculta seletivamente elementos de distração
em X, Instagram e TikTok. 100% local: sem conta, sem backend, sem telemetria.
Especificação completa: PRD em
`C:\Users\User\Downloads\foco-total-prd\foco-total-prd\PRD_Foco_Total.md`.

## Arquitetura (não redesenhar sem necessidade)

```
manifest.json      MV3. permissions: storage. host_permissions
                    restritos aos dominios suportados.
content/engine.js  motor compartilhado: lê chrome.storage.local, monta uma
                    única <style id="foco-total-style">, MutationObserver
                    único por página para regras `dynamic`.
content/x.js
content/instagram.js
content/tiktok.js
content/youtube.js regras por plataforma, chamando FocoTotal.init(nome, rules)
popup/             popup.html/css/js — vanilla, sem framework, sem build
icons/             PNGs gerados via PowerShell (System.Drawing), não SVG
docs/              documentação técnica obrigatória (ver PRD §10.3 e §22)
```

Cada regra em `rules` é `{ css: [...] }` (ocultação estática) e/ou
`{ dynamic(root, hide) {...} }` (lógica condicional, ex.: distinguir posts
recomendados de posts seguidos) e/ou `{ extraCss: "..." }` (CSS de layout
além de display:none, ex.: centralizar o feed do X quando o menu some).

## Regras de trabalho

- **Sem build step.** JS/CSS/HTML puros. Não introduzir bundler, framework ou
  dependência de npm sem pedido explícito.
- **Seletores**: seguir a ordem de preferência do PRD §10.2 — data-testid/
  data-e2e → roles/aria → href de rota → sufixo de componente em classe
  ofuscada → dicionário de texto pt/en (último recurso, sempre documentado
  em MAPEAMENTO_ELEMENTOS.md com a fragilidade explícita).
- **Toda regra nova precisa ser validada ao vivo** via Codex in Chrome nas
  sessões autenticadas do usuário antes de ser considerada pronta — não
  aceitar seletor "no papel" sem confirmar contagem de matches e efeito
  visual real.
- **Guardas de segurança em heurísticas geométricas/estruturais**: qualquer
  regra que "sobe" no DOM (como `sugestoes` do Instagram) precisa de limites
  de largura/altura/conteúdo — sem guarda, layout ainda não estabilizado
  pode fazer a regra marcar um contêiner raiz e apagar a página inteira
  (bug real já ocorrido, ver CONTEXTO.md).
- **`:nth-of-type` vs `:nth-child` em listas de navegação**: `:nth-of-type`
  só conta irmãos do MESMO nome de tag — se uma lista mistura tags
  diferentes (ex.: o guia do YouTube mistura `ytd-guide-entry-renderer` com
  wrappers especiais como `ytd-guide-downloads-entry-renderer`), a posição
  sai errada silenciosamente. Usar `:nth-child` para posição real na lista,
  escopado ao contêiner correto (confirmar esse contêiner ao vivo — sites
  grandes costumam usar templates diferentes para seções que parecem
  visualmente iguais, ver caso do YouTube "Você" em CONTEXTO.md).
- **Popup e content scripts nunca chamam rede.** Qualquer sugestão de
  fetch/XHR/analytics quebra o requisito de privacidade do PRD §13.
- **Documentação é parte da entrega**, não opcional: toda regra nova ou
  corrigida atualiza `docs/MAPEAMENTO_ELEMENTOS.md` (seletor + estratégia +
  fragilidade) e `docs/CHECKLIST_TESTES.md` (nova rodada, formato existente).
- **Rebuild do zip** após qualquer mudança em manifest/popup/
  content/icons:
  ```powershell
  $src = "D:\DEV\extensoes\extesao-foco-navegador"
  Compress-Archive -Path "$src\\manifest.json","$src\\popup","$src\\content","$src\\icons" -DestinationPath "$src\foco-total-v1.0.0.zip" -Force
  ```

## Armadilha conhecida: "F5 ritual"

Recarregar a extensão em `chrome://extensions` desconecta os content
Recarregar a extensao em `chrome://extensions` pode deixar abas antigas com content scripts da versao anterior ate reload manual da pagina.
A reinjecao automatica foi removida em 2026-07-20 para evitar boot duplicado/listeners repetidos.
Ao testar mudancas ao vivo, prefira abrir uma aba nova ou recarregar a aba da rede.

`chrome-extension://` não é navegável pelas ferramentas de automação do
Codex in Chrome (o debugger não anexa). Para testar toggles sem intervenção
manual, usar o padrão de "ponte de QA" temporária em `engine.js`
(`window.addEventListener('message', ...)` que chama `chrome.storage.local.set`)
— **sempre remover antes de finalizar**, nunca deixar no build entregue.

## Não fazer

- Não adicionar sincronização, conta, ou qualquer chamada de rede.
- Não usar `chrome.storage.sync` (PRD exige armazenamento só local).
- Não remover as guardas de segurança das heurísticas para "simplificar".
- Não commitar a ponte de QA temporária no `engine.js`.

## Atualizacao 2026-07-20 - regras de performance

Nao reintroduzir background/service worker de reinjecao automatica sem um
handshake seguro com a pagina. A permissao scripting foi removida. Regras
dinamicas que so dependem de estado/rota devem usar observe:false para nao
manter MutationObserver ativo. O popup deve continuar lazy-rendered por aba e
com gravacao parcial no chrome.storage.local.

