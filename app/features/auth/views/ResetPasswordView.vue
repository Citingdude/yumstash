<script setup lang="ts">
import type { ResetPasswordBody } from '~~/shared/types/auth/reset-password/resetPassword.type'
import type { FormSubmitEvent } from '#ui/types'
import { resetPasswordBodySchema } from '~~/shared/types/auth/reset-password/resetPassword.type'
import { useApiError } from '~/composables/error/useApiError'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import AuthFormCard from '~/features/auth/components/AuthFormCard.vue'
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
  if (isSubmitting.value)
    return

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
  <AuthFormCard
    eyebrow="A fresh start"
    title="Choose a new password"
    description="Use at least 8 characters to secure your cookbook."
    icon="i-heroicons-lock-closed"
  >
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
            <AppButton
              color="neutral"
              variant="ghost"
              size="sm"
              :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              type="button"
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
        <AppButton
          type="submit"
          class="rounded-xl"
          size="lg"
          block
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Reset password
        </AppButton>

        <AppButton
          type="button"
          class="rounded-xl"
          size="lg"
          block
          variant="ghost"
          color="neutral"
          @click="router.push('/login')"
        >
          Back to login
        </AppButton>
      </div>
    </UForm>
  </AuthFormCard>
</template>
