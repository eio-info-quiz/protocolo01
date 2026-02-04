import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Quiz responses table for capturing leads from the sleep quiz
 */
export const quizResponses = mysqlTable("quiz_responses", {
  id: int("id").autoincrement().primaryKey(),
  /** Email of the lead */
  email: varchar("email", { length: 320 }).notNull(),
  /** Name of the lead (optional) */
  name: varchar("name", { length: 255 }),
  /** Age of the baby (e.g., "0-3 months", "3-6 months", etc.) */
  babyAge: varchar("baby_age", { length: 100 }).notNull(),
  /** How many times the baby wakes up at night */
  wakeUps: varchar("wake_ups", { length: 100 }).notNull(),
  /** How the baby usually falls asleep */
  sleepMethod: varchar("sleep_method", { length: 255 }).notNull(),
  /** Whether the baby has an established sleep routine */
  hasRoutine: varchar("has_routine", { length: 50 }).notNull(),
  /** How the mother feels about the sleep situation */
  motherFeeling: varchar("mother_feeling", { length: 255 }).notNull(),
  /** Whether they've tried other methods */
  triedOtherMethods: varchar("tried_other_methods", { length: 50 }).notNull(),
  /** Timestamp when the lead was created */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  /** Timestamp when the lead was last updated */
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = typeof quizResponses.$inferInsert;