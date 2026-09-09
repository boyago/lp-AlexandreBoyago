// Independent of Google and Meta; nothing is sent without consent.
export function startOwnMetrics(win, doc, pathname) {
  const page = pathname === '/' ? '/' : '/obrigado/'
  const state = win.__aglMetrics ||= { queue: [], running: false, route: null, pageId: null }
  if (state.route !== page) { state.route = page; state.pageId = win.crypto.randomUUID() }
  async function flush() {
    if (state.running) return
    state.running = true
    try {
      while (state.queue.length && win.__aiGameLabAnalyticsAllowed) {
        const batch = state.queue.splice(0, 20)
        for (let attempt = 0; attempt < 2 && win.__aiGameLabAnalyticsAllowed; attempt++) {
          try {
            const response = await win.fetch('/api/metrics/events/', { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ consent: 'accepted', events: batch }) })
            if (response.ok || response.status < 500) break
          } catch {}
        }
      }
    } finally {
      state.running = false
      if (!win.__aiGameLabAnalyticsAllowed) {
        state.queue.length = 0
        if (state.clearRequested) { state.clearRequested = false; void clearOwnCookies(win) }
      }
    }
  }
  function send(name, params = {}, id = win.crypto.randomUUID()) {
    if (!win.__aiGameLabAnalyticsAllowed || state.queue.length >= 100) return
    state.queue.push({ id, name, page, section_id: params.section_id, game_id: params.game_id, button_id: params.button_id, depth: params.depth })
    void flush()
  }
  win.__aiGameLabMetricsSend = send
  send('page_view', {}, state.pageId)
  const depths = new Set()
  let scheduled = false, stopped = false
  function scroll() {
    if (scheduled) return
    scheduled = true
    win.requestAnimationFrame(() => {
      scheduled = false
      if (stopped || doc.hidden) return
      const height = doc.documentElement.scrollHeight
      const reached = height <= win.innerHeight ? 100 : Math.min(100, Math.round((win.scrollY + win.innerHeight) / height * 100))
      for (const depth of [25, 50, 75, 90, 100]) if (reached >= depth && !depths.has(depth)) { depths.add(depth); send('scroll_depth', { depth }) }
    })
  }
  win.addEventListener('scroll', scroll, { passive: true }); win.addEventListener('resize', scroll); doc.addEventListener('visibilitychange', scroll); scroll()
  return () => {
    stopped = true
    if (win.__aiGameLabMetricsSend === send) win.__aiGameLabMetricsSend = null
    win.removeEventListener('scroll', scroll); win.removeEventListener('resize', scroll); doc.removeEventListener('visibilitychange', scroll)
  }
}
function clearOwnCookies(win) { return win.fetch('/api/metrics/events/', { method: 'DELETE', credentials: 'same-origin', keepalive: true }).catch(() => {}) }
export function revokeOwnMetrics(win) {
  win.__aiGameLabMetricsSend = null
  if (win.__aglMetrics) { win.__aglMetrics.queue.length = 0; if (win.__aglMetrics.running) { win.__aglMetrics.clearRequested = true; return } }
  void clearOwnCookies(win)
}
