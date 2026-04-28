'use server'

import { db } from "./db"
import { cravings, usageLogs, users, communityPosts, communityLikes, communityComments, achievements, userAchievements, aiMemory } from "./db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { eq, and, sql, gte, desc, count } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { generateAIInsight, getAICoachResponse } from "./ai"
import { cookies } from "next/headers"

async function getSession() {
  return await getServerSession(authOptions)
}

export async function addXP(userId: string, xpAmount: number, pointsAmount: number = 0) {
  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (!user) return

  const newXP = (user.xp || 0) + xpAmount
  const newPoints = (user.points || 0) + pointsAmount
  
  // Level formula: Level = floor(XP / 100) + 1 (100 XP per level)
  const newLevel = Math.floor(newXP / 100) + 1
  
  await db.update(users)
    .set({ 
      xp: newXP, 
      points: newPoints,
      level: newLevel 
    })
    .where(eq(users.id, userId))

  return { leveledUp: newLevel > (user.level || 1) }
}

export async function checkAchievements(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (!user) return

  const unlocked = await db.select().from(userAchievements).where(eq(userAchievements.userId, userId))
  const unlockedIds = new Set(unlocked.map(a => a.achievementId))

  const grant = async (id: string) => {
    if (!unlockedIds.has(id)) {
      await db.insert(userAchievements).values({ userId, achievementId: id })
      // Grant bonus XP/Points for achievement
      await addXP(userId, 100, 50)
      return true
    }
    return false
  }

  // 1. Streak-based
  if (user.streak && user.streak >= 1) await grant('zap')
  if (user.streak && user.streak >= 7) await grant('medal')
  if (user.streak && user.streak >= 30) await grant('crown')

  // 2. Social-based
  const [postsCount] = await db.select({ count: count() }).from(communityPosts).where(eq(communityPosts.userId, userId))
  if (postsCount.count >= 5) await grant('shield-check')
}

export async function logCraving(trigger: string) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id

  await db.insert(cravings).values({
    userId: userId,
    trigger: trigger,
    resolved: false,
  })

  await addXP(userId, 10) // 10 XP for logging a craving
  revalidatePath('/')
}

export async function resolveCraving(id: number) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id

  await db.update(cravings)
    .set({ resolved: true })
    .where(and(eq(cravings.id, id), eq(cravings.userId, userId)))

  await addXP(userId, 20, 10) // 20 XP + 10 Points for overcoming a craving
  await checkAchievements(userId)
  revalidatePath('/')
}

export async function logUsage(amount: number) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id

  // If user logs usage, reset current streak
  await db.update(users)
    .set({ streak: 0 })
    .where(eq(users.id, userId))

  await db.insert(usageLogs).values({
    userId: userId,
    amount: amount,
  })

  revalidatePath('/')
  revalidatePath('/analytics')
}

export async function getUserStats() {
  const session = await getSession()
  if (!session?.user) return null
  const userId = (session.user as any).id

  // Get user details
  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (!user) return null

  // Get usage today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [usageToday] = await db.select({
    total: sql<number>`sum(${usageLogs.amount})`
  })
  .from(usageLogs)
  .where(and(
    eq(usageLogs.userId, userId),
    gte(usageLogs.time, today)
  ))

  // Calculate stats based on quit date (or creation date if quitDate is null)
  // If user has usage today, streak might be 0 but let's calculate based on last usage
  const quitDate = user.createdAt || new Date()
  const now = new Date()
  const hoursSinceQuit = Math.floor((now.getTime() - quitDate.getTime()) / (1000 * 60 * 60))
  const daysSinceQuit = Math.floor(hoursSinceQuit / 24)

  // Money Saved
  const moneySaved = daysSinceQuit * (user.dailySpend || 100)

  // Health Progress Logic (simplified)
  let healthProgress = 0
  if (hoursSinceQuit >= 1) healthProgress = 5
  if (hoursSinceQuit >= 12) healthProgress = 15
  if (daysSinceQuit >= 1) healthProgress = 25
  if (daysSinceQuit >= 2) healthProgress = 40
  if (daysSinceQuit >= 3) healthProgress = 60
  if (daysSinceQuit >= 14) healthProgress = 80
  if (daysSinceQuit >= 30) healthProgress = 95
  if (daysSinceQuit >= 365) healthProgress = 100

  // Determine Stage
  let stage = 1
  if (daysSinceQuit >= 7) stage = 2
  if (daysSinceQuit >= 14) stage = 3
  if (daysSinceQuit >= 21) stage = 4

  // Calculate real rank
  const [rankResult] = await db.select({
    count: sql<number>`count(*)`
  })
  .from(users)
  .where(sql`${users.xp} > ${user.xp || 0}`)

  const realRank = (Number(rankResult?.count) || 0) + 1

  return {
    streakDays: user.streak || 0,
    longestStreak: user.longestStreak || 0, 
    usageToday: Number(usageToday?.total || 0),
    moneySaved,
    healthProgress,
    level: user.level || 1,
    xp: user.xp || 0,
    points: user.points || 0,
    rank: realRank,
    userName: user.name,
    userImage: user.image,
    stage,
    motivation: user.motivation,
    currency: user.currency || 'EGP',
    dailySpend: user.dailySpend || 100,
    notificationsEnabled: user.notificationsEnabled ?? true,
    theme: user.theme || 'dark',
    aiPersonality: user.aiPersonality || 'supportive'
  }
}

export async function updateUserSettings(data: {
  name?: string,
  currency?: string,
  notificationsEnabled?: boolean,
  theme?: string,
  dailySpend?: number,
  motivation?: string,
  aiPersonality?: string
}) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id

  await db.update(users)
    .set(data)
    .where(eq(users.id, userId))

  revalidatePath('/settings')
  revalidatePath('/')
  revalidatePath('/coach')
}

export async function getTotalUserCount() {
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(users)
  return (result?.count || 0) + 4200 // Adding a base to make it look active as requested but slightly more dynamic
}

export async function getUsageHistory() {
  const session = await getSession()
  if (!session?.user) return []
  const userId = (session.user as any).id

  // Get last 7 days of usage
  const result = await db.select({
    day: sql<string>`to_char(${usageLogs.time}, 'Day')`,
    usage: sql<number>`sum(${usageLogs.amount})`
  })
  .from(usageLogs)
  .where(eq(usageLogs.userId, userId))
  .groupBy(sql`to_char(${usageLogs.time}, 'Day')`)
  .limit(7)

  return result
}

export async function getTriggerData() {
  const session = await getSession()
  if (!session?.user) return []
  const userId = (session.user as any).id

  const result = await db.select({
    name: cravings.trigger,
    value: sql<number>`count(*)`,
    resolved: sql<number>`count(case when ${cravings.resolved} = true then 1 else null end)`
  })
  .from(cravings)
  .where(eq(cravings.userId, userId))
  .groupBy(cravings.trigger)

  const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6']
  return result.map((item, i) => ({
    name: item.name,
    value: Number(item.value),
    resolvedCount: Number(item.resolved),
    color: colors[i % colors.length]
  }))
}

export async function getHealthStats() {
  const stats = await getUserStats()
  if (!stats) return []

  const d = stats.streakDays

  return [
    { name: 'وظائف الرئة', value: Math.min(15 + d * 5, 100) },
    { name: 'مستوى الأكسجين', value: Math.min(80 + d * 2, 99) },
    { name: 'حاسة التذوق والشم', value: Math.min(20 + d * 10, 100) },
    { name: 'صحة القلب', value: Math.min(40 + d * 3, 100) },
  ]
}

export async function getHealthRoadmap() {
  const stats = await getUserStats()
  if (!stats) return []

  const d = stats.streakDays
  const h = d * 24 // hours

  const roadmap = [
    { time: '20 دقيقة', title: 'تحسن ضربات القلب', desc: 'بدأت ضربات قلبك وضغط دمك في العودة للمعدل الطبيعي.', icon: 'Heart', achieved: h >= 0.33 },
    { time: '8 ساعات', title: 'مستوى الأكسجين', desc: 'نصف النيكوتين وأول أكسيد الكربون في دمك اختفوا، والأكسجين عاد لطبيعته.', icon: 'Wind', achieved: h >= 8 },
    { time: '24 ساعة', title: 'تنظيف الرئتين', desc: 'بدأت رئتاك في طرد المخاط وبقايا الفيب، وتلاشت مخاطر الأزمات القلبية الأولية.', icon: 'Lungs', achieved: h >= 24 },
    { time: '48 ساعة', title: 'التذوق والشم', desc: 'النهايات العصبية بدأت تنمو مجدداً، الأكل بقى طعمه أحلى بكتير الآن.', icon: 'Zap', achieved: h >= 48 },
    { time: '3 أيام', title: 'سهولة التنفس', desc: 'الشعب الهوائية بدأت تسترخي، وستشعر بطاقة أكبر في جسمك.', icon: 'Activity', achieved: h >= 72 },
    { time: 'أسبوع واحد', title: 'إعادة إحياء الشعيرات', desc: 'بدأت الأهداب (Cilia) في رئتيك بالنمو مجدداً لتنظيف الرئة بشكل طبيعي.', icon: 'ShieldCheck', achieved: h >= 168 },
    { time: 'أسبوعين', title: 'نضارة البشرة', desc: 'الدورة الدموية تحسنت، والجلد بدأ يستعيد بريقه ويقل الشحوب الناتج عن النيكوتين.', icon: 'Sparkles', achieved: h >= 336 },
    { time: 'شهر واحد', title: 'قوة الرئة القصوى', desc: 'السعال وضيق التنفس قلوا جداً، وسعة الرئة زادت بنسبة تصل لـ 30%.', icon: 'Trophy', achieved: h >= 720 },
  ]

  return roadmap
}

export async function getCommunityPosts() {
  const session = await getSession()
  const userId = session?.user ? (session.user as any).id : null

  const posts = await db.select({
    id: communityPosts.id,
    content: communityPosts.content,
    time: communityPosts.time,
    likes: communityPosts.likes,
    comments: communityPosts.comments,
    userName: users.name,
    userImage: users.image,
    userLevel: users.level,
    likedByUser: userId ? sql<boolean>`EXISTS(SELECT 1 FROM community_likes WHERE post_id = ${communityPosts.id} AND user_id = ${userId})` : sql<boolean>`false`,
  })
  .from(communityPosts)
  .leftJoin(users, eq(communityPosts.userId, users.id))
  .orderBy(desc(communityPosts.time))
  .limit(20)

  return posts
}

export async function createCommunityPost(content: string) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id

  await db.insert(communityPosts).values({
    userId: userId,
    content: content,
  })

  await addXP(userId, 30, 15) // 30 XP + 15 Points for sharing
  await checkAchievements(userId)
  revalidatePath('/community')
}

export async function likePost(postId: number) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id

  // ... (existing likePost logic)
  
  // Check if already liked (to avoid spamming XP)
  const [existingLike] = await db.select().from(communityLikes)
    .where(and(eq(communityLikes.userId, userId), eq(communityLikes.postId, postId)))

  if (!existingLike) {
    await addXP(userId, 5) // 5 XP for liking
    // Execute actual like logic
    await db.insert(communityLikes).values({ userId, postId })
    await db.update(communityPosts).set({ likes: sql`${communityPosts.likes} + 1` }).where(eq(communityPosts.id, postId))
  } else {
    await db.delete(communityLikes).where(and(eq(communityLikes.userId, userId), eq(communityLikes.postId, postId)))
    await db.update(communityPosts).set({ likes: sql`${communityPosts.likes} - 1` }).where(eq(communityPosts.id, postId))
  }

  revalidatePath('/community')
}

export async function commentOnPost(postId: number, content: string) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id

  await db.insert(communityComments).values({ userId, postId, content })
  await db.update(communityPosts).set({ comments: sql`${communityPosts.comments} + 1` }).where(eq(communityPosts.id, postId))

  await addXP(userId, 15, 5) // 15 XP + 5 Points for commenting
  await checkAchievements(userId)
  revalidatePath('/community')
}

// ... (getPostComments, getAIInsight, getDailyMission, getRescueAdvice, chatWithCoach, getAchievements remain same)

export async function getPostComments(postId: number) {
  const comments = await db.select({
    id: communityComments.id,
    content: communityComments.content,
    time: communityComments.time,
    userName: users.name,
    userImage: users.image,
  })
  .from(communityComments)
  .leftJoin(users, eq(communityComments.userId, users.id))
  .where(eq(communityComments.postId, postId))
  .orderBy(desc(communityComments.time))

  return comments
}

export async function getAIInsight() {
  const stats = await getUserStats()
  if (!stats) return "سجل دخولك لأعطيك نصيحة مخصصة."
  return await generateAIInsight(stats)
}

export async function getDailyMission() {
  const stats = await getUserStats()
  if (!stats) return null

  const stage = stats.stage || 1
  const missions = [
    { title: 'عدّي 12 ساعة متواصلة بدون فيب', points: 50, progress: Math.min(stats.streakDays * 20, 100) },
    { title: 'استخدم نمط الإنقاذ عند الشعور بالرغبة', points: 30, progress: 0 },
    { title: 'شارك نصيحة واحدة في المجتمع اليوم', points: 40, progress: 0 },
    { title: 'مارس رياضة خفيفة لمدة 15 دقيقة', points: 60, progress: 0 },
  ]

  return missions[stage - 1] || missions[0]
}

export async function getRescueAdvice(trigger: string) {
  const session = await getSession()
  const userId = session?.user ? (session.user as any).id : undefined
  
  const stats = await getUserStats()
  const context = stats ? `أيام التعافي: ${stats.streakDays}, المحفز: ${trigger}, الدافع الشخصي: ${stats.motivation}` : `المحفز: ${trigger}`
  const prompt = `أنا أشعر برغبة قوية (Craving) بسبب ${trigger}. أعطني نصيحة سريعة وقوية لأتخطى هذه اللحظة الآن. ذكرني بدافعي إذا كان موجوداً.`
  return await getAICoachResponse(prompt, context, userId)
}

export async function chatWithCoach(message: string, persona: string = 'supportive') {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id

  const stats = await getUserStats()
  
  let personaInstruction = ""
  if (persona === 'strict') {
    personaInstruction = "[أسلوبك: مدرب صارم جداً، لا يقبل الأعذار، واقعي، يحفز بالقوة والمنطق الجاف]"
  } else if (persona === 'zen') {
    personaInstruction = "[أسلوبك: حكيم هادئ، يركز على الوعي النفسي والتنفس، كلامك مريح وملهم]"
  } else {
    personaInstruction = "[أسلوبك: صديق داعم، مشجع، لطيف، يركز على المشاعر الإيجابية]"
  }

  const context = stats ? `أيام التعافي: ${stats.streakDays}, مستوى: ${stats.level}. ${personaInstruction}` : personaInstruction
  
  // Save user message to memory
  await db.insert(aiMemory).values({
    userId,
    role: 'user',
    content: message
  })

  const response = await getAICoachResponse(message, context, userId)

  // Save AI response to memory
  await db.insert(aiMemory).values({
    userId,
    role: 'assistant',
    content: response
  })

  return response
}

export async function getAchievements() {
  const session = await getSession()
  if (!session?.user) return []
  const userId = (session.user as any).id

  // Get all achievements
  const allAchievements = await db.select().from(achievements)
  
  // Get user's unlocked achievements
  const unlocked = await db.select().from(userAchievements).where(eq(userAchievements.userId, userId))
  const unlockedIds = new Set(unlocked.map(a => a.achievementId))

  return allAchievements.map(a => ({
    ...a,
    status: unlockedIds.has(a.id) ? 'unlocked' : 'locked'
  }))
}

export async function getLeaderboard() {
  const session = await getSession()
  const currentUserId = session?.user ? (session.user as any).id : null

  const topUsers = await db.select({
    id: users.id,
    name: users.name,
    image: users.image,
    level: users.level,
    xp: users.xp,
    streak: users.streak,
  })
  .from(users)
  .orderBy(desc(users.xp))
  .limit(20)

  // Find current user's rank if not in top 20
  let userRank = -1
  if (currentUserId) {
    const allUsersSorted = await db.select({ id: users.id }).from(users).orderBy(desc(users.xp))
    userRank = allUsersSorted.findIndex(u => u.id === currentUserId) + 1
  }

  return {
    topUsers,
    userRank,
    currentUserId
  }
}

export async function clearChatHistory() {
  const session = await getSession()
  if (!session?.user) return
  const userId = (session.user as any).id
  await db.delete(aiMemory).where(eq(aiMemory.userId, userId))
}

export async function getSessionToken() {
  const cookieStore = cookies()
  const token = cookieStore.get('next-auth.session-token')?.value || 
                cookieStore.get('__Secure-next-auth.session-token')?.value ||
                cookieStore.get('authjs.session-token')?.value
  return token
}
