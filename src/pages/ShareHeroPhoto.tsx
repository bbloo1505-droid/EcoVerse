import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Camera, Loader2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitHeroPhoto } from "@/lib/heroPhotoApi";
import { useProfile } from "@/context/ProfileContext";

export default function ShareHeroPhoto() {
  const { profile } = useProfile();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [name, setName] = useState(profile.displayName || "");
  const [posting, setPosting] = useState(false);

  const onSubmit = async () => {
    if (!file) {
      toast.error("Choose a photo (JPEG, PNG, or WebP, max 5 MB).");
      return;
    }
    const fd = new FormData();
    fd.append("photo", file);
    fd.append("caption", caption);
    fd.append("submitterName", name);
    setPosting(true);
    try {
      const { message } = await submitHeroPhoto(fd);
      toast.success(message || "Submitted for review.");
      setFile(null);
      setCaption("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="container-app py-6 sm:py-10 max-w-xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Camera className="h-5 w-5" />
        </span>
        <div>
          <span className="eyebrow inline-flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5" /> Community
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Share a nature photo</h1>
        </div>
      </div>
      <p className="text-sm text-text-secondary mb-8">
        Landscapes, plants, wildlife, waterways — your own work only. If a moderator approves it, it joins the pool that
        rotates as the <strong className="font-medium text-foreground">app homepage</strong> background (one featured
        photo per UTC day). Nothing appears until it is accepted.
      </p>

      <div className="card-elev p-5 sm:p-7 space-y-5">
        <div>
          <Label htmlFor="photo" className="font-medium">
            Photo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-2 cursor-pointer"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Max 5 MB. No people as the main subject, please.</p>
        </div>
        <div>
          <Label htmlFor="caption" className="font-medium">
            Short caption (optional)
          </Label>
          <Textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Old man banksia after rain — Royal National Park"
            className="mt-2 min-h-[72px]"
            maxLength={280}
          />
        </div>
        <div>
          <Label htmlFor="name" className="font-medium">
            Credit name (optional)
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name or how you want to appear"
            className="mt-2"
            maxLength={80}
          />
        </div>
        <Button type="button" size="lg" className="w-full gap-2" disabled={posting} onClick={() => void onSubmit()}>
          {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          Submit for review
        </Button>
        <p className="text-[11px] text-muted-foreground">
          By uploading you confirm you own the rights to the image and grant EcoVerse a non-exclusive licence to display
          it in the product. Moderators may reject images that are off-topic, low quality, or unsuitable.
        </p>
        <Button variant="ghost" asChild className="w-full">
          <Link to="/home">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
