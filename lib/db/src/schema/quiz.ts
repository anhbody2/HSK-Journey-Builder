import { pgTable, serial, integer, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quizzesTable = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id"),
  level: integer("level").notNull(),
  type: text("type").notNull().default("mini_quiz"),
  questions: jsonb("questions").notNull().default([]),
  totalQuestions: integer("total_questions").notNull().default(5),
  timeLimit: integer("time_limit"),
});

export const quizResultsTable = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().default(1),
  quizId: integer("quiz_id").notNull(),
  score: integer("score").notNull(),
  correctCount: integer("correct_count").notNull(),
  totalCount: integer("total_count").notNull(),
  passed: boolean("passed").notNull().default(false),
  xpEarned: integer("xp_earned").notNull().default(0),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertQuizSchema = createInsertSchema(quizzesTable).omit({ id: true });
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzesTable.$inferSelect;
