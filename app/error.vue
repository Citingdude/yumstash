<script setup lang="ts">
import type { NuxtError } from '#app'
import AppHeader from '~/components/header/AppHeader.vue'

defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <UApp>
    <AppHeader />
    <UContainer class="min-h-screen flex items-center justify-center py-16">
      <UCard
        variant="subtle"
        class="w-full max-w-xl text-center"
        :ui="{ body: 'space-y-8 p-8 sm:p-10' }"
      >
        <div class="space-y-4">
          <UIcon
            name="i-lucide-utensils-crossed"
            class="mx-auto size-16 text-primary"
          />

          <UBadge color="primary" variant="soft" size="lg">
            {{ error.statusCode || 'Error' }}
          </UBadge>

          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-highlighted">
            {{ error.statusCode === 404 ? 'Recipe not found' : 'Something went wrong' }}
          </h1>

          <p class="text-lg text-muted">
            {{
              error.statusCode === 404
                ? "This page isn't in your Yumstash. It may have been moved, renamed, or eaten."
                : error.statusMessage || 'An unexpected error occurred.'
            }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <UButton
            color="primary"
            size="lg"
            icon="i-lucide-search"
            to="/"
          >
            Browse recipes
          </UButton>

          <UButton
            color="neutral"
            variant="soft"
            size="lg"
            icon="i-lucide-home"
            @click="handleError"
          >
            Back home
          </UButton>
        </div>

        <USeparator />

        <p class="text-sm text-muted">
          Tip: try searching your saved recipes, collections, or ingredients from the Yumstash home page.
        </p>
      </UCard>
    </UContainer>
  </UApp>
</template>
