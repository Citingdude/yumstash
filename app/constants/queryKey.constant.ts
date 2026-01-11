/**
 * Central registry of all query keys used in the application.
 * Add new query keys here to get type safety and autocomplete.
 */
export const QUERY_KEYS = {
  // Recipe queries
  RECIPE_INDEX: 'recipe-index',
  RECIPE_COUNT: 'recipe-count',
  RECIPE_SEARCH: 'recipe-search',
  RECIPE_FAVORITES: 'recipe-favorites',
  RECIPE_FAVORITE_COUNT: 'recipe-favorite-count',
  RECIPE_COOKED_COUNT: 'recipe-cooked-count',

  // Recipe category queries
  RECIPE_CATEGORIES: 'recipe-categories',
  RECIPE_CATEGORY_COUNT: 'recipe-category-count',

  // Recipe difficulty queries
  RECIPE_DIFFICULTIES: 'recipe-difficulties',
} as const

export type QueryKey = typeof QUERY_KEYS[keyof typeof QUERY_KEYS]
