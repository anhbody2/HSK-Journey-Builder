import { pgTable, serial, integer, boolean, timestamp, text, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { lessonsTable } from "./lessons";
import { exercisesTable } from "./exercises";
import { vocabularyTable } from "./vocabulary";

export const lessonAttemptsTable = pgTable("lesson_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  isCompleted: boolean("is_completed").notNull().default(false),
  timeTakenMs: integer("time_taken_ms"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const exerciseAttemptsTable = pgTable("exercise_attempts", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id").notNull().references(() => exercisesTable.id),
  lessonAttemptId: integer("lesson_attempt_id").notNull().references(() => lessonAttemptsTable.id),
  userAnswer: text("user_answer").notNull().default(""),
  isCorrect: boolean("is_correct").notNull().default(false),
  score: integer("score").notNull().default(0),
  timeTakenMs: integer("time_taken_ms"),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

export const spacedRepetitionTable = pgTable("spaced_repetition", {
  userId: integer("user_id").notNull().references(() => usersTable.id),
  vocabularyId: integer("vocabulary_id").notNull().references(() => vocabularyTable.id),
  reviewCount: integer("review_count").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  incorrectCount: integer("incorrect_count").notNull().default(0),
  intervalDays: integer("interval_days").notNull().default(1),
  nextReview: timestamp("next_review"),
  lastReview: timestamp("last_review"),
});

export const insertLessonAttemptSchema = createInsertSchema(lessonAttemptsTable).omit({ id: true, createdAt: true });
export type InsertLessonAttempt = z.infer<typeof insertLessonAttemptSchema>;
export type LessonAttempt = typeof lessonAttemptsTable.$inferSelect;

export const insertExerciseAttemptSchema = createInsertSchema(exerciseAttemptsTable).omit({ id: true, attemptedAt: true });
export type InsertExerciseAttempt = z.infer<typeof insertExerciseAttemptSchema>;
export type ExerciseAttempt = typeof exerciseAttemptsTable.$inferSelect;

export const insertSpacedRepetitionSchema = createInsertSchema(spacedRepetitionTable);
export type InsertSpacedRepetition = z.infer<typeof insertSpacedRepetitionSchema>;
export type SpacedRepetition = typeof spacedRepetitionTable.$inferSelect;
