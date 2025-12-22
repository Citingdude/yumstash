<script setup lang="ts">
import type { RecipeCardProps } from '~/features/recipe/components/card/RecipeCard.vue'
import type { RecipeCategory } from '~/features/recipe/models/recipeCategory.model'
import StatsCard from '~/components/stats/StatsCard.vue'
import RecipeCard from '~/features/recipe/components/card/RecipeCard.vue'
import { recipeCategories } from '~/features/recipe/data/recipeCategories'

const recipeIndexQuery = useAsyncData('recipe-index', () => {
  return $fetch('/api/recipes')
})

const recipes = computed(() => {
  return recipeIndexQuery.data.value ?? []
})

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

const selectedCategory = ref<RecipeCategory>('All')
const searchQuery = ref<string | undefined>()
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
          number="24"
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
          number="6"
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
        :items="recipeCategories"
        placeholder="All Categories"
        size="lg"
        class="w-full sm:w-48"
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
