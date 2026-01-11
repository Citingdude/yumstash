<script setup lang="ts">
import AppHeader from '~/components/header/AppHeader.vue'

import RecipeCreateModal from '~/features/recipe/components/modal/RecipeCreateModal.vue'
import { useRecipeCategoryIndexQuery } from '~/features/recipe/queries/recipeCategoryIndex.query'
import { useRecipeDifficultyQuery } from '~/features/recipe/queries/recipeDifficulty.query'

const overlay = useOverlay()

const createRecipeModal = overlay.create(RecipeCreateModal)

const recipeCategoryIndexQuery = useRecipeCategoryIndexQuery()
const recipeDifficultyQuery = useRecipeDifficultyQuery()

function onAddRecipe(): void {
  createRecipeModal.open({
    categoryOptions: recipeCategoryIndexQuery.selectItems.value,
    difficultyOptions: recipeDifficultyQuery.selectItems.value,
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
