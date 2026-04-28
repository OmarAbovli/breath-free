'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingDown, 
  AlertTriangle, 
  Brain,
  Calendar,
  ChevronLeft
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { getUsageHistory, getTriggerData, getHealthStats, getHealthRoadmap } from '@/lib/actions'
import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/BottomNav'
import { 
  Heart, 
  Wind, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Trophy,
  CheckCircle2,
  Lock
} from 'lucide-react'

export default function AnalyticsPage() {
  const router = useRouter()
  const [usageData, setUsageData] = useState<{day: string, usage: number}[]>([])
  const [triggerData, setTriggerData] = useState<{name: string, value: number, color: string, resolvedCount: number}[]>([])
  const [healthStats, setHealthStats] = useState<{name: string, value: number}[]>([])
  const [roadmap, setRoadmap] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  const { getUserStats } = require('@/lib/actions')

  useEffect(() => {
    getUsageHistory().then(data => { if (data) setUsageData(data) })
    getTriggerData().then(data => { if (data) setTriggerData(data) })
    getHealthStats().then(data => { if (data) setHealthStats(data) })
    getHealthRoadmap().then(data => { if (data) setRoadmap(data) })
    getUserStats().then(setStats)
  }, [])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="h-5 w-5" />
      case 'Wind': return <Wind className="h-5 w-5" />
      case 'Zap': return <Zap className="h-5 w-5" />
      case 'Activity': return <Activity className="h-5 w-5" />
      case 'ShieldCheck': return <ShieldCheck className="h-5 w-5" />
      case 'Sparkles': return <Sparkles className="h-5 w-5" />
      case 'Trophy': return <Trophy className="h-5 w-5" />
      default: return <CheckCircle2 className="h-5 w-5" />
    }
  }

  const calculateChange = () => {
    if (usageData.length < 2) return { percent: 0, improved: true }
    const last = usageData[usageData.length - 1].usage
    const prev = usageData[usageData.length - 2].usage
    if (prev === 0) return { percent: last > 0 ? 100 : 0, improved: last === 0 }
    const diff = ((last - prev) / prev) * 100
    return { percent: Math.abs(Math.round(diff)), improved: diff <= 0 }
  }

  const change = calculateChange()
  const cravingProb = stats ? Math.min(Math.round((stats.usageToday / 10) * 100), 95) : 0

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-sans" dir="rtl">
      {/* Header */}
      <header className="p-6 pt-12 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">تحليل سلوكك</h1>
      </header>

      <main className="px-6 space-y-8">
        {/* Usage Patterns Chart */}
        <section className="bg-card rounded-3xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-bold">أنماط الاستخدام (آخر 7 أيام)</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="usage" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className={`h-4 w-4 ${change.improved ? 'text-green-500' : 'text-destructive rotate-180'}`} />
              <span className={change.improved ? 'text-green-500' : 'text-destructive'}>
                {change.improved ? 'انخفاض' : 'زيادة'} بنسبة {change.percent}%
              </span>
            </div>
            <span className="text-muted-foreground">عن الأسبوع الماضي</span>
          </div>
        </section>

        {/* Trigger Analysis */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border p-6 rounded-[32px] space-y-6">
            <h3 className="font-bold text-sm">أسباب الرغبة (Triggers)</h3>
            <div className="h-[240px] w-full">
              {triggerData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={triggerData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {triggerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                  <p className="text-xs">لا توجد بيانات محفزات بعد.<br/>ابدأ بتسجيل شعورك في نمط الإنقاذ.</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {triggerData.map((entry: any) => (
                <div key={entry.name} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs font-bold">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-primary">نسبة النجاح {Math.round((entry.resolvedCount / entry.value) * 100)}%</div>
                    <div className="text-[9px] text-muted-foreground">{entry.value} مرات رغبة</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-3xl p-6 border border-border flex flex-col justify-center space-y-4">
            <div className="bg-accent/10 p-4 rounded-2xl border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-accent">توقعات الذكاء الاصطناعي</h3>
              </div>
              <p className="text-sm leading-relaxed">
                بناءً على بياناتك، احتمال شعورك برغبة (Craving) قريباً هو <span className="text-accent font-bold">{cravingProb}%</span>.
              </p>
            </div>
            <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-primary">نصيحة الأسبوع</h3>
              </div>
              <p className="text-sm leading-relaxed">
                {triggerData.length > 0 ? `${triggerData[0].name} هو المحفز الرئيسي ليك. جرب تملأ وقت فراغك بممارسة رياضة خفيفة.` : 'ابدأ بتسجيل بياناتك لأعطيك نصائح مخصصة لمواجهة المحفزات.'}
              </p>
            </div>
          </div>
        </section>

        {/* Health Progress */}
        <section className="bg-card border border-border p-6 rounded-[32px] space-y-6">
          <h3 className="font-bold text-sm">تحسن صحتك</h3>
          <div className="space-y-6">
            {healthStats.length > 0 ? healthStats.map((stat) => (
              <div key={stat.name} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-muted-foreground">{stat.name}</span>
                  <span className="text-primary">{stat.value}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-center text-xs text-muted-foreground py-4">سجل تقدمك لتظهر إحصائياتك الصحية هنا.</p>
            )}
          </div>
        </section>

        {/* Health Roadmap */}
        <section className="space-y-4 pb-8">
          <h3 className="font-bold text-sm px-2">خارطة طريق التعافي</h3>
          <div className="space-y-4 relative">
            <div className="absolute top-0 right-7 w-0.5 h-full bg-border -z-10" />
            
            {roadmap.map((item, idx) => (
              <div key={idx} className={`flex items-start gap-4 transition-opacity ${item.achieved ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-4 border-background z-10 ${item.achieved ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                  {item.achieved ? getIcon(item.icon) : <Lock className="h-5 w-5" />}
                </div>
                <div className="bg-card border border-border p-4 rounded-2xl flex-1 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full font-mono">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  )
}
