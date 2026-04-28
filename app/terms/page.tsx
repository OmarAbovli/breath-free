'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'

export default function TermsPage() {
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
          <Button variant="ghost" asChild>
            <Link href="/">الرئيسية</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">شروط الخدمة</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">قبول الشروط</h2>
            <p>
              باستخدامك لتطبيق Quit Vape، فإنك توافق على هذه الشروط. إذا كنت لا توافق على أي منها، يرجى عدم استخدام التطبيق.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">استخدام الخدمة</h2>
            <p>أنت توافق على:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>استخدام التطبيق فقط للأغراض المقصودة</li>
              <li>عدم استخدام التطبيق بأي طريقة غير قانونية</li>
              <li>عدم محاولة الوصول إلى أنظمتنا بطرق غير مصرح بها</li>
              <li>عدم نقل أو بيع حسابك لشخص آخر</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">حساب المستخدم</h2>
            <p>
              أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك. أنت توافق على إخطارنا فوراً بأي استخدام غير مصرح به لحسابك.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">تنصل من المسؤولية</h2>
            <p>
              Quit Vape يوفر الخدمة "كما هي". نحن لا نضمن أن التطبيق سيلبي احتياجاتك أو أنه خالي من الأخطاء.
            </p>
            <p>
              التطبيق ليس بديلاً عن المشورة الطبية. يرجى استشارة متخصص صحي إذا كنت بحاجة إلى مساعدة مهنية.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">حدود المسؤولية</h2>
            <p>
              لن نكون مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة الناشئة عن استخدامك للتطبيق.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">المحتوى</h2>
            <p>
              أنت مالك المحتوى الذي تقدمه. بتقديمك للمحتوى، تمنح Quit Vape ترخيصاً لاستخدامه وتحسينه.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">المجتمع</h2>
            <p>
              لا يجب عليك نشر محتوى مسيء أو غير قانوني أو ينتهك حقوق الآخرين. نحن نحتفظ بالحق في حذف أي محتوى ننتقده.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">الإنهاء</h2>
            <p>
              نحتفظ بالحق في إنهاء حسابك إذا انتهكت هذه الشروط. يمكنك حذف حسابك في أي وقت.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">التعديلات</h2>
            <p>
              قد نعدل هذه الشروط من وقت لآخر. سيتم نشر الشروط المحدثة على التطبيق.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">اتصل بنا</h2>
            <p>
              إذا كان لديك أسئلة حول هذه الشروط، يرجى الاتصال بنا عبر البريد الإلكتروني.
            </p>
          </section>

          <div className="pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
