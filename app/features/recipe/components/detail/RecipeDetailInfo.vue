<script setup lang="ts">
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'

const props = defineProps<{
  recipe: RecipeWithRelations
}>()
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <UCard>
      <div class="flex items-center gap-3">
        <div class="p-3 bg-accented rounded-xl">
          <UIcon name="i-heroicons-tag" class="w-6 h-6 text-primary" />
        </div>
        <div>
          <p class="text-sm font-medium">
            Category
          </p>
          <p class="text-lg font-semibold capitalize">
            {{ props.recipe.category.name }}
          </p>
        </div>
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center gap-3">
        <div class="p-3 bg-accented rounded-xl">
          <UIcon name="i-heroicons-user" class="w-6 h-6 text-primary" />
        </div>
        <div>
          <p class="text-sm font-medium">
            Author
          </p>
          <p class="text-lg font-semibold">
            {{ props.recipe.author.name }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
