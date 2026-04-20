import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Bell, Mail, CreditCard, RotateCcw, AlertTriangle } from 'lucide-react';

export default function Account() {
  return (
    <div className="container-app py-6 sm:py-10 max-w-3xl space-y-5">
      <header>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Account & billing</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your subscription, reminders and refund options.</p>
      </header>

      <section className="card-elev p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold">Student Premium</h2>
              <StatusBadge variant="premium">Trial</StatusBadge>
            </div>
            <p className="mt-1 text-sm text-text-secondary">11 days left of your free trial. You'll be charged AUD $5.00 on <strong>1 Nov 2025</strong>.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Change plan</Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">Cancel trial</Button>
          </div>
        </div>
        <div className="mt-5 h-2 rounded-full bg-surface-alt overflow-hidden">
          <div className="h-full bg-gradient-hero" style={{ width: '21%' }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">3 of 14 days used</p>
      </section>

      <section className="card-elev p-6">
        <h2 className="font-display font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment method</h2>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-surface-alt/50 p-4">
          <div>
            <p className="text-sm font-medium">Visa ending 4242</p>
            <p className="text-xs text-muted-foreground">Expires 09/27</p>
          </div>
          <Button size="sm" variant="ghost">Update</Button>
        </div>
      </section>

      <section className="card-elev p-6">
        <h2 className="font-display font-semibold flex items-center gap-2"><Bell className="h-4 w-4" /> Reminders</h2>
        <p className="mt-1 text-xs text-muted-foreground">We remind you before any billing — choose how.</p>
        <div className="mt-4 space-y-3">
          {[
            { label: 'Email reminders (7d, 2d, 24h)', icon: Mail, on: true },
            { label: 'In-app notifications', icon: Bell, on: true },
            { label: 'SMS reminders', icon: Bell, on: false },
          ].map((r) => (
            <label key={r.label} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 cursor-pointer">
              <span className="inline-flex items-center gap-2.5 text-sm"><r.icon className="h-4 w-4 text-muted-foreground" /> {r.label}</span>
              <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${r.on ? 'bg-primary' : 'bg-border'}`}>
                <span className={`inline-block h-5 w-5 rounded-full bg-surface shadow transition-transform ${r.on ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="card-elev bg-gold-soft/40 border-gold/20 p-6">
        <h2 className="font-display font-semibold flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Refund policy</h2>
        <p className="mt-2 text-sm text-text-secondary">If you forget to cancel, request a <strong>7-day courtesy refund</strong> after your first billing — no questions asked. One-time per account.</p>
        <Button variant="outline" size="sm" className="mt-4">Request refund</Button>
      </section>

      <section className="card-elev p-6 border-destructive/30">
        <h2 className="font-display font-semibold flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /> Danger zone</h2>
        <p className="mt-2 text-sm text-text-secondary">Permanently delete your EcoVerse account and all associated data.</p>
        <Button variant="ghost" size="sm" className="mt-3 text-destructive hover:bg-destructive/10">Delete account</Button>
      </section>
    </div>
  );
}
