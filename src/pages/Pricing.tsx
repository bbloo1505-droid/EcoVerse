import { Button } from '@/components/ui/button';
import { Check, ShieldCheck, Bell, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  { name: 'Free', price: '$0', desc: 'Forever', features: ['Browse all opportunities', 'Save, share, apply', 'Up to 5 mentor requests / month', 'Standard event listings'] },
  { name: 'Student Premium', price: '$5', desc: 'AUD/month · with verified .edu.au email', featured: true, features: ['Personalised matches & alerts', 'Unlimited mentor requests', 'Early access to events', 'Premium opportunity filters', 'Priority message responses'] },
  { name: 'Professional Premium', price: '$10', desc: 'AUD/month', features: ['Everything in Student', 'Mentor others (verified profile)', 'Premium membership directory', 'Hiring & posting tools'] },
];

export default function Pricing() {
  return (
    <div className="container-app py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="eyebrow">Simple, transparent pricing</span>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Try Premium free for 14 days</h1>
        <p className="mt-3 text-text-secondary">No card required to start. Cancel anytime, even after billing — see refund policy below.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((p) => (
          <div key={p.name} className={`card-elev p-7 flex flex-col ${p.featured ? 'ring-2 ring-primary shadow-elev relative' : ''}`}>
            {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">Most popular</span>}
            <h3 className="font-display text-xl font-semibold">{p.name}</h3>
            <p className="mt-3"><span className="font-display text-4xl font-bold">{p.price}</span><span className="text-sm text-muted-foreground">/mo AUD</span></p>
            <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
            <ul className="mt-5 space-y-2.5 text-sm flex-1">
              {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-success shrink-0 mt-0.5" /> {f}</li>)}
            </ul>
            <Link to="/signup" className="mt-6"><Button className="w-full" variant={p.featured ? 'default' : 'outline'} size="lg">{p.name === 'Free' ? 'Sign up free' : 'Start 14-day trial'}</Button></Link>
          </div>
        ))}
      </div>

      <section className="mt-14 max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
        <div className="card-elev p-6">
          <div className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /><h3 className="font-display font-semibold">Reminder policy</h3></div>
          <p className="mt-2 text-sm text-text-secondary">We email and notify in-app at <strong>7 days</strong>, <strong>2 days</strong>, and <strong>24 hours</strong> before your trial converts. Cancel anytime in one tap.</p>
        </div>
        <div className="card-elev p-6">
          <div className="flex items-center gap-2"><RotateCcw className="h-5 w-5 text-primary" /><h3 className="font-display font-semibold">Refund policy</h3></div>
          <p className="mt-2 text-sm text-text-secondary">Forgot to cancel? Request a <strong>7-day post-trial courtesy refund</strong> — one-time per account, no questions asked.</p>
        </div>
      </section>

      <section className="mt-10 max-w-3xl mx-auto card-elev bg-secondary-soft border-secondary/20 p-6 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
        <p className="text-sm text-text-secondary">EcoVerse is built for genuine value. We'd rather you stay because you love it — not because you forgot to cancel.</p>
      </section>
    </div>
  );
}
