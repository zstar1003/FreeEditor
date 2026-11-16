import DOMPurify from 'dompurify'

// Keep KaTeX MathML/SVG and inline typography, but never active document content.
DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (data.attrName === 'style' &&
      /url\s*\(|expression\s*\(|@import|\\|behavior\s*:|-moz-binding/i.test(data.attrValue)) {
    data.keepAttr = false
  }
  if (['href', 'xlink:href', 'src'].includes(data.attrName)) {
    const value = data.attrValue.trim()
    if (/^data:/i.test(value)) {
      data.keepAttr = node.nodeName.toLowerCase() === 'img' && data.attrName === 'src' &&
        /^data:image\/(?:png|jpeg|gif|webp);base64,[a-z0-9+/=\s]+$/i.test(value)
    } else if (/^(?:file|blob|filesystem):/i.test(value)) {
      data.keepAttr = false
    }
  }
})

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    FORBID_TAGS: ['style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta', 'base'],
    FORBID_ATTR: ['srcdoc', 'srcset'],
    // IDs and names in imported HTML must not clobber application DOM globals.
    SANITIZE_NAMED_PROPS: true,
  })
}
