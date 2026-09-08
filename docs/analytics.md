# Análise de métricas

## Coleta configurada

GA4 `G-KV848N4Y33`. Código do fluxo: `15743000412`. Confirmados pelo proprietário em 08/09/2026, substituindo o ID de medição anterior. O código do fluxo não é o ID numérico da propriedade exigido pela API de relatórios.

A tag só é carregada após aceitar o aviso atualizado de cookies. A preferência agora usa `ai-game-lab-measurement-v2`; visitantes que aceitaram apenas o aviso anterior do Meta precisam escolher novamente.

Rotas medidas: `/` e `/obrigado/`. `/analise/` não carrega tags por acesso direto. Navegar para ela interrompe a coleta configurada neste código. Os testes automatizados usam mocks; não confirmam recebimento de eventos no Google.

Eventos personalizados:

| Evento | Parâmetros | Significado |
| --- | --- | --- |
| `section_view` | `section_id`, `section_name` | Seção visível por 2 segundos contínuos; uma vez por permanência na rota após consentimento. Para seções grandes, metade da altura da tela precisa estar ocupada. |
| `game_select` | `game_id` | Clique em um card, não partida iniciada. |
| `game_open` | `game_id`, `button_id` | Clique para abrir Era Racing pelo hero ou catálogo, não corrida iniciada. |
| `checkout_click` | `button_id` | Clique para Wizmarket, não pagamento aprovado. |
| `whatsapp_click` | `button_id` | Clique no convite, não entrada confirmada no grupo. |

`page_view` é enviado explicitamente uma vez por rota. No fluxo de dados do GA4, confira Medição otimizada > Visualizações de página e desative a opção baseada em alterações no histórico para não duplicar visualizações nesta SPA. Eventos automáticos extras, como scroll, podem existir no GA4 conforme as configurações da propriedade.

Cadastre dimensões personalizadas de escopo Evento para `section_id`, `section_name`, `game_id` e `button_id` antes de montar os relatórios. IDs de game: `frontier` (Era Racing), `patrol` (Tupã Patrulha), `orbit`, `prompt`, `turbo`, `raid`, `river`, `jungle`.

Os eventos não enviam dados de formulário. O contexto de URL enviado pelo código exclui fragmentos e parâmetros desconhecidos, preservando apenas UTMs e gclid para atribuição. Não inclua informações pessoais em UTMs. A personalização de anúncios e Google Signals não são habilitados por este código.

## Página `/analise/`

A estrutura da página e as instruções estão prontas; a leitura de métricas ainda depende de conectar o relatório. Não há números simulados nem contador em localStorage. O ID `G-...` permite coleta, não leitura de dados.

Opção preparada para manter a hospedagem estática: incorporar relatório Google com compartilhamento restrito. Para ativar:

1. Crie um relatório no Looker/Data Studio conectado à propriedade GA4 correta. Configure visitas, sessões, origem/dispositivo, `section_view` por seção, `game_select` por game e cliques por botão. Inclua controle de datas. Evite somar usuários distintos entre grupos como se fossem pessoas únicas.
2. Compartilhe somente com a conta Google do proprietário ou usuários autorizados. Não habilite acesso público nem “qualquer pessoa com o link”.
3. Habilite a incorporação e copie a URL própria de embed (não o link de edição).
4. Configure `ANALYTICS_REPORT_EMBED_URL` e `ANALYTICS_PRIVATE_REPORT_CONFIRMED=true` na Hostinger e reconstrua/reimplante. A URL não é uma senha; o controle de acesso é feito pelo Google.
5. Teste com a conta autorizada e sem login para verificar que terceiros não conseguem ver os dados. Restrições de cookies de terceiros podem exigir abrir o relatório diretamente no Google.

Alternativa ainda não implementada: painel próprio usando Google Analytics Data API. Isso exige ID numérico da propriedade (não `G-...`), credencial/OAuth no servidor e autenticação de administrador. Não guardar chaves de serviço em `NEXT_PUBLIC_*`, no Git ou no frontend. Essa alternativa requer sair da exportação puramente estática ou adicionar um backend protegido.

`/analise/` usa noindex/nofollow e não aparece no sitemap/menu. Isso não torna seu HTML privado. Enquanto não há fonte configurada, só exibe informações da integração. Segurança dos relatórios depende do compartilhamento no Google. Não habilitar embed de relatório público com dados comerciais.

## Validação após publicar

Aceite cookies no domínio publicado e confira page_view, visualizações de seções e cliques no relatório Em tempo real do GA4. Repita recusando cookies e confirme ausência de novos eventos. Para DebugView, use as ferramentas de depuração do Google; não foi habilitado modo de depuração global. Contagens variam com consentimento, bloqueadores, dispositivos, sessões e processamento. Não há recuperação retroativa das visitas anteriores à instalação. Para vendas, use os eventos de compra confirmada da Wizmarket e configure a integração da plataforma separadamente.

Referências oficiais:

- https://developers.google.com/analytics/devguides/collection/ga4/events
- https://docs.cloud.google.com/data-studio/embed-a-report
- https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart
