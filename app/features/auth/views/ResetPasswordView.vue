<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { ResetPasswordBody } from '~~/shared/types/auth/reset-password/resetPassword.type'
import { resetPasswordBodySchema } from '~~/shared/types/auth/reset-password/resetPassword.type'
import { useApiError } from '~/composables/error/useApiError'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import { AuthService } from '~/features/auth/services/auth.service'

const router = useRouter()
const route = useRoute()
const toast = useAppToast()
const { extractError } = useApiError()

const isSubmitting = ref<boolean>(false)
const showPassword = ref<boolean>(false)

const state = reactive<ResetPasswordBody>({
  token: '',
  password: '',
  confirmPassword: '',
})

const token = computed(() => route.query.token as string)

async function onSubmit(
  event: FormSubmitEvent<ResetPasswordBody>,
): Promise<void> {
  isSubmitting.value = true

  try {
    await AuthService.resetPassword(event.data)

    toast.success({
      title: 'Password reset successful',
      description: 'Your password has been reset. Redirecting to login...',
    })

    router.push('/login')
  }
  catch (error) {
    const errorInfo = extractError(error)

    toast.error({
      title: 'Reset failed',
      errorMessage: errorInfo.message,
    })
  }
  finally {
    isSubmitting.value = false
  }
}

watchEffect(() => {
  if (token.value) {
    state.token = token.value
  }
})

onMounted(() => {
  if (!token.value) {
    toast.error({
      title: 'Invalid reset link',
      errorMessage: 'The password reset link is invalid or missing.',
    })
    router.push('/forgot-password')
  }
})
</script>

<template>
  <section class="grid gap-10 rounded-3xl bg-white/90 p-8 shadow-2xl shadow-stone-900/40 backdrop-blur xl:grid-cols-[1.1fr_0.9fr] xl:p-12">
    <div class="flex flex-col justify-between border-b border-stone-200/60 pb-8 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-12">
      <div>
        <span class="inline-flex items-center rounded-full bg-green-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-green-800">New password</span>
        <h1 class="mt-6 text-4xl font-semibold text-stone-900 lg:text-5xl">
          Create a new password
        </h1>
        <p class="mt-4 text-base text-stone-600">
          Choose a strong password to secure your account. Make sure it's at least 8 characters long and unique to Yumstash.
        </p>
      </div>

      <div class="mt-8 rounded-2xl bg-stone-50/80 p-6 text-stone-900">
        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-shield-check"
            class="mt-0.5 size-5 shrink-0 text-green-600"
          />
          <div>
            <p class="text-sm font-medium text-stone-700">
              Password tips
            </p>
            <ul class="mt-1 space-y-1 text-sm text-stone-600">
              <li>• Use at least 8 characters</li>
              <li>• Mix uppercase and lowercase</li>
              <li>• Include numbers and symbols</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <UForm
      :schema="resetPasswordBodySchema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <UFormField
        label="New password"
        name="password"
        required
      >
        <UInput
          v-model="state.password"
          placeholder="••••••••"
          :type="showPassword ? 'text' : 'password'"
          :ui="{ trailing: 'pe-1' }"
          size="lg"
          autocomplete="new-password"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              aria-controls="password"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField
        label="Confirm new password"
        name="confirmPassword"
        required
      >
        <UInput
          v-model="state.confirmPassword"
          type="password"
          placeholder="••••••••"
          size="lg"
          autocomplete="new-password"
        />
      </UFormField>

      <div class="space-y-4">
        <UButton
          type="submit"
          size="lg"
          block
          color="success"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Reset password
        </UButton>

        <UButton
          type="button"
          size="lg"
          block
          variant="ghost"
          @click="router.push('/login')"
        >
          Back to login
        </UButton>
      </div>
    </UForm>

    <div class="mt-8 text-center">
      <p class="text-sm text-stone-600">
        Remember your password?
        <NuxtLink
          to="/login"
          class="font-semibold text-stone-900 hover:text-stone-700"
        >
          Sign in
        </NuxtLink>
      </p>
    </div>
  </section>
</template>
