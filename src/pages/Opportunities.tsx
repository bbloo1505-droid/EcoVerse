import { useState, useMemo } from 'react';
import { OpportunityCard } from '@/components/cards/OpportunityCard';
import { FilterChip } from '@/components/common/FilterChip';
import { SearchBar } from '@/components/common/SearchBar';
import { useEcoverseContent } from '@/context/EcoverseContentContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  INDUSTRY_CATEGORIES,
  matchesIndustryCategory,
  matchesListingBoard,
  sortOpportunitiesBy,
  type OpportunitySort,
} from '@/lib/industryCategories';
import { JobBoardSearchStrip } from '@/components/opportunities/JobBoardSearchStrip';
import { collectLocationTokens, matchesLocationToken } from '@/lib/locationTokens';
import { matchesOpportunitySearchQuery } from '@/lib/opportunitySearch';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'internship', label: 'Internship' },
  { id: 'entry', label: 'Entry' },
  { id: 'mid-senior', label: 'Mid/Senior' },
  { id: 'research', label: 'Research' },
  { id: 'grant', label: 'Grants' },
];

export default function Opportunities() {
  const { opportunities } = useEcoverseContent();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [locationToken, setLocationToken] = useState('all');
  const [industryId, setIndustryId] = useState('all');
  const [boardId, setBoardId] = useState('all');
  const [sortBy, setSortBy] = useState<OpportunitySort>('default');

  const uniqueOpportunities = useMemo(() => {
    const byId = new Map<string, (typeof opportunities)[number]>();
    for (const o of opportunities) {
      if (!byId.has(o.id)) byId.set(o.id, o);
    }
    return [...byId.values()];
  }, [opportunities]);

  const locationOptions = useMemo(
    () => collectLocationTokens(uniqueOpportunities.map((o) => o.location)),
    [uniqueOpportunities],
  );

  const boardOptions = useMemo(() => {
    const preset = ['EcoVerse curated', 'GoodWork', 'Green Dream Jobs', 'Conservation Careers', 'EcoJobs'];
    const fromData = new Set<string>();
    for (const o of uniqueOpportunities) {
      const b = o.listingBoard?.trim();
      if (b) fromData.add(b);
    }
    const ordered = [...preset];
    const extras = [...fromData]
      .filter((b) => !ordered.includes(b))
      .sort((a, c) => a.localeCompare(c, 'en-AU'));
    return [...ordered, ...extras];
  }, [uniqueOpportunities]);

  const filtered = useMemo(() => {
    const list = uniqueOpportunities.filter((o) => {
      const matchTab = tab === 'all' || o.type === tab;
      const matchLoc = locationToken === 'all' || matchesLocationToken(o.location, locationToken);
      const matchIndustry = matchesIndustryCategory(o, industryId);
      const matchBoard = matchesListingBoard(o, boardId);
      const matchQ = matchesOpportunitySearchQuery(o, q);
      return matchTab && matchLoc && matchIndustry && matchBoard && matchQ;
    });
    return sortOpportunitiesBy(list, sortBy);
  }, [tab, q, uniqueOpportunities, locationToken, industryId, boardId, sortBy]);

  return (
    <div className="container-app py-6 sm:py-10">
      <header className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Opportunities</h1>
        <p className="text-sm text-text-secondary mt-1">
          Filter by <span className="font-medium text-foreground">career pathway</span> (ecology, water, climate, consulting…),{' '}
          <span className="font-medium text-foreground">job board / source</span>, role type, and location — or sort by location or pathway.
        </p>
      </header>

      <JobBoardSearchStrip />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch mb-4">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Search title, org, location, or skill…"
          className="min-w-0 flex-1 sm:min-w-[200px]"
        />
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
            <SelectValue placeholder="Career pathway" />
          </SelectTrigger>
          <SelectContent className="max-h-[min(70vh,360px)]">
            <SelectItem value="all">All career pathways</SelectItem>
            {INDUSTRY_CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={boardId} onValueChange={setBoardId}>
          <SelectTrigger className="h-10 w-full rounded-full border border-border bg-surface sm:min-w-[220px] sm:max-w-[min(100%,280px)]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent className="max-h-[min(70vh,320px)]">
            <SelectItem value="all">All sources</SelectItem>
            {boardOptions.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
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

      <div className="-mx-4 px-4 overflow-x-auto pb-2 mb-5">
        <div className="flex gap-2 w-max">
          {tabs.map((t) => (
            <FilterChip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</FilterChip>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">{filtered.length} results</p>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((op) => <OpportunityCard key={op.id} op={op} />)}
      </div>
    </div>
  );
}
