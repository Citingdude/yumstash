export function useRecipeCookedCountQuery() {
  return useAsyncData(
    'recipe-cooked-count',
    async () => {
      const response = await $fetch<{ count: number }>('/api/recipes/cooked/count')
      return response.count
    },
    {
      lazy: true,
    },
  )
}
