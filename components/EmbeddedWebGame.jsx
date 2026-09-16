'use client'

import { useRef } from 'react'
import { ArrowsOut } from '@phosphor-icons/react'
import TouchGameControls from './TouchGameControls'

export default function EmbeddedWebGame({ src, title, mobileControls = false }) {
  const gameRef = useRef(null)
  const iframeRef = useRef(null)
  const pressedRef = useRef(new Set())
  const actionCodeRef = useRef('Enter')
  const keyData = {
    ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft' },
    ArrowRight: { key: 'ArrowRight', code: 'ArrowRight' },
    ArrowUp: { key: 'ArrowUp', code: 'ArrowUp' },
    ArrowDown: { key: 'ArrowDown', code: 'ArrowDown' },
    Space: { key: ' ', code: 'Space' },
    KeyX: { key: 'x', code: 'KeyX' },
    Enter: { key: 'Enter', code: 'Enter' },
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
    win.dispatchEvent(new win.KeyboardEvent(down ? 'keydown' : 'keyup', { ...data, bubbles: true }))
  }
  const move = (x, y) => {
    setKey('ArrowLeft', x < -0.28); setKey('ArrowRight', x > 0.28)
    setKey('ArrowUp', y < -0.42); setKey('ArrowDown', y > 0.42)
  }
  const setAction = (down) => {
    const win = wakeGame()
    if (!win) return
    if (down) {
      const activeScenes = win.game?.scene?.getScenes?.(true) ?? []
      const playing = activeScenes.some((scene) => scene.scene?.key === 'Game')
      actionCodeRef.current = playing ? 'KeyX' : 'Enter'
    }
    setKey(actionCodeRef.current, down)
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
      {mobileControls && <TouchGameControls onMove={move} actions={[{ label: 'OK / AÇÃO', ariaLabel: 'Confirmar seleção ou executar ação', onChange: setAction }, { label: 'ENTRAR', ariaLabel: 'Entrar na porta, descer ou mergulhar', onChange: (down) => setKey('ArrowDown', down) }, { label: 'PULAR', ariaLabel: 'Pular ou confirmar seleção', primary: true, onChange: (down) => setKey('Space', down) }]} />}
    </div>
  )
}
