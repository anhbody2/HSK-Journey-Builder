import { pgTable, serial, integer, varchar, text, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { lessonsTable } from "./lessons";

export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  type: varchar("type", { length: 64 }).notNull(),
  question: text("question").notNull().default(""),
  audioUrl: varchar("audio_url", { length: 512 }),
  imgUrl: varchar("img_url", { length: 512 }),
});

export const exerciseOptionsTable = pgTable("exercise_options", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id").notNull().references(() => exercisesTable.id),
  text: text("text").notNull().default(""),
  isCorrect: boolean("is_correct").notNull().default(false),
});

export const sentencesTable = pgTable("sentences", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id").notNull().references(() => exercisesTable.id),
  simplified: varchar("simplified", { length: 512 }).notNull().default(""),
  traditional: varchar("traditional", { length: 512 }).notNull().default(""),
  pinyin: varchar("pinyin", { length: 512 }).notNull().default(""),
  translation: text("translation").notNull().default(""),
  audioUrl: varchar("audio_url", { length: 512 }),
});

export const sentenceVocabularyTable = pgTable("sentence_vocabulary", {
  sentenceId: integer("sentence_id").notNull().references(() => sentencesTable.id),
  vocabularyId: integer("vocabulary_id").notNull(),
});

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;

export const insertExerciseOptionSchema = createInsertSchema(exerciseOptionsTable).omit({ id: true });
export type InsertExerciseOption = z.infer<typeof insertExerciseOptionSchema>;
export type ExerciseOption = typeof exerciseOptionsTable.$inferSelect;

export const insertSentenceSchema = createInsertSchema(sentencesTable).omit({ id: true });
export type InsertSentence = z.infer<typeof insertSentenceSchema>;
export type Sentence = typeof sentencesTable.$inferSelect;
