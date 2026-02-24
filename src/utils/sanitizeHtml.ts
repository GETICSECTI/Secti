import DOMPurify from 'dompurify';

// Central sanitize wrapper to keep policy consistent across the app
export const sanitizeHtml = (html: string | undefined | null) => {
  if (!html) return '';
  return DOMPurify.sanitize(String(html), {
    ALLOWED_TAGS: [
      'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'br', 'img', 'blockquote', 'hr',
      'div', 'span', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'class', 'title', 'width', 'height', 'style'
    ],
    // Keep safe URI schemes only
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|\/|#)/i,
  });
};

export default sanitizeHtml;

