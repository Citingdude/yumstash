import { QUERY_KEYS } from '~/constants/queryKey.constant'
import { useRecipeService } from '~/features/recipe/services/recipe.service'

export function useRecipeCountQuery() {
  return useAsyncData(
    QUERY_KEYS.RECIPE_COUNT,
    async () => {
      const recipeService = useRecipeService()

      const response = await recipeService.getRecipes({
        page: 1,
        pageSize: 1,
      })

      return response.meta.total
    },
    {
      lazy: true,
    },
  )
}
