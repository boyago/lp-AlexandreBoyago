'use client'

import { useEffect, useRef, useState } from 'react'

export default function TouchGameControls({ onMove, actions = [] }) {
  const padRef = useRef(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const activeActions = useRef(new Set())
  const onMoveRef = useRef(onMove)
  const actionsRef = useRef(actions)
  onMoveRef.current = onMove
  actionsRef.current = actions

  useEffect(() => {
    const release = () => {
      setKnob({ x: 0, y: 0 })
      onMoveRef.current(0, 0)
      activeActions.current.forEach((index) => actionsRef.current[index]?.onChange(false))
      activeActions.current.clear()
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => { release(); window.removeEventListener('pointerup', release); window.removeEventListener('pointercancel', release) }
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
    onMove(x / radius, y / radius)
  }

  const start = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    update(event)
  }
  const stop = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setKnob({ x: 0, y: 0 })
    onMove(0, 0)
  }

  return (
    <div className="touch-game-controls" aria-label="Controles para jogar pelo celular">
      <div ref={padRef} className="touch-joystick" role="application" aria-label="Joystick de movimento" onPointerDown={start} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event) }} onPointerUp={stop} onPointerCancel={stop}>
        <span className="touch-joystick-guides" aria-hidden="true">‹ <i>▲</i> › <b>▼</b></span>
        <span className="touch-joystick-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
      </div>
      <div className="touch-action-buttons">
        {actions.map((action, index) => (
          <button key={action.label} type="button" className={action.primary ? 'primary' : ''} aria-label={action.ariaLabel || action.label} onPointerDown={(event) => { event.preventDefault(); activeActions.current.add(index); action.onChange(true) }} onPointerUp={() => { activeActions.current.delete(index); action.onChange(false) }} onPointerCancel={() => { activeActions.current.delete(index); action.onChange(false) }}>{action.label}</button>
        ))}
      </div>
    </div>
  )
}
