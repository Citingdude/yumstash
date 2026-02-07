<script setup lang="ts">
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'

const props = defineProps<{
  recipe: RecipeWithRelations
}>()
</script>

<template>
  <div class="p-6 lg:p-8">
    <div class="flex items-start gap-3 mb-4">
      <UIcon
        name="i-heroicons-document-text"
        class="w-5 h-5 mt-1"
      />
      <div class="flex-1">
        <h2 class="text-xl font-semibold mb-3">
          Description
        </h2>

        <div v-html="props.recipe.description" />
      </div>
    </div>
  </div>
</template>
