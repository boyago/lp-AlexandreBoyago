# Meta Pixel e página de obrigado

## Pixel na LP

- ID: `1138958273839648`.
- Evento: `PageView`, somente após aceitar cookies opcionais. O link Preferências de cookies no rodapé permite mudar a escolha, tanto na LP quanto em /obrigado/.
- Após aceitar ou recusar, o aviso desaparece e não há botão flutuante. A preferência v3 continua salva no localStorage do mesmo navegador e origem. Limpar dados, usar outro navegador/domínio ou bloquear o armazenamento pode exigir nova escolha.
- Não há imagem `noscript` do Pixel: ela enviaria dados sem a escolha de consentimento.
- A coleta automática de eventos está desligada neste código. Nenhum email, telefone ou dado de pedido é enviado explicitamente.
- Não disparamos `Purchase` pela simples abertura de `/obrigado/`. A página é pública e não valida pagamentos.
- Para validar no Gerenciador de Eventos da Meta, abra o domínio publicado e aceite cookies opcionais. Bloqueadores podem impedir o Pixel. Os testes locais usam mocks e não confirmam recebimento de eventos pela Meta.

## Configuração do grupo e da Wizmarket

1. O convite padrão já é `https://whats.ly/imersao`, fornecido pelo proprietário e verificado em 07/09/2026 com resposta 303 para `chat.whatsapp.com`. Para substituí-lo, configure `NEXT_PUBLIC_WHATSAPP_GROUP_URL` com um convite oficial `https://chat.whatsapp.com/...` antes do build na Hostinger. Somente o atalho exato informado é permitido, não outros destinos no encurtador. A URL é pública, não é uma credencial. Mudar o convite exige reconstruir e reimplantar a página.
2. Após publicar, configure a URL de obrigado/pós-compra aprovada na Wizmarket para `https://alexandreboyago.com/obrigado/`. Não use esse destino como prova de pagamento.
3. Na integração de rastreamento da Wizmarket, use o mesmo ID e configure `Purchase` para pagamentos confirmados com o valor real da transação, incluindo adicionais. Não instale dois scripts para a mesma compra. A disponibilidade e os campos exatos dessa configuração precisam ser confirmados na plataforma.
4. Não passe email, telefone ou dados pessoais na URL de redirecionamento.
5. Faça uma compra de teste pelo fluxo da plataforma, verifique os eventos recebidos na Meta e o destino do grupo. O redirecionamento abre o convite, mas o participante ainda precisa confirmar a entrada no WhatsApp.

Sem convite válido, a página informa que o grupo estará disponível em breve; não mostra um botão quebrado nem inicia a animação. Com convite, a barra neon representa as etapas de entrada, avança até 96% em aproximadamente 10 segundos e aguarda o clique do aluno. O botão funciona desde o início. Não há redirecionamento automático nem confirmação de entrada no grupo. Com preferência por movimento reduzido, a barra aparece em 96% sem animação. A rota é `noindex, nofollow` e não integra o sitemap. Isso não torna o grupo privado: para controlar quem entra, use as configurações de aprovação do próprio grupo.

## Indexação e cuidados de segurança

- `robots` e `googlebot` recebem `noindex, nofollow` no HTML estático. Googlebot também recebe `noimageindex, nosnippet`.
- Não bloquear `/obrigado/` em `robots.txt`: o Google precisa acessar a página para ler `noindex`. Referência: https://developers.google.com/search/docs/crawling-indexing/block-indexing . Se já houver indexação, a remoção depende de nova leitura pelo buscador, podendo ser solicitada no Search Console.
- `Referrer-Policy` via meta `no-referrer` evita enviar a URL de origem no cabeçalho Referer ao navegar para o convite. O botão também usa `noreferrer`, `noopener` e `nofollow`. Isso não interfere nos dados enviados explicitamente pelo Meta Pixel após consentimento.
- Nenhum destino é lido de parâmetros da URL. Convites precisam usar HTTPS e passar pela validação de domínio/caminho.
- Não há autenticação nem validação de pagamento nesta página. `noindex` não é controle de acesso e não substitui aprovação de participantes no WhatsApp.
- A implantação agora usa Node.js para o painel próprio de métricas (ver `analytics.md`). `/obrigado/` continua pré-renderizada. O painel e suas APIs têm cabeçalhos adicionais de segurança, sem bloquear os iframes dos games.

Referência de implementação do snippet base: https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels/code (exemplo oficial de integração do Meta Pixel). Documentação da Meta: https://developers.facebook.com/docs/meta-pixel/ (indisponível para consulta automática durante a implementação).
