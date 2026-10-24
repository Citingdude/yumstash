<script setup lang="ts">
import type { RecipeCategoryFilterItem } from '~~/shared/types/recipe-category/recipeCategoryFilterItem.type'

const props = defineProps<{
  categoryItems: RecipeCategoryFilterItem[]
}>()

const query = defineModel<string>('query')
const favoritesOnly = defineModel<boolean>('favoritesOnly', { required: true })
const category = defineModel<RecipeCategoryFilterItem>('category')

function onClearSearch() {
  query.value = ''
}

function onToggleFavorites() {
  favoritesOnly.value = !favoritesOnly.value
}

function onClearCategory() {
  category.value = undefined
}
</script>

<template>
  <div role="search" aria-label="Find recipes" class="flex flex-col gap-3 rounded-2xl border border-default bg-default p-3 sm:flex-row">
    <UInput
      v-model="query"
      icon="i-heroicons-magnifying-glass"
      size="lg"
      placeholder="What would you like to cook?"
      aria-label="Search recipes"
      class="min-w-0 flex-1"
      variant="none"
      :ui="{ trailing: 'pe-1' }"
    >
      <template v-if="query" #trailing>
        <AppButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" aria-label="Clear search" @click="onClearSearch" />
      </template>
    </UInput>
    <USelectMenu
      v-model="category"
      :items="props.categoryItems"
      icon="i-heroicons-funnel"
      placeholder="All categories"
      aria-label="Filter by category"
      size="lg"
      class="w-full sm:w-56"
      :search-input="{ placeholder: 'Find a category…' }"
      variant="soft"
      :ui="{ base: 'rounded-xl' }"
    />
    <AppButton
      icon="i-heroicons-heart"
      :color="favoritesOnly ? 'primary' : 'neutral'"
      :variant="favoritesOnly ? 'solid' : 'soft'"
      :aria-pressed="favoritesOnly"
      size="lg"
      class="justify-center rounded-xl"
      @click="onToggleFavorites"
    >
      Favorites
    </AppButton>
    <AppButton v-if="category?.value" icon="i-heroicons-x-mark" color="neutral" variant="ghost" aria-label="Clear category filter" class="justify-center rounded-xl" @click="onClearCategory" />
  </div>
</template>
