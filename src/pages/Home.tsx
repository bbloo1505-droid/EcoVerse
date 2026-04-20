import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { OpportunityCard } from '@/components/cards/OpportunityCard';
import { EventCard } from '@/components/cards/EventCard';
import { NewsCard } from '@/components/cards/NewsCard';
import { MentorCard } from '@/components/cards/MentorCard';
import { useEcoverseContent } from '@/context/EcoverseContentContext';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { useTodayHeroBackground } from '@/hooks/useTodayHeroBackground';

function Section({ title, to, children }: { title: string; to: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">{title}</h2>
        <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          See all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const { opportunities, events, news, mentors } = useEcoverseContent();
  const { user } = useAuth();
  const { profile } = useProfile();
  const hero = useTodayHeroBackground();
  const displayName =
    profile.displayName.trim() ||
    (typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : '') ||
    (user?.email?.split('@')[0] ?? 'there');
  const primaryInterests = profile.interests.slice(0, 2);
  const recommendationLine = primaryInterests.length
    ? `Fresh opportunities matched your interests in ${primaryInterests.join(' and ')}.`
    : 'Set your interests in onboarding to improve recommendation quality.';

  return (
    <div className="container-app py-6 sm:py-10 space-y-10">
      {/* Greeting — optional community photo background (rotates daily UTC when approved pool exists) */}
      <header
        className={`card-elev relative overflow-hidden p-6 sm:p-8 border border-border ${hero.imageUrl ? '' : 'bg-gradient-leaf'}`}
      >
        {hero.imageUrl ? (
          <>
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.imageUrl})` }}
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background/92 via-background/82 to-background/72" aria-hidden />
          </>
        ) : null}
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="eyebrow inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Personalised for you</span>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold">Good afternoon, {displayName} 🌱</h1>
            <p className="mt-1 text-sm text-text-secondary">{recommendationLine}</p>
            {hero.imageUrl && hero.caption ? (
              <p className="mt-2 text-xs text-text-secondary max-w-xl">{hero.caption}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/career-tips">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm hover:opacity-95">
                <Sparkles className="h-3.5 w-3.5" /> My career plan
              </span>
            </Link>
            <Link to="/assistant">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-medium border border-border hover:border-primary/40">
                Ask AI coach
              </span>
            </Link>
            <Link to="/tips">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-medium border border-border hover:border-primary/40">
                Community tip wall
              </span>
            </Link>
            <Link to="/share-photo">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-medium border border-border hover:border-primary/40">
                Share homepage photo
              </span>
            </Link>
            <Link to="/opportunities"><span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-medium border border-border hover:border-primary/40">📋 12 saved</span></Link>
          </div>
        </div>
        {hero.imageUrl && hero.credit ? (
          <p className="relative z-10 mt-4 text-[11px] text-muted-foreground">{hero.credit}{hero.dayKeyUtc ? ` · Featured ${hero.dayKeyUtc} (UTC)` : ''}</p>
        ) : null}
      </header>

      <Section title="Recommended opportunities" to="/opportunities">
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.slice(0, 4).map((op) => <OpportunityCard key={op.id} op={op} />)}
        </div>
      </Section>

      <Section title="Upcoming events" to="/events">
        <div className="grid gap-4 md:grid-cols-2">
          {events.slice(0, 4).map((ev) => <EventCard key={ev.id} ev={ev} />)}
        </div>
      </Section>

      <Section title="Latest environmental news" to="/news">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, 3).map((n) => <NewsCard key={n.id} item={n} />)}
        </div>
      </Section>

      <Section title="Mentors open to requests" to="/mentorship">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mentors.slice(0, 3).map((m) => <MentorCard key={m.id} m={m} />)}
        </div>
      </Section>
    </div>
  );
}
