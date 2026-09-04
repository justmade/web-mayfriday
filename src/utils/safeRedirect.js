export function safeRedirect(value, fallback = '/my-courses') {
  if (typeof value !== 'string') return fallback

  const path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) {
    return fallback
  }

  return path
}
