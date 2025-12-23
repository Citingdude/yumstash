<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'
import AppHeader from '~/components/header/AppHeader.vue'

import RecipeCreateModal from '~/features/recipe/components/modal/RecipeCreateModal.vue'
import { useRecipeCategoryIndexQuery } from '~/features/recipe/queries/recipeCategoryIndex.query'

const overlay = useOverlay()

const createRecipeModal = overlay.create(RecipeCreateModal)

const recipeCategoryIndexQuery = useRecipeCategoryIndexQuery()

const difficultyOptions: SelectItem[] = [
  { label: 'Easy', value: 'e828879f-cbeb-47a7-bcdb-a08fba85f2de' },
  { label: 'Medium', value: 'a2b320ae-f7a3-4ab8-b497-276fcd805b17' },
  { label: 'Hard', value: '785053ae-6eeb-41dc-acf6-fc43ef54315f' },
]

function onAddRecipe(): void {
  createRecipeModal.open({
    categoryOptions: recipeCategoryIndexQuery.selectItems.value,
    difficultyOptions,
  })
}
</script>

<template>
  <div>
    <AppHeader
      @add-recipe="onAddRecipe"
    />
    <slot />
  </div>
</template>
