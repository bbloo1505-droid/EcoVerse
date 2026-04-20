import { cn } from '@/lib/utils';

export function FilterChip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('chip whitespace-nowrap', active && 'chip-active', className)}
    >
      {children}
    </button>
  );
}
