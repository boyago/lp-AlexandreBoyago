'use client'

import { useState } from 'react'
import { Play, X } from '@phosphor-icons/react'

// No celular o iframe começa "gated": não captura o toque até o usuário pedir para jogar,
// assim a página continua rolando com o dedo sobre o game. "Sair" devolve a rolagem.
export default function ActualGameEmbed({ compact = false }) {
  const [gated, setGated] = useState(true)
  return (
    <div className={`actual-game-embed ${compact ? 'compact' : ''} ${gated ? 'gated' : ''}`}>
      <iframe
        src={`/games/patrulha-tupa/index.html${compact ? '?mode=preview' : ''}`}
        title="Patrulha Tupã, game voxel 3D criado com inteligência artificial"
        loading={compact ? 'eager' : 'lazy'}
        sandbox="allow-scripts allow-pointer-lock"
        allow="fullscreen"
      />
      {!compact && <EmbedGate gated={gated} onToggle={() => setGated((value) => !value)} />}
    </div>
  )
}

export function EmbedGate({ gated, onToggle }) {
  if (gated) {
    return (
      <div className="embed-gate">
        <button type="button" onClick={onToggle}><Play weight="fill" /> TOCAR PARA JOGAR</button>
        <span>Enquanto o jogo está ativo a tela fica presa a ele. Use SAIR para voltar a rolar a página.</span>
      </div>
    )
  }
  return <button type="button" className="embed-exit" onClick={onToggle} aria-label="Sair do jogo e voltar a rolar a página"><X weight="bold" /> SAIR</button>
}
