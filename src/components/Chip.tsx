'use client';

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button className={`chip${active ? ' is-active' : ''}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}
