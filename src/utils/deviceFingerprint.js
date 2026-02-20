/**
 * 设备指纹生成工具
 * Device fingerprinting utility for unique device identification
 */

/**
 * 生成设备唯一ID
 * Generates a unique device ID based on browser characteristics
 */
export function generateDeviceId() {
  const data = {
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    colorDepth: screen.colorDepth,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
  }

  const fingerprint = JSON.stringify(data)
  return simpleHash(fingerprint)
}

/**
 * 获取设备显示名称
 * Gets a human-readable device name
 */
export function getDeviceName() {
  const ua = navigator.userAgent

  // 检测浏览器 / Detect browser
  let browser = 'Unknown'
  if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Firefox')) browser = 'Firefox'

  // 检测操作系统 / Detect OS
  let os = 'Unknown'
  if (ua.includes('iPhone')) os = 'iPhone'
  else if (ua.includes('iPad')) os = 'iPad'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Linux')) os = 'Linux'

  return `${browser} on ${os}`
}

/**
 * 简单哈希函数
 * Simple hash function for generating device ID
 */
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 12)
}
