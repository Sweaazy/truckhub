import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" aria-label="TruckHUB — на главную" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 1, textDecoration: 'none' }}>
      <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text)' }}>Truck</span>
      <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--accent)' }}>HUB</span>
    </Link>
  );
}
