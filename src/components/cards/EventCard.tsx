import { MapPin, Users, Globe, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { type EventItem, formatDate } from '@/lib/data';

export function EventCard({ ev }: { ev: EventItem }) {
  const d = new Date(ev.date);
  return (
    <article className="card-elev group overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-elev hover:-translate-y-0.5">
      <div className="relative h-40 sm:h-auto sm:w-[38%] min-h-[10rem] shrink-0 border-b sm:border-b-0 sm:border-r border-border bg-muted">
        {ev.imageUrl ? (
          <img
            src={ev.imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-muted to-secondary/15"
            aria-hidden
          >
            <Leaf className="h-10 w-10 text-primary/45" strokeWidth={1.25} />
          </div>
        )}
      </div>
      <div className="flex flex-1 min-w-0 gap-4 p-4 sm:p-5">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-soft text-primary self-start">
        <span className="text-[10px] font-semibold uppercase tracking-wider">{d.toLocaleString('en-AU', { month: 'short' })}</span>
        <span className="font-display text-2xl font-bold leading-none">{d.getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge variant="neutral" icon={false}>{ev.category}</StatusBadge>
          {ev.online && <StatusBadge variant="info" icon={false}>Online</StatusBadge>}
        </div>
        <h3 className="mt-2 font-display text-base sm:text-lg font-semibold leading-snug truncate group-hover:text-primary">
          {ev.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">Hosted by {ev.host}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            {ev.online ? <Globe className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />} {ev.location}
          </span>
          <span>{formatDate(ev.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          {ev.attendees && <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {ev.attendees}</span>}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm">Register</Button>
          <Button size="sm" variant="ghost">Details</Button>
        </div>
      </div>
      </div>
    </article>
  );
}
