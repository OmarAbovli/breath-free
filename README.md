# Quit Vape - تطبيق الإقلاع عن الفيبينج

تطبيق شامل مصمم لمساعدتك على الإقلاع عن التدخين الإلكتروني (الفيبينج) من خلال التدريب الذكي، وتتبع التقدم، والدعم المجتمعي.

## المميزات

###  مدرب ذكي
- تحدث مع مدرب ذكي متاح 24/7
- نصائح شخصية بناءً على تاريخك
- دعم فوري عند الرغبة الشديدة

###  تتبع التقدم
- عدّاد الأيام المباشر
- حساب الأموال المدخرة
- إحصائيات صحية مفصلة
- تحليل الأنماط والعوامل المؤثرة

###  نمط الإنقاذ الطارئ
- تمارين تنفس موجهة
- تقنيات التشتيت السريعة
- تسجيل الشعور الفوري
- دعم فوري من المدرب

###  مجتمع داعم
- شارك قصتك مع مجتمع
- تعلم من تجارب الآخرين
- احصل على التشجيع والدعم
- نقاشات آمنة وموثوقة

###  واجهة سهلة
- تصميم جميل وداكن (dark mode)
- سهولة التنقل
- استجابة على جميع الأجهزة

## البدء

### المتطلبات
- Node.js 18+
- pnpm (أو npm/yarn)

### التثبيت

```bash
# استنسخ المشروع
git clone <https://github.com/OmarAbovli/breath-free.git>
cd breath-free

# ثبت المتطلبات
pnpm install

# ابدأ الخادم
pnpm dev
```
# ابدأ الخادم
npm run dev 

التطبيق سيكون متاحاً على `http://localhost:3000`

## الإعداد

### متغيرات البيئة

أنشئ ملف `.env.local`:

```bash
# neonDB
DATABASE_URL=

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
# Google Auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=



# Groq AI (اختياري للمدرب الذكي)
GROQ_API_KEY=your_groq_key
```

### قاعدة البيانات

قم بتشغيل النص البرمجي لإعداد البيانات:

```bash
node scripts/init-db.js
```

## الصفحات الرئيسية

### للمستخدمين غير المسجلين
- `/` - الصفحة الرئيسية
- `/auth/login` - تسجيل الدخول
- `/auth/signup` - إنشاء حساب
- `/about` - عن التطبيق
- `/privacy` - سياسة الخصوصية
- `/terms` - شروط الخدمة

### للمستخدمين المسجلين
- `/onboarding` - الإعداد الأول
- `/dashboard` - لوحة التحكم الرئيسية
- `/dashboard/rescue` - نمط الإنقاذ الطارئ
- `/dashboard/coach` - المدرب الذكي
- `/dashboard/craving` - تسجيل الرغبات
- `/dashboard/progress` - عرض التقدم
- `/dashboard/community` - المجتمع
- `/dashboard/settings` - الإعدادات

## البنية

```
app/
├── api/              # API endpoints
├── auth/             # صفحات المصادقة
├── dashboard/        # صفحات المستخدم
├── about/            # صفحات عامة
├── privacy/
├── terms/
└── page.tsx          # الصفحة الرئيسية

components/          # مكونات React
lib/                 # دوال المساعدة والمرافق
hooks/               # React hooks
scripts/             # نصوص بيانات
```

## التقنيات المستخدمة

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: neonDB (PostgreSQL)
- **Auth**: neonDB Auth
- **AI**: Groq API
- **Data Fetching**: SWR, Axios

## المميزات القادمة

- [ ] إشعارات فورية للتذكير
- [ ] تقارير أسبوعية مفصلة
- [ ] نظام المستويات والإنجازات
- [ ] وضع صوتي للمدرب الذكي
- [ ] تقنيات متقدمة للتنبؤ بالانتكاسات

## المساهمة هتبقي متاحه في المستقبل ولا حاجه ولا الي عايز يعمل حاجه يعملها

نرحب بالمساهمات! يرجى:
1. عمل fork للمشروع
2. إنشاء فرع للميزة (`git checkout -b feature/amazing-feature`)
3. commit التغييرات (`git commit -m 'Add amazing feature'`)
4. push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الدعم

إذا كنت بحاجة إلى مساعدة:
- البريد الإلكتروني: [OMARABOVLI@GMAIL.COM]
- الموقع الويب: https://breath-free-one.vercel.app

## الترخيص

هذا المشروع مرخص تحت MIT License - انظر ملف LICENSE للتفاصيل.

## الشكر

شكراً لاستخدام Breathe Free. رحلتك نحو الحرية تبدأ هنا.

---

**ملاحظة مهمة**: هذا التطبيق ليس بديلاً عن المشورة الطبية المهنية. إذا كنت بحاجة إلى مساعدة طبية، يرجى استشارة متخصص صحي.
