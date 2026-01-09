<script setup lang="ts">
import type { ForgotPasswordBody } from '#shared/types/auth/forgot-password/forgotPassword.type'
import type { FormSubmitEvent } from '#ui/types'
import { forgotPasswordBodySchema } from '#shared/types/auth/forgot-password/forgotPassword.type'
import { useApiError } from '~/composables/error/useApiError'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
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
  <section class="grid gap-10 rounded-3xl bg-white/90 p-8 shadow-2xl shadow-stone-900/40 backdrop-blur xl:grid-cols-[1.1fr_0.9fr] xl:p-12">
    <div class="flex flex-col justify-between border-b border-stone-200/60 pb-8 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-12">
      <div>
        <span class="inline-flex items-center rounded-full bg-blue-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-800">Password recovery</span>
        <h1 class="mt-6 text-4xl font-semibold text-stone-900 lg:text-5xl">
          Reset your password
        </h1>
        <p class="mt-4 text-base text-stone-600">
          Enter your email address and we'll send you a link to reset your password. Get back to your recipes in just a few clicks.
        </p>
      </div>

      <div class="mt-8 rounded-2xl bg-stone-50/80 p-6 text-stone-900">
        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-information-circle"
            class="mt-0.5 size-5 shrink-0 text-stone-500"
          />
          <div>
            <p class="text-sm font-medium text-stone-700">
              Need help?
            </p>
            <p class="mt-1 text-sm text-stone-600">
              If you don't receive the email within a few minutes, check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!emailSent">
      <UForm
        :schema="forgotPasswordBodySchema"
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
            placeholder="you@example.com"
            size="lg"
            autocomplete="email"
          />
        </UFormField>

        <div class="space-y-4">
          <UButton
            type="submit"
            size="lg"
            block
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            Send reset link
          </UButton>

          <UButton
            type="button"
            size="lg"
            block
            variant="ghost"
            color="neutral"
            @click="backToLogin"
          >
            Back to login
          </UButton>
        </div>
      </UForm>

      <div class="mt-8 text-center">
        <p class="text-sm text-stone-600">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="font-semibold text-stone-900 hover:text-stone-700"
          >
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center text-center"
    >
      <div class="flex size-16 items-center justify-center rounded-full bg-green-500/20">
        <UIcon
          name="i-heroicons-check-circle"
          class="size-8 text-green-600"
        />
      </div>
      <h2 class="mt-4 text-2xl font-semibold text-stone-900">
        Check your email
      </h2>
      <p class="mt-2 text-sm text-stone-600">
        We've sent a password reset link to
        <span class="font-medium text-stone-900">{{ state.email }}</span>
      </p>
      <UButton
        type="button"
        size="lg"
        class="mt-6"
        @click="backToLogin"
      >
        Return to login
      </UButton>
    </div>
  </section>
</template>
