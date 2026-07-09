import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { lessonsTable } from "./lessons";

export const aiChatSessionsTable = pgTable("ai_chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  lessonId: integer("lesson_id").references(() => lessonsTable.id),
  scenarioDescription: text("scenario_description").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiChatMessagesTable = pgTable("ai_chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => aiChatSessionsTable.id),
  senderType: varchar("sender_type", { length: 8 }).notNull().default("USER"),
  simplified: text("simplified").notNull().default(""),
  traditional: text("traditional").notNull().default(""),
  pinyin: text("pinyin").notNull().default(""),
  translation: text("translation").notNull().default(""),
  audioUrl: varchar("audio_url", { length: 512 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAiChatSessionSchema = createInsertSchema(aiChatSessionsTable).omit({ id: true, createdAt: true });
export type InsertAiChatSession = z.infer<typeof insertAiChatSessionSchema>;
export type AiChatSession = typeof aiChatSessionsTable.$inferSelect;

export const insertAiChatMessageSchema = createInsertSchema(aiChatMessagesTable).omit({ id: true, createdAt: true });
export type InsertAiChatMessage = z.infer<typeof insertAiChatMessageSchema>;
export type AiChatMessage = typeof aiChatMessagesTable.$inferSelect;
