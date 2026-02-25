declare module 'react-cookie-consent' {
  import * as React from 'react';

  export interface CookieConsentProps {
    location?: 'top' | 'bottom';
    buttonText?: React.ReactNode;
    declineButtonText?: React.ReactNode;
    enableDeclineButton?: boolean;
    cookieName?: string;
    cookieExpiration?: number;
    onAccept?: () => void;
    onDecline?: () => void;
    style?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    declineButtonStyle?: React.CSSProperties;
    ariaRole?: string;
    buttonWrapperClasses?: string;
    children?: React.ReactNode;
  }

  export default function CookieConsent(props: CookieConsentProps): JSX.Element;
}

