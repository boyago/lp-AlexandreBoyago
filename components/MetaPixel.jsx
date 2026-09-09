'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_KEY, syncPixelConsent } from '../lib/meta-pixel.mjs'
import { isPublicAnalyticsPage, observeSections, syncAnalyticsConsent, trackAnalytics } from '../lib/analytics.mjs'
import styles from './MetaPixel.module.css'
import { startOwnMetrics, revokeOwnMetrics } from '../lib/metrics-client.mjs'

export default function MetaPixel() {
  const pathname = usePathname()
  const [consent, setConsent] = useState(null)
  const [open, setOpen] = useState(false)
  const lastPage = useRef(null)
  const lastAnalyticsPage = useRef(null)

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
    const effectiveConsent = isPublicAnalyticsPage(pathname) ? consent : 'rejected'
    lastPage.current = syncPixelConsent(window, document, effectiveConsent, pathname, lastPage.current)
    lastAnalyticsPage.current = syncAnalyticsConsent(window, document, effectiveConsent, pathname, lastAnalyticsPage.current)
    if (consent === 'rejected' && isPublicAnalyticsPage(pathname)) revokeOwnMetrics(window)
  }, [consent, pathname])

  useEffect(() => {
    if (consent !== 'accepted' || !isPublicAnalyticsPage(pathname)) return
    const stopOwnMetrics = startOwnMetrics(window, document, pathname)
    const stopObserving = observeSections(window, document)
    function clicked(event) {
      const target = event.target.closest?.('[data-analytics-event]')
      if (!target) return
      trackAnalytics(window, target.dataset.analyticsEvent, {
        button_id: target.dataset.buttonId || '', game_id: target.dataset.gameId || '',
      })
    }
    document.addEventListener('click', clicked, true)
    return () => { stopOwnMetrics(); stopObserving(); document.removeEventListener('click', clicked, true) }
  }, [consent, pathname])

  function choose(value) {
    if (value === 'rejected') { window.__aiGameLabAnalyticsAllowed = false; revokeOwnMetrics(window) }
    try { localStorage.setItem(CONSENT_KEY, value) } catch {}
    setConsent(value)
    setOpen(false)
  }

  if (!isPublicAnalyticsPage(pathname)) return null
  return open ? (
    <aside className={styles.notice} aria-label="Preferências de cookies">
      <strong>Você escolhe os cookies</strong>
      <p>Com sua permissão, usamos contadores próprios, Google Analytics e Meta Pixel para medir visitas, seções vistas, cliques e anúncios. Nosso contador usa cookies, sem nome, e-mail ou IP no banco de métricas. Google e Meta recebem dados de navegação e podem usar cookies. Recusar não afeta seu acesso.</p>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose('rejected')}>Recusar opcionais</button>
        <button type="button" onClick={() => choose('accepted')}>Aceitar opcionais</button>
      </div>
    </aside>
  ) : (
    <button className={styles.preferences} type="button" onClick={() => setOpen(true)}>Cookies</button>
  )
}
