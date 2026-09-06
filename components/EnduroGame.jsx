'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, Play } from '@phosphor-icons/react'
import { createRetroAudio } from './retroAudio'

// Turbo Tap: releitura fiel do Enduro (Activision, Atari 2600, 1983).
// Regras originais: cada dia exige ultrapassar uma cota de carros (200 no dia 1, 300 depois).
// O dia passa por manhã, tarde, crepúsculo, noite (só faróis visíveis), neblina e neve (pista escorregadia).
// Bater num carro reduz a velocidade a zero; a corrida termina se a cota não fechar antes do fim do dia.

const W = 720
const H = 400
const HORIZON = 150
const DAY_LENGTH = 180000 // ms por dia
const QUOTA = (day) => (day === 1 ? 200 : 300)

const PHASES = [
  { until: 0.32, name: 'DIA', sky: ['#5ec9ff', '#c9f0ff'], ground: '#3a8f3a', mountain: '#2a6a2a', road: '#7d7d7d', fog: 0, ice: 0, night: 0 },
  { until: 0.46, name: 'TARDE', sky: ['#ff8a5b', '#ffd48a'], ground: '#4b8038', mountain: '#7a3d4a', road: '#7a7a7a', fog: 0, ice: 0, night: 0 },
  { until: 0.58, name: 'CREPÚSCULO', sky: ['#2b1f5a', '#ff6a4d'], ground: '#2c4b28', mountain: '#221a3a', road: '#5c5c5c', fog: 0, ice: 0, night: 0.45 },
  { until: 0.76, name: 'NOITE', sky: ['#05060f', '#0d1030'], ground: '#0c150c', mountain: '#080a14', road: '#1d1d24', fog: 0, ice: 0, night: 1 },
  { until: 0.86, name: 'NEBLINA', sky: ['#b9c4cf', '#d9dfe6'], ground: '#7f9a83', mountain: '#a5b0b7', road: '#8a8e93', fog: 1, ice: 0, night: 0 },
  { until: 0.95, name: 'NEVE', sky: ['#cfe3f2', '#f4f8fb'], ground: '#eef3f6', mountain: '#c7d5e0', road: '#a6adb4', fog: 0, ice: 1, night: 0 },
  { until: 1.01, name: 'AMANHECER', sky: ['#ffb27a', '#ffe7b0'], ground: '#4f8f3d', mountain: '#7a5a5a', road: '#7d7d7d', fog: 0, ice: 0, night: 0.15 },
]

// o jogador fica fixo no centro e a pista desliza PLAYER_SHIFT px por unidade de s.x; rivais usam 0.7*half (243 px na base)
const PLAYER_SHIFT = 215
const PLAYER_TO_ROAD = PLAYER_SHIFT / (348 * 0.7)
const RIVAL_COLORS = ['#ff4d4d', '#ffd23f', '#4dff88', '#4dc3ff', '#ff7ae0', '#ffffff']

function phaseAt(progress) {
  return PHASES.find((phase) => progress < phase.until) || PHASES[PHASES.length - 1]
}

function drawCar(ctx, x, y, scale, color, night, isPlayer = false) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  if (night > 0.6 && !isPlayer) {
    // À noite o Enduro só mostra os faróis traseiros dos rivais.
    ctx.fillStyle = '#ff2f2f'
    ctx.fillRect(-22, 8, 9, 6)
    ctx.fillRect(13, 8, 9, 6)
    ctx.restore()
    return
  }
  const alpha = isPlayer ? 1 : 1 - night * 0.55
  ctx.globalAlpha = alpha
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-28, 16, 56, 6)
  ctx.fillStyle = '#101014'; ctx.fillRect(-28, -2, 10, 20); ctx.fillRect(18, -2, 10, 20) // pneus
  ctx.fillStyle = color; ctx.fillRect(-22, -22, 44, 40) // carroceria
  ctx.fillStyle = isPlayer ? '#d8f4ff' : '#0f0f14'; ctx.fillRect(-15, -17, 30, 10) // vidro
  ctx.fillStyle = color; ctx.fillRect(-10, -30, 20, 8) // cabine
  ctx.fillStyle = '#ff2f2f'; ctx.fillRect(-19, 10, 9, 5); ctx.fillRect(10, 10, 9, 5) // lanternas
  ctx.globalAlpha = 1
  ctx.restore()
}

function drawFlag(ctx, x, y, color) {
  ctx.fillStyle = '#e8e8e8'; ctx.fillRect(x, y, 2, 20)
  ctx.fillStyle = color; ctx.fillRect(x + 2, y, 10, 8)
}

export default function EnduroGame() {
  const canvasRef = useRef(null)
  const keysRef = useRef({})
  const state = useRef(null)
  const audioRef = useRef(null)
  const [hud, setHud] = useState({ day: 1, left: QUOTA(1), speed: 0, phase: 'DIA', over: false, win: false })
  const [started, setStarted] = useState(false)

  const sound = () => {
    if (!audioRef.current) audioRef.current = createRetroAudio()
    return audioRef.current
  }

  useEffect(() => () => audioRef.current?.dispose(), [])

  const freshState = () => ({
    x: 0, // posição lateral do jogador, -1..1
    speed: 0, // 0..1
    maxSpeed: 1,
    dist: 0,
    day: 1,
    dayClock: 0,
    left: QUOTA(1),
    rivals: [],
    spawnAt: 0,
    curve: 0,
    curveTarget: 0,
    curveAt: 0,
    crashUntil: 0,
    over: false,
    win: false,
    snow: Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: 1 + Math.random() * 2 })),
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!state.current) state.current = freshState()
    let frame
    let last = performance.now()
    let hudTick = 0

    const down = (event) => {
      const key = event.key.toLowerCase()
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's', ' '].includes(key)) event.preventDefault()
      keysRef.current[key] = true
    }
    const up = (event) => { keysRef.current[event.key.toLowerCase()] = false }
    window.addEventListener('keydown', down, { passive: false })
    window.addEventListener('keyup', up)

    const step = (now) => {
      const s = state.current
      const dt = Math.min(2.5, (now - last) / 16.67)
      last = now
      const keys = keysRef.current
      const progress = (s.dayClock % DAY_LENGTH) / DAY_LENGTH
      const phase = phaseAt(progress)
      const running = started && !s.over

      if (running) {
        s.dayClock += dt * 16.67
        // aceleração: segurar ↑/W/espaço acelera; soltar desacelera devagar (como no cartucho)
        const gas = keys.arrowup || keys.w || keys[' ']
        const brake = keys.arrowdown || keys.s
        if (now < s.crashUntil) s.speed = Math.max(0, s.speed - 0.05 * dt)
        else if (gas) s.speed = Math.min(1, s.speed + 0.006 * dt)
        else if (brake) s.speed = Math.max(0, s.speed - 0.02 * dt)
        else s.speed = Math.max(0, s.speed - 0.0025 * dt)

        // curvas: mudam de tempos em tempos e empurram o carro para fora
        if (now > s.curveAt) { s.curveTarget = [-1, -0.5, 0, 0, 0.5, 1][Math.floor(Math.random() * 6)]; s.curveAt = now + 4000 + Math.random() * 5000 }
        s.curve += (s.curveTarget - s.curve) * 0.01 * dt
        const grip = phase.ice ? 0.45 : 1
        const steer = ((keys.arrowleft || keys.a) ? -1 : 0) + ((keys.arrowright || keys.d) ? 1 : 0)
        s.x += steer * 0.028 * grip * dt * (0.4 + s.speed)
        s.x -= s.curve * 0.012 * s.speed * dt // força centrífuga
        if (Math.abs(s.x) > 1.15) { s.x = Math.sign(s.x) * 1.15 } // limite do acostamento
        if (Math.abs(s.x) > 1) s.speed = Math.max(0, s.speed - 0.004 * dt) // acostamento freia devagar
        s.dist += s.speed * dt

        // rivais
        if (now > s.spawnAt) {
          const dense = phase.night ? 0.7 : 1
          s.rivals.push({ z: 0.02, x: (Math.random() * 1.3 - 0.65), speed: 0.35 + Math.random() * 0.25, color: RIVAL_COLORS[Math.floor(Math.random() * RIVAL_COLORS.length)], passed: false })
          s.spawnAt = now + (480 + Math.random() * 520) / dense
        }
        s.rivals.forEach((rival) => {
          rival.z += (s.speed - rival.speed) * 0.012 * dt
          rival.x -= s.curve * 0.0 // rivais seguem a pista
          if (!rival.passed && rival.z >= 1) { rival.passed = true; s.left -= 1; audioRef.current?.pass() }
          if (rival.passed && rival.z < 1 && rival.z > 0) { rival.passed = false; s.left += 1 } // te ultrapassou de volta
          if (rival.z > 0.9 && rival.z < 1.06 && Math.abs(rival.x - s.x * PLAYER_TO_ROAD) < 0.2 && now > s.crashUntil) {
            s.crashUntil = now + 900
            s.speed = 0
            rival.z = 1.2
            audioRef.current?.crash()
          }
        })
        s.rivals = s.rivals.filter((rival) => rival.z > -0.2 && rival.z < 1.3)

        if (s.left <= 0 && s.dayClock > DAY_LENGTH * 0.96) {
          s.day += 1; s.left = QUOTA(s.day); s.dayClock = 0
          if (s.day > 5) { s.over = true; s.win = true; audioRef.current?.correct(); audioRef.current?.stopMotor() }
        } else if (s.dayClock >= DAY_LENGTH && s.left > 0) {
          s.over = true; s.win = false; audioRef.current?.fail(); audioRef.current?.stopMotor()
        }
        audioRef.current?.setMotor(s.speed)
      }

      // ---------- render ----------
      const sky = ctx.createLinearGradient(0, 0, 0, HORIZON)
      sky.addColorStop(0, phase.sky[0]); sky.addColorStop(1, phase.sky[1])
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HORIZON)
      // sol / lua
      ctx.fillStyle = phase.night > 0.6 ? '#f2f2ff' : '#fff0a0'
      ctx.beginPath(); ctx.arc(W * 0.78 - progress * 200, 60 + progress * 40, phase.night > 0.6 ? 12 : 22, 0, Math.PI * 2); ctx.fill()
      // montanhas
      ctx.fillStyle = phase.mountain
      const mShift = -s.curve * 40
      ctx.beginPath(); ctx.moveTo(0, HORIZON)
      for (let i = 0; i <= 10; i += 1) ctx.lineTo(i * 72 + mShift, HORIZON - (i % 2 ? 45 : 18) - (i % 3 === 0 ? 20 : 0))
      ctx.lineTo(W, HORIZON); ctx.fill()
      ctx.fillStyle = phase.ground; ctx.fillRect(0, HORIZON, W, H - HORIZON)

      // estrada em perspectiva com curva
      const roadAt = (t) => { // t: 0 no horizonte, 1 na base
        const bend = s.curve * 160 * (1 - t) * (1 - t)
        return { cx: W / 2 + bend + s.x * -PLAYER_SHIFT * t, half: 18 + t * 330, y: HORIZON + t * (H - HORIZON) }
      }
      ctx.fillStyle = phase.road
      ctx.beginPath()
      for (let i = 0; i <= 20; i += 1) { const r = roadAt(i / 20); ctx.lineTo(r.cx - r.half, r.y) }
      for (let i = 20; i >= 0; i -= 1) { const r = roadAt(i / 20); ctx.lineTo(r.cx + r.half, r.y) }
      ctx.closePath(); ctx.fill()
      // faixas laterais listradas rolando
      const stripe = (s.dist * 18) % 40
      for (let i = 0; i < 20; i += 1) {
        const t0 = i / 20; const t1 = (i + 1) / 20
        const a = roadAt(t0); const b = roadAt(t1)
        const on = Math.floor((t0 * 400 + stripe) / 40) % 2 === 0
        ctx.fillStyle = on ? '#ffffff' : '#e03a3a'
        ctx.beginPath(); ctx.moveTo(a.cx - a.half, a.y); ctx.lineTo(b.cx - b.half, b.y); ctx.lineTo(b.cx - b.half + 6 * t1, b.y); ctx.lineTo(a.cx - a.half + 6 * t0, a.y); ctx.fill()
        ctx.beginPath(); ctx.moveTo(a.cx + a.half, a.y); ctx.lineTo(b.cx + b.half, b.y); ctx.lineTo(b.cx + b.half - 6 * t1, b.y); ctx.lineTo(a.cx + a.half - 6 * t0, a.y); ctx.fill()
      }

      // rivais (do mais longe pro mais perto)
      s.rivals.filter((rival) => rival.z <= 1.02).sort((a, b) => a.z - b.z).forEach((rival) => {
        const t = Math.max(0, Math.min(1, rival.z))
        const r = roadAt(t)
        drawCar(ctx, r.cx + rival.x * r.half * 0.7, r.y, 0.18 + t * 0.9, rival.color, phase.night)
      })
      // jogador
      const shake = now < s.crashUntil ? (Math.random() - 0.5) * 8 : 0
      drawCar(ctx, W / 2 + shake, 340, 1.1, '#ff623e', 0, true)

      // neblina: esconde tudo além de um certo ponto
      if (phase.fog) { const fog = ctx.createLinearGradient(0, HORIZON, 0, 330); fog.addColorStop(0, 'rgba(215,222,228,1)'); fog.addColorStop(1, 'rgba(215,222,228,0)'); ctx.fillStyle = fog; ctx.fillRect(0, 0, W, 330) }
      if (phase.ice) { ctx.fillStyle = '#fff'; s.snow.forEach((flake) => { flake.y += flake.s * dt * 1.5; flake.x += Math.sin(now / 400 + flake.y) * 0.5; if (flake.y > H) { flake.y = -4; flake.x = Math.random() * W }; ctx.fillRect(flake.x, flake.y, flake.s, flake.s) }) }
      if (phase.night) { ctx.fillStyle = `rgba(0,0,12,${phase.night * 0.35})`; ctx.fillRect(0, HORIZON, W, H - HORIZON) }

      // painel estilo Activision: cota restante, dia, bandeiras dos dias vencidos, velocímetro
      ctx.fillStyle = '#0b0b10'; ctx.fillRect(0, H - 46, W, 46)
      ctx.fillStyle = '#ffd23f'; ctx.font = '700 16px "Space Grotesk", monospace'
      ctx.fillText(`FALTAM ${Math.max(0, s.left).toString().padStart(3, '0')}`, 20, H - 17)
      ctx.fillStyle = '#9fe870'; ctx.fillText(`DIA ${s.day}`, 220, H - 17)
      for (let i = 1; i < s.day; i += 1) drawFlag(ctx, 300 + i * 18, H - 36, '#4dff88')
      // velocímetro
      ctx.fillStyle = '#26262f'; ctx.fillRect(W - 220, H - 32, 200, 16)
      ctx.fillStyle = s.speed > 0.85 ? '#ff4d4d' : '#4dc3ff'; ctx.fillRect(W - 220, H - 32, 200 * s.speed, 16)
      ctx.fillStyle = '#fff'; ctx.font = '700 10px "Space Grotesk"'; ctx.fillText(`${Math.round(s.speed * 240)} KM/H`, W - 215, H - 20)

      hudTick += 1
      if (hudTick % 10 === 0) setHud({ day: s.day, left: Math.max(0, s.left), speed: Math.round(s.speed * 240), phase: phase.name, over: s.over, win: s.win })
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [started])

  const reset = () => { const audio = sound(); audio.start(); audio.startMotor('car'); state.current = freshState(); setHud({ day: 1, left: QUOTA(1), speed: 0, phase: 'DIA', over: false, win: false }); setStarted(true) }
  const setKey = (key, value) => { keysRef.current[key] = value }
  const hold = (key, label, Icon) => (
    <button type="button" onPointerDown={() => setKey(key, true)} onPointerUp={() => setKey(key, false)} onPointerLeave={() => setKey(key, false)} aria-label={label}><Icon /></button>
  )

  return (
    <div className="canvas-game endurance-game">
      <div className="canvas-hud"><span>TURBO TAP · {hud.phase}</span><strong>DIA {hud.day} · FALTAM {hud.left}</strong></div>
      <canvas ref={canvasRef} width={W} height={H} />
      {!started && <GameIntro eyebrow="ENDURANCE · ESTILO ENDURO (1983)" title="Turbo Tap" text="Ultrapasse 200 carros antes do fim do dia 1 e 300 nos dias seguintes. Enfrente crepúsculo, noite só com faróis, neblina e neve com pista escorregadia. Bater zera a velocidade." onStart={reset} />}
      {hud.over && <GameIntro eyebrow={hud.win ? 'VOCÊ VENCEU A SEMANA' : 'O DIA ACABOU'} title={hud.win ? '5 dias completos' : `Dia ${hud.day} · faltaram ${hud.left}`} text={hud.win ? 'Fechou a cota em todos os dias. Só quem domina a neve chega aqui.' : 'A cota não fechou antes do amanhecer. Segure o acelerador e passe pelo tráfego mais cedo.'} onStart={reset} button="CORRER DE NOVO" />}
      {started && !hud.over && <div className="side-controls">{hold('arrowleft', 'Virar à esquerda', ArrowLeft)}{hold('arrowup', 'Acelerar', ArrowUp)}{hold('arrowright', 'Virar à direita', ArrowRight)}</div>}
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
