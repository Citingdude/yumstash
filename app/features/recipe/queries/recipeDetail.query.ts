import type { Ref } from 'vue'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'
import { QUERY_KEYS } from '~/constants/queryKey.constant'
import { useRecipeService } from '~/features/recipe/services/recipe.service'

export function useRecipeDetailQuery(recipeId: Ref<RecipeUuid>) {
  return useAsyncData(
    `${QUERY_KEYS.RECIPE_INDEX}-${recipeId.value}`,
    () => {
      const recipeService = useRecipeService()

      return recipeService
        .getRecipe(recipeId.value)
        .match(
          res => res,
          (error) => { throw new Error(error.message) },
        )
    },
    {
      watch: [recipeId],
    },
  )
}
