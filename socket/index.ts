import { Server } from 'http'
import WebSocket from 'ws'
import { AppWebSocket } from '../types'
import storage from '../storage'
import logger from '../logger'

interface WebSocketServerOptions {
  timeout: number
}

class WebSocketServer {
  wss: WebSocket.Server

  constructor(server: Server, options?: WebSocketServerOptions) {
    const { timeout = 60000 } = options || {}

    this.wss = new WebSocket.Server({ server })

    this.wss.on('connection', (ws: AppWebSocket, req) => {
      ws.timedOut = false
      ws.username = decodeURI(req.url!).replace('/?username=', '')

      logger.log('info', `[WS] Open connection: ${ws.username}`)

      ws.timeout = setTimeout(() => {
        ws.timedOut = true
        ws.close(1000, 'timeout')
      }, timeout)

      ws.on('message', (message: string) => this.onMessage(message, ws))
      ws.on('close', () => this.onClose(ws))

      this.broadcast(
        JSON.stringify({
          type: 'userConnected',
          user: ws.username,
        })
      )
    })
  }

  broadcast(message: string) {
    logger.log('info', `[WS] Broadcast: ${message}`)

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  }

  onMessage(message: string, ws: AppWebSocket) {
    logger.log('info', `[WS] Received message: ${ws.username}: ${message}`)

    ws.timeout.refresh()

    this.broadcast(
      JSON.stringify({ type: 'message', user: ws.username, message })
    )
  }

  onClose(ws: AppWebSocket) {
    let type
    if (ws.timedOut) {
      logger.log('info', `[WS] Close connection (timeout): ${ws.username}`)

      type = 'userTimedOut'
    } else {
      logger.log('info', `[WS] Close connection (user exited): ${ws.username}`)

      type = 'userTimedOut'
    }

    this.broadcast(
      JSON.stringify({
        type,
        user: ws.username,
      })
    )

    storage.remove(ws.username)
    clearTimeout(ws.timeout)
  }

  closeAll() {
    logger.log('info', `[WS] Close all existing connections`)

    this.wss.clients.forEach((client) => client.close(1001, 'shutdown'))
  }
}

export default WebSocketServer
