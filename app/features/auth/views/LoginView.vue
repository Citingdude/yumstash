<script setup lang="ts">
import type { LoginBody } from '~~/shared/types/auth/login/authLogin.type'
import type { FormSubmitEvent } from '#ui/types'
import { authLoginFormDataSchema } from '~~/shared/types/auth/login/authLogin.type'
import { useApiError } from '~/composables/error/useApiError'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
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
  <section
    class="grid gap-10 rounded-3xl p-8 shadow-2xl shadow-stone-900/40 backdrop-blur xl:grid-cols-[1.1fr_0.9fr] xl:p-12"
  >
    <div class="flex flex-col justify-between border-b border-stone-200/60 pb-8 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-12">
      <div class="flex gap-4 items-start flex-col">
        <UBadge
          label="Welcome back"
          variant="soft"
          color="secondary"
        />
        <h1 class="text-4xl font-semibold lg:text-5xl leading-tight">
          Log into your Yumstash kitchen
        </h1>
        <p class="text-base text-dimmed">
          Keep tabs on your saved recipes, favorites, and cooking streak without missing a beat. Your curated
          inspiration board is only a moment away.
        </p>
      </div>
    </div>

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
          placeholder="you@example.com"
          size="xl"
        />
      </UFormField>

      <UFormField
        label="Password"
        name="password"
        required
      >
        <template #hint>
          <NuxtLink class="text-sm font-medium text-red-600 hover:text-red-500" to="/forgot-password">
            Forgot password?
          </NuxtLink>
        </template>
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          size="xl"
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
          :loading="isSubmitting"
          block
          size="xl"
          color="error"
        >
          {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
        </AppButton>
        <p class="text-center text-sm">
          New to Yumstash?
          <NuxtLink class="font-semibold" to="/register">
            Create an account
          </NuxtLink>
        </p>
      </div>
    </UForm>
  </section>
</template>
