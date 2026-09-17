'use client'

import { useEffect, useRef, useState } from 'react'

// Joystick analógico + botões de ação para celular. Cada dedo é seguido pelo
// seu pointerId: soltar o botão de pulo não interrompe o dedo que está no
// joystick, e vice-versa (multi-touch de verdade, como num controle).
export default function TouchGameControls({ onMove, actions = [] }) {
  const padRef = useRef(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const padPointer = useRef(null)
  const actionPointers = useRef(new Map()) // pointerId -> índice da ação
  const onMoveRef = useRef(onMove)
  const actionsRef = useRef(actions)
  onMoveRef.current = onMove
  actionsRef.current = actions

  const releasePad = () => {
    padPointer.current = null
    setKnob({ x: 0, y: 0 })
    onMoveRef.current(0, 0)
  }
  const releaseAction = (pointerId) => {
    const index = actionPointers.current.get(pointerId)
    if (index === undefined) return
    actionPointers.current.delete(pointerId)
    actionsRef.current[index]?.onChange(false)
  }

  useEffect(() => {
    // Rede de segurança: um dedo que sai da tela sem passar pelo elemento
    // (troca de aba, gesto do sistema) ainda é solto pelo seu id.
    const release = (event) => {
      if (event.pointerId === padPointer.current) releasePad()
      releaseAction(event.pointerId)
    }
    const releaseAll = () => {
      if (padPointer.current !== null) releasePad()
      ;[...actionPointers.current.keys()].forEach(releaseAction)
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', releaseAll)
    return () => {
      releaseAll()
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', releaseAll)
    }
  }, [])

  const update = (event) => {
    const rect = padRef.current.getBoundingClientRect()
    const radius = rect.width * 0.3
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    const length = Math.hypot(dx, dy) || 1
    const scale = Math.min(1, radius / length)
    const x = dx * scale
    const y = dy * scale
    setKnob({ x, y })
    onMoveRef.current(x / radius, y / radius)
  }

  const padDown = (event) => {
    event.preventDefault()
    if (padPointer.current !== null) return
    padPointer.current = event.pointerId
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* sem captura: o listener global solta o dedo */ }
    update(event)
  }
  const padMove = (event) => {
    if (event.pointerId === padPointer.current) update(event)
  }
  const padUp = (event) => {
    if (event.pointerId !== padPointer.current) return
    try { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) } catch { /* já solto */ }
    releasePad()
  }

  const actionDown = (event, index) => {
    event.preventDefault()
    if (actionPointers.current.has(event.pointerId)) return
    actionPointers.current.set(event.pointerId, index)
    actionsRef.current[index]?.onChange(true)
  }
  const actionUp = (event) => releaseAction(event.pointerId)

  return (
    <div className="touch-game-controls" aria-label="Controles para jogar pelo celular">
      {/* Tocar em qualquer ponto do círculo já define a direção (como um d-pad)
          e arrastar o polegar a atualiza continuamente (como um analógico). */}
      <div ref={padRef} className="touch-joystick" role="application" aria-label="Joystick de movimento: toque ou arraste na direção desejada" onPointerDown={padDown} onPointerMove={padMove} onPointerUp={padUp} onPointerCancel={padUp}>
        <span className="touch-joystick-guides" aria-hidden="true">‹ <i>▲</i> › <b>▼</b></span>
        <span className="touch-joystick-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
      </div>
      <div className="touch-action-buttons">
        {actions.map((action, index) => (
          <button key={action.label} type="button" className={action.primary ? 'primary' : ''} aria-label={action.ariaLabel || action.label} onPointerDown={(event) => actionDown(event, index)} onPointerUp={actionUp} onPointerCancel={actionUp}>{action.label}</button>
        ))}
      </div>
    </div>
  )
}
