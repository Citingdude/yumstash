import { sql } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { usersTable } from '../users'

export const sessionsTable = pgTable('sessions', {
  id: varchar().primaryKey(),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  secretHash: varchar().notNull(),
  createdAt: timestamp().default(sql`now()`).notNull(),
})
