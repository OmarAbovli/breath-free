'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, CheckCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-2">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Quit Vape</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">الرئيسية</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">ابدأ الآن</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Section */}
        <section className="space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">عن Quit Vape</h1>
            <p className="text-xl text-muted-foreground">
              نحن هنا لمساعدتك على الإقلاع عن الفيبينج بطريقة علمية وداعمة وشخصية.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <p className="text-foreground mb-4">
                Quit Vape هو تطبيق متكامل مصمم لدعم رحلتك نحو الإقلاع عن التدخين الإلكتروني. 
                نجمع بين قوة الذكاء الاصطناعي، وتتبع التقدم، والدعم المجتمعي لخلق تجربة شاملة لمساعدتك.
              </p>
              <p className="text-foreground">
                من لحظة دخولك إلى التطبيق إلى يوم احتفالك بأسبوعك الأول، نحن هنا معك في كل خطوة.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Mission Section */}
        <section className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold">مهمتنا</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  دعم فوري
                </CardTitle>
              </CardHeader>
              <CardContent>
                توفير دعم فوري وشخصي عند الحاجة، 24/7، من خلال مدرب ذكي يفهم احتياجاتك.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  تتبع النجاح
                </CardTitle>
              </CardHeader>
              <CardContent>
                تتبع كل يوم من نجاحك، وحساب الأموال التي توفرها، والاحتفال بكل إنجاز.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  مجتمع داعم
                </CardTitle>
              </CardHeader>
              <CardContent>
                الانضمام إلى مجتمع من الأشخاص الذين يسيرون نفس الرحلة ويفهمون التحديات.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  رؤى ذكية
                </CardTitle>
              </CardHeader>
              <CardContent>
                تحليل أنماطك والحصول على رؤى شخصية تساعدك على فهم أسباب رغباتك.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold">المميزات الأساسية</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">لوحة تحكم شاملة</h3>
                <p className="text-muted-foreground">
                  عرض شامل لتقدمك مع إحصائيات مفصلة عن الأيام والأموال والإحصائيات الصحية.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">نمط الإنقاذ الطارئ</h3>
                <p className="text-muted-foreground">
                  عند الشعور برغبة شديدة، يمكنك تفعيل نمط الإنقاذ للحصول على تمارين تنفس وتشتيت فوري.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">مدرب ذكي متخصص</h3>
                <p className="text-muted-foreground">
                  تحدث مع مدرب ذكي يتذكر محادثاتك السابقة ويقدم نصائح مخصصة لك.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">تسجيل الرغبات</h3>
                <p className="text-muted-foreground">
                  سجل كل رغبة تشعر بها مع معلومات عن السبب والموقع والشدة.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">تحليل الأنماط</h3>
                <p className="text-muted-foreground">
                  فهم أنماطك من خلال تحليل بيانات رغباتك والعوامل التي تؤثر عليها.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">مجتمع نشط</h3>
                <p className="text-muted-foreground">
                  شارك قصتك، تعلم من تجارب الآخرين، واحصل على الدعم والتشجيع من مجتمع حقيقي.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 py-16 border-t border-border">
          <h2 className="text-3xl font-bold">هل أنت مستعد لتغيير حياتك؟</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            انضم إلى آلاف الأشخاص الذين تحرروا من إدمان الفيبينج. أول خطوة هي الأهم.
          </p>
          <Button
            size="lg"
            asChild
          >
            <Link href="/auth/signup">ابدأ رحلتك الآن</Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
