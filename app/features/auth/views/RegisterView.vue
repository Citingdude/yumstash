<script setup lang="ts">
import type { RegisterFormData } from '~~/shared/types/auth/register/authRegister.type'
import type { FormSubmitEvent } from '#ui/types'
import { authRegisterFormDataSchema } from '~~/shared/types/auth/register/authRegister.type'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import AuthFormCard from '~/features/auth/components/AuthFormCard.vue'

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
  if (isSubmitting.value)
    return

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
  <AuthFormCard
    eyebrow="Make yourself at home"
    title="Start your cookbook"
    description="Keep your recipes together, find inspiration, and remember what you’ve cooked."
    icon="i-heroicons-book-open"
  >
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
          autocomplete="name"
          icon="i-heroicons-user"
          placeholder="Taylor Alvarez"
          size="lg"
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
          autocomplete="email"
          icon="i-heroicons-envelope"
          placeholder="you@example.com"
          size="lg"
        />
      </UFormField>

      <div class="grid gap-5">
        <UFormField
          label="Password"
          name="password"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="new-password"
            icon="i-heroicons-lock-closed"
            placeholder="At least 8 characters"
            size="lg"
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
            autocomplete="new-password"
            icon="i-heroicons-lock-closed"
            placeholder="Repeat password"
            size="lg"
          />
        </UFormField>
      </div>

      <UFormField name="acceptTerms">
        <UCheckbox v-model="state.acceptTerms">
          <template #label>
            <span class="text-sm">
              I agree to the
              <NuxtLink class="font-medium text-primary hover:underline" to="/legal/terms">
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
          class="rounded-xl"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          block
          size="lg"
          color="primary"
        >
          {{ isSubmitting ? 'Creating account…' : 'Create account' }}
        </AppButton>
        <p class="text-center text-sm">
          Already have an account?
          <NuxtLink class="font-medium text-primary hover:underline" to="/login">
            Sign in instead
          </NuxtLink>
        </p>
      </div>
    </UForm>
  </AuthFormCard>
</template>
