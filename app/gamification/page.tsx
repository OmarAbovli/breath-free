'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  Trophy, 
  Medal, 
  Star, 
  Lock, 
  CheckCircle2,
  Zap,
  ShieldCheck,
  Crown,
  Sparkles
} from 'lucide-react'

import { BottomNav } from '@/components/BottomNav'

import { getCommunityPosts, getUserStats, getAchievements } from '@/lib/actions'
import { useState, useEffect } from 'react'

export default function GamificationPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])

  useEffect(() => {
    getUserStats().then(setStats)
    getAchievements().then(setAchievements)
  }, [])

  if (!stats) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const getIcon = (iconName: string) => {
    const name = iconName.toLowerCase().replace('-', '')
    switch (name) {
      case 'zap': return <Zap className="h-6 w-6" />
      case 'shieldcheck': return <ShieldCheck className="h-6 w-6" />
      case 'medal': return <Medal className="h-6 w-6" />
      case 'crown': return <Crown className="h-6 w-6" />
      default: return <Trophy className="h-6 w-6" />
    }
  }

  const getColor = (iconName: string) => {
    const name = iconName.toLowerCase().replace('-', '')
    switch (name) {
      case 'zap': return 'text-yellow-500'
      case 'shieldcheck': return 'text-blue-500'
      case 'medal': return 'text-green-500'
      case 'crown': return 'text-purple-500'
      default: return 'text-primary'
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-sans" dir="rtl">
      {/* Header */}
      <header className="p-6 pt-12 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">الإنجازات والمستوى</h1>
      </header>

      <main className="px-6 space-y-8">
        {/* Level Card */}
        <section className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-[40px] p-8 border border-white/10 relative overflow-hidden text-center">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-[80px]" />
          
          <div className="relative z-10 space-y-4">
            <div className="w-24 h-24 bg-card rounded-full border-4 border-primary flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Fighter</h2>
              <p className="text-sm text-muted-foreground font-medium">المستوى {stats.level}</p>
            </div>
            
            <div className="space-y-2">
              <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-1000" 
                  style={{ width: `${stats.xp % 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold opacity-70">
                <span>XP {stats.xp}</span>
                <span>باقي {100 - (stats.xp % 100)} XP للمستوى القادم</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid remains same */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border p-3 rounded-2xl text-center space-y-1">
            <p className="text-xs text-muted-foreground">أوسمة</p>
            <p className="text-xl font-black">{achievements.filter(a => a.status === 'unlocked').length}</p>
          </div>
          <div className="bg-card border border-border p-3 rounded-2xl text-center space-y-1">
            <p className="text-xs text-muted-foreground">نقاط</p>
            <p className="text-xl font-black">{stats.points}</p>
          </div>
          <div className="bg-card border border-border p-3 rounded-2xl text-center space-y-1">
            <p className="text-xs text-muted-foreground">ترتيب</p>
            <p className="text-xl font-black">#{stats.rank}</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold flex items-center gap-2 px-2">
            <Medal className="h-5 w-5 text-primary" /> الإنجازات والميداليات
          </h3>
          
          <div className="grid gap-3">
            {achievements.length > 0 ? achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`group p-4 rounded-[32px] border transition-all duration-500 ${
                  achievement.status === 'unlocked' 
                    ? 'bg-card border-white/10 shadow-lg shadow-primary/5' 
                    : 'bg-white/5 border-white/5 opacity-50 grayscale'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${getColor(achievement.icon || achievement.id)}`}>
                    {achievement.status === 'locked' ? <Lock className="h-5 w-5 text-muted-foreground" /> : getIcon(achievement.icon || achievement.id)}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm">{achievement.title}</h4>
                      {achievement.status === 'unlocked' && <CheckCircle2 className="h-4 w-4 text-primary fill-primary/10" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{achievement.description}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-xs text-muted-foreground py-10">لا توجد إنجازات بعد.</p>
            )}
          </div>
        </section>

        {/* Rewards Section */}
        <section className="bg-primary/5 border border-primary/10 rounded-[40px] p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -mr-16 -mt-16" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-primary/20" />
              <h3 className="font-bold">خارطة المكافآت</h3>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Level Rewards</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { lvl: 5, title: 'الثيم الذهبي', desc: 'مظهر حصري للتطبيق', icon: <Sparkles className="w-5 h-5" /> },
              { lvl: 10, title: 'وسام الأسطورة', desc: 'يظهر بجانب اسمك', icon: <Crown className="w-5 h-5" /> },
              { lvl: 15, title: 'دعم VIP', desc: 'دردشة غير محدودة', icon: <Zap className="w-5 h-5" /> },
              { lvl: 20, title: 'خبير التعافي', desc: 'لقب شرفي عالمي', icon: <Trophy className="h-5 w-5" /> },
            ].map((reward) => {
              const isLocked = stats.level < reward.lvl
              return (
                <div 
                  key={reward.lvl} 
                  className={`p-4 rounded-3xl border flex flex-col items-center text-center gap-2 transition-all ${
                    isLocked ? 'bg-white/5 border-white/5 opacity-50' : 'bg-card border-primary/30 shadow-xl shadow-primary/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLocked ? 'bg-white/5 text-muted-foreground' : 'bg-primary/20 text-primary'}`}>
                    {isLocked ? <Lock className="h-5 w-5" /> : reward.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">{reward.title}</p>
                    <p className="text-[9px] text-muted-foreground">مستوى {reward.lvl}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  )
}
