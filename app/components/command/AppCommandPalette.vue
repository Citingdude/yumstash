<script setup lang="ts">
import type { CommandPaletteGroup } from '@nuxt/ui'

const colorMode = useColorMode()

const open = ref(false)

defineShortcuts({
  meta_k: () => {
    open.value = !open.value
  },
})

const groups: CommandPaletteGroup[] = [
  {
    id: 'navigation',
    label: 'Navigation',
    items: [
      {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/',
        onSelect: () => {
          open.value = false
        },
      },
    ],
  },
  {
    id: 'color-mode',
    label: 'Color mode',
    items: [
      {
        label: 'System',
        icon: 'i-lucide-layout-dashboard',
        onSelect: () => {
          colorMode.value = 'system'
          open.value = false
        },
      },
      {
        label: 'Light',
        icon: 'i-lucide-layout-dashboard',
        onSelect: () => {
          colorMode.value = 'light'
          open.value = false
        },
      },
      {
        label: 'Dark',
        icon: 'i-lucide-layout-dashboard',
        onSelect: () => {
          colorMode.value = 'dark'
          open.value = false
        },
      },
    ],
  },
]
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCommandPalette
        close
        :groups="groups"
        placeholder="Search..."
        class="h-80"
        @update:open="open = $event"
      />
    </template>
  </UModal>
</template>
