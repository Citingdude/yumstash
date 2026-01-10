import type { RecipeIndexResult } from '~~/shared/types/recipe/recipeIndexResult.type'
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

  async getRecipes(params: GetRecipesParams): Promise<RecipeIndexResult> {
    return this.requestFetch('/api/recipes', {
      query: {
        search: params.search,
        categoryId: params.categoryId,
        page: params.page,
        pageSize: params.pageSize ?? DEFAULT_RECIPE_PAGE_SIZE,
      },
    })
  }
}
