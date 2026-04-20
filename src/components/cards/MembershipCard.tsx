import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { type Membership } from '@/lib/data';

export function MembershipCard({ m }: { m: Membership }) {
  return (
    <article className="card-elev p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-soft text-secondary">
          <Building2 className="h-5 w-5" />
        </div>
        <StatusBadge variant="neutral" icon={false}>{m.category}</StatusBadge>
      </div>
      <h3 className="mt-3 font-display text-base font-semibold leading-snug">{m.org}</h3>
      <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
        <MapPin className="h-3 w-3" /> {m.location}
      </p>
      <p className="mt-3 text-sm font-medium text-foreground">{m.price}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-text-secondary flex-1">
        {m.benefits.slice(0, 3).map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-secondary shrink-0" /> {b}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground italic">{m.eligibility}</p>
      <Button variant="outline" size="sm" className="mt-4 w-full gap-1">
        View membership <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </article>
  );
}
