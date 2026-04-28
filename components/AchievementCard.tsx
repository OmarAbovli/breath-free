'use client'

import React, { useRef } from 'react'
import { 
  Flame, 
  TrendingUp, 
  Wallet, 
  Heart, 
  Trophy, 
  Download,
  Share2,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toPng } from 'html-to-image'

interface AchievementCardProps {
  stats: {
    streakDays: number
    moneySaved: number
    healthProgress: number
    rank: number
    userName: string
    userImage: string
    level: number
  }
  onClose: () => void
}

export function AchievementCard({ stats, onClose }: AchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (cardRef.current === null) return
    
    try {
      // Small delay to ensure all assets are loaded
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2, // High definition
        width: 400,    // Explicit width for capture
        height: 711,   // Explicit height (9:16 ratio)
        style: {
          transform: 'scale(1)',
          borderRadius: '40px'
        }
      })
      
      const link = document.createElement('a')
      link.download = `breathe-free-achievement-${stats.streakDays}-days.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error generating image', err)
    }
  }

  const handleShare = async () => {
    if (cardRef.current === null) return
    
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2,
        width: 400,
        height: 711
      })
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'achievement.png', { type: 'image/png' })
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'إنجاز جديد في رحلة التعافي!',
          text: `أنا بقالي ${stats.streakDays} يوم من غير فيب ووفرت ${stats.moneySaved} جنيه! حمل تطبيق Breathe Free وابدأ رحلتك.`,
        })
      }
    } catch (err) {
      console.error('Error sharing', err)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm">
        {/* Actions Above */}
        <div className="flex justify-between items-center mb-4 px-2">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-white/10 text-white">
            <X className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleDownload} className="bg-white text-black rounded-full gap-2 font-bold">
              <Download className="h-4 w-4" /> حفظ
            </Button>
            <Button onClick={handleShare} variant="outline" className="rounded-full border-white/20 text-white gap-2 font-bold">
              <Share2 className="h-4 w-4" /> مشاركة
            </Button>
          </div>
        </div>

        {/* The Card */}
        <div 
          ref={cardRef}
          className="aspect-[9/16] w-full max-w-[400px] mx-auto bg-[#050505] rounded-[40px] overflow-hidden relative border border-white/10 shadow-2xl"
          dir="rtl"
        >
          {/* Animated Background Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[40%] bg-primary/30 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[40%] bg-accent/20 blur-[100px] rounded-full animate-pulse delay-700" />
          
          <div className="relative h-full flex flex-col p-8 z-10">
            {/* User Profile */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 rounded-2xl border-2 border-white/20 p-1 bg-white/5 overflow-hidden">
                <img src={stats.userImage || '/logo.png'} alt="User" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="text-right">
                <h3 className="text-xl font-black text-white">{stats.userName}</h3>
                <p className="text-xs text-primary font-bold uppercase tracking-widest">Level {stats.level} Warrior</p>
              </div>
            </div>

            {/* Main Achievement */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-[60px] opacity-40 animate-pulse" />
                <Flame className="w-24 h-24 text-primary relative z-10 filter drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em]">Streak</p>
                <h1 className="text-8xl font-black italic tracking-tighter text-white">
                  {stats.streakDays}
                </h1>
                <p className="text-2xl font-bold text-white/90">يوم من التعافي</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-12 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-4 text-right space-y-1 backdrop-blur-sm">
                <Wallet className="w-5 h-5 text-green-500 mb-1" />
                <p className="text-[10px] text-muted-foreground font-bold">فلوس وفرتها</p>
                <p className="text-xl font-black text-white">{stats.moneySaved} <span className="text-[10px]">EGP</span></p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-4 text-right space-y-1 backdrop-blur-sm">
                <Heart className="w-5 h-5 text-red-500 mb-1" />
                <p className="text-[10px] text-muted-foreground font-bold">تحسن الصحة</p>
                <p className="text-xl font-black text-white">{stats.healthProgress}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-4 text-right space-y-1 backdrop-blur-sm">
                <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
                <p className="text-[10px] text-muted-foreground font-bold">الترتيب العالمي</p>
                <p className="text-xl font-black text-white">#{stats.rank}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-4 text-right space-y-1 backdrop-blur-sm flex flex-col justify-center items-center">
                 <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <p className="text-[8px] font-bold">Breathe Free</p>
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-6 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="w-4 h-4" />
                </div>
                <p className="text-sm font-black italic tracking-tighter text-white">Breathe Free</p>
              </div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest text-center">
                Download the app and start your journey today
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
