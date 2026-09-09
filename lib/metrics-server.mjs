import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { digest, seal, unseal } from './metrics-core.mjs'
import { storageConfigured } from './metrics-store.mjs'

export function configured() { return storageConfigured() && (process.env.ANALYTICS_SESSION_SECRET || '').length >= 32 && /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.ANALYTICS_ADMIN_PASSWORD_HASH || '') && Boolean(process.env.ANALYTICS_SITE_ORIGIN) }
function key(purpose) { return digest(purpose === 'admin' ? `admin:${process.env.ANALYTICS_ADMIN_PASSWORD_HASH}` : purpose, process.env.ANALYTICS_SESSION_SECRET || '') }
export function json(data, status = 200) { return Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store, max-age=0', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff', 'Vary': 'Cookie' } }) }
export function sameOrigin(request) { try { return new URL(request.headers.get('origin')).origin === new URL(process.env.ANALYTICS_SITE_ORIGIN).origin } catch { return false } }
export async function smallJson(request) {
  if (!(request.headers.get('content-type') || '').startsWith('application/json') || !request.body) throw new Error('invalid')
  const reader = request.body.getReader(); let size = 0; const chunks = []
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 16384) { await reader.cancel(); throw new Error('invalid') } chunks.push(Buffer.from(value)) }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}
export async function authenticated() { if (!configured()) return false; return unseal((await cookies()).get('agl_admin')?.value || '', key('admin'))?.role === 'admin' }
export async function setCookie(name, value, purpose, seconds) { (await cookies()).set(name, seal({ ...value, exp: Date.now() + seconds * 1000 }, key(purpose)), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: seconds }) }
export async function loginCookie() { await setCookie('agl_admin', { role: 'admin' }, 'admin', 8 * 3600) }
export async function clearCookies(names) { const jar = await cookies(); for (const name of names) jar.set(name, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 }) }
export async function identities() {
  const jar = await cookies(), result = {}
  for (const [type, seconds] of [['visitor', 30 * 86400], ['session', 1800]]) {
    const name = `agl_${type}`, saved = unseal(jar.get(name)?.value || '', key(type))
    const id = saved?.id || randomUUID()
    await setCookie(name, { id }, type, seconds)
    result[type] = digest(id, key(type))
  }
  return result
}
export function clientBucket(request, prefix) {
  // Never persist the IP itself. Proxy configuration affects the reliability of this limit.
  return `${prefix}:${digest(request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown', key('rate'))}`
}
