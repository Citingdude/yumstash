<script setup lang="ts">
import type { RecipeCategoryFilterItem } from '~~/shared/types/recipe-category/recipeCategoryFilterItem.type'
import type { RecipeCategorySelectItem } from '~~/shared/types/recipe-category/recipeCategorySelectItem.type'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeCardProps } from '~/features/recipe/components/card/RecipeCard.vue'
import { refDebounced } from '@vueuse/core'

import StatsCard from '~/components/stats/StatsCard.vue'
import RecipeCard from '~/features/recipe/components/card/RecipeCard.vue'
import { useRecipeCategoryCountQuery } from '~/features/recipe/queries/recipeCategoryCount.query'
import { useRecipeCategoryIndexQuery } from '~/features/recipe/queries/recipeCategoryIndex.query'
import { useRecipeCountQuery } from '~/features/recipe/queries/recipeCount.query'
import { useRecipeIndexQuery } from '~/features/recipe/queries/recipeIndex.query'

const selectedCategory = ref<RecipeCategorySelectItem | undefined>(undefined)
const searchQuery = ref<string | undefined>()
const debouncedSearchQuery = refDebounced(searchQuery, 300)

const categoryId = computed(() => selectedCategory.value?.value)

const recipeIndexQuery = useRecipeIndexQuery(debouncedSearchQuery, categoryId)
const recipeCountQuery = useRecipeCountQuery()
const recipeCategoryIndexQuery = useRecipeCategoryIndexQuery()
const recipeCategoryCountQuery = useRecipeCategoryCountQuery()

const recipeCategoryItems = computed<RecipeCategoryFilterItem[]>(() => {
  return recipeCategoryIndexQuery.filterItems.value
})

const recipes = computed<RecipeWithRelations[]>(() => {
  return recipeIndexQuery.data.value ?? []
})

const totalRecipes = computed(() => recipeCountQuery.data.value ?? 0)

const totalCategories = computed(() => recipeCategoryCountQuery.data.value ?? 0)

const recipeCards = computed<RecipeCardProps[]>(() => {
  return recipes.value.map((recipe) => {
    return {
      emoji: recipe.emoji ?? '',
      difficulty: recipe.difficulty.name,
      name: recipe.name,
      description: recipe.description,
      time: recipe.time,
      servings: recipe.servings,
      category: recipe.category.name,
    }
  })
})
</script>

<template>
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Stats -->
    <ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <li>
        <StatsCard
          emoji="📖"
          title="Total Recipes"
          :number="totalRecipes.toString()"
        />
      </li>
      <li>
        <StatsCard
          emoji="❤️"
          title="Favorites"
          number="12"
        />
      </li>
      <li>
        <StatsCard
          emoji="👨‍🍳"
          title="Cooked"
          number="8"
        />
      </li>
      <li>
        <StatsCard
          emoji="🏷️"
          title="Categories"
          :number="totalCategories.toString()"
        />
      </li>
    </ul>

    <!-- Search and Filters -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          size="lg"
          placeholder="Search recipes..."
          class="w-full"
        />
      </div>
      <USelectMenu
        v-model="selectedCategory"
        :items="recipeCategoryItems"
        placeholder="Select category"
        size="lg"
        class="w-full sm:w-48"
        searchable
        searchable-placeholder="Search categories..."
      />
    </div>

    <UPageGrid as="ul">
      <li
        v-for="recipe in recipeCards"
        :key="recipe.name"
      >
        <RecipeCard
          :emoji="recipe.emoji"
          :difficulty="recipe.difficulty"
          :name="recipe.name"
          :description="recipe.description"
          :time="recipe.time"
          :servings="recipe.servings"
          :category="recipe.category"
        />
      </li>
    </UPageGrid>
  </main>
</template>
