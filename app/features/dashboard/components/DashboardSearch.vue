<script setup lang="ts">
import type { RecipeCategoryFilterItem } from '~~/shared/types/recipe-category/recipeCategoryFilterItem.type'
import type { RecipeCategorySelectItem } from '~~/shared/types/recipe-category/recipeCategorySelectItem.type'

const props = defineProps<{
  categoryItems: RecipeCategoryFilterItem[]
}>()

const query = defineModel<string>('query')
const category = defineModel<RecipeCategorySelectItem>('category')
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="flex-1">
      <UInput
        v-model="query"
        icon="i-heroicons-magnifying-glass"
        size="lg"
        placeholder="Search recipes..."
        class="w-full"
      />
    </div>
    <USelectMenu
      v-model="category"
      :items="props.categoryItems"
      placeholder="Select category"
      size="lg"
      class="w-full sm:w-48"
      searchable
      searchable-placeholder="Search categories..."
    />
  </div>
</template>
