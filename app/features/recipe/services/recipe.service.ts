import type { CreateRecipeForm } from '~~/shared/types/recipe/createRecipeForm.type'
import type { RecipeIndexResult } from '~~/shared/types/recipe/recipeIndexResult.type'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import { DEFAULT_RECIPE_PAGE_SIZE } from '~~/shared/constants/recipePagination.constant'

interface GetRecipesParams {
  search?: string
  categoryId?: string
  page: number
  pageSize?: number
}

export class RecipeService {
  private requestFetch: ReturnType<typeof useRequestFetch>

  constructor(requestFetch: ReturnType<typeof useRequestFetch>) {
    this.requestFetch = requestFetch
  }

  public async getRecipes(params: GetRecipesParams): Promise<RecipeIndexResult> {
    return this.requestFetch('/api/recipes', {
      query: {
        search: params.search,
        categoryId: params.categoryId,
        page: params.page,
        pageSize: params.pageSize ?? DEFAULT_RECIPE_PAGE_SIZE,
      },
    })
  }

  public async getRecipe(recipeId: RecipeUuid): Promise<RecipeWithRelations> {
    return this.requestFetch(`/api/recipes/${recipeId}`)
  }

  public async createRecipe(body: CreateRecipeForm) {
    await this.requestFetch('/api/recipes', {
      method: 'POST',
      body,
    })
  }

  public async deleteRecipe(recipeId: RecipeUuid) {
    await this.requestFetch(`/api/recipes/${recipeId}`, {
      method: 'DELETE',
    })
  }

  public async toggleFavorite(recipeId: RecipeUuid, isFavorite: boolean) {
    return this.requestFetch(`/api/recipes/${recipeId}/favorite`, {
      method: 'POST',
      body: { isFavorite },
    })
  }

  public async toggleCooked(recipeId: RecipeUuid, isCooked: boolean) {
    return this.requestFetch(`/api/recipes/${recipeId}/cooked`, {
      method: 'POST',
      body: { isCooked },
    })
  }
}
