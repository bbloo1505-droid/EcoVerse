import { Bookmark, Share2, Clock, ShieldCheck } from 'lucide-react';
import { type NewsItem, formatDate } from '@/lib/data';
import { CardCoverImage } from '@/components/common/CardCoverImage';
import { coerceNewsTopic } from '@/lib/newsTopics';

export function NewsCard({ item }: { item: NewsItem }) {
  const topicLabel = coerceNewsTopic(item.topic);
  return (
    <article className="card-elev group overflow-hidden transition-all hover:shadow-elev">
      <CardCoverImage
        src={item.imageUrl}
        alt={item.title}
        aspectClassName="aspect-[16/10] sm:aspect-[2/1]"
        className="border-b border-border"
      />
      <div className="p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{topicLabel}</span>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" /> {item.readMins} min read
        </span>
      </div>
      <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:text-primary">
        {item.title}
      </h3>
      <p className="mt-2 text-sm text-text-secondary line-clamp-2">{item.excerpt}</p>
      <div className="mt-4 flex items-center justify-between border-t divider-y pt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{item.source}</span>
          <span>·</span>
          <span>{formatDate(item.publishedAt, { day: 'numeric', month: 'short' })}</span>
          <span className="inline-flex items-center gap-1 text-success ml-1">
            <ShieldCheck className="h-3 w-3" /> Verified
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <button className="rounded-full p-1.5 hover:bg-surface-alt hover:text-primary" aria-label="Save"><Bookmark className="h-4 w-4" /></button>
          <button className="rounded-full p-1.5 hover:bg-surface-alt hover:text-primary" aria-label="Share"><Share2 className="h-4 w-4" /></button>
        </div>
      </div>
      </div>
    </article>
  );
}
