import { MapPin, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { type Mentor } from '@/lib/data';

export function MentorCard({ m }: { m: Mentor }) {
  return (
    <article className="card-elev p-5 flex flex-col h-full">
      <div className="flex items-start gap-3">
        <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-border">
          <img
            src={m.imageUrl}
            alt={m.name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold truncate">{m.name}</h3>
            {m.acceptingMentees && <StatusBadge variant="success" icon={false}>Open</StatusBadge>}
          </div>
          <p className="text-sm text-text-secondary truncate">{m.role}</p>
          <p className="text-xs text-muted-foreground truncate">{m.org}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-text-secondary line-clamp-2">{m.bio}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {m.expertise.slice(0, 3).map((e) => (
          <span key={e} className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-primary">{e}</span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {m.location}</span>
        <span>{m.yearsExp} yrs experience</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button size="sm" disabled={!m.acceptingMentees}>Request mentorship</Button>
        <a href={m.linkedinUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" className="w-full gap-1.5">
            <Link className="h-3.5 w-3.5" /> LinkedIn
          </Button>
        </a>
      </div>
    </article>
  );
}
