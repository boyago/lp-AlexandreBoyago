import test from 'node:test'
import assert from 'node:assert/strict'
import { GA_ID, syncAnalyticsConsent, trackAnalytics, cleanPageLocation, sectionIsVisible, observeSections } from '../lib/analytics.mjs'
import { analyticsReportUrl } from '../lib/analytics-report.mjs'

function fixture() {
  const scripts = []
  const win = { location: { href: 'https://alexandreboyago.com/?utm_source=instagram&email=private@example.test#inicio' } }
  const doc = { title: 'AI Game Lab', referrer: 'https://example.test/?private=secret',
    querySelector: () => scripts[0],
    createElement: () => ({ dataset: {}, remove() { scripts.splice(scripts.indexOf(this), 1) } }),
    head: { appendChild: script => scripts.push(script) },
  }
  return { win, doc, scripts, commands: () => win.dataLayer?.map(args => [...args]) || [] }
}

test('GA4 never loads without consent, and excludes the analysis page', () => {
  const { win, doc, scripts, commands } = fixture()
  syncAnalyticsConsent(win, doc, null, '/', null)
  syncAnalyticsConsent(win, doc, 'rejected', '/', null)
  syncAnalyticsConsent(win, doc, 'accepted', '/analise/', null)
  trackAnalytics(win, 'checkout_click')
  assert.equal(scripts.length, 0)
  assert.equal(commands().length, 0)
  assert.equal(win[`ga-disable-${GA_ID}`], true)
})

test('GA4 initializes once and records one page view per route, with sanitized URLs', () => {
  const { win, doc, scripts, commands } = fixture()
  let last = syncAnalyticsConsent(win, doc, 'accepted', '/', null)
  last = syncAnalyticsConsent(win, doc, 'accepted', '/', last)
  win.location.href = 'https://alexandreboyago.com/obrigado/?phone=123'
  syncAnalyticsConsent(win, doc, 'accepted', '/obrigado/', last)
  assert.equal(scripts.length, 1)
  assert.equal(scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`)
  assert.equal(commands().filter(c => c[0] === 'config').length, 1)
  const views = commands().filter(c => c[0] === 'event' && c[1] === 'page_view')
  assert.equal(views.length, 2)
  assert.equal(views[0][2].page_location, 'https://alexandreboyago.com/?utm_source=instagram')
  assert.equal(views[1][2].page_location, 'https://alexandreboyago.com/obrigado/')
  assert.equal(views[0][2].page_referrer, 'https://example.test')
})

test('events only accept approved names and parameters, revocation stops collection', () => {
  const { win, doc, commands } = fixture()
  syncAnalyticsConsent(win, doc, 'accepted', '/', null)
  trackAnalytics(win, 'game_select', { game_id: 'frontier', email: 'private@test', password: 'secret' })
  const game = commands().find(c => c[1] === 'game_select')
  assert.deepEqual(game[2], { game_id: 'frontier', send_to: GA_ID })
  trackAnalytics(win, 'purchase', { value: '49' })
  assert.equal(commands().some(c => c[1] === 'purchase'), false)
  syncAnalyticsConsent(win, doc, 'rejected', '/', '/')
  const before = commands().length
  trackAnalytics(win, 'checkout_click')
  assert.equal(commands().length, before)
  assert.equal(win[`ga-disable-${GA_ID}`], true)
})

test('URL sanitation drops sensitive query parameters and hash fragments', () => {
  assert.equal(cleanPageLocation('https://example.test/?email=x&token=secret&utm_campaign=games#private'), 'https://example.test/?utm_campaign=games')
})

test('large and small sections use a reachable visibility threshold', () => {
  const entry = (height, visible) => ({ isIntersecting: true, boundingClientRect: { height }, intersectionRect: { height: visible } })
  assert.equal(sectionIsVisible(entry(2000, 400), 800), true)
  assert.equal(sectionIsVisible(entry(2000, 390), 800), false)
  assert.equal(sectionIsVisible(entry(200, 100), 800), true)
})

test('section views require two continuous seconds, deduplicate and clean up', () => {
  const timers = new Map(), events = [], listeners = new Map()
  let nextId = 0, observer, disconnected = false
  const element = { id: 'oferta', getBoundingClientRect: () => ({ top: 0, bottom: 600, height: 600 }) }
  const win = { innerHeight: 800,
    setTimeout(fn, ms) { assert.equal(ms, 2000); timers.set(++nextId, fn); return nextId },
    clearTimeout(id) { timers.delete(id) },
    IntersectionObserver: class { constructor(callback) { this.callback = callback; observer = this } observe() {} unobserve() {} disconnect() { disconnected = true } },
  }
  const doc = { hidden: false, querySelectorAll: () => [element], addEventListener: (name, callback) => listeners.set(name, callback), removeEventListener: name => listeners.delete(name) }
  const cleanup = observeSections(win, doc, (...args) => events.push(args))
  const entry = { target: element, isIntersecting: true, boundingClientRect: { height: 600 }, intersectionRect: { height: 600 } }
  observer.callback([entry]); assert.equal(events.length, 0)
  observer.callback([{ ...entry, isIntersecting: false }]); assert.equal(timers.size, 0)
  observer.callback([entry]); [...timers.values()][0]()
  assert.deepEqual(events, [['section_view', { section_id: 'oferta', section_name: 'Oferta' }]])
  observer.callback([entry]); assert.equal(timers.size, 0)
  cleanup(); assert.equal(disconnected, true); assert.equal(listeners.size, 0)
})

test('only Google report embed URLs are accepted, never arbitrary iframe destinations', () => {
  assert.equal(analyticsReportUrl('https://lookerstudio.google.com/embed/reporting/test-id/page/p_123'), 'https://lookerstudio.google.com/embed/reporting/test-id/page/p_123')
  for (const value of ['', 'https://evil.test/embed/reporting/x', 'https://lookerstudio.google.com/reporting/x', 'https://lookerstudio.google.com.evil.test/embed/reporting/x', 'javascript:alert(1)', 'https://user:pass@lookerstudio.google.com/embed/reporting/x', 'https://lookerstudio.google.com/embed/reporting/x?token=secret']) assert.equal(analyticsReportUrl(value), null)
})
