'use client'

import { useRef } from 'react'
import { ArrowsOut } from '@phosphor-icons/react'
import TouchGameControls from './TouchGameControls'

export default function EmbeddedWebGame({ src, title, mobileControls = false }) {
  const gameRef = useRef(null)
  const iframeRef = useRef(null)
  const pressedRef = useRef(new Set())
  const keyData = {
    ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
    ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
    ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
    ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
    Space: { key: ' ', code: 'Space', keyCode: 32 },
  }
  const wakeGame = () => {
    const win = iframeRef.current?.contentWindow
    if (!win) return null
    win.focus()
    win.game?.loop?.focus?.()
    return win
  }
  const setKey = (code, down) => {
    const win = wakeGame()
    if (!win || (down && pressedRef.current.has(code)) || (!down && !pressedRef.current.has(code))) return
    down ? pressedRef.current.add(code) : pressedRef.current.delete(code)
    const data = keyData[code]
    const event = new win.KeyboardEvent(down ? 'keydown' : 'keyup', { key: data.key, code: data.code, bubbles: true, cancelable: true })
    Object.defineProperty(event, 'keyCode', { get: () => data.keyCode })
    Object.defineProperty(event, 'which', { get: () => data.keyCode })
    win.dispatchEvent(event)
  }
  // Eixo horizontal responde cedo (andar); vertical só quando o polegar vai
  // claramente para cima/baixo, para uma corrida em diagonal não virar pulo.
  const move = (x, y) => {
    const vertical = Math.abs(y) > 0.5 && Math.abs(y) > Math.abs(x)
    setKey('ArrowLeft', x < -0.25); setKey('ArrowRight', x > 0.25)
    setKey('ArrowUp', vertical && y < 0); setKey('ArrowDown', vertical && y > 0)
  }
  const enterFullscreen = async () => {
    try {
      await gameRef.current?.requestFullscreen?.()
      await globalThis.screen?.orientation?.lock?.('landscape')
    } catch {
      // Alguns celulares bloqueiam a rotação, mas mantêm o jogo em tela cheia.
    }
  }
  return (
    <div ref={gameRef} className="actual-game-embed embedded-web-game">
      <div className="embedded-web-game-frame">
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          loading="lazy"
          allow="fullscreen; gamepad"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        />
        {mobileControls && <button className="mobile-fullscreen-game" type="button" onClick={enterFullscreen}><ArrowsOut weight="bold" /> TELA CHEIA</button>}
      </div>
      {mobileControls && <TouchGameControls onMove={move} actions={[{ label: 'PULAR', ariaLabel: 'Pular ou confirmar seleção', primary: true, onChange: (down) => setKey('Space', down) }]} />}
    </div>
  )
}
