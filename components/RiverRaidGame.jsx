'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Crosshair, Play } from '@phosphor-icons/react'
import { createRetroAudio } from './retroAudio'
import TouchGameControls from './TouchGameControls'

// Canyon Strike: releitura fiel do River Raid (Activision, Atari 2600, 1982).
// Elementos originais: rio vertical que estreita e se abre, ilhas, navios-tanque, helicópteros,
// jatos cruzando, depósitos de combustível (passe por cima para abastecer ou atire para pontuar),
// ponte no fim de cada setor (500 pts), medidor E–F, três vidas, acelera com ↑ e reduz com ↓.

const W = 720
const H = 400
const ROW = 8 // altura de cada faixa do rio em px
const SECTION = 340 // linhas por setor antes da ponte
const PLANE_Y = 335
const POINTS = { ship: 30, heli: 60, fuel: 80, jet: 100, bridge: 500 }

function makeRow(index, prev, sectionRow) {
  // Largura e centro do rio mudam suavemente; ponte ocupa as últimas linhas do setor com rio reto e largo.
  const nearBridge = sectionRow > SECTION - 14 || sectionRow < 10
  let center = prev ? prev.center : W / 2
  let half = prev ? prev.half : 150
  let island = prev ? prev.island : 0
  if (nearBridge) {
    center += (W / 2 - center) * 0.2
    half += (150 - half) * 0.2
    island = Math.max(0, island - 8)
  } else {
    if (index % 40 === 0) prev.targetCenter = W / 2 + (Math.random() - 0.5) * 240
    if (index % 55 === 0) prev.targetHalf = 70 + Math.random() * 170
    if (index % 90 === 0) prev.targetIsland = Math.random() > 0.55 && half > 130 ? 30 + Math.random() * 40 : 0
    center += ((prev.targetCenter ?? W / 2) - center) * 0.04
    half += ((prev.targetHalf ?? 150) - half) * 0.04
    island += ((prev.targetIsland ?? 0) - island) * 0.06
  }
  center = Math.max(half + 20, Math.min(W - half - 20, center))
  return { center, half, island, targetCenter: prev?.targetCenter, targetHalf: prev?.targetHalf, targetIsland: prev?.targetIsland, bridge: sectionRow === SECTION - 4 }
}

function drawPlane(ctx, x, y, dead) {
  ctx.save(); ctx.translate(x, y)
  ctx.fillStyle = dead ? '#ff6a3d' : '#f4f4ec'
  ctx.fillRect(-3, -22, 6, 44) // fuselagem
  ctx.fillRect(-26, -2, 52, 8) // asas
  ctx.fillRect(-10, 14, 20, 5) // cauda
  ctx.fillStyle = '#ffd23f'; ctx.fillRect(-2, -26, 4, 6)
  ctx.restore()
}

function drawEnemy(ctx, e) {
  ctx.save(); ctx.translate(e.x, e.y)
  if (e.type === 'ship') { ctx.fillStyle = '#e8e8e8'; ctx.fillRect(-30, -6, 60, 12); ctx.fillStyle = '#3a3a48'; ctx.fillRect(-12, -14, 24, 8); ctx.fillStyle = '#ff4d4d'; ctx.fillRect(-30, 4, 60, 3) }
  if (e.type === 'heli') { ctx.fillStyle = '#4dff88'; ctx.fillRect(-14, -7, 28, 14); ctx.fillRect(14, -3, 14, 5); ctx.fillStyle = '#d0ffe0'; const r = (performance.now() / 40) % 2 > 1; ctx.fillRect(r ? -26 : -3, -11, r ? 52 : 6, 3) }
  if (e.type === 'jet') { ctx.fillStyle = '#ffd23f'; ctx.fillRect(-20, -3, 40, 6); ctx.fillRect(-6, -10, 12, 20); ctx.fillRect(e.dir > 0 ? 12 : -20, -8, 8, 16) }
  if (e.type === 'fuel') { ctx.fillStyle = '#ff5a5a'; ctx.fillRect(-14, -22, 28, 44); ctx.fillStyle = '#fff'; ctx.font = '700 12px "Space Grotesk"'; ctx.textAlign = 'center'; ctx.fillText('FUEL', 0, 4) }
  if (e.type === 'bridge') { ctx.fillStyle = '#6a6a72'; ctx.fillRect(-e.w / 2, -10, e.w, 20); ctx.fillStyle = '#ffd23f'; for (let x = -e.w / 2 + 10; x < e.w / 2; x += 20) ctx.fillRect(x, -3, 10, 6) }
  ctx.restore()
}

export default function RiverRaidGame() {
  const canvasRef = useRef(null)
  const keysRef = useRef({})
  const state = useRef(null)
  const audioRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [hud, setHud] = useState({ score: 0, lives: 3, fuel: 100, over: false, sector: 1 })

  const sound = () => {
    if (!audioRef.current) audioRef.current = createRetroAudio()
    return audioRef.current
  }

  useEffect(() => () => audioRef.current?.dispose(), [])

  const freshState = () => ({ x: W / 2, scroll: 0, speed: 2.2, rows: [], enemies: [], bullets: [], score: 0, lives: 3, fuel: 100, sector: 1, dead: 0, over: false, nextRow: 0, spawnAt: 0, lastShot: 0, lastFuelSound: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!state.current) state.current = freshState()
    let frame; let last = performance.now(); let hudTick = 0

    const down = (event) => { const key = event.key.toLowerCase(); if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's', ' '].includes(key)) event.preventDefault(); keysRef.current[key] = true }
    const up = (event) => { keysRef.current[event.key.toLowerCase()] = false }
    window.addEventListener('keydown', down, { passive: false }); window.addEventListener('keyup', up)

    const ensureRows = (s) => {
      const needed = Math.ceil((s.scroll + H) / ROW) + 4
      while (s.nextRow < needed) {
        const sectionRow = s.nextRow % SECTION
        const row = makeRow(s.nextRow, s.rows[s.nextRow - 1], sectionRow)
        s.rows[s.nextRow] = row
        const worldY = s.nextRow * ROW
        if (row.bridge) s.enemies.push({ type: 'bridge', x: row.center, worldY, w: row.half * 2 + 30, hp: 1 })
        else if (sectionRow > 14 && sectionRow < SECTION - 24 && Math.random() < 0.09) {
          const roll = Math.random()
          const type = roll < 0.3 ? 'ship' : roll < 0.55 ? 'heli' : roll < 0.8 ? 'fuel' : 'jet'
          const side = Math.random() > 0.5 ? 1 : -1
          const x = type === 'jet' ? (side > 0 ? -30 : W + 30) : row.center + (Math.random() - 0.5) * (row.half * 2 - 70)
          s.enemies.push({ type, x, worldY, dir: type === 'jet' ? side : (Math.random() > 0.5 ? 1 : -1), vx: type === 'jet' ? 5 : type === 'heli' ? 1.2 : type === 'ship' ? 0.5 : 0 })
        }
        s.nextRow += 1
      }
    }
    const rowAt = (s, screenY) => s.rows[Math.floor((s.scroll + (H - screenY)) / ROW)]
    const insideRiver = (row, x) => {
      if (!row) return true
      if (x < row.center - row.half + 6 || x > row.center + row.half - 6) return false
      if (row.island > 4 && Math.abs(x - row.center) < row.island) return false
      return true
    }
    const kill = (s, now) => { if (s.dead) return; s.dead = now; s.lives -= 1; audioRef.current?.crash(); audioRef.current?.stopMotor() }

    const step = (now) => {
      const s = state.current
      const dt = Math.min(2.5, (now - last) / 16.67); last = now
      const keys = keysRef.current
      const running = started && !s.over

      if (running) {
        if (s.dead && now - s.dead > 1400) {
          if (s.lives <= 0) { s.over = true; audioRef.current?.fail() } else { s.dead = 0; s.fuel = 100; s.x = W / 2; s.scroll = (s.sector - 1) * SECTION * ROW; s.enemies = s.enemies.filter((e) => e.worldY > s.scroll + H + 40); s.bullets = []; audioRef.current?.startMotor('plane') } // volta ao início do setor, como no original
        }
        if (!s.dead) {
          s.speed = keys.arrowup || keys.w ? 4.2 : keys.arrowdown || keys.s ? 1.3 : 2.4
          s.scroll += s.speed * dt
          ensureRows(s)
          const steer = ((keys.arrowleft || keys.a) ? -1 : 0) + ((keys.arrowright || keys.d) ? 1 : 0)
          s.x = Math.max(10, Math.min(W - 10, s.x + steer * 4.6 * dt))
          s.fuel -= 0.045 * dt * (s.speed / 2.4)
          if (s.fuel <= 0) { s.fuel = 0; kill(s, now) }
          if ((keys[' '] || keys.fire) && now - s.lastShot > 260) { s.lastShot = now; s.bullets.push({ x: s.x, y: PLANE_Y - 26 }); audioRef.current?.shoot() }
          if (!insideRiver(rowAt(s, PLANE_Y), s.x)) kill(s, now)
          const nextSector = Math.floor(s.scroll / ROW / SECTION) + 1
          if (nextSector > s.sector) audioRef.current?.correct()
          s.sector = nextSector
          audioRef.current?.setMotor(Math.min(1, s.speed / 4.2))
        }
        s.bullets.forEach((b) => { b.y -= 9 * dt })
        s.bullets = s.bullets.filter((b) => b.y > -20)
        s.enemies.forEach((e) => {
          e.y = H - (e.worldY - s.scroll)
          if (e.vx) {
            e.x += e.vx * e.dir * dt
            const row = s.rows[Math.floor(e.worldY / ROW)]
            if (e.type !== 'jet' && row && (e.x < row.center - row.half + 30 || e.x > row.center + row.half - 30)) e.dir *= -1
          }
          // tiros
          s.bullets.forEach((b) => {
            const hw = e.type === 'bridge' ? e.w / 2 : 30
            if (!b.hit && Math.abs(b.x - e.x) < hw && Math.abs(b.y - e.y) < 16) { b.hit = true; e.hit = true; s.score += POINTS[e.type]; audioRef.current?.hit() }
          })
          // colisão com o avião
          if (!s.dead && !e.hit && Math.abs(e.x - s.x) < (e.type === 'bridge' ? e.w / 2 : 28) && Math.abs(e.y - PLANE_Y) < 20) {
            if (e.type === 'fuel') { s.fuel = Math.min(100, s.fuel + 0.9 * dt); if (now - s.lastFuelSound > 420) { s.lastFuelSound = now; audioRef.current?.refuel() } } // sobrevoar abastece
            else kill(s, now)
          }
        })
        s.bullets = s.bullets.filter((b) => !b.hit)
        s.enemies = s.enemies.filter((e) => !e.hit && e.y < H + 60 && e.x > -80 && e.x < W + 80)
      }

      // ---------- render ----------
      ctx.fillStyle = '#2f7a2f'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#1f4fbf'
      ctx.beginPath()
      const top = Math.floor(s.scroll / ROW)
      for (let i = 0; i <= H / ROW + 1; i += 1) { const row = s.rows[top + i]; if (!row) continue; const y = H - (i * ROW - (s.scroll % ROW)); ctx.rect(row.center - row.half, y - ROW, row.half * 2, ROW + 1) }
      ctx.fill()
      ctx.fillStyle = '#7a5a2a'
      for (let i = 0; i <= H / ROW + 1; i += 1) { const row = s.rows[top + i]; if (!row || row.island < 4) continue; const y = H - (i * ROW - (s.scroll % ROW)); ctx.fillRect(row.center - row.island, y - ROW, row.island * 2, ROW + 1) }
      // casas nas margens, como no original
      ctx.fillStyle = '#e9e2c8'
      for (let i = 0; i < 6; i += 1) { const y = ((i * 97 + s.scroll * 1) % (H + 40)) - 20; ctx.fillRect(i % 2 ? W - 60 : 30, y, 16, 12) }

      s.enemies.forEach((e) => drawEnemy(ctx, e))
      ctx.fillStyle = '#ffd23f'; s.bullets.forEach((b) => ctx.fillRect(b.x - 1.5, b.y - 8, 3, 12))
      if (started) drawPlane(ctx, s.x, PLANE_Y, !!s.dead)
      if (s.dead) { ctx.fillStyle = 'rgba(255,120,40,.6)'; ctx.beginPath(); ctx.arc(s.x, PLANE_Y, Math.min(70, 26 + ((now - s.dead) / 40)), 0, Math.PI * 2); ctx.fill() }

      // painel inferior estilo Activision: placar, tanque E–F, vidas
      ctx.fillStyle = '#8f8f8f'; ctx.fillRect(0, H - 46, W, 46)
      ctx.fillStyle = '#121218'; ctx.font = '700 18px "Space Grotesk"'; ctx.textAlign = 'left'; ctx.fillText(String(s.score).padStart(6, '0'), 20, H - 16)
      ctx.fillStyle = '#121218'; ctx.font = '700 11px "Space Grotesk"'; ctx.fillText('E', 250, H - 16); ctx.fillText('½', 355, H - 16); ctx.fillText('F', 466, H - 16)
      ctx.fillStyle = '#121218'; ctx.fillRect(265, H - 30, 195, 12)
      ctx.fillStyle = s.fuel < 20 ? '#ff4d4d' : '#ffd23f'; ctx.fillRect(265, H - 30, 195 * (s.fuel / 100), 12)
      for (let i = 0; i < s.lives; i += 1) { ctx.save(); ctx.translate(560 + i * 28, H - 24); ctx.scale(0.4, 0.4); drawPlane(ctx, 0, 0, false); ctx.restore() }
      ctx.fillStyle = '#121218'; ctx.font = '700 10px "Space Grotesk"'; ctx.fillText(`SETOR ${s.sector}`, 150, H - 16)

      hudTick += 1
      if (hudTick % 10 === 0) setHud({ score: s.score, lives: s.lives, fuel: Math.round(s.fuel), over: s.over, sector: s.sector })
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [started])

  const reset = () => { const audio = sound(); audio.start(); audio.startMotor('plane'); state.current = freshState(); setHud({ score: 0, lives: 3, fuel: 100, over: false, sector: 1 }); setStarted(true) }
  const setKey = (key, value) => { keysRef.current[key] = value }
  const hold = (key, label, Icon) => (
    <button type="button" onPointerDown={() => setKey(key, true)} onPointerUp={() => setKey(key, false)} onPointerLeave={() => setKey(key, false)} aria-label={label}><Icon /></button>
  )

  return (
    <div className="canvas-game river-game">
      <div className="canvas-hud"><span>CANYON STRIKE · SETOR {hud.sector}</span><strong>{hud.score} PTS · FUEL {hud.fuel}%</strong></div>
      <canvas ref={canvasRef} width={W} height={H} />
      {!started && <GameIntro eyebrow="VOO · ESTILO RIVER RAID (1982)" title="Canyon Strike" text="Siga o rio sem tocar as margens. Atire (espaço) em navios, helicópteros, jatos e na ponte no fim de cada setor. Sobrevoe os depósitos FUEL para abastecer. ↑ acelera, ↓ reduz." onStart={reset} />}
      {hud.over && <GameIntro eyebrow="MISSÃO ENCERRADA" title={`${hud.score} pontos`} text={`Você chegou ao setor ${hud.sector}. Voe devagar nos trechos estreitos e nunca deixe o tanque zerar.`} onStart={reset} button="VOAR DE NOVO" />}
      {started && !hud.over && <>
        <div className="side-controls desktop-game-controls">{hold('arrowleft', 'Voar para esquerda', ArrowLeft)}{hold('fire', 'Atirar', Crosshair)}{hold('arrowright', 'Voar para direita', ArrowRight)}</div>
        <TouchGameControls onMove={(x, y) => { setKey('arrowleft', x < -0.28); setKey('arrowright', x > 0.28); setKey('arrowup', y < -0.42); setKey('arrowdown', y > 0.42) }} actions={[{ label: 'FOGO', ariaLabel: 'Atirar', primary: true, onChange: (down) => setKey('fire', down) }]} />
      </>}
    </div>
  )
}

function GameIntro({ eyebrow, title, text, onStart, button = 'COMEÇAR' }) {
  return (
    <div className="mini-intro">
      <span>{eyebrow}</span><h3>{title}</h3><p>{text}</p>
      <button type="button" onClick={onStart}><Play weight="fill" /> {button}</button>
    </div>
  )
}
