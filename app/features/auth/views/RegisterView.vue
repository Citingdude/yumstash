<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { RegisterFormData } from '~~/shared/types/auth/register/authRegister.type'
import { authRegisterFormDataSchema } from '~~/shared/types/auth/register/authRegister.type'

const router = useRouter()
const toast = useToast()

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

    toast.add({
      title: 'Account created',
      description: 'Redirecting to sign in…',
      color: 'success',
    })

    router.push('/')
  }
  catch (error) {
    toast.add({
      title: 'Registration failed',
      description: error instanceof Error ? error.message : 'Unable to create your account right now.',
      color: 'error',
    })
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="grid gap-10 rounded-3xl bg-white/95 p-8 shadow-2xl shadow-stone-900/40 backdrop-blur xl:grid-cols-[1.05fr_0.95fr] xl:p-12">
    <div class="flex flex-col justify-between border-b border-stone-200/60 pb-8 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-12">
      <div>
        <span class="inline-flex items-center rounded-full bg-stone-900 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
          Join the community
        </span>
        <h1 class="mt-6 text-4xl font-semibold text-stone-900 lg:text-5xl">
          Build your personal recipe universe
        </h1>
        <p class="mt-4 text-base text-stone-600">
          Track your kitchen experiments, unlock curated collections, and share your cooking wins with fellow food
          explorers.
        </p>
      </div>

      <dl class="mt-8 grid gap-6 rounded-2xl bg-stone-50/90 p-6 text-stone-900 sm:grid-cols-3">
        <div>
          <dt class="text-sm font-medium text-stone-500">
            Creators onboard
          </dt>
          <dd class="text-2xl font-semibold">
            4,500+
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-stone-500">
            Community cook-alongs
          </dt>
          <dd class="text-2xl font-semibold">
            320
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-stone-500">
            Shared favorites
          </dt>
          <dd class="text-2xl font-semibold text-red-600">
            18k
          </dd>
        </div>
      </dl>
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
            <span class="text-sm text-stone-600">
              I agree to the
              <NuxtLink class="font-semibold text-red-600" to="/legal/terms">
                Terms
              </NuxtLink>
              and
              <NuxtLink class="font-semibold text-red-600" to="/legal/privacy">
                Privacy Policy
              </NuxtLink>.
            </span>
          </template>
        </UCheckbox>
      </UFormField>

      <div class="space-y-4">
        <UButton
          type="submit"
          :loading="isSubmitting"
          block
          size="xl"
          color="neutral"
        >
          {{ isSubmitting ? 'Creating account…' : 'Create account' }}
        </UButton>
        <p class="text-center text-sm text-stone-600">
          Already have an account?
          <NuxtLink class="font-semibold text-stone-900 hover:text-red-600" to="/login">
            Sign in instead
          </NuxtLink>
        </p>
      </div>
    </UForm>
  </section>
</template>
