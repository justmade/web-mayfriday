/* global process */
import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import activateCourse from './api/activate-course.js'
import admin from './api/admin.js'
import checkCourseAccess from './api/check-course-access.js'
import getUserCourses from './api/get-user-courses.js'
import getVideoUrl from './api/get-video-url.js'
import hlsPlaylist from './api/hls-playlist.js'
import login from './api/login.js'
import logout from './api/logout.js'
import orders from './api/orders.js'
import products from './api/products.js'
import register from './api/register.js'
import sendSmsCode from './api/send-sms-code.js'
import videoToken from './api/video-token.js'

const app = express()
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const distDirectory = path.resolve(
  process.env.DIST_DIR || path.join(currentDirectory, 'dist'),
)

app.disable('x-powered-by')
app.set('query parser', 'simple')
app.use(express.json({ limit: '2mb' }))

const wrap = (handler) => (req, res) => {
  Promise.resolve(handler(req, res)).catch((error) => {
    console.error(`[api] ${req.method} ${req.path}`, error)
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Internal error' })
    }
  })
}

// API routes must stay ahead of static files and the SPA fallback.
app.get('/healthz', (req, res) => res.json({ ok: true }))
app.all('/api/login', wrap(login))
app.all('/api/register', wrap(register))
app.all('/api/logout', wrap(logout))
app.all('/api/send-sms-code', wrap(sendSmsCode))
app.all('/api/activate-course', wrap(activateCourse))
app.all('/api/check-course-access', wrap(checkCourseAccess))
app.all('/api/get-user-courses', wrap(getUserCourses))
app.all('/api/get-video-url', wrap(getVideoUrl))
app.all('/api/video-token', wrap(videoToken))
app.all('/api/hls-playlist', wrap(hlsPlaylist))
app.all('/api/products', wrap(products))
app.all('/api/orders', wrap(orders))
app.all('/api/admin', wrap(admin))
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' })
})

app.use(express.static(distDirectory, { index: false }))
app.get('*', (req, res) => res.sendFile(path.join(distDirectory, 'index.html')))

const port = Number(process.env.PORT) || 3000

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '127.0.0.1', () => {
    console.log(`web-mayfriday listening on http://127.0.0.1:${port}`)
  })
}

export { distDirectory }
export default app
