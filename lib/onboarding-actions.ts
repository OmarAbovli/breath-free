'use server'

import { db } from "./db"
import { users } from "./db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function completeOnboarding(data: {
  addictionLevel: number;
  aiPersonality: string;
  motivation: string;
  dailySpend: number;
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id

  await db.update(users)
    .set({
      addictionLevel: data.addictionLevel,
      aiPersonality: data.aiPersonality,
      motivation: data.motivation,
      dailySpend: data.dailySpend,
    })
    .where(eq(users.id, userId))

  revalidatePath('/')
  revalidatePath('/dashboard')
  return { success: true }
}
