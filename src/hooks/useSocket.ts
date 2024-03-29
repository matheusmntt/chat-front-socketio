import { useEffect, useState } from "react"
import { socket } from "../socket"

export const useSocket = () => {
  const [socketInstance] = useState(socket())
  const [isConnected, setIsConnected] = useState(socketInstance.connected)

  useEffect(() => {
    socketInstance.on('connect', () => setIsConnected(true))
    socketInstance.on('disconnect', () => setIsConnected(false))

    return () => {
      socketInstance.off('connect')
      socketInstance.off('disconnect')
    }
  }, [socketInstance])

  return { isConnected, socketInstance }
}