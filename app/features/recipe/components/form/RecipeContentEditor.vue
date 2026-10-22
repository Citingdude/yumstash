<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import { useFormField } from '@nuxt/ui/composables/useFormField'

const props = defineProps<{
  disabled?: boolean
}>()

const model = defineModel<string>({ default: '' })
const contentEditor = useTemplateRef('contentEditor')
const { id, disabled, ariaAttrs, emitFormInput, emitFormBlur, emitFormFocus } = useFormField(props)
const editorAttributes = computed(() => ({
  'id': id.value ?? '',
  'role': 'textbox',
  'aria-label': 'Recipe content',
  'aria-multiline': 'true',
  'aria-required': 'true',
  ...ariaAttrs.value,
}))

watch(disabled, (value) => {
  contentEditor.value?.editor?.setEditable(!value)
})

watch(editorAttributes, (attributes) => {
  const editor = contentEditor.value?.editor
  if (editor) {
    editor.setOptions({ editorProps: { attributes: { ...editor.options.editorProps.attributes, ...attributes } } })
  }
})

const toolbarItems: EditorToolbarItem[][] = [
  [
    { 'kind': 'heading', 'level': 2, 'icon': 'i-mdi-format-header-2', 'aria-label': 'Heading', 'tooltip': { text: 'Heading' } },
    { 'kind': 'mark', 'mark': 'bold', 'icon': 'i-heroicons-bold', 'aria-label': 'Bold', 'tooltip': { text: 'Bold' } },
    { 'kind': 'mark', 'mark': 'italic', 'icon': 'i-heroicons-italic', 'aria-label': 'Italic', 'tooltip': { text: 'Italic' } },
  ],
  [
    { 'kind': 'bulletList', 'icon': 'i-heroicons-list-bullet', 'aria-label': 'Ingredient list', 'tooltip': { text: 'Ingredient list' } },
    { 'kind': 'orderedList', 'icon': 'i-heroicons-numbered-list', 'aria-label': 'Numbered steps', 'tooltip': { text: 'Numbered steps' } },
    { 'kind': 'blockquote', 'icon': 'i-mdi-format-quote-close', 'aria-label': 'Quote', 'tooltip': { text: 'Quote' } },
  ],
  [
    { 'kind': 'undo', 'icon': 'i-heroicons-arrow-uturn-left', 'aria-label': 'Undo', 'tooltip': { text: 'Undo' } },
    { 'kind': 'redo', 'icon': 'i-heroicons-arrow-uturn-right', 'aria-label': 'Redo', 'tooltip': { text: 'Redo' } },
  ],
]
</script>

<template>
  <ClientOnly>
    <UEditor
      ref="contentEditor"
      v-slot="{ editor }"
      v-model="model"
      content-type="html"
      :editable="!disabled"
      :image="false"
      :mention="false"
      :starter-kit="{ link: { openOnClick: false } }"
      :editor-props="{ attributes: editorAttributes }"
      :on-blur="emitFormBlur"
      :on-focus="emitFormFocus"
      placeholder="Start with your ingredients, then walk through the steps…"
      class="mt-2 overflow-hidden rounded-xl border border-default bg-default focus-within:ring-2 focus-within:ring-primary"
      :ui="{ base: 'min-h-56 max-h-96 overflow-y-auto px-4 py-3 text-base' }"
      @update:model-value="emitFormInput()"
    >
      <UEditorToolbar :editor="editor" :items="toolbarItems" class="flex-wrap border-b border-default p-2" />
    </UEditor>
    <template #fallback>
      <div role="status" class="mt-2 h-64 rounded-xl border border-default bg-muted/40 p-4 text-sm text-muted">
        Loading editor…
      </div>
    </template>
  </ClientOnly>
</template>
