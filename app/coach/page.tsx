'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  Send, 
  Sparkles, 
  Brain,
  User,
  Settings2,
  Mic,
  Heart,
  ShieldAlert
} from 'lucide-react'

import { BottomNav } from '@/components/BottomNav'

import { chatWithCoach, clearChatHistory, getUserStats, updateUserSettings } from '@/lib/actions'

interface Message {
  id: string
  text: string
  sender: 'ai' | 'user'
  time: string
}

export default function AICoachPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'أهلاً بك! أنا مدربك الشخصي. أنا هنا عشان أسمعك، أشجعك، وأساعدك تتخطى أي لحظة صعبة. تحب نتكلم في إيه النهاردة؟',
      sender: 'ai',
      time: '10:00 AM'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [persona, setPersona] = useState<'supportive' | 'strict' | 'zen'>('supportive')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    getUserStats().then(data => {
      if (data?.aiPersonality) {
        setPersona(data.aiPersonality as any)
      }
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handlePersonaChange = async (p: 'supportive' | 'strict' | 'zen') => {
    setPersona(p)
    setIsSettingsOpen(false)
    await updateUserSettings({ aiPersonality: p })
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, newMessage])
    setInputText('')
    setIsTyping(true)

    try {
      const response = await chatWithCoach(inputText, persona)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (err) {
      console.error(err)
    } finally {
      setIsTyping(false)
    }
  }

  const handleClearHistory = async () => {
    if (confirm('هل أنت متأكد من مسح كافة المحادثات؟')) {
      await clearChatHistory()
      setMessages([{
        id: '1',
        text: 'تم مسح السجل. أنا هنا من جديد، تحب نتكلم في إيه؟',
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setIsSettingsOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative" dir="rtl">
      {/* Settings Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-[80%] max-w-sm bg-card h-full p-8 shadow-2xl animate-in slide-in-from-left-full">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold">إعدادات المدرب</h2>
              <Button variant="ghost" onClick={() => setIsSettingsOpen(false)}>إغلاق</Button>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">شخصية المدرب</p>
                <div className="grid gap-2">
                  {[
                    { id: 'supportive', name: 'الداعم', desc: 'لطيف ومحفز إيجابي', icon: <Heart className="w-4 h-4" /> },
                    { id: 'strict', name: 'الصارم', desc: 'واقعي ولا يقبل الأعذار', icon: <ShieldAlert className="w-4 h-4" /> },
                    { id: 'zen', name: 'الهادئ', desc: 'يركز على التأمل والسلام', icon: <Sparkles className="w-4 h-4" /> },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePersonaChange(p.id as any)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border text-right transition-all ${
                        persona === p.id ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${persona === p.id ? 'bg-primary text-primary-foreground' : 'bg-white/5'}`}>
                        {p.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-[10px] opacity-60">{p.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <Button 
                  variant="destructive" 
                  className="w-full h-12 rounded-2xl gap-2"
                  onClick={handleClearHistory}
                >
                  مسح كافة المحادثات
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="p-6 pt-12 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground shadow-lg shadow-accent/20">
              <Brain className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
          </div>
          <div>
            <h1 className="font-bold">مدربك الذكي</h1>
            <p className="text-[10px] text-green-500 font-medium">{persona === 'supportive' ? 'صديق داعم' : persona === 'strict' ? 'مدرب صارم' : 'حكيم هادئ'}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSettingsOpen(true)}
          className="rounded-full text-muted-foreground"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                msg.sender === 'user' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
              }`}>
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </div>
              <div className={`space-y-1 ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-card border border-border rounded-tr-none' 
                    : 'bg-accent text-accent-foreground rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed selectable">{msg.text}</p>
                </div>
                <p className="text-[10px] text-muted-foreground px-1">{msg.time}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-row-reverse gap-3 max-w-[85%] items-end">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-6 bg-card/50 backdrop-blur-md border-t border-border pb-24">
        <div className="max-w-4xl mx-auto flex gap-2">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب رسالتك هنا..." 
              className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm pr-4"
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="w-14 h-14 rounded-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all shrink-0"
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </footer>
      <BottomNav />
    </div>
  )
}
