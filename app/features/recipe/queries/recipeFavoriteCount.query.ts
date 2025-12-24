export function useRecipeFavoriteCountQuery() {
  return useAsyncData(
    'recipe-favorite-count',
    async () => {
      const response = await $fetch<{ count: number }>('/api/recipes/favorites/count')
      return response.count
    },
    {
      lazy: true,
    },
  )
}
