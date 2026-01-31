<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from '#ui/types'
import type { z } from 'zod'
import type { RecipeCategorySelectItem } from '~~/shared/types/recipe-category/recipeCategorySelectItem.type'
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

const state = reactive<Partial<CreateRecipeForm>>({
  name: '',
  description: '',
  emoji: '🍽️',
  time: '',
  servings: '',
  difficultyId: '',
})

function resetForm() {
  state.name = ''
  state.description = ''
  state.emoji = '🍽️'
  state.time = ''
  state.servings = ''
  state.difficultyId = ''
}

function onCancel() {
  resetForm()
  emit('close')
}

async function onSubmit(event: FormSubmitEvent<CreateRecipeForm>) {
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
    title="Create New Recipe"
    description="Create a new recipe"
  >
    <template #body>
      <UForm
        :schema="createRecipeFormSchema"
        :state="state"
        class="grid grid-cols-1 gap-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Recipe Name"
          name="name"
          required
        >
          <UInput
            v-model="state.name"
            placeholder="e.g., Chocolate Chip Cookies"
          />
        </UFormField>

        <UFormField label="Description" name="description" required>
          <UTextarea
            v-model="state.description"
            placeholder="Describe your recipe..."
            :rows="3"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Emoji" name="emoji" required>
            <UInput
              v-model="state.emoji"
              placeholder="🍽️"
              maxlength="2"
            />
          </UFormField>

          <UFormField label="Category" name="categoryId" required>
            <USelect
              v-model="state.categoryId"
              :items="props.categoryOptions"
              placeholder="Select category"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <UFormField label="Cooking Time" name="time" required>
            <UInput
              v-model="state.time"
              placeholder="e.g., 30 min"
            />
          </UFormField>

          <UFormField label="Servings" name="servings" required>
            <UInput
              v-model="state.servings"
              placeholder="e.g., 4"
            />
          </UFormField>

          <UFormField label="Difficulty" name="difficultyId" required>
            <USelect
              v-model="state.difficultyId"
              :items="difficultyOptions"
              placeholder="Select difficulty"
            />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <AppButton
            type="button"
            color="neutral"
            variant="ghost"
            @click="onCancel"
          >
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            Create Recipe
          </AppButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
