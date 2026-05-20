import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Học viên"),
  currentLevel: integer("current_level").notNull().default(1),
  targetLevel: integer("target_level").notNull().default(3),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  totalXp: integer("total_xp").notNull().default(0),
  dailyGoalMinutes: integer("daily_goal_minutes").notNull().default(15),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastStudyDate: text("last_study_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
