import { cn } from '@/lib/utils';
import { ShieldCheck, Sparkles, Clock, AlertTriangle } from 'lucide-react';

type Variant = 'verified' | 'premium' | 'new' | 'deadline' | 'urgent' | 'neutral' | 'success' | 'info';

const styles: Record<Variant, string> = {
  verified: 'bg-success/10 text-success border-success/20',
  premium: 'bg-gold-soft text-warning border-gold/30',
  new: 'bg-secondary-soft text-secondary border-secondary/20',
  deadline: 'bg-accent-soft text-accent border-accent/20',
  urgent: 'bg-destructive/10 text-destructive border-destructive/20',
  neutral: 'bg-surface-alt text-text-secondary border-border',
  success: 'bg-success/10 text-success border-success/20',
  info: 'bg-info/10 text-info border-info/20',
};

const icons: Partial<Record<Variant, React.ComponentType<{ className?: string }>>> = {
  verified: ShieldCheck,
  premium: Sparkles,
  deadline: Clock,
  urgent: AlertTriangle,
};

export function StatusBadge({
  variant = 'neutral',
  children,
  className,
  icon: showIcon = true,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
}) {
  const Icon = icons[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        styles[variant],
        className
      )}
    >
      {showIcon && Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}
