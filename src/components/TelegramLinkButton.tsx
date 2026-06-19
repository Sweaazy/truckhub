'use client';

import { useState, useEffect, useRef } from 'react';

export function TelegramLinkButton() {
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const startVerification = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify');
      const { deepLink } = await res.json();
      window.open(deepLink, '_blank');
      setWaiting(true);
      // Start polling
      pollRef.current = setInterval(async () => {
        const status = await fetch('/api/auth/verify/status').then(r => r.json());
        if (status.verified) {
          clearInterval(pollRef.current!);
          window.location.reload();
        }
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  if (waiting) {
    return (
      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
        <span style={{ display: 'inline-block', marginRight: 8 }}>⏳</span>
        Telegram открылся. Нажмите <strong>START</strong> в боте — страница обновится автоматически.
      </div>
    );
  }

  return (
    <button
      onClick={startVerification}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#229ED9', color: '#fff', border: 'none',
        borderRadius: 8, padding: '9px 16px', fontSize: 13,
        fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.194 1.006.131.833.94z"/>
      </svg>
      {loading ? 'Открываем Telegram...' : 'Верифицировать через Telegram'}
    </button>
  );
}
