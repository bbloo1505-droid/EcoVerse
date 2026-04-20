import { useState, useMemo } from 'react';
import { formatDate } from '@/lib/data';
import { useEcoverseContent } from '@/context/EcoverseContentContext';
import { EventCard } from '@/components/cards/EventCard';
import { FilterChip } from '@/components/common/FilterChip';
import { Calendar, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  INDUSTRY_CATEGORIES,
  matchesIndustryEvent,
  sortEventsBy,
  type OpportunitySort,
} from '@/lib/industryCategories';
import { collectLocationTokens, matchesLocationToken } from '@/lib/locationTokens';

const cats = ['all', 'student', 'meetup', 'conference', 'webinar', 'hackathon'];

export default function Events() {
  const { events } = useEcoverseContent();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [cat, setCat] = useState('all');
  const [locationToken, setLocationToken] = useState('all');
  const [industryId, setIndustryId] = useState('all');
  const [sortBy, setSortBy] = useState<OpportunitySort>('default');

  const locationOptions = useMemo(
    () => collectLocationTokens(events.map((e) => e.location)),
    [events],
  );

  const filtered = useMemo(() => {
    const list = events.filter((e) => {
      const matchCat = cat === 'all' || e.category === cat;
      const matchLoc = locationToken === 'all' || matchesLocationToken(e.location, locationToken);
      const matchIndustry = matchesIndustryEvent(e, industryId);
      return matchCat && matchLoc && matchIndustry;
    });
    return sortEventsBy(list, sortBy);
  }, [cat, events, locationToken, industryId, sortBy]);

  return (
    <div className="container-app py-6 sm:py-10">
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Events</h1>
          <p className="text-sm text-text-secondary mt-1">Career nights, hackathons, conferences and webinars.</p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-surface p-1">
          <Button size="sm" variant={view === 'list' ? 'default' : 'ghost'} onClick={() => setView('list')} className="h-8 px-3 gap-1.5"><List className="h-3.5 w-3.5" /> List</Button>
          <Button size="sm" variant={view === 'calendar' ? 'default' : 'ghost'} onClick={() => setView('calendar')} className="h-8 px-3 gap-1.5"><Calendar className="h-3.5 w-3.5" /> Calendar</Button>
        </div>
      </div>

      <div className="-mx-4 px-4 overflow-x-auto pb-2 mb-4">
        <div className="flex gap-2 w-max">
          {cats.map((c) => <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>{c[0].toUpperCase() + c.slice(1)}</FilterChip>)}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch mb-5">
        <Select value={locationToken} onValueChange={setLocationToken}>
          <SelectTrigger className="h-10 w-full rounded-full border border-border bg-surface sm:w-[min(100%,240px)]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="max-h-[min(70vh,320px)]">
            <SelectItem value="all">All locations</SelectItem>
            {locationOptions.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={industryId} onValueChange={setIndustryId}>
          <SelectTrigger className="h-10 w-full rounded-full border border-border bg-surface sm:min-w-[260px] sm:max-w-[min(100%,320px)]">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent className="max-h-[min(70vh,360px)]">
            <SelectItem value="all">All sectors</SelectItem>
            {INDUSTRY_CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as OpportunitySort)}>
          <SelectTrigger className="h-10 w-full rounded-full border border-border bg-surface sm:w-[220px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Listing order</SelectItem>
            <SelectItem value="location-asc">Location A–Z</SelectItem>
            <SelectItem value="location-desc">Location Z–A</SelectItem>
            <SelectItem value="sector-asc">Sector A–Z</SelectItem>
            <SelectItem value="sector-desc">Sector Z–A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {view === 'list' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((ev) => <EventCard key={ev.id} ev={ev} />)}
        </div>
      ) : (
        <div className="card-elev p-5 sm:p-7">
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-muted-foreground mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 2;
              const ev = filtered.find((e) => new Date(e.date).getDate() === day);
              return (
                <div key={i} className={`aspect-square rounded-lg p-1.5 text-xs flex flex-col ${day < 1 || day > 31 ? 'text-muted-foreground/40' : 'border border-border bg-surface'}`}>
                  <span className="text-[11px] font-medium">{day > 0 && day < 32 ? day : ''}</span>
                  {ev && <span className="mt-auto truncate rounded bg-primary-soft px-1 py-0.5 text-[10px] font-medium text-primary">{ev.title.split(' ').slice(0, 2).join(' ')}</span>}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground text-center">Showing {formatDate(new Date().toISOString(), { month: 'long', year: 'numeric' })}</p>
        </div>
      )}
    </div>
  );
}
