import './globals.css'
import MetaPixel from '../components/MetaPixel'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
const pageTitle = 'Imersão GPT 6 + Fable 5.1 | Games com IA ao vivo'
const pageDescription =
  'Imersão ao vivo com Alexandre Boyago: explore GPT 6 e Fable 5.1, crie games com IA e publique sua própria página de jogos. Dia 26 de setembro, às 08h, por R$ 49.'
const socialImage = siteUrl ? `${siteUrl}/og.png` : undefined

export const metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: pageTitle,
  description: pageDescription,
  applicationName: 'AI Game Lab',
  authors: [{ name: 'Alexandre Boyago' }],
  creator: 'Alexandre Boyago',
  publisher: 'Alexandre Boyago',
  keywords: [
    'GPT 6',
    'Fable 5.1',
    'games com IA',
    'criar jogos com inteligência artificial',
    'imersão inteligência artificial',
    'curso de games com IA',
    'Alexandre Boyago',
  ],
  category: 'technology',
  alternates: siteUrl ? { canonical: siteUrl } : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: pageTitle,
    description: pageDescription,
    siteName: 'AI Game Lab | Alexandre Boyago',
    ...(siteUrl ? { url: siteUrl } : {}),
    ...(socialImage ? { images: [{ url: socialImage, width: 1200, height: 630, alt: 'Imersão GPT 6 + Fable 5.1: Games com IA, 26 de setembro' }] } : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    ...(socialImage ? { images: [socialImage] } : {}),
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}<MetaPixel /></body>
    </html>
  )
}
