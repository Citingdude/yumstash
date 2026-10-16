<script setup lang="ts">
import type { z } from 'zod'
import type { RecipeCategorySelectItem } from '~~/shared/types/recipe-category/recipeCategorySelectItem.type'
import type { FormSubmitEvent, SelectItem } from '#ui/types'
import { createRecipeFormSchema } from '~~/shared/types/recipe/createRecipeForm.type'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import { QUERY_KEYS } from '~/constants/queryKey.constant'
import { useRecipeService } from '~/features/recipe/services/recipe.service'
import { invalidateQuery } from '~/utils/query/query.util'

const props = defineProps<{
  categoryOptions: RecipeCategorySelectItem[]
  difficultyOptions: SelectItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

export type CreateRecipeForm = z.output<typeof createRecipeFormSchema>

const toast = useAppToast()

const recipeService = useRecipeService()

const isSubmitting = ref(false)
const formId = useId()

const state = reactive<Partial<CreateRecipeForm>>({
  name: '',
  description: '',
  emoji: '🍽️',
  time: 0,
  servings: '',
  difficultyId: '',
})

function resetForm() {
  state.name = ''
  state.description = ''
  state.emoji = '🍽️'
  state.time = 0
  state.servings = ''
  state.difficultyId = ''
  state.categoryId = undefined
}

function onCancel() {
  if (isSubmitting.value)
    return

  resetForm()
  emit('close')
}

async function onSubmit(event: FormSubmitEvent<CreateRecipeForm>) {
  if (isSubmitting.value)
    return

  isSubmitting.value = true

  try {
    await recipeService.createRecipe(event.data)

    await Promise.all([
      invalidateQuery(QUERY_KEYS.RECIPE_INDEX),
      invalidateQuery(QUERY_KEYS.RECIPE_COUNT),
    ])

    emit('close')
    resetForm()

    toast.success({
      title: 'Success',
      description: 'Recipe created',
    })
  }
  catch {
    toast.error({
      title: 'Error',
      errorMessage: 'Recipe creation failed',
    })
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    title="Add a recipe"
    description="Save something delicious to your personal cookbook."
    :dismissible="!isSubmitting"
    :close="!isSubmitting"
    :ui="{ content: 'max-w-2xl', footer: 'flex-col-reverse sm:flex-row sm:justify-between' }"
    @update:open="(open) => { if (!open) onCancel() }"
  >
    <template #title>
      <span class="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl" aria-hidden="true">{{ state.emoji || '🍽️' }}</span>
      Add a recipe
    </template>
    <template #body>
      <UForm :id="formId" :schema="createRecipeFormSchema" :state="state" :disabled="isSubmitting" class="space-y-7" @submit="onSubmit">
        <fieldset class="space-y-4">
          <legend class="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
            The basics
          </legend>
          <div class="grid grid-cols-[minmax(0,1fr)_5rem] items-start gap-4">
            <UFormField label="Recipe name" name="name" required>
              <UInput v-model="state.name" placeholder="e.g. Sunday morning pancakes" size="lg" />
            </UFormField>
            <UFormField label="Emoji" name="emoji" required>
              <UInput v-model="state.emoji" placeholder="🥞" size="lg" :ui="{ base: 'text-center' }" />
            </UFormField>
          </div>
          <UFormField label="Category" name="categoryId" required>
            <USelect v-model="state.categoryId" :items="props.categoryOptions" placeholder="Choose a category" size="lg" icon="i-heroicons-tag" />
          </UFormField>
        </fieldset>

        <fieldset class="border-t border-default pt-6">
          <legend class="float-left mb-4 w-full text-xs font-semibold uppercase tracking-wider text-muted">
            At a glance
          </legend>
          <div class="clear-both grid gap-4 sm:grid-cols-3">
            <UFormField label="Total time" name="time" required>
              <UInput v-model.number="state.time" type="number" :min="0" size="lg" icon="i-heroicons-clock">
                <template #trailing>
                  <span class="text-xs text-muted">min</span>
                </template>
              </UInput>
            </UFormField>
            <UFormField label="Servings" name="servings" required>
              <UInput v-model="state.servings" placeholder="e.g. 4" size="lg" icon="i-heroicons-user-group" />
            </UFormField>
            <UFormField label="Difficulty" name="difficultyId" required>
              <USelect v-model="state.difficultyId" :items="props.difficultyOptions" placeholder="Choose level" size="lg" />
            </UFormField>
          </div>
        </fieldset>

        <div class="border-t border-default pt-6">
          <UFormField label="The recipe" name="description" description="Include ingredients, steps, and any notes you want to remember." required>
            <UTextarea v-model="state.description" placeholder="Start with your ingredients, then walk through the steps…" :rows="6" size="lg" class="mt-2" />
          </UFormField>
        </div>
      </UForm>
    </template>
    <template #footer>
      <p class="text-center text-xs text-muted sm:text-left">
        A little inspiration for your next meal.
      </p>
      <div class="flex w-full gap-3 sm:w-auto">
        <AppButton type="button" color="neutral" variant="outline" size="lg" class="flex-1 justify-center rounded-xl sm:flex-none" :disabled="isSubmitting" @click="onCancel">
          Cancel
        </AppButton>
        <AppButton type="submit" :form="formId" icon="i-heroicons-plus" size="lg" class="flex-1 justify-center rounded-xl sm:flex-none" :loading="isSubmitting" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving…' : 'Save recipe' }}
        </AppButton>
      </div>
    </template>
  </UModal>
</template>
