import type { Ref } from 'vue'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'
import { QUERY_KEYS } from '~/constants/queryKey.constant'
import { useRecipeService } from '~/features/recipe/services/recipe.service'

export function useRecipeDetailQuery(recipeId: Ref<RecipeUuid>) {
  return useAsyncData<RecipeWithRelations>(
    `${QUERY_KEYS.RECIPE_INDEX}-${recipeId.value}`,
    () => {
      const recipeService = useRecipeService()

      return recipeService.getRecipe(recipeId.value)
    },
    {
      watch: [recipeId],
    },
  )
}
