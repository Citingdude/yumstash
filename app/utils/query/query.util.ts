import type { QueryKey } from '~/constants/queryKey.constant'

export async function invalidateQuery(queryKey: QueryKey): Promise<void> {
  refreshNuxtData(queryKey)
}
