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
            // Here we can set a cookie or navigate to a special route that handles the token
            // For next-auth, it's a bit tricky to set the session manually from a token via URL
            // but we can try to set the session cookie if the server generates it
            router.push(`/api/auth/callback/google?token=${token}`)
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
