import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Compass, Loader2, Sparkles } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FilterChip } from "@/components/common/FilterChip";
import { fetchCareerTips } from "@/lib/careerTipsApi";
import { interestTopics, auStates, careerStages } from "@/lib/data";

export default function CareerTips() {
  const { profile, updateProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!profile.targetCareer.trim()) {
      toast.error("Add a target career so we can tailor your plan.");
      return;
    }
    if (profile.interests.length < 1) {
      toast.error("Pick at least one interest area.");
      return;
    }
    setLoading(true);
    setMarkdown(null);
    try {
      const { markdown: md } = await fetchCareerTips(profile);
      setMarkdown(md);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not generate plan.");
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const toggleInterest = (t: string) => {
    const next = profile.interests.includes(t)
      ? profile.interests.filter((x) => x !== t)
      : [...profile.interests, t];
    updateProfile({ interests: next });
  };

  return (
    <div className="container-app py-6 sm:py-10 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Compass className="h-5 w-5" />
          </span>
          <div>
            <span className="eyebrow inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Your path
            </span>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold">Career pathway plan</h1>
            <p className="mt-1 text-sm text-text-secondary max-w-2xl">
              We use your profile to suggest volunteering ideas, networking moves, stepping stones, and what to learn — based
              on common public pathways people describe for environmental careers in Australia and Aotearoa (AI-generated;
              verify courses and roles yourself).
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="card-elev p-5 sm:p-7 space-y-6">
          <div>
            <Label htmlFor="targetCareer" className="text-base font-display font-semibold">
              Target career <span className="text-destructive">*</span>
            </Label>
            <Input
              id="targetCareer"
              value={profile.targetCareer}
              onChange={(e) => updateProfile({ targetCareer: e.target.value })}
              placeholder="e.g. contaminated land consultant, marine ecologist, climate policy analyst"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="displayName" className="font-display font-semibold">
              Your name (optional)
            </Label>
            <Input
              id="displayName"
              value={profile.displayName}
              onChange={(e) => updateProfile({ displayName: e.target.value })}
              placeholder="How you’d like to be addressed"
              className="mt-2"
            />
          </div>

          <div>
            <h2 className="font-display font-semibold text-sm">Interests</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Pick topics that match your direction — at least one.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {interestTopics.map((t) => (
                <FilterChip key={t} active={profile.interests.includes(t)} onClick={() => toggleInterest(t)}>
                  {t}
                </FilterChip>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state" className="font-display font-semibold">
                State / region
              </Label>
              <select
                id="state"
                value={profile.state}
                onChange={(e) => updateProfile({ state: e.target.value })}
                className="mt-2 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                {auStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="exp" className="font-display font-semibold">
                Years of experience
              </Label>
              <input
                id="exp"
                type="range"
                min={0}
                max={15}
                value={profile.yearsExperience}
                onChange={(e) => updateProfile({ yearsExperience: +e.target.value })}
                className="mt-4 w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground">
                {profile.yearsExperience === 0
                  ? "No paid experience yet"
                  : `${profile.yearsExperience}${profile.yearsExperience === 15 ? "+" : ""} years`}
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display font-semibold text-sm">Career stage</h2>
            <div className="mt-2 grid sm:grid-cols-3 gap-2">
              {careerStages.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => updateProfile({ careerStageId: s.id })}
                  className={`text-left rounded-xl border p-3 transition-all ${
                    profile.careerStageId === s.id
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-surface hover:border-primary/40"
                  }`}
                >
                  <p className="font-display text-sm font-semibold">{s.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="education" className="font-display font-semibold">
              Education (optional)
            </Label>
            <Input
              id="education"
              value={profile.education ?? ""}
              onChange={(e) => updateProfile({ education: e.target.value })}
              placeholder="e.g. BSc Environmental Science (in progress)"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="linkedIn" className="font-display font-semibold">
              LinkedIn (optional)
            </Label>
            <Input
              id="linkedIn"
              value={profile.linkedInUrl ?? ""}
              onChange={(e) => updateProfile({ linkedInUrl: e.target.value })}
              placeholder="https://linkedin.com/in/…"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="aboutMe" className="font-display font-semibold">
              About you (optional)
            </Label>
            <Textarea
              id="aboutMe"
              value={profile.aboutMe ?? ""}
              onChange={(e) => updateProfile({ aboutMe: e.target.value })}
              placeholder="Background, constraints, what you’ve tried — helps tailor networking and stepping stones."
              className="mt-2 min-h-[100px] resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
            <Button size="lg" className="gap-2" onClick={() => void generate()} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate personalised plan
            </Button>
            <Button variant="outline" asChild>
              <Link to="/assistant">Chat with AI coach</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/tips">Read the tip wall</Link>
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tips are generated from your profile and general patterns — not live scraping of individuals. AI can be wrong;
            double-check courses, visas, and employers.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-alt/60 p-5 sm:p-7 min-h-[320px]">
          {!markdown && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center text-sm text-muted-foreground gap-2 py-12 px-4">
              <Compass className="h-10 w-10 opacity-40" />
              <p>Your plan will appear here — volunteering, networking, stepping stones, skills, and next steps.</p>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Building your pathway…</p>
            </div>
          )}
          {markdown && !loading && (
            <article className="career-plan-md text-sm leading-relaxed text-foreground">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="font-display text-lg font-bold text-foreground mt-8 first:mt-0 mb-2 pb-1 border-b border-border">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-display text-base font-semibold mt-4 mb-1.5">{children}</h3>
                  ),
                  p: ({ children }) => <p className="mt-2 first:mt-0 text-text-secondary [&:has(strong)]:text-foreground">{children}</p>,
                  ul: ({ children }) => <ul className="mt-2 ml-4 list-disc space-y-1.5 text-text-secondary">{children}</ul>,
                  ol: ({ children }) => <ol className="mt-2 ml-4 list-decimal space-y-1.5 text-text-secondary">{children}</ol>,
                  li: ({ children }) => <li className="pl-0.5">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  a: ({ href, children }) => (
                    <a href={href} className="text-primary font-medium underline underline-offset-2 hover:opacity-90" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
