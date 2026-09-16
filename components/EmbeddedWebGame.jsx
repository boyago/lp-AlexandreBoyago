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
    ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
    ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
    ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
    ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
    Space: { key: ' ', code: 'Space', keyCode: 32 },
    KeyX: { key: 'x', code: 'KeyX', keyCode: 88 },
    Enter: { key: 'Enter', code: 'Enter', keyCode: 13 },
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
