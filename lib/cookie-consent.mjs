import { CONSENT_KEY } from './meta-pixel.mjs'

export const COOKIE_PREFERENCES_EVENT = 'ai-game-lab:cookie-preferences'

export function readConsentPreference(win) {
  let choice = null
  try { choice = win.localStorage.getItem(CONSENT_KEY) } catch {}
  const consent = choice === 'accepted' || choice === 'rejected' ? choice : null
  return { consent, showNotice: consent === null }
}

export function saveConsentPreference(win, choice) {
  if (choice !== 'accepted' && choice !== 'rejected') return false
  try { win.localStorage.setItem(CONSENT_KEY, choice); return true } catch { return false }
}

export function openCookiePreferences(win) {
  win.dispatchEvent(new win.Event(COOKIE_PREFERENCES_EVENT))
}
