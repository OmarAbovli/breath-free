import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  boolean,
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"

// --- NextAuth Tables ---

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // Custom fields for the app
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  points: integer("points").default(0),
  rank: integer("rank").default(1000), // Default high rank
  streak: integer("streak").default(0),
  dailySpend: integer("daily_spend").default(100), // EGP per day
  quitPlan: text("quit_plan").default("standard"),
  addictionLevel: integer("addiction_level").default(5),
  aiPersonality: text("ai_personality").default("supportive"),
  motivation: text("motivation"),
  longestStreak: integer("longest_streak").default(0),
  currency: text("currency").default("EGP"),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  theme: text("theme").default("dark"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

// --- App Specific Tables ---

export const usageLogs = pgTable("usage_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  time: timestamp("time").defaultNow(),
  amount: integer("amount"),
})

export const cravings = pgTable("cravings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  time: timestamp("time").defaultNow(),
  trigger: text("trigger"),
  resolved: boolean("resolved").default(false),
})

export const aiMemory = pgTable("ai_memory", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  role: text("role"), // 'user' or 'assistant'
  content: text("content"),
  time: timestamp("time").defaultNow(),
})

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  time: timestamp("time").defaultNow(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
})

export const communityLikes = pgTable("community_likes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  postId: integer("post_id").references(() => communityPosts.id, { onDelete: "cascade" }),
})

export const communityComments = pgTable("community_comments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  postId: integer("post_id").references(() => communityPosts.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  time: timestamp("time").defaultNow(),
})

export const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  points: integer("points").default(100),
})

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  achievementId: text("achievement_id").references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
})
