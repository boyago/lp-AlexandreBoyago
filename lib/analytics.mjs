export const GA_ID = 'G-KV848N4Y33'
export const SECTION_NAMES = {
  inicio: 'Início', imersao: 'O que você vai criar', conteudo: 'Conteúdo',
  playground: 'Games', mentor: 'Mentor', oferta: 'Oferta', faq: 'Perguntas frequentes',
}
const EVENTS = new Set(['section_view', 'game_select', 'game_open', 'checkout_click', 'whatsapp_click'])
const PARAMETERS = new Set(['section_id', 'section_name', 'game_id', 'button_id'])

export function isPublicAnalyticsPage(pathname) {
  return pathname === '/' || /^\/obrigado\/?$/.test(pathname)
}

export function cleanPageLocation(href) {
  const url = new URL(href)
  const allowed = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'])
  for (const key of [...url.searchParams.keys()]) if (!allowed.has(key)) url.searchParams.delete(key)
  url.hash = ''
  return url.href
}

export function trackAnalytics(win, name, params = {}) {
  if (!win.__aiGameLabAnalyticsAllowed || !EVENTS.has(name)) return
  const safeParams = Object.fromEntries(Object.entries(params).filter(([key, value]) => PARAMETERS.has(key) && typeof value === 'string').map(([key, value]) => [key, value.slice(0, 100)]))
  win.__aiGameLabMetricsSend?.(name, safeParams)
  win.gtag?.('event', name, { ...safeParams, send_to: GA_ID })
}

export function syncAnalyticsConsent(win, doc, consent, pathname, lastPage) {
  const enabled = consent === 'accepted' && isPublicAnalyticsPage(pathname)
  win.__aiGameLabAnalyticsAllowed = enabled
  win[`ga-disable-${GA_ID}`] = !enabled
  if (!enabled) {
    win.gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    return null
  }
  win.dataLayer = win.dataLayer || []
  if (!win.gtag) win.gtag = function () { win.dataLayer.push(arguments) }
  let referrer = ''
  try { referrer = new URL(doc.referrer).origin } catch {}
  const page = { page_title: doc.title, page_location: cleanPageLocation(win.location.href), page_referrer: referrer }
  win.gtag('set', page)
  if (!win.__aiGameLabGAInitialized) {
    win.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    win.gtag('js', new Date())
    win.gtag('config', GA_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false })
    win.__aiGameLabGAInitialized = true
  }
  win.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  if (!doc.querySelector(`script[data-ga-id="${GA_ID}"]`)) {
    const script = doc.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.dataset.gaId = GA_ID
    script.onerror = () => script.remove()
    doc.head.appendChild(script)
  }
  if (lastPage !== pathname) {
    win.gtag('event', 'page_view', { send_to: GA_ID, ...page })
  }
  return pathname
}

// A large section must occupy half the viewport, rather than requiring half of
// the entire section to fit onscreen. Count only after two continuous seconds.
export function sectionIsVisible(entry, viewportHeight) {
  const targetHeight = Math.min(entry.boundingClientRect.height, viewportHeight)
  return entry.isIntersecting && targetHeight > 0 && entry.intersectionRect.height / targetHeight >= .5
}

export function observeSections(win, doc, send = (name, params) => trackAnalytics(win, name, params)) {
  if (!win.IntersectionObserver) return () => {}
  const seen = new Set(), timers = new Map()
  const elements = [...doc.querySelectorAll('section[id]')].filter(el => SECTION_NAMES[el.id])
  function cancel(id) { win.clearTimeout(timers.get(id)); timers.delete(id) }
  const observer = new win.IntersectionObserver(entries => {
    for (const entry of entries) {
      const id = entry.target.id
      if (doc.hidden || !sectionIsVisible(entry, win.innerHeight)) { cancel(id); continue }
      if (seen.has(id) || timers.has(id)) continue
      timers.set(id, win.setTimeout(() => {
        cancel(id)
        if (doc.hidden) return
        const rect = entry.target.getBoundingClientRect()
        const visibleHeight = Math.max(0, Math.min(rect.bottom, win.innerHeight) - Math.max(0, rect.top))
        if (visibleHeight / Math.min(rect.height, win.innerHeight) < .5) return
        seen.add(id)
        send('section_view', { section_id: id, section_name: SECTION_NAMES[id] })
      }, 2000))
    }
  }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) })
  elements.forEach(el => observer.observe(el))
  function visibility() {
    timers.forEach((_, id) => cancel(id))
    if (!doc.hidden) elements.forEach(el => { observer.unobserve(el); observer.observe(el) })
  }
  doc.addEventListener('visibilitychange', visibility)
  return () => { observer.disconnect(); timers.forEach((_, id) => cancel(id)); doc.removeEventListener('visibilitychange', visibility) }
}
