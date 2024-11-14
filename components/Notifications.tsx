'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface Notification {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
  timestamp: number
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()

  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: Date.now(),
    }

    setNotifications(prev => [...prev, newNotification])

    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id))
    }, 5000)
  }

  // Expose addNotification to window for global access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).addNotification = addNotification
    }
  }, [])

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`
            p-4 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300
            ${notification.type === 'success' ? 'bg-green-500/20 text-green-300' :
              notification.type === 'error' ? 'bg-red-500/20 text-red-300' :
              'bg-blue-500/20 text-blue-300'
            }
          `}
        >
          {notification.message}
        </div>
      ))}
    </div>
  )
} 