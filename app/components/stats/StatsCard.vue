<script setup lang="ts">
export interface StatCardProps {
  emoji: string
  title: string
  number: string
}

const props = defineProps<StatCardProps>()
</script>

<template>
  <UCard>
    <div class="flex items-center gap-4">
      <div class="p-3 bg-neutral-50 rounded-lg">
        <div class="text-2xl">
          {{ props.emoji }}
        </div>
      </div>
      <div>
        <p class="text-sm text-muted">
          {{ props.title }}
        </p>
        <p class="text-2xl font-bold text-highlighted">
          {{ props.number }}
        </p>
      </div>
    </div>
  </UCard>
</template>
