import type {
  Article,
  Event,
  Membership,
  MentorProfile,
  Opportunity,
  UserProfile,
} from "../types";

export const userProfile: UserProfile = {
  name: "Brooke",
  profilePhoto:
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
  location: "Brisbane, QLD",
  careerStage: "Student",
  interests: ["Conservation", "Climate Policy", "ESG Consulting"],
  linkedInUrl: "https://www.linkedin.com/in/your-profile",
};

export const opportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Marine Conservation Internship",
    organization: "Great Barrier Reef Foundation",
    location: "Cairns, QLD",
    type: "Internship",
    deadline: "Closes in 6 days",
    summary: "Field and data support role focused on reef monitoring and restoration.",
    tags: ["Paid", "Field Work", "Student Friendly"],
  },
  {
    id: "opp-2",
    title: "Sustainability Analyst Graduate Role",
    organization: "EcoAdvisory AU",
    location: "Sydney, NSW",
    type: "Graduate",
    deadline: "Closes in 10 days",
    summary: "Support ESG reporting, stakeholder analysis, and emissions data projects.",
    tags: ["Hybrid", "Graduate", "Consulting"],
  },
  {
    id: "opp-3",
    title: "Bushcare Weekend Volunteer Lead",
    organization: "Landcare Australia",
    location: "Melbourne, VIC",
    type: "Volunteer",
    deadline: "Always open",
    summary: "Coordinate local restoration volunteers and habitat maintenance days.",
    tags: ["Volunteer", "Community", "Weekend"],
  },
];

export const events: Event[] = [
  {
    id: "event-1",
    title: "Future of Environmental Consulting Forum",
    host: "Engineers Australia - Environment College",
    date: "2026-04-28",
    format: "Hybrid",
    location: "Sydney + Online",
    summary: "Industry panel on skills pathways for graduates entering consulting.",
    publishedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "event-2",
    title: "Climate Policy Career Night",
    host: "ANU Environmental Society",
    date: "2026-04-30",
    format: "In person",
    location: "Canberra, ACT",
    summary: "Meet policy professionals and learn how to break into impact careers.",
    publishedAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "event-mock-ozwater",
    title: "Ozwater 2026",
    host: "Australian Water Association",
    date: "2026-05-05",
    format: "In person",
    location: "Melbourne Convention Centre, VIC",
    summary: "Australia’s flagship water conference — technical program and careers fair.",
    publishedAt: "2025-10-01T00:00:00.000Z",
  },
  {
    id: "event-mock-landcare-nsw",
    title: "NSW Landcare and Local Land Services Conference 2026",
    host: "Landcare NSW & Local Land Services",
    date: "2026-10-27",
    format: "In person",
    location: "Corowa, NSW",
    summary: "Regional Landcare conference — workshops and field visits (confirm dates with organisers).",
    publishedAt: "2025-09-01T00:00:00.000Z",
  },
  {
    id: "event-mock-national-landcare-2027",
    title: "National Landcare Conference 2027",
    host: "Landcare Australia",
    date: "2027-09-06",
    format: "Hybrid",
    location: "Adelaide Convention Centre, SA",
    summary: "National forum — Adelaide, early September 2027 (see official program).",
    publishedAt: "2025-09-01T00:00:00.000Z",
  },
  {
    id: "event-mock-carbon-webinar",
    title: "Carbon markets & biodiversity credits — intro webinar",
    host: "Carbon Market Institute",
    date: "2026-04-08",
    format: "Online",
    location: "Online",
    summary: "Intro for graduates on how carbon and nature markets work in Australia.",
    publishedAt: "2026-01-10T00:00:00.000Z",
  },
];

export const articles: Article[] = [
  {
    id: "article-1",
    title: "New habitat restoration grants open across Queensland councils",
    source: "Environment Australia News",
    lastVerified: "Verified today",
    summary: "Councils announced fresh funding rounds for regeneration and biodiversity.",
  },
  {
    id: "article-2",
    title: "How entry-level ESG roles are changing in 2026",
    source: "Sustainability Careers AU",
    lastVerified: "Verified 3 hours ago",
    summary: "Firms are increasingly hiring graduates with mixed policy and analytics skills.",
  },
];

export const mentors: MentorProfile[] = [
  {
    id: "mentor-1",
    name: "Dr. Chloe Tan",
    role: "Principal Ecologist, Wetland Strategies",
    expertise: ["Conservation Planning", "Field Methods", "Career Strategy"],
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
    mentoringSlots: 2,
    linkedInUrl: "https://www.linkedin.com/in/chloe-tan-eco",
  },
  {
    id: "mentor-2",
    name: "Marcus Reid",
    role: "ESG Consultant, Impact Advisory",
    expertise: ["ESG Reporting", "Graduate Hiring", "Consulting Skills"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    mentoringSlots: 1,
    linkedInUrl: "https://www.linkedin.com/in/marcus-reid-esg",
  },
];

export const memberships: Membership[] = [
  {
    id: "member-1",
    organization: "Environment Institute of Australia and New Zealand",
    type: "Student & Professional Membership",
    benefits:
      "Events, mentoring programs, member rates, and national professional network access.",
    joinLink: "https://www.eianz.org/membership",
  },
  {
    id: "member-2",
    organization: "Australasian Land and Groundwater Association",
    type: "Emerging Professionals Membership",
    benefits:
      "Technical sessions, conference discounts, and career development workshops.",
    joinLink: "https://landandgroundwater.com/membership",
  },
];
