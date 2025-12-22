import type { z } from 'zod'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export const insertUserSchema = createInsertSchema(usersTable, {
  email: schema => schema.email(),
  name: schema => schema.min(2).max(255),
}).omit({ id: true, createdAt: true, updatedAt: true })

export const selectUserSchema = createSelectSchema(usersTable)

export type UserInsert = z.infer<typeof insertUserSchema>
export type UserSelect = z.infer<typeof selectUserSchema>
