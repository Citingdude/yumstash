import { sql } from 'drizzle-orm'
import { pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'

import { usersTable } from '../users'

export const passwordResetTokensTable = pgTable('password_reset_tokens', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  token: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().default(sql`now()`).notNull(),
}, table => [
  unique('password_reset_tokens_token_unique').on(table.token),
])
