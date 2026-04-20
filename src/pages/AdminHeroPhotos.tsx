import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminApproveHeroPhoto,
  adminListHeroPhotos,
  adminRejectHeroPhoto,
  resolvePublicMediaUrl,
} from "@/lib/heroPhotoApi";
import type { HeroPhotoRecord, HeroPhotoStatus } from "@/types/heroPhoto";
import { cn } from "@/lib/utils";

const ADMIN_TOKEN_KEY = "ecoverse_admin_token";

export default function AdminHeroPhotos() {
  const [tokenInput, setTokenInput] = useState(() => sessionStorage.getItem(ADMIN_TOKEN_KEY) || "");
  /** Token used for API calls (updated when you click Refresh, not on every keystroke). */
  const [activeToken, setActiveToken] = useState(() => sessionStorage.getItem(ADMIN_TOKEN_KEY) || "");
  const [filter, setFilter] = useState<HeroPhotoStatus | "all">("pending");
  const [photos, setPhotos] = useState<HeroPhotoRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!activeToken.trim()) {
      setPhotos([]);
      return;
    }
    setLoading(true);
    try {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, activeToken.trim());
      const { photos: list } = await adminListHeroPhotos(activeToken.trim(), filter);
      setPhotos(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load queue.");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [activeToken, filter]);

  useEffect(() => {
    if (!activeToken.trim()) {
      setPhotos([]);
      return;
    }
    void load();
  }, [activeToken, filter, load]);

  const applyTokenAndRefresh = () => {
    const t = tokenInput.trim();
    setActiveToken(t);
    if (!t) {
      setPhotos([]);
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  };

  const approve = async (id: string) => {
    setActingId(id);
    try {
      await adminApproveHeroPhoto(activeToken.trim(), id);
      toast.success("Approved — it can appear on the homepage rotation.");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approve failed.");
    } finally {
      setActingId(null);
    }
  };

  const reject = async (id: string) => {
    setActingId(id);
    try {
      await adminRejectHeroPhoto(activeToken.trim(), id);
      toast.success("Rejected.");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reject failed.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="container-app py-6 sm:py-10 max-w-4xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Shield className="h-5 w-5" />
        </span>
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="font-display text-2xl font-bold">Homepage photo queue</h1>
        </div>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Set <code className="rounded bg-muted px-1 py-0.5 text-xs">ECOVERSE_ADMIN_TOKEN</code> on the API server, then
        paste the same value here. Approve photos to add them to the daily rotation (UTC midnight). Reject removes the
        file from disk.
      </p>

      <div className="card-elev p-5 sm:p-6 space-y-4 mb-8">
        <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <Label htmlFor="adm-tok">Admin token</Label>
            <Input
              id="adm-tok"
              type="password"
              autoComplete="off"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste token from server env"
              className="mt-2 font-mono text-sm"
            />
          </div>
          <Button type="button" variant="secondary" onClick={applyTokenAndRefresh} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply & refresh"}
          </Button>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Filter</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["pending", "approved", "rejected", "all"] as const).map((f) => (
              <Button
                key={f}
                type="button"
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {loading && photos.length === 0 ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : photos.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">No photos in this queue.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {photos.map((p) => {
            const src = resolvePublicMediaUrl(`/uploads/hero/${p.storageName}`);
            const showImg = p.status !== "rejected" && src;
            return (
              <li key={p.id} className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-muted relative">
                  {showImg ? (
                    <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground p-4 text-center">
                      File removed (rejected)
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider w-fit rounded-full px-2 py-0.5",
                      p.status === "pending" && "bg-warning/20 text-warning",
                      p.status === "approved" && "bg-success/20 text-success",
                      p.status === "rejected" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {p.status}
                  </span>
                  {p.caption ? <p className="text-sm text-foreground">{p.caption}</p> : null}
                  <p className="text-xs text-muted-foreground">
                    By {p.submitterName || "Anonymous"} · {new Date(p.submittedAt).toLocaleString()}
                  </p>
                  {p.status === "pending" && (
                    <div className="flex gap-2 mt-auto pt-2">
                      <Button
                        type="button"
                        size="sm"
                        className="gap-1"
                        disabled={actingId === p.id}
                        onClick={() => void approve(p.id)}
                      >
                        {actingId === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Approve
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive"
                        disabled={actingId === p.id}
                        onClick={() => void reject(p.id)}
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
