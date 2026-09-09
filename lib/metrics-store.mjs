import { mkdir, readFile, writeFile, rename } from 'node:fs/promises'
import path from 'node:path'

const RETENTION = 90 * 86400000
let pool
let queue = Promise.resolve()
function localFile() { return path.join(process.cwd(), '.local', process.env.ANALYTICS_TEST_MODE === 'true' ? 'analytics-test' : 'analytics', 'events.json') }
export function storageConfigured() {
  if (process.env.ANALYTICS_STORAGE === 'file') return process.env.NODE_ENV !== 'production'
  return ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'].every(key => Boolean(process.env[key]))
}
async function database() {
  if (!storageConfigured()) throw new Error('Metrics storage not configured')
  if (!pool) { const mysql = await import('mysql2/promise'); pool = mysql.createPool({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectionLimit: 4, connectTimeout: 5000, supportBigNumbers: true, bigNumberStrings: false }) }
  return pool
}
function localOperation(fn) {
  const result = queue.then(async () => {
    const file = localFile()
    await mkdir(path.dirname(file), { recursive: true })
    let state = { events: [], limits: {} }
    try { state = JSON.parse(await readFile(file, 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
    const now = Date.now()
    state.events = state.events.filter(e => e.time > now - RETENTION)
    for (const key of Object.keys(state.limits)) if (state.limits[key].exp < now) delete state.limits[key]
    const output = fn(state)
    await writeFile(`${file}.tmp`, JSON.stringify(state), { mode: 0o600 })
    await rename(`${file}.tmp`, file)
    return output
  })
  queue = result.catch(() => {})
  return result
}
function isLocal() { return process.env.ANALYTICS_STORAGE === 'file' && process.env.NODE_ENV !== 'production' }
export async function rateLimit(key, limit, windowMs) {
  const now = Date.now(), bucket = `${key}:${Math.floor(now / windowMs)}`, exp = now + windowMs
  if (isLocal()) return localOperation(state => { const entry = state.limits[bucket] ||= { hits: 0, exp }; return ++entry.hits <= limit })
  const db = await database()
  await db.execute('INSERT INTO metrics_limits (bucket,hits,expires) VALUES (?,1,?) ON DUPLICATE KEY UPDATE hits=hits+1', [bucket, exp])
  const [rows] = await db.execute('SELECT hits FROM metrics_limits WHERE bucket=?', [bucket])
  await db.execute('DELETE FROM metrics_limits WHERE expires < ? LIMIT 100', [now])
  return rows[0].hits <= limit
}
export async function insertEvents(events) {
  if (isLocal()) return localOperation(state => { const ids = new Set(state.events.map(e => e.id)); const fresh = events.filter(e => !ids.has(e.id) && ids.add(e.id)); if (state.events.length + fresh.length > 100000) throw new Error('Development storage full'); state.events.push(...fresh) })
  const db = await database(), connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    for (const e of events) await connection.execute('INSERT IGNORE INTO metrics_events (id,time,visitor,session,name,page,section_id,game_id,button_id,depth) VALUES (?,?,?,?,?,?,?,?,?,?)', [e.id,e.time,e.visitor,e.session,e.name,e.page,e.section_id,e.game_id,e.button_id,e.depth])
    await connection.commit()
  } catch (error) { await connection.rollback(); throw error } finally { connection.release() }
  await db.execute('DELETE FROM metrics_events WHERE time < ? LIMIT 1000', [Date.now() - RETENTION])
}
export async function readEvents(since, until) {
  let rows
  if (isLocal()) rows = await localOperation(state => state.events.filter(e => e.time >= since && e.time <= until))
  else [rows] = await (await database()).execute('SELECT * FROM metrics_events WHERE time >= ? AND time <= ? ORDER BY time LIMIT 50001', [since, until])
  if (rows.length > 50000) throw new Error('Report too large; choose a shorter period')
  return rows
}
