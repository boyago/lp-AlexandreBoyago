import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { passwordHash, passwordMatches, seal, unseal, validateEvents, summarize } from '../lib/metrics-core.mjs'
import { startOwnMetrics, revokeOwnMetrics } from '../lib/metrics-client.mjs'
import { storageConfigured } from '../lib/metrics-store.mjs'

test('file persistence is never allowed as production fallback', () => {
  const previous = { node: process.env.NODE_ENV, storage: process.env.ANALYTICS_STORAGE }
  process.env.NODE_ENV = 'production'; process.env.ANALYTICS_STORAGE = 'file'
  assert.equal(storageConfigured(), false)
  if (previous.node === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous.node
  if (previous.storage === undefined) delete process.env.ANALYTICS_STORAGE; else process.env.ANALYTICS_STORAGE = previous.storage
})

test('signed sessions reject tampering, expiry and rotated keys', () => {
  const token = seal({ role: 'admin', exp: 200 }, 'test-secret')
  assert.equal(unseal(token, 'test-secret', 100).role, 'admin')
  assert.equal(unseal(token + 'x', 'test-secret', 100), null)
  assert.equal(unseal(token, 'test-secret', 201), null)
  assert.equal(unseal(token, 'new-key', 100), null)
})
test('passwords use salted scrypt, never plain text', () => {
  const hash = passwordHash('local-test-password')
  assert.ok(passwordMatches('local-test-password', hash))
  assert.equal(passwordMatches('incorrect', hash), false)
  assert.equal(passwordMatches('x'.repeat(257), hash), false)
})
test('collector rejects unknown events, private routes and missing consent; strips untrusted data', () => {
  const event = { id: randomUUID(), name: 'page_view', page: '/', email: 'discard', url: 'discard' }
  assert.equal(validateEvents({ consent: 'accepted', events: [event] })[0].email, undefined)
  for (const patch of [{ name: 'purchase' }, { page: '/analise/' }, { name: 'section_view', section_id: '__proto__' }, { name: 'scroll_depth', depth: 99 }]) assert.throws(() => validateEvents({ consent: 'accepted', events: [{ ...event, ...patch }] }))
  assert.throws(() => validateEvents({ events: [event] }))
  assert.throws(() => validateEvents({ consent: 'accepted', events: Array(21).fill(event) }))
})
test('report deduplicates session reach and separates repeat clicks from session conversion', () => {
  const base = { session: 'a', visitor: 'a', page: '/' }
  const rows = [ { ...base, name: 'page_view' }, { ...base, name: 'checkout_click' }, { ...base, name: 'checkout_click' }, { ...base, name: 'section_view', section_id: 'oferta' }, { ...base, name: 'section_view', section_id: 'oferta' }, { ...base, session: 'outside-cohort', name: 'section_view', section_id: 'oferta' } ]
  const result = summarize(rows)
  assert.equal(result.checkout, 2); assert.equal(result.checkoutSessions, 1)
  assert.equal(result.sections.find(s => s.label === 'Oferta').count, 1)
  assert.equal(result.thankYou, 0)
})
test('own collector is consent-gated, independent of tags and serializes requests', async () => {
  const calls = [], frames = []
  const win = { __aiGameLabAnalyticsAllowed: false, crypto: { randomUUID }, innerHeight: 500, scrollY: 500, addEventListener() {}, removeEventListener() {}, requestAnimationFrame(fn) { frames.push(fn) }, async fetch(url, options) { calls.push({ url, ...options }); return { ok: true } } }
  const doc = { hidden: false, documentElement: { scrollHeight: 1000 }, addEventListener() {}, removeEventListener() {} }
  let stop = startOwnMetrics(win, doc, '/'); stop()
  assert.equal(calls.length, 0)
  win.__aiGameLabAnalyticsAllowed = true
  stop = startOwnMetrics(win, doc, '/')
  win.__aiGameLabMetricsSend('checkout_click', { button_id: 'primary-cta' })
  frames.forEach(fn => fn())
  await new Promise(resolve => setImmediate(resolve))
  const events = calls.flatMap(call => JSON.parse(call.body).events)
  assert.equal(events.filter(e => e.name === 'page_view').length, 1)
  assert.equal(events.filter(e => e.name === 'scroll_depth').length, 5)
  assert.ok(events.some(e => e.name === 'checkout_click'))
  stop(); win.__aiGameLabAnalyticsAllowed = false; revokeOwnMetrics(win)
  assert.equal(calls.at(-1).method, 'DELETE')
})
