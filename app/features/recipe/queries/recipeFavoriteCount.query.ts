import { QUERY_KEYS } from '~/constants/queryKey.constant'

export function useRecipeFavoriteCountQuery() {
  return useAsyncData(
    QUERY_KEYS.RECIPE_FAVORITE_COUNT,
    async () => {
      const response = await $fetch<{ count: number }>('/api/recipes/favorites/count')
      return response.count
    },
    {
      lazy: true,
    },
  )
}
