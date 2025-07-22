import DOMPurify from 'dompurify'

export const useSanitizer = () => {
  /**
   * Sanitiza HTML para prevenir ataques XSS
   * @param html - String HTML a sanitizar
   * @param options - Opciones de configuración para DOMPurify
   * @returns HTML sanitizado seguro
   */
  const sanitizeHtml = (html: string, options?: DOMPurify.Config): string => {
    if (!html) return ''
    
    // Configuración por defecto para contenido de i18n
    const defaultConfig: DOMPurify.Config = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote'
      ],
      ALLOWED_ATTR: [
        'class', 'id', 'style'
      ],
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'object', 'embed', 'link', 'style', 'meta'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false
    }

    const config = { ...defaultConfig, ...options }
    
    return DOMPurify.sanitize(html, config)
  }

  /**
   * Sanitiza contenido HTML específicamente para traducciones i18n
   * Permite solo tags básicos de formato
   */
  const sanitizeI18nContent = (html: string): string => {
    return sanitizeHtml(html, {
      ALLOWED_TAGS: ['strong', 'em', 'br', 'span'],
      ALLOWED_ATTR: ['class'],
      ALLOW_DATA_ATTR: false
    })
  }

  /**
   * Sanitiza contenido HTML para uso general
   * Permite más tags pero sigue siendo seguro
   */
  const sanitizeContent = (html: string): string => {
    return sanitizeHtml(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a'
      ],
      ALLOWED_ATTR: [
        'class', 'id', 'href', 'target', 'rel'
      ],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP: /^https?:\/\/|^mailto:|^tel:/
    })
  }

  /**
   * Verifica si el contenido HTML es seguro
   * @param html - String HTML a verificar
   * @returns boolean indicando si es seguro
   */
  const isHtmlSafe = (html: string): boolean => {
    if (!html) return true
    
    const sanitized = sanitizeHtml(html)
    return sanitized === html
  }

  return {
    sanitizeHtml,
    sanitizeI18nContent,
    sanitizeContent,
    isHtmlSafe
  }
}