import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Providers } from '@/components/Providers'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Breathe Free - رفيقك للتحرر من الفيب',
  description: 'Breathe Free هو تطبيق ذكي يساعدك على الإقلاع عن التدخين الإلكتروني (Vaping) من خلال تتبع التقدم، تحليلات الذكاء الاصطناعي، ودعم المجتمع. ابدأ رحلتك نحو صحة أفضل اليوم.',
  generator: 'v0.app',
  keywords: ['الإقلاع عن الفيب', 'صحة الرئة', 'Breathe Free', 'تنفس بحرية', 'vaping cessation', 'quit vape app', 'AI health coach'],
  authors: [{ name: 'Breathe Free Team' }],
  openGraph: {
    title: 'Breathe Free - تنفس بحرية واستعد صحتك',
    description: 'التطبيق الأول عربياً المدعوم بالذكاء الاصطناعي لمساعدتك على ترك الفيب نهائياً.',
    url: 'https://breathe-free.app', // Placeholder URL
    siteName: 'Breathe Free',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Breathe Free App Logo',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Breathe Free - التحرر من الفيب يبدأ هنا',
    description: 'تتبع صمودك، وفر أموالك، واستعد عافيتك مع رفيقك الذكي.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

import { CapacitorHandler } from '@/components/CapacitorHandler'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background text-foreground">
      <body className="font-sans antialiased">
        <Providers>
          <CapacitorHandler />
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
