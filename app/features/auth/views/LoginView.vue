<script setup lang="ts">
import type { LoginBody } from '~~/shared/types/auth/login/authLogin.type'
import type { FormSubmitEvent } from '#ui/types'
import { authLoginFormDataSchema } from '~~/shared/types/auth/login/authLogin.type'
import { useApiError } from '~/composables/error/useApiError'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import AuthFormCard from '~/features/auth/components/AuthFormCard.vue'
import { AuthService } from '~/features/auth/services/auth.service'

const router = useRouter()
const toast = useAppToast()
const { extractError } = useApiError()

const isSubmitting = ref<boolean>(false)

const state = reactive<LoginBody>({
  email: '',
  password: '',
  remember: true,
})

async function onSubmit(event: FormSubmitEvent<LoginBody>): Promise<void> {
  if (isSubmitting.value)
    return

  isSubmitting.value = true

  try {
    await AuthService.login(event.data)

    toast.success({
      title: 'Signed in',
      description: 'Redirecting to your dashboard…',
    })

    await router.push('/')
  }
  catch (error) {
    const appError = extractError(error)

    toast.error({
      title: 'Login failed',
      errorMessage: appError.message,
    })
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthFormCard
    eyebrow="Welcome back"
    title="Your kitchen awaits"
    description="Sign in to pick up where you left off and find your next favorite meal."
    icon="i-mdi-pot-steam-outline"
  >
    <UForm
      :schema="authLoginFormDataSchema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <UFormField
        label="Email address"
        name="email"
        required
      >
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          icon="i-heroicons-envelope"
          placeholder="you@example.com"
          size="lg"
        />
      </UFormField>

      <UFormField
        label="Password"
        name="password"
        required
      >
        <template #hint>
          <NuxtLink class="text-sm font-medium text-primary hover:underline" to="/forgot-password">
            Forgot password?
          </NuxtLink>
        </template>
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="current-password"
          icon="i-heroicons-lock-closed"
          placeholder="••••••••"
          size="lg"
        />
      </UFormField>

      <UFormField name="remember">
        <UCheckbox
          v-model="state.remember"
          label="Remember this device"
        />
      </UFormField>

      <div class="space-y-4">
        <AppButton
          type="submit"
          class="rounded-xl"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          block
          size="lg"
          color="primary"
        >
          {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
        </AppButton>
        <p class="text-center text-sm">
          New to Yumstash?
          <NuxtLink class="font-medium text-primary hover:underline" to="/register">
            Create an account
          </NuxtLink>
        </p>
      </div>
    </UForm>
  </AuthFormCard>
</template>
