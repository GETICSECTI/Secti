// Apenas validação de consentimento de cookies — sem lógica de analytics

export function isConsentGiven(cookieName = 'secti_cookie_consent') {
  try {
    const match = document.cookie.match(new RegExp('(?:^|; )' + cookieName.replace(/[-.*+?^${}()|[\\]\\]/g, '\\$&') + '=([^;]*)'));
    return match ? match[1] === 'accepted' : false;
  } catch {
    try {
      return window.localStorage.getItem(cookieName) === 'accepted';
    } catch {
      return false;
    }
  }
}
