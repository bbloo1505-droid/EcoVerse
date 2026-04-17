export type NavTab = "home" | "news" | "opportunities" | "mentors" | "events";

export type CareerStage = "Student" | "Graduate" | "Early Career" | "Professional";

export interface UserProfile {
  name: string;
  profilePhoto: string;
  location: string;
  careerStage: CareerStage;
  interests: string[];
  linkedInUrl?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: "Volunteer" | "Internship" | "Graduate" | "Entry" | "Research" | "Fellowship";
  deadline: string;
  image: string;
  summary: string;
  tags: string[];
  url?: string;
  source?: string;
  publishedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  host: string;
  date: string;
  format: "In person" | "Online" | "Hybrid";
  location: string;
  image: string;
  summary: string;
  url?: string;
  source?: string;
  publishedAt?: string;
}

export interface Article {
  id: string;
  title: string;
  source: string;
  lastVerified: string;
  image: string;
  summary: string;
  url?: string;
  publishedAt?: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  image: string;
  mentoringSlots: number;
  linkedInUrl: string;
}

export interface Membership {
  id: string;
  organization: string;
  type: string;
  benefits: string;
  joinLink: string;
}
