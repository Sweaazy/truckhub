'use client';

import { useEffect, useRef } from 'react';

export function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.childElementCount > 0) return;
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'teoriginalbot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', `${window.location.origin}/api/auth/telegram`);
    script.setAttribute('data-request-access', 'write');
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} style={{ display: 'flex', justifyContent: 'center' }} />;
}
