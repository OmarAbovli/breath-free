'use client'

import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { useRouter } from 'next/navigation'

export function CapacitorHandler() {
  const router = useRouter()

  useEffect(() => {
    // Listen for deep links
    const setupListener = async () => {
      App.addListener('appUrlOpen', (data: any) => {
        const url = new URL(data.url)
        
        // Example: breathefree://login?session-token=ABC
        if (url.protocol === 'breathefree:' && url.host === 'login') {
          const token = url.searchParams.get('token')
          if (token) {
            // Navigate to the session-set route to establish the session in the WebView
            router.push(`/api/auth/session-set?token=${token}&callbackUrl=/`)
          } else {
            // Fallback for cases without token
            router.push('/')
          }
        }
      })
    }

    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      setupListener()
    }
  }, [router])

  return null
}
