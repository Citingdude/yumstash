<script setup lang="ts">
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import { AuthService } from '~/features/auth/services/auth.service'

const emit = defineEmits<{
  addRecipe: []
}>()

const toast = useAppToast()

function onAddRecipe(): void {
  emit('addRecipe')
}

async function logout(): Promise<void> {
  try {
    await AuthService.logout()
    await navigateTo('/login')
  }
  catch {
    toast.error({
      title: 'Logout failed',
    })
  }
}

const userMenuItems = [
  [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    onSelect: logout,
  }],
]
</script>

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
          <AppButton
            icon="i-heroicons-plus"
            color="primary"
            size="lg"
            @click="onAddRecipe"
          >
            Add Recipe
          </AppButton>
          <UDropdownMenu
            :items="userMenuItems"
            :popper="{ placement: 'bottom-end' }"
          >
            <UAvatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User"
              size="md"
              class="cursor-pointer"
            />
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>
