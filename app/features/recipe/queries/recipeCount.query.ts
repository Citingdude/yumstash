import type { RecipeIndexResult } from '~~/shared/types/recipe/recipeIndexResult.type'

export function useRecipeCountQuery() {
  return useAsyncData(
    'recipe-count',
    async () => {
      const response = await $fetch<RecipeIndexResult>('/api/recipes', {
        query: {
          pageSize: 1,
          page: 1,
        },
      })

      return response.meta.total
    },
    {
      lazy: true,
    },
  )
}
