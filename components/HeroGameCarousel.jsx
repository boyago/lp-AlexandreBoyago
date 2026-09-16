'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Play } from '@phosphor-icons/react'

const slides = [
  {
    id: 'canto',
    eyebrow: 'NOVO GAME · AVENTURA BRASILEIRA',
    title: 'Canto Azul',
    description: 'Explore a mata, resgate animais e proteja a arara-azul em uma aventura pixel art.',
    label: 'JOGAR CANTO AZUL',
    className: 'hero-canto-art',
  },
  {
    id: 'frontier',
    eyebrow: 'BLENDER 3D · BETA JOGÁVEL',
    title: 'Era Racing',
    description: 'Clássicos, esportivos e Fórmula 1 dividem a mesma pista em uma corrida 3D.',
    label: 'JOGAR ERA RACING',
    image: '/images/era-racing-blender.png',
  },
  {
    id: 'patrol',
    eyebrow: 'MUNDO ABERTO · MISSÃO URBANA',
    title: 'Tupã Patrulha',
    description: 'Assuma o plantão, explore a cidade voxel e cumpra as ocorrências da patrulha.',
    label: 'INICIAR PLANTÃO',
    image: '/images/tupa-patrulha-gameplay.png',
  },
]

export default function HeroGameCarousel({ onPlay }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6200)
    return () => window.clearInterval(timer)
  }, [paused])

  const slide = slides[active]
  const move = (direction) => setActive((current) => (current + direction + slides.length) % slides.length)
  const openGame = (event) => {
    event.preventDefault()
    onPlay(slide.id)
    document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', '#playground')
  }

  return (
    <div className="hero-game-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <a className="hero-visual hero-patrol-preview" href="#playground" onClick={openGame} aria-label={`${slide.label} na página`} data-analytics-event="game_open" data-game-id={slide.id} data-button-id="hero-game-carousel">
        <div className="game-preview-window">
          <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>AI GAME ARCADE</span><span className="online"><i /> JOGÁVEL</span></div>
          <div className={`hero-game-poster ${slide.className || ''}`}>
            {slide.image && <Image key={slide.image} src={slide.image} alt="" fill sizes="(max-width: 1080px) 92vw, 48vw" priority={active === 0} />}
            {slide.id === 'canto' && <><span className="canto-sun" /><span className="canto-hills" /><span className="canto-trees" /><span className="canto-bird canto-bird-one" /><span className="canto-bird canto-bird-two" /><Image className="canto-hero-image" src="/images/canto-azul-henrique.png" alt="" width={120} height={150} /></>}
            <div className="hero-game-poster-shade" />
            <div className="hero-game-slide-copy"><span>{slide.eyebrow}</span><strong>{slide.title}</strong><p>{slide.description}</p><b><Play weight="fill" /> {slide.label}</b></div>
          </div>
          <div className="preview-caption"><div><span>DESTAQUES DO AI GAME ARCADE</span><strong>{slide.title}</strong></div><span className="preview-jump">ABRIR NO PLAYER <ArrowRight weight="bold" /></span></div>
        </div>
      </a>
      <div className="hero-carousel-controls" aria-label="Escolher game em destaque">
        <button type="button" onClick={() => move(-1)} aria-label="Game anterior"><ArrowLeft weight="bold" /></button>
        <div>{slides.map((item, index) => <button key={item.id} type="button" className={index === active ? 'active' : ''} onClick={() => setActive(index)} aria-label={`Mostrar ${item.title}`} aria-current={index === active ? 'true' : undefined} />)}</div>
        <button type="button" onClick={() => move(1)} aria-label="Próximo game"><ArrowRight weight="bold" /></button>
      </div>
    </div>
  )
}
