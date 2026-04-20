import { ExternalLink } from "lucide-react";
import { EXTERNAL_JOB_BOARD_LINKS } from "@/lib/externalJobBoardLinks";

export function JobBoardSearchStrip() {
  return (
    <section className="rounded-2xl border border-border bg-surface-alt/40 p-4 sm:p-5 mb-8">
      <h2 className="font-display text-sm font-semibold text-foreground">Also search major job boards</h2>
      <p className="mt-1 text-xs text-text-secondary max-w-3xl leading-relaxed">
        Seek, Indeed, LinkedIn, and GradConnection do not publish stable public RSS feeds for every search. EcoVerse pulls
        listings from environmental-focused RSS sources below, and these buttons open saved searches so you can cross-check
        the same roles (and many more) on each board.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {EXTERNAL_JOB_BOARD_LINKS.map((b) => (
          <li key={b.id}>
            <a
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              title={b.description}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-primary-soft/30 transition-colors"
            >
              {b.label}
              <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
