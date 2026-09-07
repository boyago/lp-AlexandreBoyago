import test from 'node:test'
import assert from 'node:assert/strict'
import { META_PIXEL_ID, syncPixelConsent } from '../lib/meta-pixel.mjs'
import { whatsappInvite, PROGRESS_DURATION_MS, IMMERSION_INVITE, inviteProgressAt } from '../lib/whatsapp.mjs'

function browserStub() {
  const scripts = []
  const win = {}
  const doc = {
    querySelector: () => scripts[0],
    createElement: () => ({ remove() { scripts.splice(scripts.indexOf(this), 1) } }),
    head: { appendChild: script => scripts.push(script) },
  }
  return { win, doc, scripts, commands: () => win.fbq.queue.map(args => [...args]) }
}

test('no consent or rejection never downloads the Meta script', () => {
  const { win, doc, scripts } = browserStub()
  assert.equal(syncPixelConsent(win, doc, null, '/', null), null)
  assert.equal(syncPixelConsent(win, doc, 'rejected', '/', null), null)
  assert.equal(scripts.length, 0)
  assert.equal(win.fbq, undefined)
})

test('acceptance initializes the correct pixel once, with one PageView per route', () => {
  const { win, doc, scripts, commands } = browserStub()
  let last = syncPixelConsent(win, doc, 'accepted', '/', null)
  last = syncPixelConsent(win, doc, 'accepted', '/', last)
  syncPixelConsent(win, doc, 'accepted', '/obrigado/', last)
  assert.equal(scripts.length, 1)
  assert.equal(scripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js')
  assert.deepEqual(commands().filter(c => c[0] === 'init'), [['init', META_PIXEL_ID]])
  assert.deepEqual(commands().filter(c => c[0] === 'trackSingle'), [
    ['trackSingle', META_PIXEL_ID, 'PageView'], ['trackSingle', META_PIXEL_ID, 'PageView'],
  ])
  assert.equal(commands().some(c => c.includes('Purchase')), false)
})

test('revoking consent prevents new PageViews and an unavailable script can be retried', () => {
  const { win, doc, scripts, commands } = browserStub()
  let last = syncPixelConsent(win, doc, 'accepted', '/', null)
  last = syncPixelConsent(win, doc, 'rejected', '/obrigado/', last)
  assert.equal(last, null)
  assert.deepEqual(commands().at(-1), ['consent', 'revoke'])
  assert.equal(commands().filter(c => c[0] === 'trackSingle').length, 1)
  scripts[0].onerror()
  syncPixelConsent(win, doc, 'accepted', '/obrigado/', last)
  assert.equal(scripts.length, 1)
  assert.equal(commands().filter(c => c[0] === 'init').length, 1)
})

test('WhatsApp only accepts a configured HTTPS invitation, never arbitrary redirects', () => {
  assert.equal(PROGRESS_DURATION_MS, 10000)
  assert.equal(whatsappInvite(IMMERSION_INVITE), 'https://whats.ly/imersao')
  for (const value of ['https://whats.ly/outro', 'https://whats.ly/imersao?redirect=https://evil.test', 'https://whats.ly.evil.test/imersao', 'http://whats.ly/imersao']) assert.equal(whatsappInvite(value), null)
  assert.equal(whatsappInvite(' https://chat.whatsapp.com/ExampleInvite123 '), 'https://chat.whatsapp.com/ExampleInvite123')
  for (const value of [undefined, '', 'javascript:alert(1)', 'http://chat.whatsapp.com/abc', 'https://chat.whatsapp.com.evil.test/abc', 'https://evil.test/abc', 'https://user:pass@chat.whatsapp.com/abc', 'https://chat.whatsapp.com/', 'https://chat.whatsapp.com:444/abc']) {
    assert.equal(whatsappInvite(value), null, String(value))
  }
})

test('onboarding progress stops at 96 percent and never auto-completes', () => {
  assert.equal(inviteProgressAt(0), 0)
  assert.equal(inviteProgressAt(5000), 48)
  assert.equal(inviteProgressAt(10000), 96)
  assert.equal(inviteProgressAt(60000), 96)
  assert.equal(inviteProgressAt(-100), 0)
  assert.equal(inviteProgressAt(NaN), 0)
})
