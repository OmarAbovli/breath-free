'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-8">سياسة الخصوصية</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">المقدمة</h2>
            <p>
              في Quit Vape، نحن نقدّر خصوصيتك. هذه السياسة تشرح كيفية جمعنا واستخدامنا وحماية بيانتك الشخصية.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">البيانات التي نجمعها</h2>
            <p>نجمع البيانات التالية عند استخدامك للتطبيق:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>معلومات الحساب (البريد الإلكتروني، الاسم، كلمة المرور المشفرة)</li>
              <li>بيانات التقدم (عدد الأيام، الرغبات المسجلة، الإحصائيات)</li>
              <li>محادثات المدرب الذكي</li>
              <li>معلومات الجهاز (نوع الجهاز، نظام التشغيل)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">كيف نستخدم بيانتك</h2>
            <p>نستخدم بيانتك للأغراض التالية:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>تقديم الخدمات وتحسينها</li>
              <li>تقديم دعم المدرب الذكي الشخصي</li>
              <li>تحليل الأنماط والسلوك لتحسين الخدمة</li>
              <li>الاتصال بك حول حسابك أو الخدمة</li>
              <li>الامتثال للقوانين واللوائح</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">حماية البيانات</h2>
            <p>
              نتخذ تدابير أمان قوية لحماية بيانتك:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>تشفير البيانات في النقل (HTTPS)</li>
              <li>تشفير كلمات المرور باستخدام معايير الصناعة</li>
              <li>الوصول المقيد إلى البيانات</li>
              <li>مراجعات أمان منتظمة</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">حقوقك</h2>
            <p>لديك الحق في:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>الوصول إلى بيانتك الشخصية</li>
              <li>تصحيح البيانات غير الدقيقة</li>
              <li>حذف حسابك وبيانتك</li>
              <li>الحصول على نسخة من بيانتك</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">اتصل بنا</h2>
            <p>
              إذا كان لديك أسئلة حول هذه السياسة أو ممارسات الخصوصية لدينا، يرجى الاتصال بنا عبر البريد الإلكتروني.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold">التعديلات</h2>
            <p>
              قد نحدث هذه السياسة من وقت لآخر. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني.
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
