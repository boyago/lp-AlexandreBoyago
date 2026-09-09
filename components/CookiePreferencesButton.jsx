'use client'

import { openCookiePreferences } from '../lib/cookie-consent.mjs'
import styles from './MetaPixel.module.css'

export default function CookiePreferencesButton() {
  return <button type="button" className={styles.preferences} aria-controls="cookie-preferences-panel" onClick={() => openCookiePreferences(window)}>Preferências de cookies</button>
}
