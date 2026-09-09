export const META_PIXEL_ID = '1138958273839648'
// Keep this version when changing only the notice UI: existing choices remain valid.
export const CONSENT_KEY = 'ai-game-lab-measurement-v3'

export function startMetaPixel(win, doc) {
  if (!win.fbq) {
    const fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments)
      else fbq.queue.push(arguments)
    }
    win.fbq = fbq
    if (!win._fbq) win._fbq = fbq
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
  }
  win.fbq('consent', 'grant')
  if (!win.__aiGameLabPixelInitialized) {
    // Only explicit events, without automatic form/advanced matching collection.
    win.fbq('set', 'autoConfig', false, META_PIXEL_ID)
    win.fbq('init', META_PIXEL_ID)
    win.__aiGameLabPixelInitialized = true
  }
  if (!doc.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]')) {
    const script = doc.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    script.onerror = () => script.remove()
    doc.head.appendChild(script)
  }
}

export function trackPageView(win) {
  win.fbq?.('trackSingle', META_PIXEL_ID, 'PageView')
}

export function syncPixelConsent(win, doc, consent, pathname, lastPage) {
  if (consent !== 'accepted') {
    win.fbq?.('consent', 'revoke')
    return null
  }
  startMetaPixel(win, doc)
  if (lastPage !== pathname) trackPageView(win)
  return pathname
}
