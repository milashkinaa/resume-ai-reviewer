import express from 'express'
import cors from 'cors'

import { apiRouter } from './routes/api.route.js'

const app = express()

const CORS_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://s1163794.ha023.t.mydomain.zone',
  'https://s1163794.ha023.t.mydomain.zone',
  'https://resume-ai-reviewer.onrender.com',
]

// Явная обработка preflight (OPTIONS), чтобы избежать зависания
app.options('*', (req, res) => {
  const origin = req.headers.origin
  if (origin && CORS_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')
  res.sendStatus(204)
})

app.use(cors({
  origin: CORS_ORIGINS,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json({ limit: '50mb' }))

app.use('/api', apiRouter)

export { app }
