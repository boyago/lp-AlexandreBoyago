# Painel próprio de métricas

## O que mudou

`/analise/` agora consulta um contador centralizado do próprio site, protegido por senha. Não depende de acesso aos relatórios Google. Não há contadores em localStorage nem dados simulados no painel.

**Mudança de hospedagem:** saiu `output: 'export'`. A LP e os jogos continuam no projeto, mas as APIs precisam de Next.js rodando em Node.js. Não publique apenas a antiga pasta `out/`. O banco MySQL fica fora da pasta de implantação e mantém os dados entre deploys.

GA4 continua em paralelo: `G-KV848N4Y33`, fluxo `15743000412`. O painel não lê GA4/Meta automaticamente. O link “Comparar no GA4” abre o Google para comparação manual.

## Ativar na Hostinger, antes de publicar

1. Em Websites → Dashboard → Databases → Management, crie um banco MySQL e um usuário exclusivos. Guarde a senha no gerenciador de senhas.
2. Abra o phpMyAdmin desse banco e execute `db/analytics.sql`. Cria apenas `metrics_events` e `metrics_limits`, sem apagar tabelas existentes. A aplicação não faz migração de esquema automaticamente.
3. No terminal local, execute `node tools/metrics-credentials.mjs`. Digite uma senha forte, sem eco na tela. Copie as variáveis geradas para o ambiente privado no hPanel. Não envie a senha ou chaves pelo chat, Git ou frontend.
4. Configure as variáveis abaixo em Environment variables da aplicação Node.js. Consulte `.env.example`:
   - `ANALYTICS_STORAGE=mysql`
   - `ANALYTICS_SITE_ORIGIN=https://alexandreboyago.com` (origem exata usada no navegador; redirecione www para o domínio canônico)
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `ANALYTICS_SESSION_SECRET` e `ANALYTICS_ADMIN_PASSWORD_HASH` gerados no passo anterior
5. Use aplicação **Next.js / Node.js**, Node >= 20.9. Instalação `npm ci`, build `npm run build`, início `npm start`. Mantenha a detecção Next.js padrão da Hostinger e não force diretório de saída `out`. Se o hPanel ainda estiver em hospedagem estática, ajuste o tipo de aplicação antes do deploy.
6. Após configurar o banco e o runtime, publique o código e reinicie/reimplante. Não foi feita publicação automática desta migração.
7. Exclua `/analise/*` e `/api/metrics/*` de qualquer cache/CDN que sobrescreva cabeçalhos. Remova o cache da versão antiga do painel. APIs usam no-store e dados exigem autenticação no servidor.
8. Abra `https://alexandreboyago.com/analise/` e entre com a senha escolhida.

Sem banco/configuração válidos, o painel informa indisponibilidade; não mostra números inventados. Um build aprovado não confirma conexão com seu MySQL. Faça backup do banco pelo provedor.

## Testar no computador

Crie/complete `.env.local` (não versionado), preservando as variáveis existentes:

```dotenv
ANALYTICS_STORAGE=file
ANALYTICS_SITE_ORIGIN=http://localhost:3000
ANALYTICS_SESSION_SECRET=valor-gerado-no-terminal
ANALYTICS_ADMIN_PASSWORD_HASH=hash-gerado-no-terminal
```

Execute o gerador de credenciais acima e substitua os dois valores. Reinicie `npm run dev`. Acesse `http://localhost:3000/analise/`. Arquivo centralizado de desenvolvimento: `.local/analytics/events.json`, excluído do Git. **Modo file é recusado em produção**, onde múltiplos processos e reimplantações exigem MySQL.

Testes:

```text
node --test tools/analytics.test.mjs tools/marketing.test.mjs tools/metrics.test.mjs
node tools/metrics-http-test.mjs
npm run build
```

O teste HTTP sobe um servidor isolado na porta 4327 e encerra apenas esse processo. Usa `.next-metrics-test/` e `.local/analytics-test/`; não altera o banco normal. Testa login, acesso negado, coleta, deduplicação, persistência lida por outro processo, headers privados e logout. Não valida o MySQL da Hostinger.

## Indicadores e interpretação

| Indicador | Regra |
| --- | --- |
| Visitantes estimados | Identificadores de navegador distintos nos eventos do período; não pessoas identificadas. |
| Sessões | Cookie de sessão, renovado por 30 minutos a cada envio. |
| Visualizações | `page_view` nas rotas / e /obrigado/. |
| Seções | `section_view`: metade da seção ou da altura da tela visível por 2 segundos contínuos. Alcance deduplicado por sessão. |
| Rolagem | `scroll_depth`: parte inferior da tela alcançou 25%, 50%, 75%, 90% ou 100% da página. Exclusivo do contador próprio; não equivale ao scroll automático do GA4. |
| Games | `game_select`: card clicado. `game_open`: abrir Era Racing, hero ou catálogo. Não são partidas iniciadas/concluídas. |
| Checkout | `checkout_click`: cliques totais e sessões da LP com clique. Não confirma venda. |
| Obrigado / grupo | Visita à página e `whatsapp_click` no convite. Não confirma pagamento nem ingresso no grupo. |

Percentuais de alcance usam as sessões com page_view da LP no mesmo período. Eventos de sessões iniciadas antes do período podem aparecer nos totais de cliques, mas não nesse percentual. Seções não formam necessariamente um funil sequencial: a pessoa pode usar âncoras e pular áreas.

Períodos móveis: 24 horas, 7, 30 ou 90 dias. Até 50 mil eventos por consulta, sem truncamento silencioso; use período menor se exceder. O painel informa data/hora da consulta no fuso do navegador. A coleta não recupera visitas anteriores à ativação.

## Privacidade e segurança implementadas

- Aceite explícito antes da coleta própria, GA4 ou Meta. Preferência `ai-game-lab-measurement-v3` preservada: depois de aceitar ou recusar, o aviso fica fechado nas próximas visitas ao mesmo navegador/origem. Preferências podem ser reabertas manualmente pelo rodapé, sem botão flutuante. Recusa não bloqueia jogos/conteúdo. Limpar dados ou bloquear armazenamento pode exigir nova escolha; avisos de escopo anterior não são tratados automaticamente como aceite do escopo v3.
- Cookies próprios HttpOnly: visitante 30 dias, sessão 30 minutos, administrador 8 horas. Secure em produção e SameSite Strict. Ao revogar, param os novos eventos e são removidos os cookies de medição próprios. Eventos históricos não são apagados automaticamente pela revogação.
- O banco não recebe nome, e-mail, texto livre de formulário, URL completa, parâmetros de campanha ou IP bruto. IDs pseudônimos assinados e derivados com HMAC. Logs de infraestrutura e dados enviados a Google/Meta são independentes dessa base.
- Senha com hash scrypt e salt. Não há senha padrão. Trocar o hash/segredo invalida sessões de administração.
- Validação de origem nas escritas; JSON até 16 KB, até 20 eventos, nomes e campos permitidos; SQL preparado; idempotência por ID de evento.
- Limite compartilhado no banco: 120 requisições/minuto por hash de IP para coleta, 10 tentativas de login/10 minutos por hash e 100 globais/10 minutos. Verifique se o proxy da hospedagem substitui x-forwarded-for corretamente. Isso reduz abuso, mas não garante eliminação de bots ou eventos forjados.
- /analise/ e APIs com noindex, no-store e bloqueio de iframe. Autenticação está na API, não apenas no frontend. Página fora do sitemap.
- Relatórios consultam no máximo 90 dias. A coleta limpa eventos mais antigos em lotes de até 1000 por requisição. Sem tráfego, registros antigos podem permanecer; para prazo rígido de exclusão, agende manutenção no banco e alinhe retenção de backups no provedor. Não foi criado agendamento nesta implementação.
- GA4/Meta, bloqueadores, recusas, abas/dispositivos e definição de sessão geram diferenças. Não espere números idênticos entre ferramentas; o contador não mede “cliques no pixel”.
- Para usuários e permissões individuais, 2FA ou auditoria avançada, substituir a senha única por um provedor de autenticação.

## Conferência depois do deploy

1. Sem login, GET /api/metrics/report/ deve responder 401, nunca dados.
2. Na LP, recuse cookies: não deve haver POST de eventos. Aceite e veja se as respostas de /api/metrics/events/ são 200.
3. Veja uma seção por 2 segundos, role a página, clique em um game e no checkout; atualize o painel.
4. Revogue consentimento e confirme ausência de novos POSTs; logout impede consultar dados.
5. No GA4, confira eventos em Tempo real separadamente. Dimensões personalizadas: section_id, section_name, game_id, button_id. Desative page_view automático baseado em mudanças de histórico se duplicar o envio manual.
6. Uma compra só deve ser contada a partir de confirmação da Wizmarket, não por acesso ao obrigado.

## Fontes oficiais

- [Tráfego no hPanel](https://www.hostinger.com/support/5650167-how-to-use-the-analytics-section-on-hpanel-at-hostinger/)
- [MySQL em aplicações Node.js na Hostinger](https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/)
- [mysql2](https://sidorares.github.io/node-mysql2/docs)
- [Eventos GA4](https://developers.google.com/analytics/devguides/collection/ga4/events)
