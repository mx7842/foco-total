# Permissões solicitadas

Princípio: menor permissão possível (PRD §13).

| Permissão | Por quê |
|---|---|
| `storage` | Salvar as preferências de ocultação localmente (`chrome.storage.local`). Nada é sincronizado nem enviado a servidores. |
| Content scripts em `x.com`, `twitter.com`, `instagram.com`, `tiktok.com`, `www.youtube.com`, `facebook.com` e `www.facebook.com` | Injetar o CSS/JS de ocultação apenas nesses domínios. A extensão não roda em nenhum outro site. |

O popup usa `chrome.tabs.query` para saber em qual das 5 redes a aba ativa
está e já abrir a aba certa no painel — isso **não exige permissão extra**:
a API sempre pode ser chamada, e o `host_permissions` acima já garante que a
URL da aba ativa é visível quando ela é uma das 5 redes suportadas (para
qualquer outro site, a URL fica oculta e a detecção simplesmente não age).

O que a extensão **não** faz:

- Nao ha service worker/background em runtime. A extensao roda apenas no popup e nos content scripts dos dominios suportados.
- Não lê nem armazena conteúdo de posts, mensagens ou perfis.
- Não usa analytics/telemetria.
- Não exige conta.

O ciclo de vida por rota e a sincronização dos toggles usam somente APIs locais
do navegador. Não foram adicionadas permissões para rede, scripting ou
execução em outros domínios.

## Atualizacao 2026-07-20 - runtime otimizado

A extensao nao usa mais service worker nem permissao scripting. A reinjecao
automatica em abas abertas foi removida porque podia duplicar scripts/listeners
em contextos antigos. A extensao agora roda apenas como content scripts normais
nos dominios declarados e popup; apos atualizar a extensao, abas ja abertas
podem precisar de reload manual para receber a nova versao.

