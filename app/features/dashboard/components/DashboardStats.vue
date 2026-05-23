<script setup lang="ts">
import type { StatCardProps } from '~/components/stats/StatsCard.vue'

const props = defineProps<{
  stats: StatCardProps[]
}>()
</script>

<template>
  <ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <li
      v-for="stat in props.stats"
      :key="stat.title"
    >
      <StatsCard
        :icon="stat.icon"
        :title="stat.title"
        :number="stat.number.toString()"
      />
    </li>
  </ul>
</template>
