import { Link } from 'react-router-dom';
import { MapPin, Calendar, Bookmark, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CardCoverImage } from '@/components/common/CardCoverImage';
import { type Opportunity, daysUntil, formatDate } from '@/lib/data';

const typeLabel: Record<Opportunity['type'], string> = {
  volunteer: 'Volunteer',
  internship: 'Internship',
  entry: 'Entry-level',
  'mid-senior': 'Mid/Senior',
  research: 'Research',
  grant: 'Grant / funding',
};

export function OpportunityCard({ op }: { op: Opportunity }) {
  const days = daysUntil(op.deadline);
  const urgent = days <= 7;
  return (
    <article className="card-elev group overflow-hidden transition-all hover:shadow-elev hover:-translate-y-0.5">
      <CardCoverImage
        src={op.imageUrl}
        alt={op.title}
        aspectClassName="aspect-[16/9] sm:aspect-[2/1]"
        className="border-b border-border"
      />
      <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge variant="neutral" icon={false}>{typeLabel[op.type]}</StatusBadge>
          {op.verified && <StatusBadge variant="verified">Verified</StatusBadge>}
          {urgent && <StatusBadge variant="urgent">{days <= 0 ? 'Closed' : `${days}d left`}</StatusBadge>}
        </div>
        <button className="text-muted-foreground hover:text-primary" aria-label="Save">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <Link to={`/opportunities/${op.id}`} className="block mt-3">
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
          {op.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-secondary">{op.org}</p>
        {op.listingBoard ? (
          <p className="mt-0.5 text-[11px] text-muted-foreground">Source: {op.listingBoard}</p>
        ) : null}
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {op.location} · {op.remote}</span>
        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Closes {formatDate(op.deadline)}</span>
        {op.salary && <span className="font-medium text-foreground">{op.salary}</span>}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {op.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-surface-alt px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">{t}</span>
          ))}
        </div>
        <Link to={`/opportunities/${op.id}`}>
          <Button size="sm" className="gap-1">Apply <ExternalLink className="h-3.5 w-3.5" /></Button>
        </Link>
      </div>
      </div>
    </article>
  );
}
