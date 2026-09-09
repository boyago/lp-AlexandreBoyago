# Imersão GPT 6 + Fable 5.1

Landing page de vendas da imersão ao vivo de Alexandre Boyago, construída com Next.js. A LP é pré-renderizada; o painel de métricas próprio exige servidor Node.js e MySQL.

## Rodar localmente

```bash
npm install
npm run dev
```

## Configuração antes de publicar

Crie um arquivo `.env.local` com os dados reais:

```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
NEXT_PUBLIC_CHECKOUT_URL=https://wizmarket.com.br/checkout/ai-game-lab?offer=imersao-lore1
```

`NEXT_PUBLIC_SITE_URL` ativa a URL canônica, o sitemap completo e a URL absoluta da imagem de compartilhamento. `NEXT_PUBLIC_CHECKOUT_URL` conecta todos os botões de compra ao checkout.

## Publicar na Hostinger

1. Configure Node.js 20.9 ou superior.
2. Use `npm ci` para instalar as dependências.
3. Use `npm run build` como comando de build.
4. Mantenha a aplicação Next.js ativa com `npm start`. Não publique apenas a antiga pasta `out`.
5. Antes de implantar esta versão, configure MySQL e as credenciais privadas do painel conforme [docs/analytics.md](docs/analytics.md).

O build usa `.next/`. As rotas `/api/metrics/*` precisam do runtime Node.js. O banco permanece separado das implantações. Sem configurá-lo, a LP continua acessível, mas o contador e o painel ficam indisponíveis.
