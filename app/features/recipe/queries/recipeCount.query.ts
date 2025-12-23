export function useRecipeCountQuery() {
  return useAsyncData(
    'recipe-count',
    async () => {
      const recipes = await $fetch('/api/recipes')
      return recipes.length
    },
    {
      lazy: true,
    },
  )
}
