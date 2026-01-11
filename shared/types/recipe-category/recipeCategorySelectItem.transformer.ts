import type { RecipeCategory } from '~~/shared/types/recipe-category/recipeCategory.type'
import type { RecipeCategorySelectItem } from '~~/shared/types/recipe-category/recipeCategorySelectItem.type'

export class RecipeCategorySelectItemTransformer {
  public static fromRecipeCategory(recipeCategory: RecipeCategory): RecipeCategorySelectItem {
    return {
      label: recipeCategory.name,
      value: recipeCategory.id,
    }
  }
}
