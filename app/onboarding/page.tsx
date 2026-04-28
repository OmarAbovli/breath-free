'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Leaf, Heart, Sparkles, Target, Zap } from 'lucide-react'
import { completeOnboarding } from '@/lib/onboarding-actions'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [addictionLevel, setAddictionLevel] = useState(5)
  const [dailySpend, setDailySpend] = useState(100)
  const [aiPersonality, setAiPersonality] = useState('supportive')
  const [motivation, setMotivation] = useState('')
  const [loading, setLoading] = useState(false)

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const result = await completeOnboarding({
        addictionLevel,
        aiPersonality,
        motivation,
        dailySpend
      })
      
      if (result.success) {
        toast.success('تم إعداد ملفك بنجاح!')
        router.push('/')
      }
    } catch (err) {
      console.error('Onboarding error:', err)
      toast.error('حدث خطأ أثناء حفظ البيانات')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 font-sans" dir="rtl">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-primary/10 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-xl space-y-8 relative z-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative rounded-3xl bg-[#000] border border-white/10 p-2 shadow-2xl overflow-hidden">
              <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain scale-125" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight">أهلاً بك في Breathe Free</h1>
            <p className="text-muted-foreground">لنقم بإعداد رفيقك الذكي لرحلة تنفس بحرية</p>
          </div>
        </div>

        <Card className="border-white/10 bg-card/50 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl">
          <div className="h-1.5 w-full bg-white/5">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          
          <CardHeader className="pt-8 text-right">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">الخطوة {step} من 4</span>
            </div>
            <CardTitle className="text-xl">
              {step === 1 && 'ما هي عاداتك مع الفيب؟'}
              {step === 2 && 'تكلفة الفيب اليومية'}
              {step === 3 && 'اختر شخصية مدربك الذكي'}
              {step === 4 && 'لماذا تريد الإقلاع؟'}
            </CardTitle>
            <CardDescription className="text-muted-foreground/70">
              {step === 1 && 'صدقك يساعدنا على تقديم الدعم المناسب لك.'}
              {step === 2 && 'هذا سيساعدنا في حساب كم ستوفر من المال.'}
              {step === 3 && 'هذا سيحدد كيف سيتفاعل معك "رفيق" طوال الرحلة.'}
              {step === 4 && 'هذا سيكون دافعك الأساسي في اللحظات الصعبة.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 pb-8">
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <Label htmlFor="addiction" className="text-base font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> ما مدى شعورك بالإدمان؟
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[addictionLevel]}
                        onValueChange={(val) => setAddictionLevel(val[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl font-black text-primary">
                        {addictionLevel}
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground px-1 font-bold">
                      <span>خفيف جداً</span>
                      <span>متعلق جداً</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3">
                  <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed opacity-80">
                    لا يوجد حكم هنا. كلما كنت صادقاً، كان "رفيق" أكثر قدرة على مساعدتك في اللحظات الحرجة.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> كم تنفق يومياً على الفيب؟
                  </Label>
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <input 
                        type="number"
                        value={dailySpend}
                        onChange={(e) => setDailySpend(parseInt(e.target.value) || 0)}
                        className="w-32 h-16 bg-white/5 border border-white/10 rounded-3xl text-center text-3xl font-black focus:border-primary outline-none text-white"
                      />
                      <span className="text-xl font-bold text-muted-foreground">ج.م</span>
                    </div>
                    <p className="text-xs text-muted-foreground">متوسط تكلفة "بود" أو "ليكويد" مقسومة على الأيام.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <RadioGroup value={aiPersonality} onValueChange={setAiPersonality} className="grid gap-3">
                  {[
                    { id: 'supportive', title: 'داعم ولطيف', desc: 'مشجع، هادئ، ولا يطلق الأحكام.', icon: <Heart className="w-5 h-5" /> },
                    { id: 'direct', title: 'مباشر وعملي', desc: 'يركز على الحلول والأفعال فوراً.', icon: <Target className="w-5 h-5" /> },
                    { id: 'motivational', title: 'حماسي وطموح', desc: 'يحتفل بكل نجاح ويدفعك للأفضل.', icon: <Sparkles className="w-5 h-5" /> },
                  ].map((p) => (
                    <Label 
                      key={p.id}
                      htmlFor={p.id} 
                      className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                        aiPersonality === p.id ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <RadioGroupItem value={p.id} id={p.id} className="sr-only" />
                      <div className={`p-3 rounded-xl ${aiPersonality === p.id ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground'}`}>
                        {p.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{p.title}</p>
                        <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="motivation" className="text-base font-bold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> اكتب دافعك الشخصي
                  </Label>
                  <Textarea
                    id="motivation"
                    placeholder="مثلاً: أريد استعادة صحتي، توفير المال، أو لأجل عائلتي..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    rows={5}
                    className="resize-none bg-white/5 border-white/10 rounded-2xl focus:border-primary focus:ring-primary/20 p-4 text-sm"
                  />
                </div>

                <div className="bg-accent/5 border border-accent/10 rounded-2xl p-4">
                  <p className="text-xs text-center opacity-70 italic">
                    "هذا الكلام سيظهر لك في لحظات الضعف ليذكرك لماذا بدأت."
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || loading}
            className="flex-1 h-14 rounded-2xl border border-white/5 hover:bg-white/5"
          >
            السابق
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={loading || (step === 4 && !motivation)}
            className="flex-[2] h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (step === 4 ? 'ابدأ رحلتي الآن' : 'المتابعة')}
          </Button>
        </div>
      </div>
    </div>
  )
}
