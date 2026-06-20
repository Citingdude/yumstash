import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema/index'
import { relations } from './schema/relations'

let _db: DB | null = null

export type DB = NodePgDatabase<typeof relations>

export function useDB() {
  if (!_db) {
    const config = useRuntimeConfig()
    _db = drizzle(config.databaseUrl, { relations })
  }
  return _db
}

export { schema }
