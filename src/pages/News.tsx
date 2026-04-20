import { useState, useMemo } from 'react';
import { useEcoverseContent } from '@/context/EcoverseContentContext';
import { NewsCard } from '@/components/cards/NewsCard';
import { FilterChip } from '@/components/common/FilterChip';
import { SearchBar } from '@/components/common/SearchBar';
import { NEWS_TOPIC_OPTIONS, coerceNewsTopic } from '@/lib/newsTopics';

const topics = ['All', ...NEWS_TOPIC_OPTIONS] as const;

export default function News() {
  const { news } = useEcoverseContent();
  const [topic, setTopic] = useState('All');
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const qTrim = q.trim();
    const qLower = qTrim.toLowerCase();
    return news.filter((n) => {
      const matchTopic = topic === 'All' || coerceNewsTopic(n.topic) === topic;
      const hay = `${n.title} ${n.excerpt}`.toLowerCase();
      const matchQ = !qTrim || hay.includes(qLower);
      return matchTopic && matchQ;
    });
  }, [topic, q, news]);

  return (
    <div className="container-app py-6 sm:py-10">
      <header className="mb-5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">News</h1>
        <p className="text-sm text-text-secondary mt-1">
          From climate and policy to taxonomy, consulting, land & water, and Indigenous stewardship — filter by topic or search.
        </p>
      </header>

      <SearchBar value={q} onChange={setQ} placeholder="Search news…" className="mb-4" />
      <div className="-mx-4 px-4 overflow-x-auto pb-2 mb-5">
        <div className="flex gap-2 w-max">
          {topics.map((t) => <FilterChip key={t} active={topic === t} onClick={() => setTopic(t)}>{t}</FilterChip>)}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((n) => <NewsCard key={n.id} item={n} />)}
      </div>
    </div>
  );
}
