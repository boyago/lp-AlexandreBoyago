import { passwordMatches } from '../../../../lib/metrics-core.mjs'
import { configured, authenticated, sameOrigin, smallJson, json, loginCookie, clearCookies, clientBucket } from '../../../../lib/metrics-server.mjs'
import { rateLimit } from '../../../../lib/metrics-store.mjs'

export const runtime = 'nodejs'
export async function GET() { return json({ configured: configured(), authenticated: await authenticated() }) }
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Origem não permitida.' }, 403)
  if (!configured()) return json({ error: 'Configure o banco e as credenciais na hospedagem.' }, 503)
  let body
  try { body = await smallJson(request) } catch { return json({ error: 'Pedido inválido.' }, 400) }
  try {
    if (!await rateLimit(clientBucket(request, 'login'), 10, 600000) || !await rateLimit('login-global', 100, 600000)) return json({ error: 'Muitas tentativas. Aguarde 10 minutos.' }, 429)
    if (!passwordMatches(body.password, process.env.ANALYTICS_ADMIN_PASSWORD_HASH)) return json({ error: 'Senha incorreta.' }, 401)
    await loginCookie()
    return json({ authenticated: true })
  } catch { return json({ error: 'Banco indisponível. Confira a configuração.' }, 503) }
}
export async function DELETE(request) {
  if (!sameOrigin(request)) return json({ error: 'Origem não permitida.' }, 403)
  await clearCookies(['agl_admin'])
  return json({ authenticated: false })
}
