'use client';

import { useEffect, useRef } from 'react';

export function TelegramLinkButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.childElementCount > 0) return;
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'teoriginalbot');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-auth-url', `${window.location.origin}/api/auth/telegram/link`);
    script.setAttribute('data-request-access', 'write');
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}
