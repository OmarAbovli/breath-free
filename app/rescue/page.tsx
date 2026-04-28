'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Wind, 
  MessageCircle, 
  Gamepad2, 
  ChevronRight, 
  Timer,
  CheckCircle2,
  X,
  Brain,
  Loader2
} from 'lucide-react'
import { logCraving, getRescueAdvice, chatWithCoach, getUserStats } from '@/lib/actions'

export default function RescueMode() {
  const router = useRouter()
  const [mode, setMode] = useState<'menu' | 'breathing' | 'chat' | 'distract'>('menu')
  const [timeLeft, setTimeLeft] = useState(390) // 6:30 in seconds
  const [breathingStep, setBreathingStep] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [breathingText, setBreathingText] = useState('شهيق...')
  
  const [showAdvice, setShowAdvice] = useState(false)
  const [selectedTrigger, setSelectedTrigger] = useState('')
  const [aiAdvice, setAiAdvice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Chat State
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Distraction State
  const [distractionNumbers, setDistractionNumbers] = useState<number[]>([])
  const [targetNumber, setTargetNumber] = useState<number>(0)

  // User Context
  const [userMotivation, setUserMotivation] = useState('')

  useEffect(() => {
    getUserStats().then(data => {
      if (data?.motivation) setUserMotivation(data.motivation)
    })
  }, [])

  const handleLogFeeling = async (feeling: string) => {
    setSelectedTrigger(feeling)
    setIsLoading(true)
    try {
      await logCraving(feeling)
      const advice = await getRescueAdvice(feeling)
      setAiAdvice(advice)
      setShowAdvice(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return
    const msg = currentMessage
    setCurrentMessage('')
    setChatHistory(prev => [...prev, { role: 'user', content: msg }])
    setIsTyping(true)
    
    try {
      const response = await chatWithCoach(msg)
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }])
    } finally {
      setIsTyping(false)
    }
  }

  const startDistractionGame = () => {
    const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100))
    setDistractionNumbers(nums)
    setTargetNumber(Math.max(...nums))
    setMode('distract')
  }

  const handleNumberClick = (num: number) => {
    if (num === targetNumber) {
      const remaining = distractionNumbers.filter(n => n !== num)
      if (remaining.length === 0) {
        startDistractionGame() // Next round
      } else {
        setDistractionNumbers(remaining)
        setTargetNumber(Math.max(...remaining))
      }
    }
  }

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Breathing logic
  useEffect(() => {
    if (mode !== 'breathing') return
    let timer: NodeJS.Timeout
    
    if (breathingStep === 'inhale') {
      setBreathingText('شهيق...')
      timer = setTimeout(() => setBreathingStep('hold'), 4000)
    } else if (breathingStep === 'hold') {
      setBreathingText('اكتم...')
      timer = setTimeout(() => setBreathingStep('exhale'), 4000)
    } else {
      setBreathingText('زفير...')
      timer = setTimeout(() => setBreathingStep('inhale'), 4000)
    }
    
    return () => clearTimeout(timer)
  }, [breathingStep, mode])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground relative overflow-hidden flex flex-col font-sans" dir="rtl">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full bg-white/5">
          <X className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <Timer className="h-4 w-4 text-destructive" />
          <span className="font-mono text-destructive font-bold">{formatTime(timeLeft)}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        {mode === 'menu' && (
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight">خد نَفَس عميق...</h1>
              <p className="text-muted-foreground">الرغبة دي مجرد موجة وهتعدي. إحنا معاك.</p>
            </div>

            <div className="grid gap-4">
              <Button 
                onClick={() => setMode('breathing')}
                className="h-20 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary justify-between px-6 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Wind className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">تمارين تنفس</p>
                    <p className="text-xs opacity-70">هدّي ضربات قلبك</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-[-4px] transition-transform" />
              </Button>

              <Button 
                onClick={() => setMode('chat')}
                className="h-20 rounded-2xl bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent justify-between px-6 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">اتكلم مع AI</p>
                    <p className="text-xs opacity-70">فرغ اللي جواك</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-[-4px] transition-transform" />
              </Button>

              <Button 
                onClick={startDistractionGame}
                className="h-20 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white justify-between px-6 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">شتت انتباهك</p>
                    <p className="text-xs opacity-70">ألعاب وتحديات سريعة</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-[-4px] transition-transform" />
              </Button>
            </div>

            {userMotivation && (
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1 h-full bg-primary" />
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">دافعك الأساسي</p>
                <p className="text-sm italic opacity-90">"{userMotivation}"</p>
              </div>
            )}

            <div className="pt-8">
              <p className="text-sm text-muted-foreground mb-4">إيه شعورك دلوقتي؟</p>
              <div className="flex justify-center gap-3">
                {['مضغوط', 'زهقان', 'وحيد'].map(feeling => (
                  <Button 
                    key={feeling} 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full bg-white/5 border-white/10 hover:bg-destructive/20"
                    onClick={() => handleLogFeeling(feeling)}
                  >
                    {feeling}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {mode === 'breathing' && (
          <div className="flex flex-col items-center gap-12 w-full max-w-md">
            <div className="relative flex items-center justify-center w-64 h-64">
              <div className={`absolute inset-0 rounded-full bg-primary/20 transition-all duration-[4000ms] ease-in-out ${
                breathingStep === 'inhale' ? 'scale-150 opacity-100' : 
                breathingStep === 'hold' ? 'scale-150 opacity-50' : 'scale-50 opacity-20'
              }`} />
              <div className={`w-32 h-32 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-[0_0_50px] shadow-primary/50 transition-transform duration-[4000ms] ${
                breathingStep === 'inhale' ? 'scale-150' : 
                breathingStep === 'hold' ? 'scale-150' : 'scale-100'
              }`}>
                {breathingText}
              </div>
            </div>
            <p className="text-xl font-medium text-center">ركز مع الدايرة... جسمك هيبدأ يهدى.</p>
            <Button variant="ghost" onClick={() => setMode('menu')} className="text-muted-foreground">رجوع</Button>
          </div>
        )}

        {mode === 'chat' && (
          <div className="w-full max-w-md flex flex-col h-[70vh] bg-card rounded-3xl border border-border overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-border bg-accent/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">مدربك الذكي</p>
                <p className="text-[10px] text-accent">متصل الآن للمساعدة</p>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="bg-accent/10 p-3 rounded-2xl rounded-tr-none max-w-[80%] self-start text-sm">
                أنا هنا عشانك. إيه اللي خلاك تحس بالرغبة دي دلوقتي؟ فضفض، أنا بسمعك.
              </div>
              {chatHistory.map((msg, i) => (
                <div key={i} className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary/20 self-end mr-auto rounded-tl-none' : 'bg-accent/10 self-start rounded-tr-none'}`}>
                  {msg.content}
                </div>
              ))}
              {isTyping && (
                <div className="bg-accent/5 p-3 rounded-2xl rounded-tr-none max-w-[80%] self-start">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <input 
                type="text" 
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب هنا..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus:outline-none focus:border-accent text-sm"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={isTyping} className="rounded-full bg-accent">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </Button>
            </div>
            <Button variant="ghost" onClick={() => setMode('menu')} className="text-muted-foreground py-2 text-[10px]">رجوع للرئيسية</Button>
          </div>
        )}

        {mode === 'distract' && (
          <div className="text-center space-y-8 w-full max-w-sm">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto animate-bounce">
              <Gamepad2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">تشتيت الانتباه</h2>
              <p className="text-muted-foreground text-sm">اضغط على الرقم <span className="text-primary font-bold text-lg">{targetNumber}</span> بسرعة!</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {distractionNumbers.map((num, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  onClick={() => handleNumberClick(num)}
                  className={`h-24 rounded-2xl border-white/10 bg-white/5 text-2xl font-bold transition-all ${num === targetNumber ? 'border-primary ring-2 ring-primary/20' : ''}`}
                >
                  {num}
                </Button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => setMode('menu')} className="text-muted-foreground">استسلام ورجوع</Button>
          </div>
        )}
      </main>

      {/* AI Support Dialog */}
      {showAdvice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border p-8 rounded-[40px] max-w-sm w-full space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                <Brain className="h-7 w-7" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAdvice(false)} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold">نصيحة سريعة لـ {selectedTrigger}</h3>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                "{aiAdvice}"
              </p>
            </div>

            <Button 
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
              onClick={() => setShowAdvice(false)}
            >
              فهمت، شكراً يا رفيق
            </Button>
          </div>
        </div>
      )}

      {/* Success Popup (Later) */}
      {timeLeft === 0 && (
        <div className="absolute inset-0 bg-background/90 z-50 flex items-center justify-center p-6 text-center">
          <div className="bg-card p-8 rounded-[40px] border border-primary/20 space-y-6 max-w-sm">
            <CheckCircle2 className="h-20 w-20 text-primary mx-auto" />
            <div className="space-y-2">
              <h2 className="text-3xl font-black">أنت كسبت الجولة دي! 🔥</h2>
              <p className="text-muted-foreground">الرغبة انتهت، وجسمك دلوقتي أقوى. فخور بيك جداً.</p>
            </div>
            <Button onClick={() => router.push('/')} className="w-full h-14 rounded-2xl text-lg font-bold">رجوع للرئيسية</Button>
          </div>
        </div>
      )}
    </div>
  )
}
