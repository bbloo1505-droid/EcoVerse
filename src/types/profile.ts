/** Saved locally (and optionally synced to Supabase later). */
export interface EcoverseProfile {
  displayName: string;
  /** Preferred onboarding depth for pathway planning. */
  pathwayPlanMode?: "simple" | "detailed";
  /** Role or field the user wants (e.g. environmental consulting, bush regeneration ecologist). */
  targetCareer: string;
  interests: string[];
  /** Australian state/region code from onboarding (e.g. NSW, VIC). */
  state: string;
  careerStageId: string;
  yearsExperience: number;
  education?: string;
  linkedInUrl?: string;
  /** Background, prior roles, constraints — helps the AI tailor advice. */
  aboutMe?: string;
  updatedAt: string;
}

export const defaultProfile = (): EcoverseProfile => ({
  displayName: "",
  pathwayPlanMode: "simple",
  targetCareer: "",
  interests: [],
  state: "NSW",
  careerStageId: "student",
  yearsExperience: 0,
  education: "",
  linkedInUrl: "",
  aboutMe: "",
  updatedAt: new Date().toISOString(),
});
