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

const STORAGE_KEY = "ecoverse_profile_v1";

function loadStored(): EcoverseProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw) as Partial<EcoverseProfile>;
    return { ...defaultProfile(), ...parsed, updatedAt: parsed.updatedAt || new Date().toISOString() };
  } catch {
    return defaultProfile();
  }
}

function saveStored(p: EcoverseProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...p, updatedAt: new Date().toISOString() }));
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
  const [profile, setProfileState] = useState<EcoverseProfile>(() => loadStored());

  useEffect(() => {
    saveStored(profile);
  }, [profile]);

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
