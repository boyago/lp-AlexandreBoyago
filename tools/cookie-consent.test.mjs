import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { CONSENT_KEY } from '../lib/meta-pixel.mjs'
import { COOKIE_PREFERENCES_EVENT, readConsentPreference, saveConsentPreference, openCookiePreferences } from '../lib/cookie-consent.mjs'

function browser(storage = new Map()) {
  return { localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } }
}

test('acceptance survives page reload without reopening the notice', () => {
  const storage = new Map(), win = browser(storage)
  assert.deepEqual(readConsentPreference(win), { consent: null, showNotice: true })
  assert.equal(saveConsentPreference(win, 'accepted'), true)
  assert.equal(CONSENT_KEY, 'ai-game-lab-measurement-v3')
  assert.equal(storage.get(CONSENT_KEY), 'accepted')
  assert.deepEqual(readConsentPreference(browser(storage)), { consent: 'accepted', showNotice: false })
})

test('rejection is also remembered and unknown values never grant permission', () => {
  const storage = new Map(), win = browser(storage)
  saveConsentPreference(win, 'rejected')
  assert.deepEqual(readConsentPreference(browser(storage)), { consent: 'rejected', showNotice: false })
  storage.set(CONSENT_KEY, 'true')
  assert.deepEqual(readConsentPreference(win), { consent: null, showNotice: true })
  assert.equal(saveConsentPreference(win, 'invalid'), false)
})

test('unavailable or cleared storage safely requests a new choice', () => {
  const blocked = { get localStorage() { throw new Error('blocked') } }
  assert.deepEqual(readConsentPreference(blocked), { consent: null, showNotice: true })
  assert.equal(saveConsentPreference(blocked, 'accepted'), false)
  const storage = new Map([[CONSENT_KEY, 'accepted']])
  storage.clear()
  assert.deepEqual(readConsentPreference(browser(storage)), { consent: null, showNotice: true })
})

test('shared storage reflects a changed decision in another tab', () => {
  const storage = new Map(), first = browser(storage), second = browser(storage)
  saveConsentPreference(first, 'accepted')
  assert.equal(readConsentPreference(second).showNotice, false)
  saveConsentPreference(second, 'rejected')
  assert.deepEqual(readConsentPreference(first), { consent: 'rejected', showNotice: false })
})

test('manual preferences event does not change saved consent or call trackers', () => {
  const win = browser(new Map([[CONSENT_KEY, 'rejected']])), events = []
  Object.assign(win, { Event, dispatchEvent: event => events.push(event.type), gtag() { assert.fail('Opening preferences must not track') }, fbq() { assert.fail('Opening preferences must not track') } })
  openCookiePreferences(win)
  assert.deepEqual(events, [COOKIE_PREFERENCES_EVENT])
  assert.deepEqual(readConsentPreference(win), { consent: 'rejected', showNotice: false })
})

test('closed notice renders nothing and preference links are in both public footers', async () => {
  const [component, home, thanks, css] = await Promise.all(['../components/MetaPixel.jsx', '../app/page.jsx', '../app/obrigado/thank-you.jsx', '../components/MetaPixel.module.css'].map(file => readFile(new URL(file, import.meta.url), 'utf8')))
  assert.match(component, /if \(!isPublicAnalyticsPage\(pathname\) \|\| !open\) return null/)
  assert.doesNotMatch(component, /className=\{styles\.preferences\}/)
  assert.match(component, /window\.addEventListener\('storage', sync\)/)
  assert.match(home, /<footer>[\s\S]*?<CookiePreferencesButton \/>[\s\S]*?<\/footer>/)
  assert.match(thanks, /<footer[\s\S]*?<CookiePreferencesButton \/>[\s\S]*?<\/footer>/)
  assert.doesNotMatch(css.match(/\.preferences \{([^}]+)\}/)[1], /position:\s*fixed/)
})
