import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Loader2, StickyNote, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/context/ProfileContext";
import { DREAM_ROLE_PRESETS, OTHER_PRESET } from "@/lib/dreamRoles";
import {
  DEFAULT_TIP_WALL_KEY,
  TIP_WALL_PRESETS,
  isValidWallKey,
  labelForWallKey,
  wallKeyForCustomRole,
} from "@/lib/tipWallKeys";
import { fetchTipsWall, postTipWall } from "@/lib/tipsWallApi";
import type { CommunityTipNote } from "@/types/communityTip";
import { cn } from "@/lib/utils";

const NOTE_STYLES = [
  {
    card: "bg-[#fff9db] border-amber-200/80 text-amber-950 shadow-[3px_4px_0_rgba(180,140,60,0.12)]",
    pin: "bg-red-500 shadow-sm",
  },
  {
    card: "bg-[#ffe4ec] border-rose-200/80 text-rose-950 shadow-[3px_4px_0_rgba(180,90,110,0.12)]",
    pin: "bg-rose-600 shadow-sm",
  },
  {
    card: "bg-[#e8f8ef] border-emerald-200/70 text-emerald-950 shadow-[3px_4px_0_rgba(60,120,90,0.12)]",
    pin: "bg-emerald-600 shadow-sm",
  },
  {
    card: "bg-[#e6f4ff] border-sky-200/80 text-sky-950 shadow-[3px_4px_0_rgba(70,120,160,0.12)]",
    pin: "bg-sky-600 shadow-sm",
  },
  {
    card: "bg-[#f0e8ff] border-violet-200/75 text-violet-950 shadow-[3px_4px_0_rgba(110,80,160,0.12)]",
    pin: "bg-violet-600 shadow-sm",
  },
  {
    card: "bg-[#fff3e0] border-orange-200/80 text-orange-950 shadow-[3px_4px_0_rgba(180,100,40,0.12)]",
    pin: "bg-orange-600 shadow-sm",
  },
] as const;

function rotationForId(id: string, index: number): number {
  let h = index * 7;
  for (let i = 0; i < id.length; i++) h += id.charCodeAt(i);
  const steps = [-3.5, -2, 1.5, 2.5, -1.2, 3, -2.8, 1.2];
  return steps[h % steps.length];
}

function PostIt({
  tip,
  index,
  showDreamRole,
}: {
  tip: CommunityTipNote;
  index: number;
  showDreamRole: boolean;
}) {
  const skin = NOTE_STYLES[tip.colorIndex % NOTE_STYLES.length];
  const rot = rotationForId(tip.id, index);
  const when = formatDistanceToNow(new Date(tip.createdAt), { addSuffix: true });

  return (
    <article
      className={cn(
        "relative break-inside-avoid rounded-sm border px-4 pb-4 pt-7 mb-6 w-full transition-transform hover:z-10 hover:scale-[1.02]",
        skin.card,
      )}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <span
        className={cn(
          "absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full ring-2 ring-white/80",
          skin.pin,
        )}
        aria-hidden
      />
      {showDreamRole && tip.dreamRole ? (
        <p className="font-display text-[11px] font-bold uppercase tracking-wide text-black/45">{tip.dreamRole}</p>
      ) : null}
      <p className={cn("font-sans text-[15px] leading-snug text-black/85 whitespace-pre-wrap", showDreamRole && tip.dreamRole ? "mt-2" : "mt-0")}>
        {tip.body}
      </p>
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-2 text-[11px] text-black/50">
        <span>{tip.displayName ? `— ${tip.displayName}` : "— Anonymous"}</span>
        <time dateTime={tip.createdAt}>{when}</time>
      </footer>
    </article>
  );
}

export default function TipsWall() {
  const { wallKey: wallKeyParam } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const wallKey = wallKeyParam && isValidWallKey(wallKeyParam) ? wallKeyParam : DEFAULT_TIP_WALL_KEY;

  const [tips, setTips] = useState<CommunityTipNote[]>([]);
  const [wallTitle, setWallTitle] = useState("");
  const [wallLabels, setWallLabels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [preset, setPreset] = useState<string>(DREAM_ROLE_PRESETS[0]);
  const [customRole, setCustomRole] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState(profile.displayName || "");

  useEffect(() => {
    setAuthor((a) => a || profile.displayName || "");
  }, [profile.displayName]);

  useEffect(() => {
    if (wallKeyParam && !isValidWallKey(wallKeyParam)) {
      navigate(`/tips/${DEFAULT_TIP_WALL_KEY}`, { replace: true });
    }
  }, [wallKeyParam, navigate]);

  const skipFetchForOtherForm = preset === OTHER_PRESET && !wallKey.startsWith("custom-");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTipsWall(wallKey);
      setTips(data.tips);
      setWallTitle(data.wallLabel);
      setWallLabels(data.wallLabels || {});
      if (data.wallKey.startsWith("custom-")) {
        setPreset(OTHER_PRESET);
        setCustomRole(data.wallLabels?.[data.wallKey] || labelForWallKey(data.wallKey, data.wallLabels));
      } else {
        const match = TIP_WALL_PRESETS.find((p) => p.key === data.wallKey);
        if (match) setPreset(match.label);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load the tip wall.");
      setTips([]);
    } finally {
      setLoading(false);
    }
  }, [wallKey]);

  useEffect(() => {
    if (skipFetchForOtherForm) {
      setTips([]);
      setWallTitle("New custom role wall");
      setLoading(false);
      return;
    }
    void load();
  }, [wallKey, skipFetchForOtherForm, load]);

  const isCustomWall = wallKey.startsWith("custom-");
  const showDreamRoleOnNotes = isCustomWall;

  const customWallKeyPreview = useMemo(() => {
    if (preset !== OTHER_PRESET) return "";
    const t = customRole.trim();
    if (t.length < 2) return "";
    return wallKeyForCustomRole(t);
  }, [preset, customRole]);

  const onSubmit = async () => {
    let targetWall = wallKey;
    let wallLabel: string | undefined;
    let dreamRole: string | undefined;

    if (preset === OTHER_PRESET) {
      const role = customRole.trim();
      if (role.length < 2) {
        toast.error("Describe your dream role in a few words.");
        return;
      }
      targetWall = wallKeyForCustomRole(role);
      wallLabel = role;
      dreamRole = role;
    } else {
      dreamRole = preset;
    }

    setPosting(true);
    try {
      await postTipWall({
        wallKey: targetWall,
        body: body.trim(),
        displayName: author.trim() || undefined,
        dreamRole,
        wallLabel,
      });
      toast.success("Your note is on the wall.");
      setBody("");
      if (preset === OTHER_PRESET && targetWall !== wallKey) {
        navigate(`/tips/${targetWall}`, { replace: false });
      } else {
        await load();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not post.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)]">
      <div className="container-app py-6 sm:py-10">
        <header className="max-w-3xl mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft text-warning">
              <StickyNote className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">Community</span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">Career tip walls</h1>
            </div>
          </div>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            Each dream role has its own cork board. Pick a wall below, then share a short post-it for people aiming for
            that path.
          </p>
        </header>

        <nav aria-label="Dream role walls" className="-mx-4 px-4 overflow-x-auto pb-4 mb-6">
          <div className="flex gap-2 w-max max-w-full flex-wrap sm:flex-wrap sm:w-full">
            {TIP_WALL_PRESETS.map(({ key, label }) => (
              <Link
                key={key}
                to={`/tips/${key}`}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-xs font-medium transition-colors shrink-0",
                  key === wallKey
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface text-text-secondary hover:border-primary/40",
                )}
              >
                {label}
              </Link>
            ))}
            <span className="self-center text-[11px] text-muted-foreground px-1">Other → use the form</span>
          </div>
        </nav>

        <p className="text-sm font-medium text-foreground mb-2">
          Wall: <span className="text-primary">{wallTitle || labelForWallKey(wallKey, wallLabels)}</span>
        </p>
        {skipFetchForOtherForm ? (
          <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-2 mb-6 max-w-2xl">
            Describe your dream role below, then post — your note will open a dedicated wall for that role. Preset walls
            are hidden while Other is selected in the form.
          </p>
        ) : null}

        <div className="grid gap-10 xl:grid-cols-[minmax(0,340px)_1fr] mb-6">
          <aside className="card-elev h-fit p-5 sm:p-6 space-y-4 xl:sticky xl:top-24">
            <h2 className="font-display font-semibold text-lg">Add your note</h2>
            <div>
              <Label htmlFor="dream-preset" className="text-sm font-medium">
                Dream role for this note
              </Label>
              <select
                id="dream-preset"
                value={preset}
                onChange={(e) => {
                  const v = e.target.value;
                  setPreset(v);
                  if (v !== OTHER_PRESET) {
                    const entry = TIP_WALL_PRESETS.find((p) => p.label === v);
                    if (entry) navigate(`/tips/${entry.key}`, { replace: false });
                  }
                }}
                className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                {DREAM_ROLE_PRESETS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            {preset === OTHER_PRESET && (
              <div>
                <Label htmlFor="dream-custom" className="text-sm font-medium">
                  Describe the role (creates / uses its own wall)
                </Label>
                <Input
                  id="dream-custom"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Reef restoration project lead"
                  className="mt-2"
                  maxLength={120}
                />
                {customWallKeyPreview ? (
                  <p className="mt-1 text-[11px] text-muted-foreground font-mono">Wall id: {customWallKeyPreview}</p>
                ) : null}
              </div>
            )}
            <div>
              <Label htmlFor="tip-body" className="text-sm font-medium">
                Your tip or lesson
              </Label>
              <Textarea
                id="tip-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="One thing that helped you (or would have) — volunteering, a course, how you met someone useful, a mistake to avoid…"
                className="mt-2 min-h-[120px] resize-y text-sm"
                maxLength={800}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">{body.trim().length}/800 · at least 15 characters</p>
            </div>
            <div>
              <Label htmlFor="author" className="text-sm font-medium">
                Name (optional)
              </Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="First name or nickname"
                className="mt-2"
                maxLength={50}
              />
            </div>
            <Button type="button" size="lg" className="w-full gap-2" disabled={posting} onClick={() => void onSubmit()}>
              {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Pin to this wall
            </Button>
          </aside>

          <section
            aria-label="Community tips"
            className="relative rounded-3xl border border-[#c4a574]/40 bg-[#d4b896] p-4 sm:p-8 shadow-inner"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 28px,
                rgba(0,0,0,0.04) 28px,
                rgba(0,0,0,0.04) 29px
              )`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-4 rounded-2xl border border-white/25 opacity-50"
              aria-hidden
            />
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
                <Loader2 className="h-9 w-9 animate-spin text-primary" />
                <p className="text-sm">Unrolling the wall…</p>
              </div>
            ) : tips.length === 0 ? (
              <p className="text-center text-sm text-black/60 py-16 px-4">
                No notes on this wall yet. Be the first to share a tip for this dream role.
              </p>
            ) : (
              <div className="columns-1 sm:columns-2 2xl:columns-3 gap-6 [column-fill:_balance]">
                {tips.map((tip, i) => (
                  <PostIt key={tip.id} tip={tip} index={i} showDreamRole={showDreamRoleOnNotes} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
