<script setup lang="ts">
const props = defineProps<{
  emoji: string
  title: string
  number: string
}>()
</script>

<template>
  <UCard>
    <div class="flex items-center gap-4">
      <div class="p-3 bg-red-100 rounded-lg">
        <div class="text-2xl">
          {{ props.emoji }}
        </div>
      </div>
      <div>
        <p class="text-sm text-stone-600">
          {{ props.title }}
        </p>
        <p class="text-2xl font-bold text-stone-900">
          {{ props.number }}
        </p>
      </div>
    </div>
  </UCard>
</template>
