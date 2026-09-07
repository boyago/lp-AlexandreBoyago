import ThankYou from './thank-you'
import { IMMERSION_INVITE, whatsappInvite } from '../../lib/whatsapp.mjs'

export const metadata = {
  title: 'Obrigado | AI Game Lab',
  description: 'Próximo passo: entre no grupo da imersão AI Game Lab no WhatsApp.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true, nosnippet: true } },
  referrer: 'no-referrer',
  alternates: { canonical: '/obrigado/' },
  openGraph: { title: 'Obrigado | AI Game Lab', description: 'Informações de acesso à imersão.', url: '/obrigado/' },
  twitter: { title: 'Obrigado | AI Game Lab', description: 'Informações de acesso à imersão.' },
}

export default function ThankYouPage() {
  const groupUrl = whatsappInvite(process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || IMMERSION_INVITE)
  return <ThankYou groupUrl={groupUrl} />
}
