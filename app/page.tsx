'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession, signIn } from 'next-auth/react'
import { ShieldAlert, Flame, TrendingUp, Heart, Target, Sparkles, Brain, LogIn, PlusCircle, Settings, Share2 } from 'lucide-react'
import { getUserStats, logUsage, getAIInsight, getDailyMission } from '@/lib/actions'

import { BottomNav } from '@/components/BottomNav'
import { AchievementCard } from '@/components/AchievementCard'

export default function HomeDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [stats, setStats] = useState<any>({
    streakDays: 0,
    longestStreak: 0,
    usageToday: 0,
    moneySaved: 0,
    healthProgress: 0,
    level: 1,
    xp: 0
  })
  const [userCount, setUserCount] = useState(5000)
  const [aiInsight, setAiInsight] = useState("أهلاً بك! سأقوم بتحليل سلوكك وإعطائك نصائح مخصصة قريباً.")
  const [mission, setMission] = useState<any>(null)
  const [isSharing, setIsSharing] = useState(false)

  const { getTotalUserCount } = require('@/lib/actions')

  useEffect(() => {
    if (session) {
      getUserStats().then(data => {
        if (data) setStats(data)
      })
      getAIInsight().then(setAiInsight)
      getDailyMission().then(setMission)
    } else {
      getTotalUserCount().then(setUserCount)
    }
  }, [session])

  const handleLogPuff = async () => {
    await logUsage(1)
    const newStats = await getUserStats()
    if (newStats) setStats(newStats)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden" dir="rtl">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Section */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-8 pt-20 text-center space-y-12 z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-[45px] blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative w-32 h-32 bg-[#000] border border-white/10 rounded-[40px] flex items-center justify-center shadow-2xl overflow-hidden p-2">
              <img
                src="/logo.png"
                alt="Breathe Free Logo"
                className="relative z-10 w-full h-full object-contain scale-125"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter leading-tight">
              تنفس بحرية<br />
              <span className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">Breathe Free</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xs mx-auto leading-relaxed">
              مش مجرد تطبيق، ده رفيقك الذكي لاستعادة صحتك والتحرر من الفيب للأبد.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 gap-3 w-full max-w-sm px-4">
            {[
              { icon: <ShieldAlert className="w-5 h-5" />, title: 'نمط الإنقاذ الذكي', desc: 'مساعدة فورية لما تحس بالرغبة', color: 'text-destructive' },
              { icon: <Brain className="w-5 h-5" />, title: 'مدرب AI خاص بك', desc: 'بيفهمك وبيدعمك 24/7', color: 'text-accent' },
              { icon: <TrendingUp className="w-5 h-5" />, title: 'تحليل دقيق لسلوكك', desc: 'افهم محفزاتك وسيطر عليها', color: 'text-primary' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md">
                <div className={`p-3 rounded-2xl bg-white/5 ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-sm">{feature.title}</h3>
                  <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="p-8 pb-12 space-y-6 z-10">
          <div className="flex justify-center -space-x-3 rtl:space-x-reverse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-muted overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-card flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              +{userCount > 1000 ? Math.floor(userCount / 100) / 10 + 'k' : userCount}
            </div>
          </div>
          <p className="text-[10px] text-center text-muted-foreground">انضم لأكثر من {userCount} شخص بدأوا رحلتهم بنجاح</p>

          <div className="space-y-3">
            <Button
              size="lg"
              onClick={async () => {
                if (typeof window !== 'undefined' && (window as any).Capacitor) {
                  const { Browser } = await import('@capacitor/browser')
                  await Browser.open({ 
                    url: 'https://breath-free-one.vercel.app/api/auth/signin/google?callbackUrl=https://breath-free-one.vercel.app/auth-success' 
                  })
                } else {
                  signIn('google')
                }
              }}
              className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-primary-foreground gap-4 text-lg font-bold shadow-[0_0_30px_-5px] shadow-primary/40 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <LogIn className="w-6 h-6" />
              ابدأ رحلتك الآن
            </Button>
            <p className="text-[10px] text-center text-muted-foreground px-10">
              بالضغط على ابدأ، أنت توافق على شروط الخدمة وسياسة الخصوصية
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans" dir="rtl">
      {/* Header */}
      <header className="p-6 pt-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#000] border border-border rounded-2xl flex items-center justify-center overflow-hidden p-1 shadow-sm">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-125" />
          </div>
          <div>
            <h1 className="text-xl font-bold italic">مرحباً، {session.user?.name?.split(' ')[0]}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">مستوى {stats.level || 1}</span>
              <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-1000"
                  style={{ width: `${(stats.xp || 0) % 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-12 h-12 rounded-full border-2 border-accent/20 p-0.5 cursor-pointer hover:scale-105 transition-all"
          onClick={() => router.push('/settings')}
        >
          <img
            src={session.user?.image || ''}
            alt="Profile"
            className="w-full h-full rounded-full"
          />
        </div>
      </header>

      <main className="px-6 space-y-8">
        {/* Streak Card (Apple Rings style) */}
        <section
          className="bg-card rounded-3xl p-6 border border-border shadow-lg relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
          onClick={() => router.push('/gamification')}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -ml-10 -mt-10" />
          <div className="flex justify-between items-center">
            <div className="space-y-1 z-10">
              <h2 className="text-muted-foreground font-medium">أيام التعافي</h2>
              <div className="text-5xl font-extrabold text-primary flex items-baseline gap-2">
                {stats.streakDays} <span className="text-lg font-normal text-muted-foreground">أيام</span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                <Flame className="h-4 w-4 text-orange-500" /> أطول سلسلة: {stats.longestStreak} يوم
              </p>
            </div>

            {/* Circular Progress */}
            <div className="relative w-28 h-28 z-10 mr-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-muted fill-none" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40"
                  className="stroke-primary fill-none transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (stats.streakDays > 0 ? 100 : 0) / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <Heart className="h-6 w-6 text-primary fill-primary/20 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Craving Status (Rescue Button) */}
        <section>
          <Button
            size="lg"
            className="w-full h-24 rounded-3xl bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_40px_-10px] shadow-destructive/50 transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
            onClick={() => router.push('/rescue')}
          >
            <div className="flex flex-col items-center gap-1">
              <ShieldAlert className="h-8 w-8" />
              <span className="text-lg font-bold">حاسس برغبة؟ اضغط هنا فوراً</span>
            </div>
          </Button>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-2xl border border-border flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-xl shrink-0">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">وفرت حتى الآن</p>
              <p className="text-base font-bold">{stats.moneySaved} ج.م</p>
            </div>
          </div>
          <div className="bg-card p-4 rounded-2xl border border-border flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-xl shrink-0">
              <Heart className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">تحسن الصحة</p>
              <p className="text-base font-bold">{stats.healthProgress}%</p>
            </div>
          </div>
        </section>

        {/* Quick Log Puff */}
        <section className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-primary/10 gap-2 px-3"
            onClick={handleLogPuff}
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <PlusCircle className="h-4 w-4" />
            </div>
            <span className="font-bold text-[10px]">سجل سحبة</span>
            <div className="text-[10px] text-muted-foreground font-mono">
              {stats.usageToday}
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-primary/20 bg-primary/5 text-primary gap-2 font-bold hover:bg-primary/10 transition-all"
            onClick={() => setIsSharing(true)}
          >
            <Share2 className="h-5 w-5" /> مشاركة إنجازك
          </Button>
        </section>

        {/* AI Insight */}
        <section className="bg-accent/10 border border-accent/20 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1 bg-accent h-full" />
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-accent mb-1">رؤية المدرب الذكي</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                "{aiInsight}"
              </p>
            </div>
          </div>
        </section>

        {/* Daily Mission */}
        {mission && (
          <section className="space-y-3 pb-8">
            <h3 className="font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> مهمة اليوم
            </h3>
            <div className="bg-card border border-border p-4 rounded-2xl flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{mission.title}</p>
                <p className="text-xs text-muted-foreground mt-1">التقدم: {mission.progress}%</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary bg-primary/10 font-bold shrink-0 text-xs">
                +{mission.points}
              </div>
            </div>
          </section>
        )}
      </main>

      <BottomNav />
      {isSharing && (
        <AchievementCard 
          stats={{
            ...stats,
            userName: session?.user?.name || 'بطل متعافي',
            userImage: session?.user?.image || '/logo.png'
          }} 
          onClose={() => setIsSharing(false)} 
        />
      )}
    </div>
  )
}
