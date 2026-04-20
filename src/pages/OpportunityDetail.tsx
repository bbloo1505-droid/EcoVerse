import { useParams, Link } from 'react-router-dom';
import { formatDate, daysUntil } from '@/lib/data';
import { useEcoverseContent } from '@/context/EcoverseContentContext';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, MapPin, Calendar, Bookmark, Share2, ExternalLink, Building2 } from 'lucide-react';
import { CardCoverImage } from '@/components/common/CardCoverImage';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { opportunities } = useEcoverseContent();
  const op = opportunities.find((o) => o.id === id);
  if (!op) return <div className="container-app py-10">Not found. <Link to="/opportunities" className="text-primary underline">Back</Link></div>;
  const days = daysUntil(op.deadline);

  return (
    <div className="container-app py-6 sm:py-10 max-w-3xl">
      <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to opportunities
      </Link>
      <article className="card-elev overflow-hidden">
        <CardCoverImage
          src={op.imageUrl}
          alt={op.title}
          aspectClassName="aspect-[2.2/1] max-h-[min(42vh,300px)]"
          className="border-b border-border"
        />
        <div className="bg-gradient-leaf p-6 sm:p-8 border-b border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge variant="neutral" icon={false}>{op.type}</StatusBadge>
            {op.verified && <StatusBadge variant="verified">Verified</StatusBadge>}
            {days > 0 && days <= 14 && <StatusBadge variant="deadline">{days} days left</StatusBadge>}
          </div>
          <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold leading-tight">{op.title}</h1>
          <p className="mt-2 inline-flex items-center gap-2 text-secondary font-semibold"><Building2 className="h-4 w-4" /> {op.org}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {op.location} · {op.remote}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Closes {formatDate(op.deadline)}</span>
            {op.salary && <span className="font-semibold text-foreground">{op.salary}</span>}
          </div>
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="font-display font-semibold text-lg">About this role</h2>
            <p className="mt-2 text-text-secondary leading-relaxed">{op.description}</p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg">What you'll do</h2>
            <ul className="mt-2 space-y-2 text-text-secondary">
              <li className="flex gap-2"><span className="mt-2 h-1 w-1 rounded-full bg-secondary shrink-0" /> Contribute to ongoing field and desk-based work alongside experienced staff.</li>
              <li className="flex gap-2"><span className="mt-2 h-1 w-1 rounded-full bg-secondary shrink-0" /> Collaborate across teams in a values-led organisation.</li>
              <li className="flex gap-2"><span className="mt-2 h-1 w-1 rounded-full bg-secondary shrink-0" /> Develop tangible outputs you can share in your portfolio.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg">Tags</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {op.tags.map((t) => <span key={t} className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-text-secondary">{t}</span>)}
            </div>
          </section>
          <p className="text-xs text-muted-foreground">
            {op.listingBoard ? <>Board: {op.listingBoard} · </> : null}
            Listing: {op.source}
          </p>
        </div>
        <div className="border-t border-border bg-surface-alt/50 p-4 sm:p-5 flex items-center gap-2 sticky bottom-16 md:bottom-0">
          <Button size="lg" className="flex-1 gap-1">Apply now <ExternalLink className="h-4 w-4" /></Button>
          <Button size="lg" variant="outline" className="gap-1.5"><Bookmark className="h-4 w-4" /> Save</Button>
          <Button size="icon" variant="outline" aria-label="Share"><Share2 className="h-4 w-4" /></Button>
        </div>
      </article>
    </div>
  );
}
