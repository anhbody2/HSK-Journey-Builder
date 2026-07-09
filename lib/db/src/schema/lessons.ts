import { pgTable, serial, varchar, integer, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { unitsTable } from "./units";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => unitsTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  xpReward: integer("xp_reward").notNull().default(50),
  orderIndex: integer("order_index").notNull().default(0),
  lessonRequirement: integer("lesson_requirement").notNull().default(0),
  exerciseRequirement: integer("exercise_requirement").notNull().default(0),
});

export const grammarTable = pgTable("grammar", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull().default(""),
});

export const lessonGrammarTable = pgTable("lesson_grammar", {
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  grammarId: integer("grammar_id").notNull().references(() => grammarTable.id),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;

export const insertGrammarSchema = createInsertSchema(grammarTable).omit({ id: true });
export type InsertGrammar = z.infer<typeof insertGrammarSchema>;
export type Grammar = typeof grammarTable.$inferSelect;
