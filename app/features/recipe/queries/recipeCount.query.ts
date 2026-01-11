import { QUERY_KEYS } from '~/constants/queryKey.constant'
import { RecipeService } from '~/features/recipe/services/recipe.service'

export function useRecipeCountQuery() {
  return useAsyncData(
    QUERY_KEYS.RECIPE_COUNT,
    async () => {
      const requestFetch = useRequestFetch()
      const recipeService = new RecipeService(requestFetch)

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
