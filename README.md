# Foco Total

Extensão de navegador (Chrome/Brave, Manifest V3) que oculta distrações em
X, Instagram, TikTok e YouTube — item por item, 100% local, sem conta e sem
coleta de dados.

- Instalação: [docs/INSTALACAO.md](docs/INSTALACAO.md)
- Permissões: [docs/PERMISSOES.md](docs/PERMISSOES.md)
- Mapeamento técnico dos seletores: [docs/MAPEAMENTO_ELEMENTOS.md](docs/MAPEAMENTO_ELEMENTOS.md)
- Limitações conhecidas: [docs/LIMITACOES.md](docs/LIMITACOES.md)
- Checklist de testes: [docs/CHECKLIST_TESTES.md](docs/CHECKLIST_TESTES.md)

## Estrutura

```
manifest.json      MV3, permissao storage
popup/             painel (HTML/CSS/JS puros, dark + verde-neon)
content/engine.js  motor: CSS injetado reversível + MutationObserver único
content/x.js       regras do X
content/instagram.js  regras do Instagram
content/tiktok.js  regras do TikTok (inventário via inspeção ao vivo)
content/youtube.js regras do YouTube (organização inspirada na Unhook)
icons/             ícones originais
docs/              documentação técnica
```

## Atualizacao 2026-07-20 - otimizacao

O runtime atual nao possui background service worker. O motor e idempotente,
usa observer somente quando ha regra dinamica ativa/observavel e processa
mutacoes por addedNodes. O popup renderiza apenas a aba inicial e cria os demais
paineis sob demanda.

