import { app } from './app.js'

const PORT = process.env.PORT ?? 3004
const SERVER_VERSION = 'cors-debug-v3'

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`Server version: ${SERVER_VERSION}`)
})
