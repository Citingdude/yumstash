<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { RegisterFormData } from '~~/shared/types/auth/register/authRegister.type'
import { authRegisterFormDataSchema } from '~~/shared/types/auth/register/authRegister.type'
import { useAppToast } from '~/composables/toast/useAppToast.composable'

const router = useRouter()
const toast = useAppToast()

const isSubmitting = ref(false)

const state = reactive<RegisterFormData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

async function onSubmit(event: FormSubmitEvent<RegisterFormData>): Promise<void> {
  isSubmitting.value = true

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: event.data.name,
        email: event.data.email,
        password: event.data.password,
      },
    })

    toast.success({
      title: 'Account created',
      description: 'Redirecting to sign in…',
    })

    router.push('/')
  }
  catch (error) {
    const apiError = handleApiError(error)

    toast.error({
      title: 'Registration failed',
      errorMessage: apiError.message,
    })
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="grid gap-10 rounded-3xl p-8 shadow-2xl shadow-stone-900/40 backdrop-blur xl:grid-cols-[1.05fr_0.95fr] xl:p-12">
    <div class="flex flex-col justify-between border-b border-muted pb-8 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-12">
      <div>
        <UBadge
          label="Join the community"
          variant="soft"
          color="secondary"
        />
        <h1 class="mt-6 text-4xl font-semibold lg:text-5xl">
          Build your personal recipe universe
        </h1>
        <p class="mt-4 text-base text-muted">
          Track your kitchen experiments, unlock curated collections, and share your cooking wins with fellow food
          explorers.
        </p>
      </div>
    </div>

    <UForm
      :schema="authRegisterFormDataSchema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <UFormField
        label="Full name"
        name="name"
        required
      >
        <UInput
          v-model="state.name"
          type="text"
          placeholder="Taylor Alvarez"
          size="xl"
        />
      </UFormField>

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

      <div class="grid gap-6 sm:grid-cols-2">
        <UFormField
          label="Password"
          name="password"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="At least 8 characters"
            size="xl"
          />
        </UFormField>

        <UFormField
          label="Confirm password"
          name="confirmPassword"
          required
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="Repeat password"
            size="xl"
          />
        </UFormField>
      </div>

      <UFormField name="acceptTerms">
        <UCheckbox v-model="state.acceptTerms">
          <template #label>
            <span class="text-sm">
              I agree to the
              <NuxtLink class="font-semibold text-" to="/legal/terms">
                Terms
              </NuxtLink>
              and
              <NuxtLink class="font-semibold text-primary" to="/legal/privacy">
                Privacy Policy
              </NuxtLink>.
            </span>
          </template>
        </UCheckbox>
      </UFormField>

      <div class="space-y-4">
        <AppButton
          type="submit"
          :loading="isSubmitting"
          block
          size="xl"
          color="neutral"
        >
          {{ isSubmitting ? 'Creating account…' : 'Create account' }}
        </AppButton>
        <p class="text-center text-sm">
          Already have an account?
          <NuxtLink class="font-semibold" to="/login">
            Sign in instead
          </NuxtLink>
        </p>
      </div>
    </UForm>
  </section>
</template>
