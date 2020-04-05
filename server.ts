require('dotenv').config()
import express from 'express'
import http from 'http'
import cors from 'cors'
import authRouter from './routes/auth'
import errorHandler from './middlewares/errorHandler'
import WebSocketServer from './socket'
import logger from './logger'

const app = express()
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  })
)
app.use(express.json())
app.use('/', authRouter)
app.use(errorHandler)

const server = http.createServer(app)
server.listen(process.env.PORT, () => {
  logger.log('info', `[Server] Started at http://localhost:${process.env.PORT}`)
})

const wss = new WebSocketServer(server)

const shutdown = (signal: string) => {
  logger.log('info', `[Server] ${signal} received, begin graceful shutdown`)

  wss.closeAll()

  server.close(() => {
    logger.log('info', `[Server] Closed`)
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
