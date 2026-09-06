'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from '@phosphor-icons/react'

// Fronteira 2049: a imagem do gameplay abre a tela; ao clicar, carrega o protótipo 3D em Three.js
// (public/games/fronteira-2049/index.html) com cânion procedural, névoa, pôr do sol e buggy dirigível.
export default function FrontierPreview() {
  const [live, setLive] = useState(false)
  if (live) {
    return (
      <div className="actual-game-embed">
        <iframe
          src="/games/fronteira-2049/index.html"
          title="Fronteira 2049, protótipo 3D de mundo aberto criado com inteligência artificial"
          loading="eager"
          sandbox="allow-scripts allow-pointer-lock"
          allow="fullscreen"
        />
      </div>
    )
  }
  return (
    <div className="cinematic-game-preview">
      <Image src="/images/fronteira-2049-gameplay.png" alt="Gameplay real de Fronteira 2049, com um veículo explorando um mundo aberto 3D entre árvores e cânions" fill sizes="(max-width: 900px) 100vw, 1100px" />
      <div className="cinematic-shade" />
      <div className="cinematic-copy">
        <span>GAMEPLAY REAL · PROTÓTIPO 3D JOGÁVEL</span>
        <h3>Fronteira 2049</h3>
        <p>Esta é uma cena real do protótipo rodando no navegador: mundo aberto em 3D, árvores, cânions e um veículo de exploração para dirigir com WASD.</p>
        <button type="button" className="cinematic-play" onClick={() => setLive(true)}><Play weight="fill" /> ABRIR PROTÓTIPO 3D</button>
      </div>
    </div>
  )
}
