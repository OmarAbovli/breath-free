'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionToken } from '@/lib/actions'

export default function AuthSuccess() {
  const router = useRouter()

  useEffect(() => {
    // This page is reached after successful web login
    // It will trigger the deep link to return to the app with the session token
    const triggerDeepLink = async () => {
      const token = await getSessionToken()
      if (token) {
        window.location.href = `breathefree://login?token=${token}`
      } else {
        // If no token, just try to go back
        window.location.href = 'breathefree://login'
      }
    }

    setTimeout(triggerDeepLink, 1000)
    
    // Fallback back to home if user is on web
    setTimeout(() => {
      router.push('/')
    }, 5000)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
      <h1 className="text-2xl font-bold mb-2">تم تسجيل الدخول بنجاح!</h1>
      <p className="text-muted-foreground">جاري العودة للتطبيق...</p>
      <button 
        onClick={() => window.location.href = 'breathefree://login'}
        className="mt-8 text-primary font-bold underline"
      >
        اضغط هنا إذا لم يتم تحويلك تلقائياً
      </button>
    </div>
  )
}
