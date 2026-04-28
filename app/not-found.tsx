'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها
        </p>
        <div className="pt-4 flex gap-3 justify-center">
          <Button asChild>
            <Link href="/">العودة للوحة التحكم</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">الصفحة الرئيسية</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
