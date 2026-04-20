import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Calendar, Newspaper, Users, Award, ShieldCheck, Sparkles, Leaf, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImg from '@/assets/hero-eucalyptus.jpg';
import { useTodayHeroBackground } from '@/hooks/useTodayHeroBackground';

const features = [
  { icon: Compass, title: 'Curated opportunities', desc: 'Volunteer days, internships, graduate roles, research and grants — verified and updated weekly.' },
  { icon: Calendar, title: 'Events that matter', desc: 'Career nights, conferences, hackathons and webinars across every Australian state.' },
  { icon: Newspaper, title: 'Sector news, no noise', desc: 'Daily updates on policy, climate, conservation and careers — sourced and timestamped.' },
  { icon: Users, title: 'Real mentorship', desc: 'Direct, requestable conversations with people working in the field today.' },
  { icon: Award, title: 'Memberships directory', desc: 'Find every professional body, student society and industry network worth joining.' },
  { icon: Sparkles, title: 'Personalised home', desc: 'Your interests, location and stage shape what you see — quietly, in the background.' },
];

export default function Landing() {
  const communityHero = useTodayHeroBackground();
  const heroBackdrop = communityHero.imageUrl || heroImg;
  const heroOpacity = communityHero.imageUrl ? 0.35 : 0.18;

  return (
    <div>
      {/* Hero — uses approved community photo when available (same daily rotation as the app home) */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${heroBackdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: heroOpacity,
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        <div className="container-app pt-14 sm:pt-20 pb-16 sm:pb-24">
          <div className="max-w-3xl">
            <span className="eyebrow inline-flex items-center gap-2">
              <Leaf className="h-3.5 w-3.5" /> For environmental students & early-career pros
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] text-foreground">
              Your career in the environment <span className="text-primary">starts here.</span>
            </h1>
            <p className="mt-5 text-lg text-text-secondary max-w-2xl leading-relaxed">
              EcoVerse is the focused hub for Australia's next generation of environmental professionals. Real opportunities,
              real mentors, real community — without the social-media noise.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/signup"><Button size="xl" variant="hero" className="gap-2">Start free trial <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/opportunities"><Button size="xl" variant="outline">Explore opportunities</Button></Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-success" /> 14-day free trial · cancel anytime</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Reminders before you're billed</span>
            </div>
            {communityHero.imageUrl && communityHero.credit ? (
              <p className="mt-5 text-[11px] text-muted-foreground/90">{communityHero.credit}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Logos / trust */}
      <section className="border-y border-border bg-surface-alt/60 py-7">
        <div className="container-app">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center mb-4">
            Connecting students and professionals across
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-text-secondary">
            {['CSIRO', 'Bush Heritage', 'Climate Council', 'AYCC', 'Atlassian ESG', 'Landcare', 'EIANZ'].map(n => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container-app py-16 sm:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow">Everything in one place</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Built for the environmental field — not for everyone.</h2>
          <p className="mt-3 text-text-secondary">We don't try to be LinkedIn. We try to be the most useful tool for people building careers that matter.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-elev p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="bg-surface-alt/60 border-y border-border">
        <div className="container-app py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Trust-first pricing</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Fair pricing. Clear reminders. No surprises.</h2>
            <p className="mt-3 text-text-secondary">Try Premium free for 14 days. We send reminders at 7 days, 2 days and 24 hours before billing — by email and in-app. Forgot to cancel? You have 7 days for a courtesy refund.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '$0', desc: 'Forever free', items: ['Browse all opportunities', 'Save & share content', 'Up to 5 mentor requests'] },
              { name: 'Student Premium', price: '$5', desc: 'AUD / month · with .edu email', items: ['Personalised matching', 'Unlimited mentor requests', 'Early-access events'], featured: true },
              { name: 'Professional', price: '$10', desc: 'AUD / month', items: ['Everything in Student', 'Mentor others', 'Premium directory'] },
            ].map((p) => (
              <div key={p.name} className={`card-elev p-6 ${p.featured ? 'ring-2 ring-primary shadow-elev relative' : ''}`}>
                {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">Most popular</span>}
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                <p className="mt-3"><span className="font-display text-3xl font-bold">{p.price}</span><span className="text-sm text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.items.map((it) => <li key={it} className="flex gap-2"><Check className="h-4 w-4 text-success shrink-0 mt-0.5" />{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/pricing"><Button variant="outline">See full pricing & refund policy</Button></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-16 sm:py-24">
        <div className="card-elev bg-gradient-hero text-primary-foreground p-10 sm:p-14 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Find your next step in the environmental field.</h2>
          <p className="mt-3 max-w-xl mx-auto opacity-90">Join thousands of Australian students and early-career professionals building meaningful careers.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/signup"><Button size="lg" variant="gold">Start your free trial</Button></Link>
            <Link to="/opportunities"><Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10">Browse opportunities</Button></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container-app py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-semibold text-primary"><Leaf className="h-4 w-4" /> EcoVerse</div>
          <div className="flex gap-5"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div>
          <span>© 2025 EcoVerse · Made in Australia</span>
        </div>
      </footer>
    </div>
  );
}
