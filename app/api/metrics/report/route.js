import { summarize } from '../../../../lib/metrics-core.mjs'
import { authenticated, json } from '../../../../lib/metrics-server.mjs'
import { readEvents } from '../../../../lib/metrics-store.mjs'

export const runtime = 'nodejs'
export async function GET(request) {
  if (!await authenticated()) return json({ error: 'Entre para consultar as métricas.' }, 401)
  const days = Number(new URL(request.url).searchParams.get('days') || 7)
  if (![1, 7, 30, 90].includes(days)) return json({ error: 'Período inválido.' }, 400)
  const until = Date.now(), since = until - days * 86400000
  try { return json({ ...summarize(await readEvents(since, until)), since, until, storage: process.env.ANALYTICS_STORAGE === 'file' ? 'development' : 'mysql' }) }
  catch { return json({ error: 'Não foi possível carregar. Confira o banco ou tente um período menor (limite de 50 mil eventos por consulta).' }, 503) }
}
