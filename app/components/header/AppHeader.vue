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
  <header class="bg-default border-b border-default sticky top-0 z-10 py-4">
    <AppContainer>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <AppLogo />
          <h1 class="text-2xl font-bold">
            Yumstash
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <UColorModeSelect />

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
    </AppContainer>
  </header>
</template>
