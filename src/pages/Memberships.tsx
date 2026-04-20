import { useState, useMemo } from 'react';
import { useEcoverseContent } from '@/context/EcoverseContentContext';
import { MembershipCard } from '@/components/cards/MembershipCard';
import { FilterChip } from '@/components/common/FilterChip';
import { SearchBar } from '@/components/common/SearchBar';

const cats = ['All', 'Professional Body', 'Advocacy', 'Industry Network', 'Scientific Society'];

export default function Memberships() {
  const { memberships } = useEcoverseContent();
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const qTrim = q.trim();
    const qLower = qTrim.toLowerCase();
    return memberships.filter((m) => {
      const matchCat = cat === 'All' || m.category === cat;
      const hay = `${m.org} ${m.benefits.join(' ')} ${m.location}`.toLowerCase();
      const matchQ = !qTrim || hay.includes(qLower);
      return matchCat && matchQ;
    });
  }, [cat, q, memberships]);

  return (
    <div className="container-app py-6 sm:py-10">
      <header className="mb-5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Memberships directory</h1>
        <p className="text-sm text-text-secondary mt-1">Professional bodies, networks and scientific societies worth joining.</p>
      </header>

      <SearchBar value={q} onChange={setQ} placeholder="Search organisations…" className="mb-4" />
      <div className="-mx-4 px-4 overflow-x-auto pb-2 mb-5">
        <div className="flex gap-2 w-max">
          {cats.map((c) => <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</FilterChip>)}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => <MembershipCard key={m.id} m={m} />)}
      </div>
    </div>
  );
}
