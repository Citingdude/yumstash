export function useRecipeCategoryCountQuery() {
  return useAsyncData(
    'recipe-category-count',
    async () => {
      const categories = await $fetch('/api/recipe-categories')
      return categories.length
    },
    {
      lazy: true,
    },
  )
}
