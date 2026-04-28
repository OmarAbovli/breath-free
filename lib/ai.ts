import Groq from "groq-sdk";
import { db } from "./db";
import { aiMemory } from "./db/schema";
import { eq, desc, limit } from "drizzle-orm";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getAICoachResponse(message: string, context?: string, userId?: string) {
  if (!process.env.GROQ_API_KEY) {
    return "عذراً، يجب إعداد GROQ_API_KEY في ملف .env لتفعيل المدرب الذكي.";
  }

  // Fetch recent memory if userId is provided
  let history: any[] = [];
  if (userId) {
    history = await db.select()
      .from(aiMemory)
      .where(eq(aiMemory.userId, userId))
      .orderBy(desc(aiMemory.time))
      .limit(10);
    
    history = history.reverse().map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content || ""
    }));
  }

  const systemPrompt = `أنت مدرب ذكي متخصص في مساعدة الأشخاص على الإقلاع عن التدخين الإلكتروني (Vaping). 
  اسمك "رفيق". أسلوبك داعم، مشجع، وعملي. 
  تحدث باللغة العربية (اللهجة المصرية البسيطة) فقط.
  يجب أن يكون ردك بالكامل (100%) باللغة العربية العامية المصرية.
  ممنوع منعاً باتاً استخدام أي لغات أخرى أو حروف من لغات غير العربية.
  تحذير هام: لا تكرر تعريف نفسك أو اسمك في كل رسالة. ادخل في صلب الموضوع ورد على المستخدم مباشرة وبشكل طبيعي كأنك في محادثة مستمرة.
  استخدم البيانات التالية عن المستخدم إذا توفرت: ${context || "مستخدم جديد"}.
  هدفنا هو مساعدة المستخدم على تخطي الرغبة (Craving) والبقاء نظيفاً.`;

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message },
  ];

  const completion = await groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
    temperature: 0.7, // Lower temperature can help reduce hallucinations
  });

  const response = completion.choices[0]?.message?.content || "عذراً، حدث خطأ في التواصل مع المدرب.";
  
  // Safety filter: Remove any non-Arabic characters (except standard numbers and punctuation)
  // This prevents Chinese/English leakage from the model
  return response.replace(/[^\u0600-\u06FF\s0-9\u0660-\u0669.,!؟():-]/g, '');
}

export async function generateAIInsight(userStats: any) {
  if (!process.env.GROQ_API_KEY) return "ابدأ رحلتك اليوم وسأقوم بتحليل سلوكك قريباً.";

  const prompt = `أنت مدرب ذكي تشجع مستخدم على الإقلاع عن الفيب. 
  بناءً على هذه البيانات: 
  أيام التعافي: ${userStats.streakDays}, 
  استهلاك اليوم: ${userStats.usageToday}, 
  الدافع الشخصي: ${userStats.motivation || "غير محدد"},
  أعطني نصيحة مخصصة ومباشرة (جملة واحدة فقط) بالعامية المصرية.
  ابدأ بالنصيحة فوراً بدون "أهلاً" أو "أنا رفيق" أو أي مقدمات.
  تحذير هام: ممنوع استخدام أي حروف غير عربية نهائياً.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.6,
  });

  const response = completion.choices[0]?.message?.content || "أنت تبلي بلاءً حسناً، استمر!";
  return response.replace(/[^\u0600-\u06FF\s0-9\u0660-\u0669.,!؟():-]/g, '');
}
