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
    image:
      "https://images.unsplash.com/photo-1526481280695-3c4690d5e2ac?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1506973035872-a4f23adf7d27?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    summary: "Coordinate local restoration volunteers and habitat maintenance days.",
    tags: ["Volunteer", "Community", "Weekend"],
  },
];

export const events: Event[] = [
  {
    id: "event-1",
    title: "Future of Environmental Consulting Forum",
    host: "Engineers Australia - Environment College",
    date: "Tue 28 Apr",
    format: "Hybrid",
    location: "Sydney + Online",
    image:
      "https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=1200&q=80",
    summary: "Industry panel on skills pathways for graduates entering consulting.",
  },
  {
    id: "event-2",
    title: "Climate Policy Career Night",
    host: "ANU Environmental Society",
    date: "Thu 30 Apr",
    format: "In person",
    location: "Canberra, ACT",
    image:
      "https://images.unsplash.com/photo-1545044846-351ba102b6d5?auto=format&fit=crop&w=1200&q=80",
    summary: "Meet policy professionals and learn how to break into impact careers.",
  },
];

export const articles: Article[] = [
  {
    id: "article-1",
    title: "New habitat restoration grants open across Queensland councils",
    source: "Environment Australia News",
    lastVerified: "Verified today",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
    summary: "Councils announced fresh funding rounds for regeneration and biodiversity.",
  },
  {
    id: "article-2",
    title: "How entry-level ESG roles are changing in 2026",
    source: "Sustainability Careers AU",
    lastVerified: "Verified 3 hours ago",
    image:
      "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?auto=format&fit=crop&w=1200&q=80",
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
