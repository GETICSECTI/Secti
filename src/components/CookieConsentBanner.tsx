import React, { useState } from 'react';

// Usamos js-cookie (já presente em node_modules) para gerenciar o cookie de consentimento
// @ts-expect-error - pacote presente em node_modules
import Cookies from 'js-cookie';

type Props = {
  locale?: 'pt-BR' | string;
  cookieName?: string;
  onAccept?: () => void;
  onDecline?: () => void;
};

export const CookieConsentBanner: React.FC<Props> = ({
  locale = 'pt-BR',
  cookieName = 'secti_cookie_consent',
  onAccept,
  onDecline,
}) => {
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      const consent = Cookies.get(cookieName);
      return !consent;
    } catch {
      // fallback para localStorage se Cookies falhar
      const consent = window.localStorage.getItem(cookieName);
      return !consent;
    }
  });

  const handleAccept = () => {
    try {
      Cookies.set(cookieName, 'accepted', { expires: 365 });
    } catch {
      window.localStorage.setItem(cookieName, 'accepted');
    }
    setVisible(false);
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    try {
      Cookies.set(cookieName, 'declined', { expires: 365 });
    } catch {
      window.localStorage.setItem(cookieName, 'declined');
    }
    setVisible(false);
    if (onDecline) onDecline();
  };

  if (!visible) return null;

  const message =
    locale === 'pt-BR'
      ? 'Utilizamos cookies para melhorar sua experiência no site. Ao continuar, você concorda com o uso de cookies.'
      : 'We use cookies to improve your experience on the site. By continuing, you agree to our use of cookies.';

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-4 bottom-4 md:bottom-6 z-50"
    >
      <div className="max-w-6xl mx-auto bg-[#0C2856] text-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 text-sm" id="cookie-banner-desc">
          <div id="cookie-banner-title" className="font-medium mb-1">
            {locale === 'pt-BR' ? 'Aviso de cookies' : 'Cookie notice'}
          </div>
          <div>
            {message}{' '}
            <a href="/politica-de-privacidade" className="underline font-medium" style={{ color: '#FFFFFF' }}>
              {locale === 'pt-BR' ? 'Política de Privacidade' : 'Privacy Policy'}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecline}
            className="px-4 cursor-pointer py-2 rounded-md border border-white text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={locale === 'pt-BR' ? 'Recusar cookies' : 'Decline cookies'}
          >
            {locale === 'pt-BR' ? 'Recusar' : 'Decline'}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 cursor-pointer py-2 rounded-md bg-[#195CE3] text-white font-semibold hover:bg-[#0f4fc0] focus:outline-none focus:ring-2 focus:ring-[#195CE3]"
            aria-label={locale === 'pt-BR' ? 'Aceitar cookies' : 'Accept cookies'}
          >
            {locale === 'pt-BR' ? 'Aceitar' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;

