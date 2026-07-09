import { pgTable, serial, text, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().default("Học viên"),
  email: text("email"),
  passwordHash: text("password_hash"),
  profilePicture: text("profile_picture"),
  language: text("language").notNull().default("vi"),
  timezone: text("timezone").notNull().default("Asia/Ho_Chi_Minh"),
  dailyGoal: integer("daily_goal").notNull().default(15),
  league: text("league").notNull().default("bronze"),
  gems: integer("gems").notNull().default(0),
  hearts: integer("hearts").notNull().default(5),
  totalXp: integer("total_xp").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  lastActiveDate: date("last_active_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
