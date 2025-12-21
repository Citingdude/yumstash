<template>
  <header class="bg-white border-b border-stone-200 sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="text-3xl">
            🍲
          </div>
          <h1 class="text-2xl font-bold text-stone-900">
            Yumstash
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <UButton icon="i-heroicons-plus" color="primary" size="lg">
            Add Recipe
          </UButton>
          <UAvatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            size="md"
          />
        </div>
      </div>
    </div>
  </header>
</template>
