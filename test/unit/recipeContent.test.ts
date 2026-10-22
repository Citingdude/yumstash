import { describe, expect, it } from 'vitest'
import { createRecipeFormSchema } from '../../shared/types/recipe/createRecipeForm.type'
import { hasRecipeContent, sanitizeRecipeContent } from '../../shared/utils/recipeContent'

describe('recipe content', () => {
  it('preserves existing plain text, line breaks, and literal comparison characters', () => {
    expect(sanitizeRecipeContent('Ingredients\n2 eggs & milk\nBake < 20 minutes'))
      .toBe('<p>Ingredients<br />2 eggs &amp; milk<br />Bake &lt; 20 minutes</p>')
  })

  it('keeps rich formatting and numbered list starts', () => {
    const html = '<h2>Ingredients</h2><ul><li><strong>2 eggs</strong></li></ul><h2>Steps</h2><ol start="3"><li><em>Whisk</em></li></ol>'
    expect(sanitizeRecipeContent(html)).toBe(html)
    expect(sanitizeRecipeContent(sanitizeRecipeContent(html))).toBe(html)
  })

  it('removes scripts, event handlers, styles, embedded content, and unsafe links', () => {
    const html = '<script>alert(1)</script><p onclick="alert(1)" style="color:red">Cook</p><img src="x" onerror="alert(1)"><iframe src="https://example.com"></iframe><a href="javascript:alert(1)">source</a>'
    expect(sanitizeRecipeContent(html)).toBe('<p>Cook</p><a>source</a>')
  })

  it('keeps safe source links', () => {
    expect(sanitizeRecipeContent('<a href="https://example.com/recipe">Source</a>'))
      .toBe('<a href="https://example.com/recipe">Source</a>')
  })

  it.each(['', '   ', '<p></p>', '<p><br></p>', '<p>&nbsp;</p>', '<ul><li> </li></ul>', '<script>alert(1)</script>'])('rejects visually empty content: %s', (content) => {
    expect(hasRecipeContent(sanitizeRecipeContent(content))).toBe(false)
    expect(createRecipeFormSchema.shape.description.safeParse(content).success).toBe(false)
  })

  it('validates and sanitizes both create and edit form content', () => {
    expect(createRecipeFormSchema.shape.description.parse('<p onclick="x()">Mix <strong>well</strong></p>'))
      .toBe('<p>Mix <strong>well</strong></p>')
  })
})
