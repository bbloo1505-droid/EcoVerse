import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/common/FilterChip';
import { interestTopics, auStates, careerStages } from '@/lib/data';
import { useProfile } from '@/context/ProfileContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const [interests, setInterests] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('NSW');
  const [stage, setStage] = useState<string>('student');
  const [exp, setExp] = useState<number>(2);

  const toggle = (t: string) =>
    setInterests((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <div className="container-app py-8 sm:py-12 max-w-2xl">
      <div className="card-elev p-6 sm:p-9">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft text-warning">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="eyebrow">Personalise your experience</span>
        </div>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold">Help us tailor what you see</h1>
        <p className="mt-1.5 text-sm text-text-secondary">Better matches for opportunities, events and mentors. Takes 30 seconds — or skip and do it later.</p>

        <div className="mt-7">
          <h2 className="font-display font-semibold">What interests you?</h2>
          <p className="text-xs text-muted-foreground mt-1">Pick a few — at least 3 helps.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {interestTopics.map((t) => (
              <FilterChip key={t} active={interests.includes(t)} onClick={() => toggle(t)}>{t}</FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-7 grid sm:grid-cols-2 gap-5">
          <div>
            <h2 className="font-display font-semibold">Your location</h2>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15">
              {auStates.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <h2 className="font-display font-semibold">Years of experience</h2>
            <input type="range" min={0} max={15} value={exp} onChange={(e) => setExp(+e.target.value)} className="mt-3 w-full accent-primary" />
            <p className="text-xs text-muted-foreground">{exp === 0 ? 'No experience yet' : `${exp}${exp === 15 ? '+' : ''} years`}</p>
          </div>
        </div>

        <div className="mt-7">
          <h2 className="font-display font-semibold">Career stage</h2>
          <div className="mt-3 grid sm:grid-cols-3 gap-2">
            {careerStages.map((s) => (
              <button
                key={s.id}
                onClick={() => setStage(s.id)}
                className={`text-left rounded-xl border p-3.5 transition-all ${
                  stage === s.id ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:border-primary/40'
                }`}
              >
                <p className="font-display text-sm font-semibold">{s.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => navigate('/home')}>Skip for now</Button>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => {
              updateProfile({
                interests,
                state: location,
                careerStageId: stage,
                yearsExperience: exp,
              });
              navigate('/career-tips');
            }}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
