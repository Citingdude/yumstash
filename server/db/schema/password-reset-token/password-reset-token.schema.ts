import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from '../user/user.schema'

export const passwordResetTokensTable = pgTable('password_reset_tokens', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  token: varchar({ length: 255 }).notNull().unique(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})

export const passwordResetTokensRelations = relations(passwordResetTokensTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [passwordResetTokensTable.userId],
    references: [usersTable.id],
  }),
}))

export type PasswordResetTokenInsert = InferInsertModel<typeof passwordResetTokensTable>
export type PasswordResetTokenSelect = InferSelectModel<typeof passwordResetTokensTable>
