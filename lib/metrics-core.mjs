import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { SECTION_NAMES } from './analytics.mjs'

export const EVENT_NAMES = ['page_view', 'section_view', 'scroll_depth', 'game_select', 'game_open', 'checkout_click', 'whatsapp_click']
export const GAMES = { frontier: 'Era Racing', patrol: 'Tupã Patrulha', orbit: 'Orbit Runner', prompt: 'Prompt Quest', turbo: 'Turbo Tap', raid: 'Pixel Raid', river: 'Canyon Strike', jungle: 'Jungle Leap' }
export function digest(value, secret) { return createHmac('sha256', secret).update(value).digest('hex') }
export function seal(value, secret) { const data = Buffer.from(JSON.stringify(value)).toString('base64url'); return `${data}.${digest(data, secret)}` }
export function unseal(token, secret, now = Date.now()) {
  try {
    const [data, signature] = token.split('.')
    const expected = digest(data, secret)
    if (signature?.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
    const value = JSON.parse(Buffer.from(data, 'base64url').toString())
    return value.exp > now ? value : null
  } catch { return null }
}
export function passwordHash(password) { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}` }
export function passwordMatches(password, hash) {
  if (typeof password !== 'string' || password.length > 256 || !/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash || '')) return false
  const [salt, expected] = hash.split(':')
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(expected, 'hex'))
}
export function validateEvents(payload) {
  if (payload?.consent !== 'accepted' || !Array.isArray(payload.events) || !payload.events.length || payload.events.length > 20) throw new Error('invalid')
  return payload.events.map(event => {
    if (!/^[a-f0-9-]{36}$/i.test(event.id || '') || !EVENT_NAMES.includes(event.name) || !['/', '/obrigado/'].includes(event.page)) throw new Error('invalid')
    const clean = { id: event.id, name: event.name, page: event.page, section_id: '', game_id: '', button_id: '', depth: 0 }
    if (event.name === 'section_view') { if (!Object.hasOwn(SECTION_NAMES, event.section_id) || event.page !== '/') throw new Error('invalid'); clean.section_id = event.section_id }
    if (event.name === 'scroll_depth') { if (![25, 50, 75, 90, 100].includes(event.depth)) throw new Error('invalid'); clean.depth = event.depth }
    if (event.name.startsWith('game_')) { if (!Object.hasOwn(GAMES, event.game_id)) throw new Error('invalid'); clean.game_id = event.game_id }
    if (event.button_id) { if (!/^[a-z0-9_-]{1,48}$/.test(event.button_id)) throw new Error('invalid'); clean.button_id = event.button_id }
    return clean
  })
}
export function summarize(events) {
  const count = name => events.filter(e => e.name === name).length
  const unique = (rows, field = 'session') => new Set(rows.map(e => e[field])).size
  const landing = new Set(events.filter(e => e.name === 'page_view' && e.page === '/').map(e => e.session))
  const reach = rows => unique(rows.filter(e => landing.has(e.session)))
  return {
    pageViews: count('page_view'), visitors: unique(events, 'visitor'), sessions: unique(events), landingSessions: landing.size,
    checkout: count('checkout_click'), whatsapp: count('whatsapp_click'), thankYou: events.filter(e => e.name === 'page_view' && e.page === '/obrigado/').length,
    checkoutSessions: reach(events.filter(e => e.name === 'checkout_click')),
    sections: Object.entries(SECTION_NAMES).map(([id, label]) => ({ label, count: reach(events.filter(e => e.name === 'section_view' && e.section_id === id)) })),
    scroll: [25, 50, 75, 90, 100].map(depth => ({ label: `${depth}%`, count: reach(events.filter(e => e.name === 'scroll_depth' && e.page === '/' && e.depth === depth)) })),
    games: Object.entries(GAMES).map(([id, label]) => ({ label, count: events.filter(e => e.name === 'game_select' && e.game_id === id).length, opens: events.filter(e => e.name === 'game_open' && e.game_id === id).length })),
    buttons: [...new Set(events.filter(e => e.name === 'checkout_click').map(e => e.button_id || 'sem identificação'))].map(label => ({ label, count: events.filter(e => e.name === 'checkout_click' && (e.button_id || 'sem identificação') === label).length })),
  }
}
