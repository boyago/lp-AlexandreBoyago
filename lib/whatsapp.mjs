export const PROGRESS_DURATION_MS = 10000
export const INVITE_PROGRESS_LIMIT = 96
export const IMMERSION_INVITE = 'https://whats.ly/imersao'

export function inviteProgressAt(elapsedMs) {
  if (!Number.isFinite(elapsedMs)) return 0
  return Math.round(Math.min(1, Math.max(0, elapsedMs / PROGRESS_DURATION_MS)) * INVITE_PROGRESS_LIMIT)
}

// Only a configured WhatsApp invitation is accepted; never redirect from query parameters.
export function whatsappInvite(value = '') {
  try {
    const url = new URL(value.trim())
    // The owner supplied this exact short URL. Other shortener paths are not allowed.
    if (url.href === IMMERSION_INVITE) return IMMERSION_INVITE
    if (url.protocol !== 'https:' || url.hostname !== 'chat.whatsapp.com' || url.port || url.username || url.password || !/^\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)) return null
    return url.href
  } catch { return null }
}
