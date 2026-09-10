# Limitações conhecidas

1. **Idiomas**: seletores independem de idioma sempre que possível (rotas,
   roles, data-testid/data-e2e). Exceções que usam dicionário pt-BR/en:
   - Instagram: itens de menu sem rota (Notificações, Criar, Mais, Também da
     Meta, Pesquisa como botão) e detecção de posts sugeridos no feed.
   Em interfaces em outros idiomas esses controles específicos podem não
   atuar (nada é ocultado por engano — falha conservadora).
2. **"Para você" no X e TikTok**: as plataformas não marcam posts
   recomendados individualmente de forma estável. A solução conservadora
   oculta a aba/feed de recomendações e mantém o usuário no feed de contas
   seguidas ("Seguindo"). Conteúdo seguido nunca é ocultado.
3. **Anúncios do TikTok**: nenhum marcador confiável de conteúdo patrocinado
   foi encontrado na sessão inspecionada; não há controle específico de
   anúncios no MVP.
4. **Classes ofuscadas**: TikTok usa sufixos de styled-components
   (`--DivSideNavContainer` etc.) que podem mudar em refactors grandes.
   Instagram não expõe atributos estáveis; as regras usam sinais combinados
   (rota + posição + aria). Ver pontos de quebra em MAPEAMENTO_ELEMENTOS.md.
5. **Instagram RTL**: o critério geométrico do rail (borda esquerda) não
   cobre layouts right-to-left (fora do escopo do MVP).
6. **Piscada mínima**: o CSS é injetado em `document_start`, mas regras
   dinâmicas (ex.: posts sugeridos do IG) dependem do conteúdo existir para
   ser marcado — pode haver exibição breve antes da ocultação nesses casos.
7. **Feeds vazios**: ocultar muitos grupos ao mesmo tempo (ex.: barra lateral
   inteira + cabeçalho no TikTok) mantém a página funcional, mas a navegação
   passa a depender de atalhos/URLs diretas.
8. **YouTube — recursos não implementados**: "Ocultar resultados de busca
   inapropriados" (sem marcador estrutural de classificação de conteúdo,
   contrário ao princípio conservador do PRD §6.1) e "Desativar anotações"
   (recurso removido pelo YouTube há vários anos — confirmado ao vivo que o
   item não existe mais no menu de configurações do player; a heurística da
   Unhook para esse recurso hoje aponta para "Voice boost" por engano, então
   não foi portada). Os controles `arrecadacao` (fundraiser) e
   `fotosPerfilComentarios` são best-effort: não foi possível encontrar,
   respectivamente, uma live com arrecadação ativa e comentários totalmente
   carregados durante a inspeção para validar os seletores ao vivo.
