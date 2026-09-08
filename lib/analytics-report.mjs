export function analyticsReportUrl(value = '') {
  try {
    const url = new URL(value)
    const allowedHosts = ['lookerstudio.google.com', 'datastudio.google.com']
    if (url.protocol !== 'https:' || !allowedHosts.includes(url.hostname) || url.port || url.username || url.password) return null
    if (!/^\/embed\/reporting\/[a-zA-Z0-9_-]+(?:\/page\/[a-zA-Z0-9_-]+)?\/?$/.test(url.pathname)) return null
    if (url.search || url.hash) return null
    return url.href
  } catch { return null }
}
