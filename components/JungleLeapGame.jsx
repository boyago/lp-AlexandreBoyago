'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Play } from '@phosphor-icons/react'
import { createRetroAudio } from './retroAudio'
import TouchGameControls from './TouchGameControls'

// Jungle Leap: releitura fiel do Pitfall! (Activision, Atari 2600, 1982).
// 255 telas encadeadas com toras (paradas ou rolando, tiram pontos), poços de piche e areia movediça,
// lagoas com três jacarés (só a cabeça fechada é segura), cipó, buracos com escada para o subterrâneo
// (paredes de tijolo e escorpião), cascavéis e fogueiras guardando 32 tesouros, 20 minutos, 3 vidas, 2000 pontos.

const W = 720
const H = 400
const GROUND = 250 // y dos pés no nível da selva
const UNDER = 378 // y dos pés no subterrâneo
const UNDER_TOP = 300
const TIME_LIMIT = 20 * 60 * 1000
const TREASURE_X = 655
const CROC_SPACING = 70
const TREASURES = [
  { type: 'bag', label: 'SACO DE DINHEIRO', value: 2000 },
  { type: 'silver', label: 'BARRA DE PRATA', value: 3000 },
  { type: 'gold', label: 'BARRA DE OURO', value: 4000 },
  { type: 'ring', label: 'ANEL DE DIAMANTE', value: 5000 },
]

function seeded(n) { const s = Math.sin(n * 9301 + 49297) * 233280; return s - Math.floor(s) }

// Cada tela é gerada de forma determinística a partir do índice, como a sequência fixa do cartucho.
// Tipos do original: buracos (1 ou 3), toras (1 a 3, paradas ou rolando), lagoa com jacarés (com cipó ou tesouro),
// piche com cipó, areia movediça, e tesouros sempre guardados por cascavel ou fogueira.
function makeRoom(index) {
  const r = (k) => seeded(index * 11 + k)
  const roll = r(1)
  const room = { index, logs: [], pit: null, crocs: false, vine: false, holes: [], ladder: null, treasure: null, wall: null, scorpion: r(9) > 0.5, quicksand: false, snake: null, fire: null }
  const guard = (x) => { if (r(12) > 0.5) room.snake = { x }; else room.fire = { x } }
  const wallMaybe = () => { if (r(6) > 0.55) room.wall = { x: r(7) > 0.5 ? 130 : 590 } }
  if (roll < 0.2) { // toras
    const count = 1 + Math.floor(r(2) * 3); const rolling = r(3) > 0.45
    const gap = r(13) > 0.5 ? 60 : 160
    for (let i = 0; i < count; i += 1) room.logs.push({ x: 200 + i * gap + r(4 + i) * 40, rolling, phase: i * 200 })
    wallMaybe()
  } else if (roll < 0.36) { // piche com cipó
    room.pit = { x: 235, w: 250, kind: 'tar' }; room.vine = true
  } else if (roll < 0.52) { // lagoa com jacarés, às vezes com cipó ou tesouro
    room.pit = { x: 245, w: 230, kind: 'water' }; room.crocs = true
    if (r(14) > 0.6) room.vine = true
    else if (r(15) > 0.5) { room.treasure = TREASURES[index % TREASURES.length]; guard(560) }
  } else if (roll < 0.66) { // areia movediça que abre e fecha
    room.pit = { x: 280, w: 160, kind: 'sand' }; room.quicksand = true
  } else if (roll < 0.82) { // buracos com escada
    const triple = r(5) > 0.5
    room.holes = triple ? [220, 360, 500] : [360]
    room.ladder = 360
    wallMaybe()
  } else { // tesouro guardado por cascavel ou fogueira
    room.treasure = TREASURES[index % TREASURES.length]
    guard(560)
    if (r(8) > 0.5) room.logs.push({ x: 300 + r(8) * 60, rolling: false, phase: 0 })
    wallMaybe()
  }
  return room
}

const logX = (log, now) => (log.rolling ? ((log.x - (now + log.phase) / 12) % 760 + 760) % 760 - 20 : log.x)

// ---------- sprites, todos desenhados em blocos como o 2600 ----------
function px(ctx, color, x, y, w, h) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h) }

function drawHarry(ctx, x, y, dir, frame, pose, dead) {
  // Harry de perfil, como no cartucho: sempre olha para o lado em que anda; as pernas fazem a passada lateral.
  ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1)
  const skin = dead ? '#7a4a3a' : '#e9a67a'
  const shirt = '#2f9a3d'; const pants = '#3554b8'; const hair = '#5a3a1a'; const boot = '#3a2a1a'
  const running = pose === 'run' && frame !== 0
  const step = running ? Math.sin(frame) : 0
  // pernas (desenhadas primeiro para ficarem atrás do corpo)
  if (pose === 'vine') { px(ctx, pants, -4, -17, 5, 12); px(ctx, pants, 1, -17, 5, 12); px(ctx, boot, -4, -5, 6, 3); px(ctx, boot, 1, -5, 6, 3) }
  else if (pose === 'climb') { const c = Math.sin(frame * 2) * 4; px(ctx, pants, -4, -17 - c, 5, 12 + c); px(ctx, pants, 1, -17 + c, 5, 12 - c); px(ctx, boot, -4, -5, 6, 3); px(ctx, boot, 1, -5, 6, 3) }
  else if (!running) { px(ctx, pants, -3, -17, 8, 14); px(ctx, boot, -3, -3, 9, 3) }
  else {
    // perna da frente avança, perna de trás recua; coxa + canela em blocos diagonais
    const f = step * 7; const k = Math.abs(step) * 4
    px(ctx, pants, -1 + f * 0.5, -17, 5, 8); px(ctx, pants, -1 + f, -10, 5, 8 - k * 0.5); px(ctx, boot, -2 + f, -3 + Math.max(0, -step) * 2, 7, 3)
    px(ctx, pants, -1 - f * 0.5, -17, 5, 8); px(ctx, pants, -1 - f, -10, 5, 8); px(ctx, boot, -2 - f, -3 + Math.max(0, step) * 2, 7, 3)
  }
  px(ctx, shirt, -5, -31, 11, 14) // tronco de perfil
  px(ctx, skin, -3, -40, 10, 9) // rosto
  px(ctx, hair, -5, -43, 12, 4); px(ctx, hair, -5, -40, 3, 7) // cabelo e nuca
  px(ctx, skin, 7, -37, 2, 3) // nariz
  px(ctx, '#111', 4, -38, 2, 2) // olho
  if (pose === 'vine') { px(ctx, skin, -1, -50, 4, 20); px(ctx, skin, 3, -50, 4, 20) } // duas mãos no cipó
  else if (pose === 'climb') { const c = Math.sin(frame * 2) * 4; px(ctx, skin, -3, -44 - c, 4, 14); px(ctx, skin, 4, -44 + c, 4, 14) }
  else { const swing = step * 6; px(ctx, skin, 2 + swing, -30, 4, 11); px(ctx, shirt, 2 + swing, -30, 4, 4) } // braço da frente balança
  ctx.restore()
}

function drawCroc(ctx, cx, open, t) {
  ctx.save(); ctx.translate(0, 16) // jacarés boiam dentro da lagoa, abaixo da linha da grama
  // corpo verde deitado na água; a cabeça fica à direita e a mandíbula superior sobe quando abre
  px(ctx, '#0b3d0b', cx - 28, 234, 44, 16); px(ctx, '#1f7a1f', cx - 26, 236, 40, 12) // contorno + corpo
  px(ctx, '#0b3d0b', cx - 26, 231, 8, 5); px(ctx, '#0b3d0b', cx - 14, 231, 8, 5); px(ctx, '#0b3d0b', cx - 2, 231, 8, 5) // escamas
  px(ctx, '#0b3d0b', cx - 42, 239, 16, 8); px(ctx, '#1f7a1f', cx - 40, 240, 14, 6) // cauda
  px(ctx, '#0b3d0b', cx + 12, 236, 20, 14); px(ctx, '#1f7a1f', cx + 14, 238, 16, 10) // mandíbula inferior
  px(ctx, '#f4f4f4', cx + 14, 238, 16, 2) // dentes
  if (open) { px(ctx, '#0b3d0b', cx + 10, 220, 22, 12); px(ctx, '#1f7a1f', cx + 12, 222, 18, 8); px(ctx, '#f4f4f4', cx + 12, 230, 18, 2); px(ctx, '#111', cx + 22, 224, 3, 3) } else { px(ctx, '#0b3d0b', cx + 10, 230, 22, 8); px(ctx, '#1f7a1f', cx + 12, 232, 18, 6); px(ctx, '#111', cx + 22, 233, 3, 3) }
  if (Math.floor(t / 400) % 2 === 0) px(ctx, '#f4f4f4', cx - 12, 228, 3, 3) // olho pisca
  ctx.restore()
}

function drawSnake(ctx, x, t) {
  // cascavel enrolada, cabeça erguida e língua piscando
  px(ctx, '#111', x - 14, 238, 28, 12)
  px(ctx, '#f2e46a', x - 10, 242, 20, 3)
  px(ctx, '#111', x - 4, 226, 10, 12) // pescoço
  px(ctx, '#111', x - 2, 218, 14, 9) // cabeça
  px(ctx, '#f2e46a', x + 6, 221, 3, 3)
  if (Math.floor(t / 250) % 2 === 0) px(ctx, '#ff3b3b', x + 12, 224, 6, 2) // língua
  px(ctx, '#f2e46a', x - 16, 236, 6, 4); px(ctx, '#111', x - 16, 232, 4, 4) // chocalho
}

function drawFire(ctx, x, t) {
  px(ctx, '#6a3a1a', x - 16, 244, 32, 6); px(ctx, '#6a3a1a', x - 12, 248, 24, 4)
  const f = Math.floor(t / 90) % 3
  px(ctx, '#ff8a1f', x - 12, 226 + f * 2, 24, 18)
  px(ctx, '#ffd23f', x - 6, 218 + (2 - f) * 3, 12, 20)
  px(ctx, '#fff2a0', x - 2, 228, 4, 10)
}

function drawScorpion(ctx, x, dir, t) {
  const leg = Math.floor(t / 120) % 2
  px(ctx, '#f4f4f4', x - 12, UNDER - 9, 24, 7) // corpo
  px(ctx, '#f4f4f4', x + 12 * dir, UNDER - 14, 5, 5); px(ctx, '#f4f4f4', x + 15 * dir, UNDER - 18, 4, 5) // garra
  px(ctx, '#f4f4f4', x - 14 * dir, UNDER - 16, 3, 8); px(ctx, '#f4f4f4', x - 16 * dir, UNDER - 20, 5, 4) // cauda com ferrão
  for (let i = 0; i < 3; i += 1) px(ctx, '#f4f4f4', x - 9 + i * 8, UNDER - 2 + (i % 2 === leg ? 1 : 0), 3, 3)
}

function drawLog(ctx, x) {
  ctx.fillStyle = '#7a4a1e'; ctx.beginPath(); ctx.arc(x, 237, 13, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#c98e5a'; ctx.lineWidth = 2; for (let r = 3; r < 12; r += 4) { ctx.beginPath(); ctx.arc(x, 237, r, 0, Math.PI * 2); ctx.stroke() }
}

function drawTreasure(ctx, type, t) {
  const x = TREASURE_X; const bob = Math.sin(t / 300) * 1.5
  if (type === 'bag') { px(ctx, '#f4f4f4', x - 12, 226 + bob, 24, 22); px(ctx, '#f4f4f4', x - 6, 220 + bob, 12, 7); px(ctx, '#3a3a3a', x - 4, 236 + bob, 8, 6) }
  if (type === 'silver') { px(ctx, '#c9ccd8', x - 16, 232 + bob, 32, 14); px(ctx, '#eef0f6', x - 12, 235 + bob, 24, 3) }
  if (type === 'gold') { px(ctx, '#e0a81a', x - 16, 232 + bob, 32, 14); px(ctx, '#ffe27a', x - 12, 235 + bob, 24, 3) }
  if (type === 'ring') { ctx.strokeStyle = '#f4f4f4'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, 236 + bob, 10, 0, Math.PI * 2); ctx.stroke(); px(ctx, Math.floor(t / 200) % 2 ? '#8ef7ff' : '#fff', x - 4, 220 + bob, 8, 8) }
}

export default function JungleLeapGame() {
  const canvasRef = useRef(null)
  const keysRef = useRef({})
  const state = useRef(null)
  const audioRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [hud, setHud] = useState({ score: 2000, lives: 3, room: 1, over: false, found: 0 })

  const sound = () => {
    if (!audioRef.current) audioRef.current = createRetroAudio()
    return audioRef.current
  }
  useEffect(() => () => audioRef.current?.dispose(), [])

  const freshState = () => ({ room: 0, x: 40, y: GROUND, vy: 0, dir: 1, level: 'surface', onVine: false, climbing: false, score: 2000, lives: 3, clock: TIME_LIMIT, collected: new Set(), dead: 0, over: false, frame: 0, msg: '', msgUntil: 0, jumpHeld: false, vineCool: 0, holeSafeUntil: 0, lastHitSound: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!state.current) state.current = freshState()
    if (process.env.NODE_ENV !== 'production') window.__jungle = state // atalho de depuração em dev
    let raf; let last = performance.now(); let hudTick = 0
    const down = (event) => { const key = event.key.toLowerCase(); if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'a', 'd', 'w', 's'].includes(key)) event.preventDefault(); keysRef.current[key] = true }
    const up = (event) => { keysRef.current[event.key.toLowerCase()] = false }
    window.addEventListener('keydown', down, { passive: false }); window.addEventListener('keyup', up)

    const step = (now) => {
      const s = state.current
      const audio = audioRef.current
      const dt = Math.min(2.5, (now - last) / 16.67); last = now
      const keys = keysRef.current
      const room = makeRoom(((s.room % 255) + 255) % 255)
      const running = started && !s.over
      const left = keys.arrowleft || keys.a; const right = keys.arrowright || keys.d
      const upKey = keys.arrowup || keys.w; const downKey = keys.arrowdown || keys.s
      const climbUp = upKey || keys.jump
      const jump = keys[' '] || keys.jump || (upKey && s.level === 'surface' && !s.climbing)
      const vineAngle = Math.sin(now / 700) * 0.95
      const vinePivot = { x: room.pit ? room.pit.x + room.pit.w / 2 : 360, y: 58, len: 182 }
      const vineEnd = { x: vinePivot.x + Math.sin(vineAngle) * vinePivot.len, y: vinePivot.y + Math.cos(vineAngle) * vinePivot.len }
      const sandOpen = Math.sin(now / 1500) > -0.25 // areia movediça: fica fechada por alguns segundos
      const crocOpen = Math.sin(now / 1000) > 0.25
      const scorpionX = 360 + Math.sin(now / 1400) * 250
      const scorpionDir = Math.cos(now / 1400) >= 0 ? 1 : -1
      const crocCenters = room.crocs ? [0, 1, 2].map((i) => room.pit.x + 45 + i * CROC_SPACING) : []

      const die = () => { if (s.dead) return; audio?.stopVine(); s.dead = now; s.lives -= 1; audio?.crash(); if (s.lives <= 0) { s.over = true; audio?.fail() } }

      if (running) {
        s.clock -= dt * 16.67
        if (s.clock <= 0) { s.clock = 0; s.over = true; audio?.stopVine(); audio?.fail() }
        s.frame += dt * 0.4
        if (s.dead) {
          if (now - s.dead > 1500) { s.dead = 0; s.x = 40; s.y = GROUND; s.vy = 0; s.level = 'surface'; s.onVine = false; s.climbing = false }
        } else if (s.onVine) {
          s.x = vineEnd.x; s.y = vineEnd.y + 24
          if (jump && !s.jumpHeld) { s.onVine = false; s.vineCool = now + 700; s.vy = -4.5; s.x += Math.cos(vineAngle) * 14 * Math.sign(Math.cos(now / 700)); audio?.stopVine(); audio?.jump() }
        } else if (s.climbing) {
          if (climbUp) s.y -= 2.4 * dt
          if (downKey) s.y += 2.4 * dt
          if (s.y <= GROUND) { s.y = GROUND; s.climbing = false; s.level = 'surface'; s.x = Math.min(W - 20, s.x + 28); s.holeSafeUntil = now + 700 }
          if (s.y >= UNDER) { s.y = UNDER; s.climbing = false; s.level = 'under' }
        } else {
          const floor = s.level === 'surface' ? GROUND : UNDER
          const speed = 3 * dt
          if (left) { s.x -= speed; s.dir = -1 }
          if (right) { s.x += speed; s.dir = 1 }
          if (s.level === 'under' && room.wall && Math.abs(s.x - room.wall.x) < 20) s.x = room.wall.x + (s.x < room.wall.x ? -20 : 20) // parede de tijolo
          const grounded = s.y >= floor - 0.5
          if (jump && grounded && !s.jumpHeld) { s.vy = -7.4; audio?.jump() }
          s.vy += 0.36 * dt; s.y += s.vy * dt
          if (s.y >= floor) { s.y = floor; s.vy = 0 }
          if (s.level === 'surface') {
            if (room.ladder && grounded && Math.abs(s.x - room.ladder) < 16 && downKey) { s.climbing = true; s.x = room.ladder; s.y = GROUND + 2 }
            const inHole = room.holes.some((hx) => Math.abs(s.x - hx) < 18)
            if (!s.climbing && inHole && grounded && now > s.holeSafeUntil) { s.level = 'under'; s.y = UNDER; if (room.ladder && Math.abs(s.x - room.ladder) < 22) s.x = room.ladder; s.score = Math.max(0, s.score - 100); audio?.hit() } // cair no buraco custa 100
            if (room.pit && s.x > room.pit.x + 6 && s.x < room.pit.x + room.pit.w - 6 && s.y >= GROUND - 0.5) {
              let safe = false
              // jacaré: o lombo segura sempre; a cabeça (lado direito) só com a boca fechada
              crocCenters.forEach((cx) => { const rel = s.x - cx; if (rel > -26 && rel < 12) safe = true; if (rel >= 12 && rel < 30 && !crocOpen) safe = true })
              if (room.quicksand && !sandOpen) safe = true
              if (!safe) die()
            }
            if (room.vine && now > s.vineCool && s.y < GROUND - 8 && Math.hypot(s.x - vineEnd.x, s.y - 24 - vineEnd.y) < 24) { s.onVine = true; s.vy = 0; audio?.startVine() }
            room.logs.forEach((log) => { if (Math.abs(s.x - logX(log, now)) < 20 && s.y > GROUND - 16) { s.score = Math.max(0, s.score - (log.rolling ? 3 : 1) * dt); if (now - s.lastHitSound > 220) { s.lastHitSound = now; audio?.hit() } } })
            if (room.snake && Math.abs(s.x - room.snake.x) < 18 && s.y > GROUND - 24) die()
            if (room.fire && Math.abs(s.x - room.fire.x) < 18 && s.y > GROUND - 26) die()
            if (room.treasure && !s.collected.has(room.index) && Math.abs(s.x - TREASURE_X) < 22 && s.y > GROUND - 34) { s.collected.add(room.index); s.score += room.treasure.value; s.msg = `${room.treasure.label} +${room.treasure.value}`; s.msgUntil = now + 2200; audio?.pickup() }
          } else {
            if (room.ladder && Math.abs(s.x - room.ladder) < 22 && climbUp && grounded) { s.climbing = true; s.x = room.ladder; s.y = UNDER - 2 }
            if (room.scorpion && Math.abs(s.x - scorpionX) < 16 && s.y > UNDER - 14) die()
          }
          const stride = s.level === 'under' ? 3 : 1 // subterrâneo pula 3 telas, como no original
          if (s.x < 8) { s.room -= stride; s.x = W - 12; audio?.room() } else if (s.x > W - 8) { s.room += stride; s.x = 12; audio?.room() }
        }
        s.jumpHeld = !!jump
      }

      // ---------- render ----------
      px(ctx, '#7bc3ff', 0, 0, W, 250) // céu
      px(ctx, '#1f6b2a', 0, 56, W, 40) // copa contínua
      for (let i = 0; i < 9; i += 1) { px(ctx, '#1f6b2a', 20 + i * 84, 90, 52, 14); px(ctx, '#175a20', 36 + i * 84, 100, 22, 10) } // folhas em blocos
      px(ctx, '#2f8a3a', 0, 150, W, 100) // mata ao fundo
      px(ctx, '#276f2e', 0, 150, W, 6)
      for (let i = 0; i < 5; i += 1) { px(ctx, '#3f2510', 60 + i * 160, 56, 22, 194); px(ctx, '#2a1808', 60 + i * 160, 56, 6, 194); px(ctx, '#3f2510', 40 + i * 160, 120, 20, 6); px(ctx, '#3f2510', 82 + i * 160, 140, 22, 6) } // troncos com galhos
      px(ctx, '#b8b364', 0, 255, W, 45) // chão de terra
      px(ctx, '#7bd23a', 0, 250, W, 6) // grama
      px(ctx, '#0d0d0d', 0, UNDER_TOP, W, 100) // subterrâneo
      px(ctx, '#6e5b3a', 0, UNDER + 2, W, 20)
      if (room.pit) {
        if (room.pit.kind === 'water') { px(ctx, '#2a5fd8', room.pit.x, 250, room.pit.w, 50); for (let i = 0; i < 6; i += 1) px(ctx, '#7fa8ff', room.pit.x + 12 + i * 38 + Math.sin(now / 400 + i) * 4, 262 + (i % 2) * 14, 14, 2) }
        else if (room.pit.kind === 'sand') { if (sandOpen) { px(ctx, '#3a3a2a', room.pit.x, 250, room.pit.w, 50); px(ctx, '#5a5a3a', room.pit.x + 10, 254, room.pit.w - 20, 3) } else px(ctx, '#b8b364', room.pit.x, 250, room.pit.w, 50) }
        else px(ctx, '#141414', room.pit.x, 250, room.pit.w, 50)
        crocCenters.forEach((cx) => drawCroc(ctx, cx, crocOpen, now))
      }
      room.holes.forEach((hx) => px(ctx, '#0d0d0d', hx - 18, 250, 36, 50))
      if (room.ladder) { px(ctx, '#e0d7a8', room.ladder - 10, 252, 3, 128); px(ctx, '#e0d7a8', room.ladder + 7, 252, 3, 128); for (let y = 262; y < 380; y += 14) px(ctx, '#e0d7a8', room.ladder - 10, y, 20, 3) }
      if (room.wall) { px(ctx, '#b03a2a', room.wall.x - 12, UNDER_TOP, 24, 80); for (let y = UNDER_TOP + 8; y < UNDER; y += 12) px(ctx, '#e8c9a0', room.wall.x - 12 + ((y / 12) % 2) * 8, y, 12, 2) }
      if (room.scorpion) drawScorpion(ctx, scorpionX, scorpionDir, now)
      if (room.vine) { ctx.strokeStyle = '#6a4a20'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(vinePivot.x, vinePivot.y); ctx.lineTo(vineEnd.x, vineEnd.y); ctx.stroke(); for (let i = 1; i < 5; i += 1) { const t = i / 5; px(ctx, '#2f9a3d', vinePivot.x + (vineEnd.x - vinePivot.x) * t - 4, vinePivot.y + (vineEnd.y - vinePivot.y) * t, 8, 4) } }
      room.logs.forEach((log) => drawLog(ctx, logX(log, now)))
      if (room.snake) drawSnake(ctx, room.snake.x, now)
      if (room.fire) drawFire(ctx, room.fire.x, now)
      if (room.treasure && !s.collected.has(room.index)) drawTreasure(ctx, room.treasure.type, now)
      if (started) drawHarry(ctx, s.x, s.y, s.dir, (left || right) && !s.climbing && !s.onVine ? s.frame : 0, s.onVine ? 'vine' : s.climbing ? 'climb' : 'run', !!s.dead)

      // painel superior estilo Activision: pontos, relógio, vidas
      px(ctx, 'rgba(0,0,0,.72)', 0, 0, W, 56)
      ctx.fillStyle = '#9fe870'; ctx.font = '700 9px "Space Grotesk"'; ctx.textAlign = 'left'; ctx.fillText(`JUNGLE LEAP · TELA ${((s.room % 255) + 255) % 255 + 1}`, 20, 14); ctx.textAlign = 'right'; ctx.fillText(`${s.collected.size}/32 TESOUROS`, W - 20, 14)
      ctx.fillStyle = '#ffd23f'; ctx.font = '700 18px "Space Grotesk"'; ctx.textAlign = 'left'; ctx.fillText(String(Math.floor(s.score)).padStart(6, '0'), 20, 40)
      const mins = Math.floor(s.clock / 60000); const secs = Math.floor((s.clock % 60000) / 1000)
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`, W / 2, 40)
      ctx.textAlign = 'right'; ctx.fillStyle = '#9fe870'; ctx.fillText('♥'.repeat(Math.max(0, s.lives)), W - 20, 40); ctx.textAlign = 'left'
      if (s.msg && now < s.msgUntil) { ctx.fillStyle = '#ffd23f'; ctx.font = '700 13px "Space Grotesk"'; ctx.textAlign = 'center'; ctx.fillText(s.msg, W / 2, 130); ctx.textAlign = 'left' }

      hudTick += 1
      if (hudTick % 10 === 0) setHud({ score: Math.floor(s.score), lives: s.lives, room: ((s.room % 255) + 255) % 255 + 1, over: s.over, found: s.collected.size })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [started])

  const reset = () => { const audio = sound(); audio.stopVine(); audio.start(); state.current = freshState(); setHud({ score: 2000, lives: 3, room: 1, over: false, found: 0 }); setStarted(true) }
  const setKey = (key, value) => { keysRef.current[key] = value }
  const hold = (key, label, Icon, extra = '') => (
    <button type="button" className={extra} onPointerDown={() => setKey(key, true)} onPointerUp={() => setKey(key, false)} onPointerLeave={() => setKey(key, false)} onPointerCancel={() => setKey(key, false)} aria-label={label}><Icon /></button>
  )

  return (
    <div className="canvas-game jungle-game">
      <canvas ref={canvasRef} width={W} height={H} />
      {!started && <GameIntro eyebrow="AVENTURA · ESTILO PITFALL! (1982)" title="Jungle Leap" text="Atravesse a selva tela por tela em 20 minutos. Pule toras e poços, cruze a lagoa pelas cabeças dos jacarés quando a boca estiver fechada, balance no cipó, desça pela escada e fuja do escorpião. Cascavéis e fogueiras guardam 32 tesouros de 2000 a 5000 pontos." onStart={reset} />}
      {hud.over && <GameIntro eyebrow={hud.lives <= 0 ? 'FIM DA EXPEDIÇÃO' : 'TEMPO ESGOTADO'} title={`${hud.score} pontos`} text={`Você chegou à tela ${hud.room} e achou ${hud.found} tesouros. No subterrâneo cada tela vale por três.`} onStart={reset} button="EXPLORAR DE NOVO" />}
      {started && !hud.over && (
        <><div className="side-controls dpad-controls desktop-game-controls">
          {hold('arrowleft', 'Andar para esquerda', ArrowLeft)}
          {hold('arrowdown', 'Descer', ArrowDown)}
          {hold('arrowup', 'Subir', ArrowUp)}
          {hold('arrowright', 'Andar para direita', ArrowRight)}
          {hold('jump', 'Pular', ArrowUp, 'jump-button')}
        </div><TouchGameControls onMove={(x, y) => { setKey('arrowleft', x < -0.28); setKey('arrowright', x > 0.28); setKey('arrowup', y < -0.42); setKey('arrowdown', y > 0.42) }} actions={[{ label: 'PULAR', ariaLabel: 'Pular ou soltar o cipó', primary: true, onChange: (down) => setKey('jump', down) }]} /></>
      )}
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
