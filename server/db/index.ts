import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema/index'

let _db: NodePgDatabase<typeof schema> | null = null

export function useDB() {
  if (!_db) {
    const config = useRuntimeConfig()
    _db = drizzle(config.databaseUrl, { schema })
  }
  return _db
}

export { schema }
