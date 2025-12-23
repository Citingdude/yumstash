export function useRecipeIndexQuery(
  search: Ref<string | undefined>,
  categoryId: Ref<string | undefined>,
) {
  return useAsyncData(
    'recipe-index',
    () => {
      return $fetch('/api/recipes', {
        query: {
          search: search.value,
          categoryId: categoryId.value,
        },
      })
    },
    {
      watch: [search, categoryId],
    },
  )
}
