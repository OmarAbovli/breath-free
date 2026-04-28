'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Flame, 
  TrendingUp, 
  Brain, 
  Users,
  Trophy
} from 'lucide-react'

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { label: 'الرئيسية', icon: Flame, path: '/', color: 'text-primary' },
    { label: 'التحليل', icon: TrendingUp, path: '/analytics', color: 'text-accent' },
    { label: 'المدرب', icon: Brain, path: '/coach', color: 'text-accent' },
    { label: 'المجتمع', icon: Users, path: '/community', color: 'text-primary' },
    { label: 'الأبطال', icon: Trophy, path: '/leaderboard', color: 'text-yellow-500' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-background/80 backdrop-blur-xl border-t border-border z-40">
      <div className="max-w-md mx-auto flex justify-between items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          
          return (
            <Button 
              key={item.path}
              variant="ghost" 
              size="sm" 
              className={`flex flex-col items-center gap-1 h-auto py-2 px-1 flex-1 ${isActive ? item.color : 'text-muted-foreground'}`}
              onClick={() => router.push(item.path)}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-[9px] font-bold">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
