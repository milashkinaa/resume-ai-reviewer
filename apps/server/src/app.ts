import express from 'express'

import { apiRouter } from './routes/api.route.js'

const app = express()

const CORS_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://s1163794.ha023.t.mydomain.zone',
  'https://s1163794.ha023.t.mydomain.zone',
  'https://resume-ai-reviewer.onrender.com',
])

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, '')
}

function isAllowedOrigin(origin?: string): origin is string {
  return typeof origin === 'string' && CORS_ORIGINS.has(normalizeOrigin(origin))
}

app.use((req, res, next) => {
  const origin = req.headers.origin

  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})

app.use(express.json({ limit: '50mb' }))

app.use('/api', apiRouter)

export { app }
