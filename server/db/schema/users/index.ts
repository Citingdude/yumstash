import { sql } from 'drizzle-orm'
import { pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  passwordHash: varchar({ length: 255 }),
  createdAt: timestamp().default(sql`now()`).notNull(),
  updatedAt: timestamp().default(sql`now()`).notNull(),
}, table => [
  unique('users_email_unique').on(table.email),
])

export type UserSelect = typeof usersTable.$inferSelect
export type UserInsert = typeof usersTable.$inferInsert
