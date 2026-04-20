import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EcoverseProfile } from "@/types/profile";
import { defaultProfile } from "@/types/profile";
import { useAuth } from "@/context/AuthContext";

export const PROFILE_STORAGE_KEY = "ecoverse_profile_v1";
export const ONBOARDING_SEEN_KEY = "ecoverse_onboarding_seen_v1";

const PLACEHOLDER_NAMES = new Set(["ella"]);

function inferredNameFromEmail(email: string | null | undefined): string {
  const local = (email || "").split("@")[0]?.trim();
  if (!local) return "";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");
}

function loadStored(): EcoverseProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw) as Partial<EcoverseProfile>;
    return { ...defaultProfile(), ...parsed, updatedAt: parsed.updatedAt || new Date().toISOString() };
  } catch {
    return defaultProfile();
  }
}

function saveStored(p: EcoverseProfile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ ...p, updatedAt: new Date().toISOString() }));
  } catch {
    /* ignore quota */
  }
}

type ProfileContextValue = {
  profile: EcoverseProfile;
  setProfile: (p: EcoverseProfile | ((prev: EcoverseProfile) => EcoverseProfile)) => void;
  updateProfile: (patch: Partial<EcoverseProfile>) => void;
  isProfileComplete: boolean;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfileState] = useState<EcoverseProfile>(() => loadStored());

  useEffect(() => {
    saveStored(profile);
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const googleName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
    const fallbackName = inferredNameFromEmail(user.email);
    const nextName = googleName || fallbackName;
    const clearPlaceholder = (prevName: string) => {
      const p = prevName.trim().toLowerCase();
      return !p || PLACEHOLDER_NAMES.has(p);
    };
    if (!nextName && !clearPlaceholder(profile.displayName)) return;
    setProfileState((prev) => {
      if (!clearPlaceholder(prev.displayName)) return prev;
      return { ...prev, displayName: nextName || prev.displayName, updatedAt: new Date().toISOString() };
    });
  }, [user, profile.displayName]);

  const setProfile = useCallback((next: EcoverseProfile | ((prev: EcoverseProfile) => EcoverseProfile)) => {
    setProfileState(next);
  }, []);

  const updateProfile = useCallback((patch: Partial<EcoverseProfile>) => {
    setProfileState((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }));
  }, []);

  const isProfileComplete = useMemo(() => {
    return (
      Boolean(profile.targetCareer.trim()) &&
      profile.interests.length >= 1 &&
      Boolean(profile.state)
    );
  }, [profile]);

  const value = useMemo(
    () => ({ profile, setProfile, updateProfile, isProfileComplete }),
    [profile, setProfile, updateProfile, isProfileComplete],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
