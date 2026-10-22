import sanitizeHtml from 'sanitize-html'

/** Accept existing plain-text recipes as well as rich-text HTML. */
export function sanitizeRecipeContent(content: string): string {
  const html = /<[a-z/!][^>]*>/i.test(content)
    ? content
    : `<p>${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, '<br>')}</p>`

  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'a', 'pre', 'code', 'hr'],
    allowedAttributes: { a: ['href', 'title'], ol: ['start'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    parseStyleAttributes: false,
  })
}

export function hasRecipeContent(content: string): boolean {
  return sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} })
    .replace(/&(?:nbsp|#160|#x0*a0);/gi, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .length > 0
}
