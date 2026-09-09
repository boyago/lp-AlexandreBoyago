'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_KEY, syncPixelConsent } from '../lib/meta-pixel.mjs'
import { isPublicAnalyticsPage, observeSections, syncAnalyticsConsent, trackAnalytics } from '../lib/analytics.mjs'
import styles from './MetaPixel.module.css'
import { startOwnMetrics, revokeOwnMetrics } from '../lib/metrics-client.mjs'
import { COOKIE_PREFERENCES_EVENT, readConsentPreference, saveConsentPreference } from '../lib/cookie-consent.mjs'

export default function MetaPixel() {
  const pathname = usePathname()
  const [consent, setConsent] = useState(null)
  const [open, setOpen] = useState(false)
  const lastPage = useRef(null)
  const lastAnalyticsPage = useRef(null)
  const preferencesTrigger = useRef(null)
  const notice = useRef(null)

  useEffect(() => {
    function readChoice() {
      const saved = readConsentPreference(window)
      setConsent(saved.consent)
      setOpen(saved.showNotice)
    }
    readChoice()
    function sync(event) { if (event.key === CONSENT_KEY || event.key === null) readChoice() }
    function reopen() { preferencesTrigger.current = document.activeElement; setOpen(true) }
    window.addEventListener('storage', sync)
    window.addEventListener(COOKIE_PREFERENCES_EVENT, reopen)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, reopen)
    }
  }, [])

  useEffect(() => {
    // Only focus the notice when the visitor explicitly opens it from the footer.
    if (open && preferencesTrigger.current) notice.current?.querySelector('button')?.focus({ preventScroll: true })
  }, [open])

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

  function closeNotice() {
    setOpen(false)
    preferencesTrigger.current?.focus?.({ preventScroll: true })
    preferencesTrigger.current = null
  }

  function choose(value) {
    if (value === 'rejected') { window.__aiGameLabAnalyticsAllowed = false; revokeOwnMetrics(window) }
    saveConsentPreference(window, value)
    setConsent(value)
    closeNotice()
  }

  if (!isPublicAnalyticsPage(pathname) || !open) return null
  return (
    <aside ref={notice} id="cookie-preferences-panel" className={styles.notice} aria-label="Preferências de cookies">
      <strong>Você escolhe os cookies</strong>
      <p>Com sua permissão, usamos contadores próprios, Google Analytics e Meta Pixel para medir visitas, seções vistas, cliques e anúncios. Nosso contador usa cookies, sem nome, e-mail ou IP no banco de métricas. Google e Meta recebem dados de navegação e podem usar cookies. Recusar não afeta seu acesso.</p>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose('rejected')}>Recusar opcionais</button>
        <button type="button" onClick={() => choose('accepted')}>Aceitar opcionais</button>
      </div>
      {consent !== null && <button className={styles.close} type="button" onClick={closeNotice}>Fechar sem alterar</button>}
    </aside>
  )
}
