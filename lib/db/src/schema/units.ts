import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const unitsTable = pgTable("units", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  xpReward: integer("xp_reward").notNull().default(100),
  orderIndex: integer("order_index").notNull().default(0),
  lessonRequirement: integer("lesson_requirement").notNull().default(0),
  exerciseRequirement: integer("exercise_requirement").notNull().default(0),
});

export const insertUnitSchema = createInsertSchema(unitsTable).omit({ id: true });
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Unit = typeof unitsTable.$inferSelect;
