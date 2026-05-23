<script setup lang="ts">
import type { AppIcon } from '~/types/icon/icon.type'

export interface StatCardProps {
  icon: AppIcon
  title: string
  number: string
}

const props = defineProps<StatCardProps>()
</script>

<template>
  <UCard>
    <div class="flex items-center gap-4">
      <div class="p-3 bg-elevated rounded-lg">
        <UIcon
          :name="props.icon"
          class="w-8 h-8 text-primary"
        />
      </div>
      <div>
        <p class="text-sm text-muted">
          {{ props.title }}
        </p>
        <p class="text-2xl font-bold text-highlighted">
          <AppNumberCounter :duration="300" :value="Number.parseInt(props.number)" />
        </p>
      </div>
    </div>
  </UCard>
</template>
