'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  User, 
  Bell, 
  Shield, 
  Sparkles,
  LogOut,
  ChevronRight,
  Wallet,
  Settings,
  Moon,
  Sun,
  Brain
} from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { getUserStats, updateUserSettings } from '@/lib/actions'

export default function SettingsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    getUserStats().then(setStats)
  }, [])

  const handleUpdate = async (field: string, value: any) => {
    setIsUpdating(true)
    try {
      await updateUserSettings({ [field]: value })
      const newStats = await getUserStats()
      setStats(newStats)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!stats) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const sections = [
    {
      title: 'بيانات الحساب',
      items: [
        { 
          label: 'اسم المستخدم', 
          value: stats.userName, 
          icon: <User className="h-5 w-5" />,
          onClick: () => {
            const name = prompt('أدخل اسمك الجديد:', stats.userName)
            if (name) handleUpdate('name', name)
          }
        },
        { 
          label: 'العملة', 
          value: stats.currency, 
          icon: <Wallet className="h-5 w-5" />,
          onClick: () => {
            const currencies = ['EGP', 'USD', 'SAR', 'AED']
            const next = currencies[(currencies.indexOf(stats.currency) + 1) % currencies.length]
            handleUpdate('currency', next)
          }
        },
        { 
          label: 'شخصية المدرب', 
          value: stats.aiPersonality === 'strict' ? 'صارم' : stats.aiPersonality === 'zen' ? 'هادئ' : 'داعم', 
          icon: <Brain className="h-5 w-5" />,
          onClick: () => {
            const personalities = ['supportive', 'strict', 'zen']
            const next = personalities[(personalities.indexOf(stats.aiPersonality) + 1) % personalities.length]
            handleUpdate('aiPersonality', next)
          }
        },
      ]
    },
    {
      title: 'إعدادات الخطة',
      items: [
        { 
          label: 'التكلفة اليومية', 
          value: `${stats.dailySpend} ${stats.currency}`, 
          icon: <Shield className="h-5 w-5" />,
          onClick: () => {
            const amount = prompt('كم كنت تنفق يومياً على الفيب؟', stats.dailySpend.toString())
            if (amount) handleUpdate('dailySpend', parseInt(amount))
          }
        },
        { 
          label: 'الدافع الشخصي', 
          value: stats.motivation || 'غير محدد', 
          icon: <Sparkles className="h-5 w-5" />,
          onClick: () => {
            const m = prompt('ما هو دافعك الأساسي للإقلاع؟', stats.motivation)
            if (m) handleUpdate('motivation', m)
          }
        },
      ]
    },
    {
      title: 'التطبيق',
      items: [
        { 
          label: 'التنبيهات', 
          value: stats.notificationsEnabled ? 'مفعلة' : 'معطلة', 
          icon: <Bell className="h-5 w-5" />,
          onClick: () => handleUpdate('notificationsEnabled', !stats.notificationsEnabled)
        },
        { 
          label: 'المظهر', 
          value: stats.theme === 'dark' ? 'ليلي' : 'نهاري', 
          icon: stats.theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />,
          onClick: () => handleUpdate('theme', stats.theme === 'dark' ? 'light' : 'dark')
        },
      ]
    }
  ]

  return (
    <div className={`min-h-screen ${stats.theme === 'dark' ? 'bg-background' : 'bg-slate-50 text-slate-900'} pb-24 font-sans`} dir="rtl">
      {/* Header */}
      <header className="p-6 pt-12 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
      </header>

      <main className="px-6 space-y-8">
        {/* Profile Card */}
        <section className="bg-card border border-border p-6 rounded-[32px] flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden">
            <img src={session?.user?.image || ''} alt="Profile" className="w-full h-full" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{stats.userName}</h2>
            <p className="text-xs text-muted-foreground">المستوى {stats.level} • بطل متعافي</p>
          </div>
        </section>

        {/* Settings Sections */}
        {sections.map((section, idx) => (
          <section key={idx} className="space-y-3">
            <h3 className="text-[10px] font-bold text-muted-foreground px-4 uppercase tracking-[0.2em]">{section.title}</h3>
            <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
              {section.items.map((item, i) => (
                <button 
                  key={i} 
                  onClick={item.onClick}
                  disabled={isUpdating}
                  className={`w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors ${
                    i !== section.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-primary">{item.icon}</div>
                    <span className="font-bold text-xs">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-accent">{item.value}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Logout */}
        <section className="pt-4">
          <Button 
            variant="ghost" 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full h-16 rounded-[28px] text-destructive hover:bg-destructive/10 gap-3 font-bold border border-destructive/10"
          >
            <LogOut className="h-5 w-5" /> تسجيل الخروج
          </Button>
        </section>

        <p className="text-[10px] text-center text-muted-foreground opacity-50 pb-4">
          Breathe Free v1.1.0 • تنفس بحرية<br/>
          جميع البيانات مشفرة وآمنة تماماً
        </p>
      </main>

      <BottomNav />
      
      {isUpdating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
