import type { QueryKey } from '~/constants/queryKey.constant'

// TODO: Add support for query keys with params
// Example: Recipe detail with recipe ID
export async function invalidateQuery(queryKey: QueryKey | string): Promise<void> {
  refreshNuxtData(queryKey)
}
