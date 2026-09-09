import { validateEvents } from '../../../../lib/metrics-core.mjs'
import { configured, sameOrigin, smallJson, json, identities, clearCookies, clientBucket } from '../../../../lib/metrics-server.mjs'
import { insertEvents, rateLimit } from '../../../../lib/metrics-store.mjs'

export const runtime = 'nodejs'
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Origem não permitida.' }, 403)
  if (!configured()) return json({ error: 'Medição não configurada.' }, 503)
  let events
  try { events = validateEvents(await smallJson(request)) } catch { return json({ error: 'Evento inválido.' }, 400) }
  try {
    if (!await rateLimit(clientBucket(request, 'events'), 120, 60000)) return json({ error: 'Aguarde.' }, 429)
    const ids = await identities(), time = Date.now()
    await insertEvents(events.map(event => ({ ...event, ...ids, time })))
    return json({ accepted: true })
  } catch { return json({ error: 'Medição indisponível.' }, 503) }
}
export async function DELETE(request) {
  if (!sameOrigin(request)) return json({ error: 'Origem não permitida.' }, 403)
  await clearCookies(['agl_visitor', 'agl_session'])
  return json({ cleared: true })
}
