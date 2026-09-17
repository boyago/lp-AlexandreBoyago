'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, Crosshair, GameController, Play, Rocket, Sparkle } from '@phosphor-icons/react'
import ActualGameEmbed from './ActualGameEmbed'
import EmbeddedWebGame from './EmbeddedWebGame'
import EnduroGame from './EnduroGame'
import RiverRaidGame from './RiverRaidGame'
import FrontierPreview from './FrontierPreview'
import JungleLeapGame from './JungleLeapGame'
import { createRetroAudio } from './retroAudio'

const games = [
  { id: 'canto', title: 'Canto Azul', genre: 'Aventura e conservação', icon: '🦜', color: 'forest', playable: true, featured: true },
  { id: 'frontier', title: 'Era Racing', genre: 'Clássicos x Modernos x F1', icon: '🏁', color: 'cinematic', art: '/images/era-racing-blender.png', playable: true, preview3d: true },
  { id: 'patrol', title: 'Tupã Patrulha', genre: 'Mundo aberto', icon: '🚓', color: 'violet', art: '/images/tupa-patrulha-gameplay.png', playable: true },
  { id: 'orbit', title: 'Orbit Runner', genre: 'Arcade espacial', icon: '🚀', color: 'blue', playable: true },
  { id: 'prompt', title: 'Prompt Quest', genre: 'Memória', icon: '🧠', color: 'lime', playable: true },
  { id: 'turbo', title: 'Turbo Tap', genre: 'Estilo Enduro (Atari)', icon: '🏎️', color: 'orange', playable: true },
  { id: 'raid', title: 'Pixel Raid', genre: 'Defesa em ondas', icon: '👾', color: 'pink', playable: true },
  { id: 'river', title: 'Canyon Strike', genre: 'Estilo River Raid (Atari)', icon: '✈️', color: 'cyan', playable: true },
  { id: 'jungle', title: 'Jungle Leap', genre: 'Estilo Pitfall! (Atari)', icon: '🧭', color: 'gold', playable: true },
]

function GameCardArtwork({ game }) {
  if (game.art) return <Image src={game.art} alt="" fill sizes="(max-width: 640px) 92vw, (max-width: 980px) 44vw, 24vw" />

  if (game.id === 'canto') {
    return <span className="card-scene scene-canto" aria-hidden="true"><span className="scene-canto-sun" /><span className="scene-canto-hills" /><span className="scene-canto-trees" /><span className="scene-canto-bird" /><Image className="scene-canto-hero-image" src="/images/canto-azul-henrique.png" alt="" width={80} height={100} /></span>
  }

  if (game.id === 'orbit') {
    return <span className="card-scene scene-orbit" aria-hidden="true"><span className="scene-stars" /><span className="scene-orbit-planet" /><span className="scene-asteroid asteroid-one" /><span className="scene-asteroid asteroid-two" /><span className="scene-orbit-ship" /></span>
  }
  if (game.id === 'prompt') {
    return <span className="card-scene scene-prompt" aria-hidden="true"><span className="scene-prompt-glow" /><span className="scene-prompt-grid">{[0, 1, 2, 3].map((tile) => <span key={tile}>{['✦', '◆', '●', '▲'][tile]}</span>)}</span><span className="scene-prompt-line" /></span>
  }
  if (game.id === 'turbo') {
    return <span className="card-scene scene-turbo" aria-hidden="true"><span className="scene-sun" /><span className="scene-mountains" /><span className="scene-road"><span /></span><span className="scene-car rival-car" /><span className="scene-car player-car" /></span>
  }
  if (game.id === 'raid') {
    return <span className="card-scene scene-raid" aria-hidden="true"><span className="scene-raid-grid">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</span><span className="scene-laser" /><span className="scene-player-ship" /></span>
  }
  if (game.id === 'river') {
    return <span className="card-scene scene-river" aria-hidden="true"><span className="scene-river-water" /><span className="scene-river-island" /><span className="scene-river-bridge" /><span className="scene-river-plane" /></span>
  }
  return <span className="card-scene scene-jungle" aria-hidden="true"><span className="scene-jungle-sun" /><span className="scene-jungle-canopy canopy-one" /><span className="scene-jungle-canopy canopy-two" /><span className="scene-jungle-trunk" /><span className="scene-jungle-ground" /><span className="scene-jungle-rope" /><span className="scene-jungle-runner" /></span>
}

function GameIntro({ eyebrow, title, text, onStart, icon: Icon = Play, button = 'COMEÇAR' }) {
  return (
    <div className="mini-intro">
      <span>{eyebrow}</span><h3>{title}</h3><p>{text}</p>
      <button type="button" onClick={onStart}><Icon weight="fill" /> {button}</button>
    </div>
  )
}

function OrbitGame() {
  const canvasRef = useRef(null)
  const playerRef = useRef(360)
  const keysRef = useRef({})
  const asteroidsRef = useRef([])
  const scoreRef = useRef(0)
  const [started, setStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let frame
    let last = performance.now()
    let spawnAt = 0
    const down = (event) => {
      if (!started) return
      if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(event.key)) event.preventDefault()
      keysRef.current[event.key.toLowerCase()] = true
    }
    const up = (event) => { keysRef.current[event.key.toLowerCase()] = false }
    window.addEventListener('keydown', down, { passive: false })
    window.addEventListener('keyup', up)
    const draw = (now) => {
      const dt = Math.min(2, (now - last) / 16.67); last = now
      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, '#0b0a21'); gradient.addColorStop(1, '#24104c')
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 720, 400)
      ctx.fillStyle = 'rgba(255,255,255,.7)'
      for (let i = 0; i < 58; i += 1) ctx.fillRect((i * 83) % 720, (i * 47 + now * .025) % 400, i % 7 === 0 ? 2 : 1, i % 7 === 0 ? 2 : 1)
      ctx.strokeStyle = 'rgba(200,255,46,.16)'
      for (let y = 260; y < 400; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(720, y); ctx.stroke() }
      for (let x = -80; x < 800; x += 80) { ctx.beginPath(); ctx.moveTo(360, 235); ctx.lineTo(x, 400); ctx.stroke() }
      if (started && !gameOver) {
        if (keysRef.current.arrowleft || keysRef.current.a) playerRef.current -= 5 * dt
        if (keysRef.current.arrowright || keysRef.current.d) playerRef.current += 5 * dt
        playerRef.current = Math.max(28, Math.min(692, playerRef.current))
        if (now > spawnAt) {
          asteroidsRef.current.push({ x: 25 + Math.random() * 670, y: -25, r: 9 + Math.random() * 14, spin: Math.random() * 6 })
          spawnAt = now + Math.max(320, 720 - scoreRef.current * 8)
        }
        asteroidsRef.current.forEach((asteroid) => { asteroid.y += (2.3 + scoreRef.current * .018) * dt; asteroid.spin += .025 * dt })
        const before = asteroidsRef.current.length
        asteroidsRef.current = asteroidsRef.current.filter((asteroid) => asteroid.y < 430)
        if (before !== asteroidsRef.current.length) { scoreRef.current += before - asteroidsRef.current.length; setScore(scoreRef.current) }
        if (asteroidsRef.current.some((asteroid) => Math.hypot(asteroid.x - playerRef.current, asteroid.y - 347) < asteroid.r + 15)) setGameOver(true)
      }
      asteroidsRef.current.forEach((asteroid) => {
        ctx.save(); ctx.translate(asteroid.x, asteroid.y); ctx.rotate(asteroid.spin); ctx.fillStyle = '#74667e'; ctx.beginPath()
        for (let point = 0; point < 7; point += 1) { const angle = point / 7 * Math.PI * 2; const radius = asteroid.r * (.78 + (point % 3) * .11); ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius) }
        ctx.closePath(); ctx.fill(); ctx.restore()
      })
      ctx.save(); ctx.translate(playerRef.current, 347); ctx.fillStyle = '#c8ff2e'; ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(17, 17); ctx.lineTo(0, 10); ctx.lineTo(-17, 17); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#6e4eff'; ctx.fillRect(-6, 10, 12, 18); ctx.restore()
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [started, gameOver])

  const reset = () => { playerRef.current = 360; asteroidsRef.current = []; scoreRef.current = 0; setScore(0); setGameOver(false); setStarted(true) }
  const setKey = (key, value) => { keysRef.current[key] = value }
  const movePointer = (event) => { if (!started || gameOver) return; const rect = canvasRef.current.getBoundingClientRect(); playerRef.current = Math.max(28, Math.min(692, (event.clientX - rect.left) / rect.width * 720)) }
  return (
    <div className="canvas-game orbit-game">
      <div className="canvas-hud"><span>ORBIT RUNNER</span><strong>SCORE {String(score).padStart(2, '0')}</strong></div>
      <canvas ref={canvasRef} width="720" height="400" onPointerMove={movePointer} />
      {!started && <GameIntro eyebrow="ARCADE · SOBREVIVÊNCIA" title="Orbit Runner" text="Mova a nave, desvie dos asteroides e sobreviva o máximo que puder." onStart={reset} icon={Rocket} />}
      {gameOver && <GameIntro eyebrow="FIM DE JOGO" title={`${score} pontos`} text="Seu reflexo foi bom. Agora tente quebrar seu próprio recorde." onStart={reset} />}
      {started && !gameOver && <div className="side-controls"><button type="button" onPointerDown={() => setKey('arrowleft', true)} onPointerUp={() => setKey('arrowleft', false)} onPointerLeave={() => setKey('arrowleft', false)} aria-label="Mover nave para esquerda"><ArrowLeft /></button><button type="button" onPointerDown={() => setKey('arrowright', true)} onPointerUp={() => setKey('arrowright', false)} onPointerLeave={() => setKey('arrowright', false)} aria-label="Mover nave para direita"><ArrowRight /></button></div>}
    </div>
  )
}

function MemoryGame() {
  const [sequence, setSequence] = useState([])
  const [active, setActive] = useState(null)
  const [playerStep, setPlayerStep] = useState(0)
  const [locked, setLocked] = useState(true)
  const [message, setMessage] = useState('')
  const [started, setStarted] = useState(false)
  const timers = useRef([])
  const audioRef = useRef(null)
  const sound = () => {
    if (!audioRef.current) audioRef.current = createRetroAudio()
    return audioRef.current
  }
  useEffect(() => () => { timers.current.forEach(clearTimeout); audioRef.current?.dispose() }, [])
  const showSequence = (next) => {
    timers.current.forEach(clearTimeout); timers.current = []
    setLocked(true); setPlayerStep(0); setMessage('OBSERVE A SEQUÊNCIA')
    next.forEach((tile, index) => { timers.current.push(setTimeout(() => { setActive(tile); audioRef.current?.tile(tile) }, 550 + index * 650)); timers.current.push(setTimeout(() => setActive(null), 950 + index * 650)) })
    timers.current.push(setTimeout(() => { setLocked(false); setMessage('SUA VEZ') }, 1050 + next.length * 650))
  }
  const nextRound = (base = sequence) => { const next = [...base, Math.floor(Math.random() * 4)]; setSequence(next); showSequence(next) }
  const start = () => { sound().start(); setStarted(true); setSequence([]); setMessage(''); timers.current.push(setTimeout(() => nextRound([]), 200)) }
  const pick = (tile) => {
    if (locked) return
    setActive(tile); audioRef.current?.tile(tile); timers.current.push(setTimeout(() => setActive(null), 180))
    if (sequence[playerStep] !== tile) { audioRef.current?.fail(); setLocked(true); setMessage(`FIM · NÍVEL ${Math.max(1, sequence.length)}`); timers.current.push(setTimeout(start, 950)); return }
    if (playerStep + 1 === sequence.length) { audioRef.current?.correct(); setLocked(true); setMessage('ACERTOU!'); timers.current.push(setTimeout(() => nextRound(sequence), 720)) }
    else setPlayerStep(playerStep + 1)
  }
  return (
    <div className="memory-game">
      <div className="memory-hud"><span>PROMPT QUEST</span><strong>NÍVEL {sequence.length}</strong></div>
      <div className="memory-board">{[0, 1, 2, 3].map((tile) => <button key={tile} type="button" disabled={locked} aria-label={`Bloco ${tile + 1}`} className={active === tile ? 'active' : ''} onClick={() => pick(tile)}><span>{['✦', '◆', '●', '▲'][tile]}</span></button>)}</div>
      <p>{message || 'REPITA O PADRÃO CRIADO PELA IA'}</p>
      {!started && <GameIntro eyebrow="MEMÓRIA · PADRÕES" title="Prompt Quest" text="Observe a sequência e repita sem errar. Cada rodada adiciona um novo comando." onStart={start} icon={Sparkle} />}
    </div>
  )
}

function createInvaders(wave = 1) { return Array.from({ length: 24 }, (_, index) => ({ x: 165 + (index % 8) * 56, y: 75 + Math.floor(index / 8) * 42, alive: true, phase: (index + wave) % 3 })) }

function InvaderGame() {
  const canvasRef = useRef(null)
  const playerRef = useRef(360)
  const keysRef = useRef({})
  const bulletsRef = useRef([])
  const invadersRef = useRef([])
  const directionRef = useRef(1)
  const lastShotRef = useRef(0)
  const waveRef = useRef(1)
  const scoreRef = useRef(0)
  const audioRef = useRef(null)
  const lastMarchRef = useRef(0)
  const overSoundRef = useRef(false)
  const [score, setScore] = useState(0)
  const [wave, setWave] = useState(1)
  const [started, setStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const sound = () => {
    if (!audioRef.current) audioRef.current = createRetroAudio()
    return audioRef.current
  }
  useEffect(() => () => audioRef.current?.dispose(), [])
  const shoot = () => { const now = performance.now(); if (!started || gameOver || now - lastShotRef.current < 260) return; lastShotRef.current = now; bulletsRef.current.push({ x: playerRef.current, y: 342 }); audioRef.current?.shoot() }
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let frame; let last = performance.now()
    const down = (event) => { if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd'].includes(event.key)) event.preventDefault(); keysRef.current[event.key.toLowerCase()] = true; if (event.key === ' ') shoot() }
    const up = (event) => { keysRef.current[event.key.toLowerCase()] = false }
    window.addEventListener('keydown', down, { passive: false }); window.addEventListener('keyup', up)
    const draw = (now) => {
      const dt = Math.min(2, (now - last) / 16.67); last = now
      const bg = ctx.createLinearGradient(0, 0, 720, 400); bg.addColorStop(0, '#100a25'); bg.addColorStop(1, '#3c113d'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 720, 400)
      ctx.fillStyle = 'rgba(255,255,255,.45)'; for (let i = 0; i < 52; i += 1) ctx.fillRect((i * 97) % 720, (i * 61) % 390, 1, 1)
      ctx.strokeStyle = 'rgba(255,88,176,.11)'; for (let y = 215; y < 400; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(720, y); ctx.stroke() }
      if (started && !gameOver) {
        if (keysRef.current.arrowleft || keysRef.current.a) playerRef.current -= 5 * dt
        if (keysRef.current.arrowright || keysRef.current.d) playerRef.current += 5 * dt
        playerRef.current = Math.max(28, Math.min(692, playerRef.current))
        let alive = invadersRef.current.filter((invader) => invader.alive)
        if (alive.length === 0) { waveRef.current += 1; setWave(waveRef.current); invadersRef.current = createInvaders(waveRef.current); directionRef.current = 1; alive = invadersRef.current; audioRef.current?.correct() }
        if (now - lastMarchRef.current > Math.max(145, 520 - waveRef.current * 28)) { lastMarchRef.current = now; audioRef.current?.march(Math.floor(now / 200) % 4) }
        const step = (.34 + waveRef.current * .055) * dt * directionRef.current
        alive.forEach((invader) => { invader.x += step })
        if (alive.some((invader) => invader.x > 680 || invader.x < 40)) { directionRef.current *= -1; alive.forEach((invader) => { invader.y += 14 }) }
        bulletsRef.current.forEach((bullet) => { bullet.y -= 7 * dt })
        bulletsRef.current.forEach((bullet) => { const hit = invadersRef.current.find((invader) => invader.alive && Math.abs(invader.x - bullet.x) < 20 && Math.abs(invader.y - bullet.y) < 17); if (hit) { hit.alive = false; bullet.hit = true; scoreRef.current += 10; setScore(scoreRef.current); audioRef.current?.hit() } })
        bulletsRef.current = bulletsRef.current.filter((bullet) => bullet.y > 45 && !bullet.hit)
        if (alive.some((invader) => invader.y > 315)) { if (!overSoundRef.current) { overSoundRef.current = true; audioRef.current?.fail() }; setGameOver(true) }
      }
      invadersRef.current.filter((invader) => invader.alive).forEach((invader) => { ctx.fillStyle = invader.phase === 0 ? '#ff58b0' : invader.phase === 1 ? '#c8ff2e' : '#8f72ff'; ctx.fillRect(invader.x - 15, invader.y - 10, 30, 18); ctx.fillRect(invader.x - 22, invader.y - 3, 8, 8); ctx.fillRect(invader.x + 14, invader.y - 3, 8, 8); ctx.fillStyle = '#0d0a19'; ctx.fillRect(invader.x - 8, invader.y - 4, 5, 5); ctx.fillRect(invader.x + 3, invader.y - 4, 5, 5) })
      ctx.fillStyle = '#fff'; bulletsRef.current.forEach((bullet) => ctx.fillRect(bullet.x - 2, bullet.y - 8, 4, 13))
      ctx.fillStyle = '#65d8ff'; ctx.beginPath(); ctx.moveTo(playerRef.current, 326); ctx.lineTo(playerRef.current + 24, 354); ctx.lineTo(playerRef.current + 10, 348); ctx.lineTo(playerRef.current - 10, 348); ctx.lineTo(playerRef.current - 24, 354); ctx.closePath(); ctx.fill()
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [started, gameOver])
  const reset = () => { sound().start(); playerRef.current = 360; bulletsRef.current = []; invadersRef.current = createInvaders(1); directionRef.current = 1; waveRef.current = 1; scoreRef.current = 0; lastMarchRef.current = 0; overSoundRef.current = false; setScore(0); setWave(1); setGameOver(false); setStarted(true) }
  const setKey = (key, value) => { keysRef.current[key] = value }
  const aim = (event) => { if (!started || gameOver) return; const rect = canvasRef.current.getBoundingClientRect(); playerRef.current = Math.max(28, Math.min(692, (event.clientX - rect.left) / rect.width * 720)) }
  return (
    <div className="canvas-game invader-game"><div className="canvas-hud"><span>PIXEL RAID · ONDA {wave}</span><strong>{score} PTS</strong></div><canvas ref={canvasRef} width="720" height="400" onPointerMove={aim} onPointerDown={shoot} />
      {!started && <GameIntro eyebrow="DEFESA · ONDAS" title="Pixel Raid" text="Mova a nave, dispare e destrua as formações antes que elas alcancem sua base." onStart={reset} icon={Crosshair} />}
      {gameOver && <GameIntro eyebrow="BASE INVADIDA" title={`${score} pontos`} text={`Você chegou à onda ${wave}. Reposicione a nave e tente novamente.`} onStart={reset} />}
      {started && !gameOver && <div className="side-controls"><button type="button" onPointerDown={() => setKey('arrowleft', true)} onPointerUp={() => setKey('arrowleft', false)} onPointerLeave={() => setKey('arrowleft', false)} aria-label="Mover para esquerda"><ArrowLeft /></button><button type="button" onPointerDown={shoot} aria-label="Disparar"><Crosshair /></button><button type="button" onPointerDown={() => setKey('arrowright', true)} onPointerUp={() => setKey('arrowright', false)} onPointerLeave={() => setKey('arrowright', false)} aria-label="Mover para direita"><ArrowRight /></button></div>}
    </div>
  )
}

export default function MiniGameHub({ selected, onSelect, raceLive, onRaceLiveChange }) {
  const stageRef = useRef(null)
  const current = games.find((game) => game.id === selected)
  const chooseGame = (game) => { onRaceLiveChange(false); onSelect(game.id); window.requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })) }
  return (
    <div className="game-hub">
      <div className="game-stage" ref={stageRef} role="tabpanel" aria-label={`${current.playable ? 'Jogar' : 'Ver prévia de'} ${current.title}`}>
        <div className="game-stage-bar"><span><GameController weight="fill" /> AI GAME ARCADE / {current.title}</span><div><i className={!current.playable ? 'preview-dot' : ''} /><b>{current.playable ? 'JOGÁVEL NA LP' : 'PRÉVIA VISUAL'}</b></div></div>
        {selected === 'canto' && <EmbeddedWebGame src="/games/canto-azul/index.html?v=7" title="Canto Azul, aventura pixel art brasileira sobre natureza e preservação" mobileControls />}
        {selected === 'patrol' && <ActualGameEmbed />}
        {selected === 'orbit' && <OrbitGame />}
        {selected === 'prompt' && <MemoryGame />}
        {selected === 'turbo' && <EnduroGame />}
        {selected === 'raid' && <InvaderGame />}
        {selected === 'river' && <RiverRaidGame />}
        {selected === 'jungle' && <JungleLeapGame />}
        {selected === 'frontier' && <FrontierPreview live={raceLive} onLiveChange={onRaceLiveChange} />}
      </div>
      <div className="portal-heading"><div><span>ESCOLHA SEU PRÓXIMO JOGO</span><strong>Catálogo AI Game Arcade</strong></div><small>9 JOGÁVEIS · CANTO AZUL É NOVIDADE</small></div>
      <div className="game-selector" role="tablist" aria-label="Catálogo de games">
        {games.map((game, index) => (
          <button key={game.id} type="button" role="tab" aria-selected={selected === game.id} className={`portal-game-card ${game.color} ${game.featured ? 'portal-card-featured' : ''} ${selected === game.id ? 'active' : ''}`} onClick={() => chooseGame(game)} data-analytics-event="game_select" data-game-id={game.id}>
            <span className="portal-card-art">
              <GameCardArtwork game={game} />
              <span className="portal-card-topline"><b>{game.id === 'canto' ? 'NOVO GAME' : game.preview3d ? 'BLENDER 3D' : 'JOGÁVEL'}</b><small>{String(index + 1).padStart(2, '0')}</small></span>
              <span className="portal-card-play"><Play weight="fill" /></span>
            </span>
            <span className="portal-card-meta"><span className="portal-card-copy"><small>{game.genre}</small><strong>{game.title}</strong></span><span className="portal-card-action">{game.playable ? 'JOGAR' : 'VER PRÉVIA'} <ArrowRight /></span></span>
          </button>
        ))}
      </div>
    </div>
  )
}
