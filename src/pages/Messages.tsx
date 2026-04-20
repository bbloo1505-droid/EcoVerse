import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Send, Shield, ArrowLeft, Check, X } from 'lucide-react';

type Req = { id: string; name: string; role: string; preview: string; ts: string; approved?: boolean };

const initialReqs: Req[] = [
  { id: 'r1', name: 'Sophie Chen', role: 'Head of ESG · Atlassian', preview: 'Hi Ella — happy to chat about your move into ESG. Free Thursday?', ts: '2h' },
  { id: 'r2', name: 'Marcus Tjungurrayi', role: 'Indigenous Ranger Coordinator', preview: 'Saw your interest in cultural fire programs — keen to share more.', ts: '1d' },
  { id: 'r3', name: 'Climate Council', role: 'Recruiting team', preview: 'Following up on your internship application — quick question…', ts: '3d' },
];

export default function Messages() {
  const [reqs, setReqs] = useState(initialReqs);
  const [active, setActive] = useState<Req | null>(null);

  const approve = (id: string) => setReqs((r) => r.map((x) => x.id === id ? { ...x, approved: true } : x));
  const decline = (id: string) => setReqs((r) => r.filter((x) => x.id !== id));

  if (active) {
    return (
      <div className="container-app py-4 max-w-2xl">
        <button onClick={() => setActive(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-4"><ArrowLeft className="h-4 w-4" /> Inbox</button>
        <div className="card-elev overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 12rem)' }}>
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero font-semibold text-primary-foreground">{active.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
              <div>
                <p className="font-display font-semibold text-sm">{active.name}</p>
                <p className="text-xs text-muted-foreground">{active.role}</p>
              </div>
            </div>
            <button className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-destructive"><Shield className="h-3.5 w-3.5" /> Report</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-alt/40">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm border border-border">{active.preview}</div>
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">Thanks so much for accepting! Thursday at 2pm works for me — happy to send a calendar invite.</div>
          </div>
          <div className="border-t border-border p-3 flex items-center gap-2">
            <input className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" placeholder="Type a message…" />
            <Button size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-6 sm:py-10 max-w-2xl">
      <header className="mb-5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Inbox</h1>
        <p className="text-sm text-text-secondary mt-1">Messages open only after both sides approve. Keeps things safe and intentional.</p>
      </header>

      <div className="space-y-3">
        {reqs.map((r) => (
          <article key={r.id} className="card-elev p-4 flex gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-soft font-semibold text-secondary shrink-0">{r.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-semibold text-sm truncate">{r.name}</p>
                {!r.approved && <StatusBadge variant="info" icon={false}>Request</StatusBadge>}
                <span className="ml-auto text-[11px] text-muted-foreground">{r.ts}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{r.role}</p>
              <p className="text-sm text-text-secondary mt-1.5 line-clamp-2">{r.preview}</p>
              <div className="mt-3 flex gap-2">
                {r.approved ? (
                  <Button size="sm" onClick={() => setActive(r)}>Open chat</Button>
                ) : (
                  <>
                    <Button size="sm" onClick={() => approve(r.id)} className="gap-1"><Check className="h-3.5 w-3.5" /> Approve</Button>
                    <Button size="sm" variant="ghost" onClick={() => decline(r.id)} className="gap-1"><X className="h-3.5 w-3.5" /> Decline</Button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
