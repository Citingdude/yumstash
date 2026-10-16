<script setup lang="ts">
import type { ForgotPasswordBody } from '#shared/types/auth/forgot-password/forgotPassword.type'
import type { FormSubmitEvent } from '#ui/types'
import { forgotPasswordBodySchema } from '#shared/types/auth/forgot-password/forgotPassword.type'
import { useApiError } from '~/composables/error/useApiError'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import AuthFormCard from '~/features/auth/components/AuthFormCard.vue'
import { AuthService } from '~/features/auth/services/auth.service'

const router = useRouter()
const toast = useAppToast()
const { extractError } = useApiError()

const isSubmitting = ref<boolean>(false)
const emailSent = ref<boolean>(false)

const state = reactive<ForgotPasswordBody>({
  email: '',
})

async function onSubmit(
  event: FormSubmitEvent<ForgotPasswordBody>,
): Promise<void> {
  if (isSubmitting.value)
    return

  isSubmitting.value = true

  try {
    await AuthService.forgotPassword(event.data)

    emailSent.value = true

    toast.success({
      title: 'Reset link sent',
      description: 'Check your email for password reset instructions.',
    })
  }
  catch (error) {
    const errorInfo = extractError(error)
    toast.error({
      title: 'Request failed',
      errorMessage: errorInfo.message,
    })
  }
  finally {
    isSubmitting.value = false
  }
}

function backToLogin() {
  router.push('/login')
}
</script>

<template>
  <AuthFormCard
    :eyebrow="emailSent ? 'Check your inbox' : 'Let’s get you back in'"
    :title="emailSent ? 'Check your email' : 'Forgot your password?'"
    :description="emailSent ? 'If an account exists for this address, you’ll receive a password reset link shortly.' : 'Enter your email and we’ll send you a link to get back to your recipes.'"
    :icon="emailSent ? 'i-heroicons-envelope-open' : 'i-heroicons-key'"
  >
    <UForm v-if="!emailSent" :schema="forgotPasswordBodySchema" :state="state" class="space-y-6" @submit="onSubmit">
      <UFormField label="Email address" name="email" required>
        <UInput v-model="state.email" type="email" placeholder="you@example.com" size="lg" autocomplete="email" icon="i-heroicons-envelope" />
      </UFormField>
      <AppButton type="submit" size="lg" block class="rounded-xl" :loading="isSubmitting" :disabled="isSubmitting">
        {{ isSubmitting ? 'Sending…' : 'Send reset link' }}
      </AppButton>
    </UForm>
    <div v-else role="status" class="space-y-5">
      <div class="rounded-2xl border border-default bg-muted/40 p-5">
        <p class="text-sm font-medium text-highlighted break-words">
          {{ state.email }}
        </p>
        <p class="mt-2 text-sm leading-6 text-muted">
          Can’t find it? Check your spam folder and make sure you entered the right email address.
        </p>
      </div>
      <AppButton color="neutral" variant="outline" block size="lg" class="rounded-xl" @click="emailSent = false">
        Try another email
      </AppButton>
    </div>
    <template #footer>
      <AppButton icon="i-heroicons-arrow-left" color="neutral" variant="link" @click="backToLogin">
        Back to sign in
      </AppButton>
    </template>
  </AuthFormCard>
</template>
