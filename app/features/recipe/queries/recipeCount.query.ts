import { QUERY_KEYS } from '~/constants/queryKey.constant'
import { useRecipeService } from '~/features/recipe/services/recipe.service'

export function useRecipeCountQuery() {
  return useAsyncData(
    QUERY_KEYS.RECIPE_COUNT,
    () => {
      const recipeService = useRecipeService()

      return recipeService
        .getRecipes({
          page: 1,
          pageSize: 1,
        })
        .match(
          res => res.meta.total,
          (error) => { throw new Error(error.message) },
        )
    },
    {
      lazy: true,
    },
  )
}
