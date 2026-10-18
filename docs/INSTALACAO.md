# Instalação local (Chrome e Brave)

1. Baixe/clone a pasta do projeto (ou extraia `foco-total-v1.0.5.zip`).
2. Abra `chrome://extensions` (Chrome) ou `brave://extensions` (Brave).
3. Ative o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** e selecione a pasta raiz do
   projeto (a que contém o `manifest.json`).
5. Fixe o ícone da Foco Total na barra de ferramentas e clique nele para
   abrir o painel.

## Estado inicial

- Extensão ligada, **nenhuma** regra de ocultação ativa (PRD AC-01).
- As preferências ficam só no `chrome.storage.local` do navegador — Chrome e
  Brave mantêm configurações independentes e nada é sincronizado ou enviado
  para fora.

## Atualização

Após alterar arquivos, clique no botão ↻ (Atualizar) do card da extensão em
`chrome://extensions` e recarregue as abas das redes sociais abertas.

O pacote oficial da versão atual é `foco-total-v1.0.5.zip`. Depois do reload,
abra o popup novamente para conferir a versão e as configurações persistidas.

O botão de restauração dentro do painel atua somente na rede selecionada. A
restauração de todas as redes fica no botão ↻ do cabeçalho, ao lado da
engrenagem.
