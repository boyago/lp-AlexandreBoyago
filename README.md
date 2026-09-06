# Imersão GPT 6 + Fable 5.1

Landing page de vendas da imersão ao vivo de Alexandre Boyago, construída com Next.js e exportação estática otimizada.

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
2. Use `npm install` para instalar as dependências.
3. Use `npm run build` como comando de build.
4. Publique o conteúdo da pasta `out` como raiz do site.

O build gera HTML estático, CSS, JavaScript, `robots.txt`, `sitemap.xml` e a imagem social em `out/`.
