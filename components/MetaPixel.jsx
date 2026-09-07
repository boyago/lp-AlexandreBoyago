'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_KEY, syncPixelConsent } from '../lib/meta-pixel.mjs'
import styles from './MetaPixel.module.css'

export default function MetaPixel() {
  const pathname = usePathname()
  const [consent, setConsent] = useState(null)
  const [open, setOpen] = useState(false)
  const lastPage = useRef(null)

  useEffect(() => {
    function readChoice() {
      let choice = null
      try { choice = localStorage.getItem(CONSENT_KEY) } catch {}
      const known = choice === 'accepted' || choice === 'rejected'
      setConsent(known ? choice : null)
      setOpen(!known)
    }
    readChoice()
    function sync(event) { if (event.key === CONSENT_KEY || event.key === null) readChoice() }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  useEffect(() => {
    lastPage.current = syncPixelConsent(window, document, consent, pathname, lastPage.current)
  }, [consent, pathname])

  function choose(value) {
    try { localStorage.setItem(CONSENT_KEY, value) } catch {}
    setConsent(value)
    setOpen(false)
  }

  return open ? (
    <aside className={styles.notice} aria-label="Preferências de cookies">
      <strong>Você escolhe os cookies</strong>
      <p>Com sua permissão, usamos o Meta Pixel para medir visitas e anúncios. A Meta recebe dados de navegação e pode usar cookies. Recusar não afeta seu acesso.</p>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose('rejected')}>Recusar opcionais</button>
        <button type="button" onClick={() => choose('accepted')}>Aceitar opcionais</button>
      </div>
    </aside>
  ) : (
    <button className={styles.preferences} type="button" onClick={() => setOpen(true)}>Cookies</button>
  )
}
