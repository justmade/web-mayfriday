import path from 'node:path'

import { isMembershipActive } from './_membership.js'

export const COURSE_PLAYLISTS = new Map([
  ['courses/course1/playlist.m3u8', 'course1'],
  ['courses/course2/inkle-basics/playlist.m3u8', 'course2'],
  ['courses/course3/playlist.m3u8', 'course3'],
])

export const PUBLIC_RESOURCE_PLAYLISTS = new Set([
  'resources/1/hls/playlist.m3u8',
  'resources/mini-heddle-latvia-pattern/playlist.m3u8',
  'resources/ipad-bag-crochet-tutorial/playlist.m3u8',
])

export function normalizeObjectPath(value) {
  if (typeof value !== 'string' || !value || value.startsWith('/') || value.includes('\\')) {
    return null
  }

  const normalized = path.posix.normalize(value)
  if (normalized !== value || normalized === '.' || normalized.startsWith('../') || /[?#]/.test(value)) {
    return null
  }

  return normalized
}

export function courseIdForObject(objectPath) {
  const match = /^courses\/(course\d+)(?:\/|$)/.exec(objectPath || '')
  return match?.[1] || null
}

export function userCanAccessCourse(user, courseId) {
  return isMembershipActive(user?.membership) || (user?.courses || []).includes(courseId)
}

export function resolvePlaylistObject(playlistPath, uri) {
  if (typeof uri !== 'string' || !uri || /^[a-z][a-z\d+.-]*:/i.test(uri) || uri.startsWith('//')) {
    return null
  }

  const objectPath = path.posix.normalize(path.posix.join(path.posix.dirname(playlistPath), uri))
  return objectPath.startsWith('courses/') && !objectPath.includes('?') && !objectPath.includes('#')
    ? objectPath
    : null
}
