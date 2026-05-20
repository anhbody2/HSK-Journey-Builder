import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lessonProgressTable = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  lessonId: integer("lesson_id").notNull(),
  step: text("step").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  score: integer("score"),
  completedAt: timestamp("completed_at"),
});

export const dailyActivityTable = pgTable("daily_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  date: text("date").notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
  minutesStudied: integer("minutes_studied").notNull().default(0),
});

export const insertLessonProgressSchema = createInsertSchema(lessonProgressTable).omit({ id: true });
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type LessonProgress = typeof lessonProgressTable.$inferSelect;

export const insertDailyActivitySchema = createInsertSchema(dailyActivityTable).omit({ id: true });
export type InsertDailyActivity = z.infer<typeof insertDailyActivitySchema>;
export type DailyActivity = typeof dailyActivityTable.$inferSelect;
