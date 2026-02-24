import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

/**
 * Returns a singleton Socket.IO client connected to the /chat namespace.
 * The connection uses httpOnly cookies for authentication (same accessToken
 * cookie the REST API uses), so no manual token handling is needed.
 */
export function getChatSocket(): Socket {
  if (socket) return socket

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
  const origin = baseUrl.replace(/\/v1\/?$/, '')

  socket = io(`${origin}/chat`, {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  })

  return socket
}

/**
 * Disconnects and destroys the singleton socket instance.
 * Call this on logout or when chat is no longer needed.
 */
export function disconnectChatSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
