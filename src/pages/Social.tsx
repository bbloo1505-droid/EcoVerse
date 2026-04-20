import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Link, Sparkles, Award, Calendar } from 'lucide-react';

const requests = [
  { id: 'c1', name: 'Priya Nair', role: 'Climate analyst · Sydney', mutual: 4 },
  { id: 'c2', name: 'Daniel Ng', role: 'Sustainability Officer · UQ', mutual: 2 },
];

const activity = [
  { id: 'a1', who: 'Sophie Chen', what: 'shared a resource: ASRS Quick Guide', when: '2h', icon: Award },
  { id: 'a2', who: 'AYCC Climate Summit', what: 'opened registrations', when: '5h', icon: Calendar },
  { id: 'a3', who: 'Liam Howard', what: 'completed Carbon Accounting 101', when: '1d', icon: Sparkles },
  { id: 'a4', who: 'Climate Council', what: 'posted a new internship', when: '1d', icon: Award },
];

export default function Social() {
  return (
    <div className="container-app py-6 sm:py-10 space-y-6 max-w-3xl">
      <header>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Community</h1>
        <p className="text-sm text-text-secondary mt-1">Quiet, growth-focused. Not a social feed.</p>
      </header>

      <section className="card-elev p-5">
        <h2 className="section-title text-base">Connection requests</h2>
        <div className="mt-3 space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-soft font-semibold text-secondary shrink-0">{r.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground truncate">{r.role} · {r.mutual} mutual</p>
              </div>
              <Button size="sm">Accept</Button>
              <Button size="sm" variant="ghost" className="gap-1.5"><Link className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      </section>

      <section className="card-elev p-5">
        <h2 className="section-title text-base">Recent activity</h2>
        <ul className="mt-3 divide-y divide-border">
          {activity.map((a) => (
            <li key={a.id} className="flex items-start gap-3 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary shrink-0">
                <a.icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">{a.who}</span> <span className="text-text-secondary">{a.what}</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.when} ago</p>
              </div>
              <StatusBadge variant="neutral" icon={false}>View</StatusBadge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
