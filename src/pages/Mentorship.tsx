import { useEcoverseContent } from '@/context/EcoverseContentContext';
import { MentorCard } from '@/components/cards/MentorCard';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Sparkles, Link } from 'lucide-react';

const seekingStories = [
  { id: 's1', name: 'Liam Howard', stage: 'Final-year UNSW BSc', looking: 'Climate tech founder mentor', tags: ['Climate Tech', 'Founders'] },
  { id: 's2', name: 'Amaya Singh', stage: '6 months out of UQ', looking: 'Marine science career coach', tags: ['Marine', 'Research'] },
  { id: 's3', name: 'Tom Reilly', stage: 'Graduate at Big4 ESG', looking: 'Senior in carbon assurance', tags: ['ESG', 'Reporting'] },
];

export default function Mentorship() {
  const { mentors } = useEcoverseContent();
  const requestsUsed = 3;
  const requestsLimit = 5;
  return (
    <div className="container-app py-6 sm:py-10 space-y-8">
      <header>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Mentorship</h1>
        <p className="text-sm text-text-secondary mt-1">Real conversations with people working in the field today.</p>
      </header>

      <div className="card-elev bg-gradient-warm border-accent/20 p-5 flex items-start gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent shrink-0">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">Free tier · {requestsUsed} of {requestsLimit} mentorship requests used this month</p>
          <p className="text-xs text-text-secondary mt-1">Upgrade to Premium for unlimited requests, priority response, and access to senior mentors.</p>
        </div>
        <Button variant="accent" size="sm">Upgrade</Button>
      </div>

      <section>
        <h2 className="section-title mb-4">Mentors open to requests</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m) => <MentorCard key={m.id} m={m} />)}
        </div>
      </section>

      <section>
        <h2 className="section-title mb-4">Members seeking mentorship</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {seekingStories.map((s) => (
            <article key={s.id} className="card-elev p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold">{s.name}</h3>
                  <p className="text-xs text-muted-foreground">{s.stage}</p>
                </div>
                <StatusBadge variant="info" icon={false}>Seeking</StatusBadge>
              </div>
              <p className="mt-3 text-sm text-text-secondary"><span className="text-muted-foreground">Looking for:</span> {s.looking}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.tags.map((t) => <span key={t} className="rounded-full bg-secondary-soft px-2.5 py-0.5 text-[11px] font-medium text-secondary">{t}</span>)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline">Offer mentorship</Button>
                <Button size="sm" variant="ghost" className="gap-1.5"><Link className="h-3.5 w-3.5" /> Profile</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
