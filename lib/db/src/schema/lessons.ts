import { pgTable, serial, text, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull(),
  unit: integer("unit").notNull(),
  lessonNumber: integer("lesson_number").notNull(),
  title: text("title").notNull(),
  titleChinese: text("title_chinese").notNull(),
  type: text("type").notNull().default("dialogue"),
  xpReward: integer("xp_reward").notNull().default(50),
  estimatedMinutes: integer("estimated_minutes").notNull().default(10),
  dialogue: jsonb("dialogue").notNull().default([]),
  vocabulary: jsonb("vocabulary").notNull().default([]),
  grammarPoints: jsonb("grammar_points").notNull().default([]),
  shadowingText: text("shadowing_text").notNull().default(""),
  shadowingPinyin: text("shadowing_pinyin").notNull().default(""),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
