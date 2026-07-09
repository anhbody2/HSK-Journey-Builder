import { pgTable, serial, integer, varchar, text, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const vocabularyTable = pgTable("vocabulary", {
  id: serial("id").primaryKey(),
  simplified: varchar("simplified", { length: 64 }).notNull(),
  traditional: varchar("traditional", { length: 64 }).notNull().default(""),
  pinyin: varchar("pinyin", { length: 128 }).notNull(),
  toneNumber: integer("tone_number"),
  partOfSpeech: varchar("part_of_speech", { length: 64 }),
  frequency: integer("frequency").notNull().default(0),
  hskLevel: integer("hsk_level").notNull().default(1),
});

export const vocabularyTranslationsTable = pgTable("vocabulary_translations", {
  id: serial("id").primaryKey(),
  vocabularyId: integer("vocabulary_id").notNull().references(() => vocabularyTable.id),
  language: varchar("language", { length: 8 }).notNull().default("vi"),
  translation: text("translation").notNull().default(""),
});

export const userVocabularyListsTable = pgTable("user_vocabulary_lists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  vocabularyId: integer("vocabulary_id").notNull().references(() => vocabularyTable.id),
  isStarred: boolean("is_starred").notNull().default(false),
  notes: text("notes"),
});

export const insertVocabularySchema = createInsertSchema(vocabularyTable).omit({ id: true });
export type InsertVocabulary = z.infer<typeof insertVocabularySchema>;
export type Vocabulary = typeof vocabularyTable.$inferSelect;

export const insertUserVocabularyListSchema = createInsertSchema(userVocabularyListsTable).omit({ id: true });
export type InsertUserVocabularyList = z.infer<typeof insertUserVocabularyListSchema>;
export type UserVocabularyList = typeof userVocabularyListsTable.$inferSelect;
