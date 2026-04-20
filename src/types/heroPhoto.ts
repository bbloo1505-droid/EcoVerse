export type HeroPhotoStatus = "pending" | "approved" | "rejected";

export type HeroPhotoRecord = {
  id: string;
  storageName: string;
  caption: string;
  submitterName: string;
  status: HeroPhotoStatus;
  submittedAt: string;
  reviewedAt: string | null;
  approvedAt: string | null;
};

export type TodayHeroPhotoResponse = {
  imagePath: string | null;
  caption: string | null;
  credit: string | null;
  dayKeyUtc: string | null;
  hasPhoto: boolean;
  photoId?: string;
};
