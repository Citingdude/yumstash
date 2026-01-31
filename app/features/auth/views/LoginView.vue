<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { LoginBody } from '~~/shared/types/auth/login/authLogin.type'
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
  <section class="grid gap-10 rounded-3xl bg-white/90 p-8 shadow-2xl shadow-stone-900/40 backdrop-blur xl:grid-cols-[1.1fr_0.9fr] xl:p-12">
    <div class="flex flex-col justify-between border-b border-stone-200/60 pb-8 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-12">
      <div>
        <span class="inline-flex items-center rounded-full bg-yellow-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-yellow-800">Welcome back</span>
        <h1 class="mt-6 text-4xl font-semibold text-stone-900 lg:text-5xl">
          Log into your Yumstash kitchen
        </h1>
        <p class="mt-4 text-base text-stone-600">
          Keep tabs on your saved recipes, favorites, and cooking streak without missing a beat. Your curated
          inspiration board is only a moment away.
        </p>
      </div>

      <dl class="mt-8 grid gap-6 rounded-2xl bg-stone-50/80 p-6 text-stone-900 sm:grid-cols-3">
        <div>
          <dt class="text-sm font-medium text-stone-500">
            Active collections
          </dt>
          <dd class="text-2xl font-semibold">
            240+
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-stone-500">
            New recipes weekly
          </dt>
          <dd class="text-2xl font-semibold">
            25
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-stone-500">
            Cooks online now
          </dt>
          <dd class="text-2xl font-semibold text-red-600">
            1,482
          </dd>
        </div>
      </dl>
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
        <p class="text-center text-sm text-stone-600">
          New to Yumstash?
          <NuxtLink class="font-semibold text-stone-900 hover:text-red-600" to="/register">
            Create an account
          </NuxtLink>
        </p>
      </div>
    </UForm>
  </section>
</template>
