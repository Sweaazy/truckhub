'use client';

import { useEffect, useRef } from 'react';

export function TelegramLinkButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.childElementCount > 0) return;

    (window as any).onTelegramLink = async (user: Record<string, string>) => {
      const params = new URLSearchParams(user as any).toString();
      const res = await fetch(`/api/auth/telegram/link?${params}`);
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Не удалось верифицировать аккаунт. Попробуйте ещё раз.');
      }
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'teoriginalbot');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-onauth', 'onTelegramLink(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;
    ref.current.appendChild(script);

    return () => {
      delete (window as any).onTelegramLink;
    };
  }, []);

  return <div ref={ref} />;
}
