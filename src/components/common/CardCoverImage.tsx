import { cn } from '@/lib/utils';

export function CardCoverImage({
  src,
  alt,
  className,
  aspectClassName = 'aspect-[16/10]',
}: {
  /** When omitted, shows a neutral gradient (feed did not supply an image). */
  src?: string | null;
  alt: string;
  className?: string;
  /** Tailwind aspect / height classes */
  aspectClassName?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-muted', aspectClassName, className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/15 via-muted to-secondary/10"
          aria-hidden
        />
      )}
    </div>
  );
}
