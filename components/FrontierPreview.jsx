'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Play, X } from '@phosphor-icons/react'

export default function FrontierPreview() {
  const [live, setLive] = useState(false)
  const frame = useRef(null)
  useEffect(() => {
    if (!live || !frame.current) return
    const observer = new IntersectionObserver(([entry]) => {
      frame.current?.contentWindow?.postMessage({ type: 'era-racing-visibility', visible: entry.isIntersecting }, window.location.origin)
    }, { threshold: 0 })
    observer.observe(frame.current)
    return () => observer.disconnect()
  }, [live])
  if (live) return (
    <div className="race-embed-shell">
      <div className="race-embed-toolbar"><span>ERA RACING · BETA WEB</span><button type="button" onClick={() => setLive(false)}><X /> FECHAR JOGO</button></div>
      <div className="actual-game-embed"><iframe ref={frame} src="/games/era-racing/index.html?v=js-modules-2" title="Era Racing, corrida 3D com carros clássicos, esportivos e Fórmula 1" allow="fullscreen" /></div>
    </div>
  )
  return (
    <div className="cinematic-game-preview">
      <Image src="/images/era-racing-blender.png" alt="Prévia de Era Racing criada no Blender, com um carro clássico e um Fórmula 1 alinhados em uma pista 3D" fill sizes="(max-width: 900px) 100vw, 1100px" />
      <div className="cinematic-shade" />
      <div className="cinematic-copy">
        <span>BLENDER 3D · BETA JOGÁVEL</span>
        <h3>Era Racing</h3>
        <p>Fusca, pickup clássica, Porsche e Fórmula 1 na mesma pista. Escolha seu carro e dispute uma corrida contra a IA.</p>
        <button type="button" className="cinematic-play" onClick={() => setLive(true)}><Play weight="fill" /> JOGAR ERA RACING</button>
      </div>
    </div>
  )
}
