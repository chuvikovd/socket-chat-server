import WebSocket from 'ws'

export interface AppWebSocket extends WebSocket {
  username: string
  timeout: NodeJS.Timeout
  timedOut: boolean
}
