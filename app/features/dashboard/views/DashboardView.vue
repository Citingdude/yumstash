<script setup lang="ts">
import type { Recipe } from '~/features/recipe/models/recipe.model'
import type { RecipeCategory } from '~/features/recipe/models/recipeCategory.model'
import StatsCard from '~/components/stats/StatsCard.vue'
import RecipeCard from '~/features/recipe/components/card/RecipeCard.vue'
import { recipeCategories } from '~/features/recipe/data/recipeCategories'
import { recipes } from '~/features/recipe/data/recipes'

const selectedCategory = ref<RecipeCategory>('All')
const searchQuery = ref<string | undefined>()

const filteredRecipes = computed<Recipe[]>(() => {
  let filtered = recipes

  // Filter by category
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(recipe => recipe.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(recipe =>
      recipe.name.toLowerCase().includes(query)
      || recipe.description.toLowerCase().includes(query),
    )
  }

  return filtered
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
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
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
