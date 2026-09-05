/* global Buffer, process */
import jwt from 'jsonwebtoken'

import { getOssClient } from './_oss.js'
import { COURSE_PLAYLISTS, normalizeObjectPath, resolvePlaylistObject } from './_video-access.js'

const SEGMENT_TTL_SECONDS = 4 * 60 * 60
const URI_ATTRIBUTE = /URI="([^"]+)"/g

function signUri(client, playlistPath, uri) {
  const objectPath = resolvePlaylistObject(playlistPath, uri)
  if (!objectPath) throw new Error('Invalid playlist URI')
  return client.signatureUrl(objectPath, { expires: SEGMENT_TTL_SECONDS })
}

export function rewritePlaylist(content, playlistPath, client) {
  return content.split(/\r?\n/).map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return line

    if (trimmed.startsWith('#')) {
      return line.replace(URI_ATTRIBUTE, (_match, uri) => `URI="${signUri(client, playlistPath, uri)}"`)
    }

    return signUri(client, playlistPath, trimmed)
  }).join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const objectPath = normalizeObjectPath(req.query?.path)
  const token = typeof req.query?.t === 'string' ? req.query.t : ''
  if (!objectPath || !COURSE_PLAYLISTS.has(objectPath) || !token) {
    return res.status(400).json({ success: false, error: '无效的播放请求 / Invalid playback request' })
  }

  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured')
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (payload.type !== 'video' || payload.path !== objectPath || !payload.phone) {
      return res.status(403).json({ success: false, error: '播放令牌与视频不匹配 / Token does not match video' })
    }

    const client = getOssClient()
    const result = await client.get(objectPath)
    const content = Buffer.isBuffer(result.content)
      ? result.content.toString('utf8')
      : String(result.content)
    const rewritten = rewritePlaylist(content, objectPath, client)

    res.set('Content-Type', 'application/vnd.apple.mpegurl')
    res.set('Cache-Control', 'private, no-store')
    return res.status(200).send(rewritten)
  } catch (error) {
    if (error?.name === 'TokenExpiredError' || error?.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, error: '播放令牌已失效 / Playback token expired' })
    }
    console.error('HLS playlist error:', error)
    return res.status(500).json({ success: false, error: '播放列表加载失败 / Failed to load playlist' })
  }
}
