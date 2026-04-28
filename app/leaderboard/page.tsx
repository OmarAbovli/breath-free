'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  Crown, 
  Medal, 
  ChevronLeft, 
  TrendingUp, 
  Zap,
  Star,
  Flame
} from 'lucide-react'
import { getLeaderboard } from '@/lib/actions'
import { BottomNav } from '@/components/BottomNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function LeaderboardPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard().then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const top3 = data?.topUsers?.slice(0, 3) || []
  const others = data?.topUsers?.slice(3) || []

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 font-sans overflow-hidden" dir="rtl">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="p-6 pt-12 flex items-center justify-between relative z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full bg-white/5">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" /> لوحة الأبطال
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="px-4 sm:px-6 relative z-10">
        {/* Podium */}
        <div className="flex items-end justify-center gap-1 sm:gap-4 mt-12 mb-12 h-[240px] sm:h-[300px]">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="flex flex-col items-center gap-2 w-1/3 max-w-[100px]">
              <div className="relative">
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-slate-400 shadow-[0_0_20px_rgba(148,163,184,0.3)]">
                  <AvatarImage src={top3[1].image || ''} />
                  <AvatarFallback>{top3[1].name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-1 bg-slate-400 text-slate-950 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full rotate-12">
                  2
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-[10px] sm:text-xs truncate w-full">{top3[1].name}</p>
                <p className="text-[8px] sm:text-[10px] text-muted-foreground">LVL {top3[1].level}</p>
              </div>
              <div className="w-full h-20 sm:h-28 bg-gradient-to-t from-slate-400/20 to-slate-400/5 rounded-t-2xl border-t border-slate-400/30 flex items-center justify-center">
                <Medal className="h-5 w-5 sm:h-7 sm:w-7 text-slate-400 opacity-50" />
              </div>
            </div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <div className="flex flex-col items-center gap-2 w-1/3 max-w-[120px] mb-4 scale-110">
              <div className="relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
                  <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 fill-yellow-500" />
                </div>
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                  <AvatarImage src={top3[0].image || ''} />
                  <AvatarFallback>{top3[0].name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-950 text-[10px] sm:text-[12px] font-black px-2 sm:px-3 py-0.5 rounded-full whitespace-nowrap z-20">
                  البطل
                </div>
              </div>
              <div className="text-center">
                <p className="font-black text-[11px] sm:text-sm truncate w-full">{top3[0].name}</p>
                <p className="text-[8px] sm:text-[10px] text-yellow-500 font-bold">LVL {top3[0].level}</p>
              </div>
              <div className="w-full h-28 sm:h-36 bg-gradient-to-t from-yellow-500/30 to-yellow-500/5 rounded-t-3xl border-t border-yellow-500/40 flex items-center justify-center">
                <Trophy className="h-7 w-7 sm:h-9 sm:w-9 text-yellow-500" />
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="flex flex-col items-center gap-2 w-1/3 max-w-[100px]">
              <div className="relative">
                <Avatar className="w-10 h-10 sm:w-14 sm:h-14 border-2 border-amber-700 shadow-[0_0_20px_rgba(180,83,9,0.3)]">
                  <AvatarImage src={top3[2].image || ''} />
                  <AvatarFallback>{top3[2].name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 bg-amber-700 text-amber-50 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full -rotate-12">
                  3
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-[10px] sm:text-xs truncate w-full">{top3[2].name}</p>
                <p className="text-[8px] sm:text-[10px] text-muted-foreground">LVL {top3[2].level}</p>
              </div>
              <div className="w-full h-16 sm:h-24 bg-gradient-to-t from-amber-700/20 to-amber-700/5 rounded-t-2xl border-t border-amber-700/30 flex items-center justify-center">
                <Medal className="h-4 w-4 sm:h-6 sm:w-6 text-amber-700 opacity-50" />
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div className="space-y-3">
          {others.map((user: any, idx: number) => (
            <div 
              key={user.id} 
              className={`flex items-center gap-4 p-4 rounded-[24px] border transition-all ${
                user.id === data.currentUserId 
                ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]' 
                : 'bg-white/5 border-white/10'
              }`}
            >
              <span className="w-6 text-center font-black text-sm text-muted-foreground">
                {idx + 4}
              </span>
              <Avatar className="w-10 h-10 border border-white/10">
                <AvatarImage src={user.image || ''} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">{user.name}</p>
                  {user.streak > 7 && <Flame className="h-3 w-3 text-orange-500 fill-orange-500" />}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" /> {user.xp} XP
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 text-primary fill-primary" /> مستوى {user.level}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-black ${idx === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                   {user.streak} يوم
                </div>
                <div className="text-[9px] opacity-50 uppercase tracking-widest">تعافي</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* User Status Bar */}
      {data.userRank > 20 && (
        <div className="fixed bottom-24 left-6 right-6 z-20">
          <div className="bg-primary p-4 rounded-[28px] shadow-2xl flex items-center justify-between border-t-4 border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black">
                {data.userRank}
              </div>
              <div>
                <p className="font-bold text-sm">ترتيبك الحالي</p>
                <p className="text-[10px] opacity-80">أنت تتفوق على 65% من المستخدمين</p>
              </div>
            </div>
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
