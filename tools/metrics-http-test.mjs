import { spawn, execFileSync } from 'node:child_process'
import { randomBytes, randomUUID } from 'node:crypto'
import assert from 'node:assert/strict'
import { passwordHash } from '../lib/metrics-core.mjs'

// Isolated development database and build folder; no production credentials or traffic.
const port = 4327, origin = `http://localhost:${port}`, password = randomBytes(24).toString('hex')
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--webpack', '-p', String(port)], { env: { ...process.env, ANALYTICS_TEST_MODE: 'true', ANALYTICS_STORAGE: 'file', ANALYTICS_SESSION_SECRET: randomBytes(32).toString('hex'), ANALYTICS_ADMIN_PASSWORD_HASH: passwordHash(password), ANALYTICS_SITE_ORIGIN: origin }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
let log = ''; server.stdout.on('data', chunk => { log += chunk }); server.stderr.on('data', chunk => { log += chunk })
let cookie = ''
async function request(route, method = 'GET', body, sentOrigin = origin) {
  const response = await fetch(`${origin}/api/metrics/${route}/`, { method, headers: { Origin: sentOrigin, Cookie: cookie, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined })
  const values = new Map(cookie.split('; ').filter(Boolean).map(item => item.split('=')))
  for (const item of response.headers.getSetCookie()) { const [name, value] = item.split(';')[0].split('='); if (value) values.set(name,value); else values.delete(name) }
  cookie = [...values].map(([name,value]) => `${name}=${value}`).join('; ')
  return response
}
try {
  let ready = false
  for (let i = 0; i < 90; i++) { try { if ((await request('auth')).ok) { ready = true; break } } catch {} await new Promise(r => setTimeout(r, 500)) }
  assert.ok(ready, log)
  const pageResponse = await fetch(`${origin}/analise/`)
  assert.equal(pageResponse.status, 200)
  assert.equal(pageResponse.headers.get('x-frame-options'), 'DENY')
  assert.match(pageResponse.headers.get('x-robots-tag'), /noindex/)
  assert.equal((await request('report')).status, 401)
  assert.equal((await request('auth', 'POST', { password }, 'https://example.invalid')).status, 403)
  assert.equal((await request('auth', 'POST', { password: 'incorrect' })).status, 401)
  assert.equal((await request('auth', 'POST', { password })).status, 200)
  const initial = await (await request('report')).json()
  const events = [ { id: randomUUID(), name: 'page_view', page: '/' }, { id: randomUUID(), name: 'checkout_click', page: '/', button_id: 'test-cta' }, { id: randomUUID(), name: 'section_view', page: '/', section_id: 'oferta' }, { id: randomUUID(), name: 'scroll_depth', page: '/', depth: 75 } ]
  assert.equal((await request('events', 'POST', { events })).status, 400)
  assert.equal((await request('events', 'POST', { consent: 'accepted', events })).status, 200)
  assert.equal((await request('events', 'POST', { consent: 'accepted', events })).status, 200)
  const reportResponse = await request('report'), report = await reportResponse.json()
  assert.match(reportResponse.headers.get('cache-control'), /no-store/)
  assert.equal(report.pageViews, initial.pageViews + 1)
  assert.equal(report.checkout, initial.checkout + 1)
  assert.ok(report.sections.find(s => s.label === 'Oferta').count > 0)
  const persistedCount = execFileSync(process.execPath, ['--input-type=module', '-e', "import {readEvents} from './lib/metrics-store.mjs'; console.log((await readEvents(0,Date.now())).length)"], { env: { ...process.env, NODE_ENV: 'development', ANALYTICS_STORAGE: 'file', ANALYTICS_TEST_MODE: 'true' }, encoding: 'utf8', windowsHide: true })
  assert.ok(Number(persistedCount.trim()) >= 4)
  assert.match(cookie, /agl_visitor=/)
  await request('events', 'DELETE'); assert.doesNotMatch(cookie, /agl_visitor=/)
  await request('auth', 'DELETE'); assert.equal((await request('report')).status, 401)
  console.log('PASS: real HTTP login, origin guard, validation, persistent collection, deduplication, report, consent-cookie removal and logout.')
} finally {
  if (process.platform === 'win32') { try { execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' }) } catch {} }
  else server.kill('SIGTERM')
}
