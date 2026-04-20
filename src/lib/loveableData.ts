import { mentorHeadshotImage } from "./contentImages";

// Realistic Australian environmental sector mock data
export type Opportunity = {
  id: string;
  title: string;
  org: string;
  location: string;
  remote: 'on-site' | 'hybrid' | 'remote';
  type: 'volunteer' | 'internship' | 'entry' | 'mid-senior' | 'research' | 'grant';
  deadline: string; // ISO
  salary?: string;
  tags: string[];
  source: string;
  verified?: boolean;
  description: string;
  /** Aggregator / job board (RSS source or curated). */
  listingBoard?: string;
  /** Inferred career pathway ids (see environmentalPathways.json). */
  pathwayIds?: string[];
  /** Cover image when the RSS listing or source provides one. */
  imageUrl?: string;
};

export const opportunities: Opportunity[] = [
  {
    id: 'op1',
    title: 'Graduate Ecologist — Threatened Species',
    org: 'Bush Heritage Australia',
    location: 'Melbourne, VIC',
    remote: 'hybrid',
    type: 'entry',
    deadline: '2025-11-12',
    salary: 'AUD $72k–$78k',
    tags: ['Conservation', 'Fieldwork', 'Graduate'],
    source: 'bushheritage.org.au',
    verified: true,
    description: 'Support recovery programs for native species across our reserve network. Field deployments 4–6 weeks per quarter, rest hybrid from Melbourne office.',
  },
  {
    id: 'op2',
    title: 'Climate Policy Internship (Paid)',
    org: 'Climate Council',
    location: 'Sydney, NSW',
    remote: 'hybrid',
    type: 'internship',
    deadline: '2025-10-30',
    salary: 'AUD $32/hr',
    tags: ['Policy', 'Research', 'Paid'],
    source: 'climatecouncil.org.au',
    verified: true,
    description: 'Six-month paid internship contributing to state and federal climate policy briefings. Open to penultimate and final-year students.',
  },
  {
    id: 'op3',
    title: 'Weekend Bushcare Volunteer',
    org: 'Landcare Victoria',
    location: 'Dandenong Ranges, VIC',
    remote: 'on-site',
    type: 'volunteer',
    deadline: '2025-12-31',
    tags: ['Restoration', 'Community', 'Weekend'],
    source: 'landcarevic.org.au',
    verified: true,
    description: 'Join monthly bush regeneration days. Tools and training provided. Great entry point for students building field experience.',
  },
  {
    id: 'op4',
    title: 'PhD Scholarship — Marine Heatwaves',
    org: 'CSIRO & UTAS',
    location: 'Hobart, TAS',
    remote: 'on-site',
    type: 'research',
    deadline: '2025-11-28',
    salary: 'AUD $34,500 stipend',
    tags: ['PhD', 'Marine', 'Stipend'],
    source: 'csiro.au',
    verified: true,
    description: 'Three-year PhD modelling marine heatwave impacts on temperate reef ecosystems. Co-supervised with IMAS.',
  },
  {
    id: 'op5',
    title: 'Sustainability Consultant (2–4 yrs)',
    org: 'Edge Environment',
    location: 'Brisbane, QLD',
    remote: 'hybrid',
    type: 'mid-senior',
    deadline: '2025-11-20',
    salary: 'AUD $95k–$110k',
    tags: ['Consulting', 'LCA', 'ESG'],
    source: 'edgeenvironment.com',
    verified: true,
    description: 'Deliver life-cycle assessments and Scope 3 inventories for ASX200 clients. Pathway to senior consultant within 18 months.',
  },
  {
    id: 'op6',
    title: 'Climate Innovation Grant — Up to $50k',
    org: 'Myer Foundation',
    location: 'Australia-wide',
    remote: 'remote',
    type: 'grant',
    deadline: '2025-12-15',
    tags: ['Funding', 'Early-stage', 'Climate Tech'],
    source: 'myerfoundation.org.au',
    verified: true,
    description: 'Seed funding for early-stage climate solutions led by under-30 Australian founders. No equity taken.',
  },
];

export type EventItem = {
  id: string;
  title: string;
  date: string; // ISO
  endDate?: string;
  location: string;
  online: boolean;
  host: string;
  category: 'student' | 'meetup' | 'conference' | 'webinar' | 'hackathon';
  tags: string[];
  description: string;
  attendees?: number;
  /** Hero image when the feed or organiser page exposes one. */
  imageUrl?: string;
};

export const events: EventItem[] = [
  { id: 'ev1', title: 'AYCC National Climate Summit', date: '2025-11-22', endDate: '2025-11-24', location: 'Canberra, ACT', online: false, host: 'Australian Youth Climate Coalition', category: 'conference', tags: ['Youth', 'Advocacy'], description: 'Three days of workshops, panels and campaign training for student climate organisers.', attendees: 420 },
  { id: 'ev2', title: 'Climate Tech Career Night Melbourne', date: '2025-10-29', location: 'Carlton, VIC', online: false, host: 'Climate Salad', category: 'meetup', tags: ['Networking', 'Careers'], description: 'Meet 12 hiring climate tech startups over drinks. Free for students.', attendees: 180 },
  { id: 'ev3', title: 'Intro to Carbon Accounting (Webinar)', date: '2025-10-24', location: 'Online', online: true, host: 'Carbon Market Institute', category: 'webinar', tags: ['Skills', 'Beginner'], description: '90-minute primer on Scope 1/2/3 reporting under the new ASRS standards.', attendees: 612 },
  { id: 'ev4', title: 'Reef Restoration Hackathon', date: '2025-11-08', endDate: '2025-11-09', location: 'Townsville, QLD', online: false, host: 'James Cook University', category: 'hackathon', tags: ['Marine', 'Tech', 'Students'], description: 'Build prototypes addressing coral reef monitoring. Cash prizes and AIMS internship offers.', attendees: 95 },
  { id: 'ev5', title: 'Women in Environment Breakfast', date: '2025-11-05', location: 'Sydney, NSW', online: false, host: 'WIE Network', category: 'meetup', tags: ['Mentorship', 'Networking'], description: 'Monthly breakfast connecting women across the environmental sector.', attendees: 75 },
  { id: 'ev6', title: 'Student Sustainability Showcase', date: '2025-11-15', location: 'UNSW, Sydney', online: false, host: 'UNSW Sustainability Society', category: 'student', tags: ['Student', 'Projects'], description: 'Student teams pitch sustainability solutions to industry judges.', attendees: 230 },
];

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  topic: string;
  publishedAt: string;
  verifiedAt: string;
  excerpt: string;
  readMins: number;
  /** Thumbnail when the article RSS includes media or inline images. */
  imageUrl?: string;
};

export const news: NewsItem[] = [
  { id: 'n1', title: 'Australia ratifies stronger 2035 emissions target', source: 'The Guardian Australia', topic: 'Climate', publishedAt: '2025-10-19', verifiedAt: '2025-10-19', excerpt: 'The federal government confirmed a 65–75% emissions reduction goal by 2035, drawing measured praise from sector bodies.', readMins: 4 },
  { id: 'n2', title: 'Great Barrier Reef sees fifth mass bleaching in nine years', source: 'AIMS', topic: 'Marine', publishedAt: '2025-10-17', verifiedAt: '2025-10-18', excerpt: 'Aerial surveys confirm widespread bleaching across northern and central reef sectors following sustained marine heatwave.', readMins: 6 },
  { id: 'n3', title: '$2.4B in renewables investment announced for regional NSW', source: 'RenewEconomy', topic: 'Energy', publishedAt: '2025-10-15', verifiedAt: '2025-10-16', excerpt: 'New transmission corridor unlocks four wind and battery projects, with construction roles ramping up Q2 2026.', readMins: 3 },
  { id: 'n4', title: 'New Indigenous-led ranger program launches across Kimberley', source: 'ABC News', topic: 'Indigenous & country', publishedAt: '2025-10-13', verifiedAt: '2025-10-14', excerpt: 'Twelve new ranger positions funded over three years, prioritising young Aboriginal applicants from local communities.', readMins: 5 },
  { id: 'n5', title: 'ASRS climate disclosure rules: what graduates need to know', source: 'CPA Australia', topic: 'Careers & education', publishedAt: '2025-10-10', verifiedAt: '2025-10-11', excerpt: 'Mandatory climate reporting is reshaping graduate roles in finance, audit and consulting. Here\u2019s what to learn.', readMins: 7 },
  { id: 'n6', title: 'Herbarium revision reinstates former genus for eastern mallee eucalypts', source: 'Austral Ecology', topic: 'Species & nomenclature', publishedAt: '2025-10-08', verifiedAt: '2025-10-09', excerpt: 'A taxonomic study updates synonymy and lectotypification for several species following the Australian Plant Census.', readMins: 5 },
  { id: 'n7', title: 'National contaminated land guidance: what EIA practitioners should expect', source: 'EIANZ', topic: 'Consulting & EIA', publishedAt: '2025-10-05', verifiedAt: '2025-10-06', excerpt: 'Draft technical notes on site investigation and remediation reporting are open for industry consultation.', readMins: 6 },
  { id: 'n8', title: 'Murray–Darling plan: new environmental water recovery targets', source: 'ABC News', topic: 'Land & water', publishedAt: '2025-10-03', verifiedAt: '2025-10-04', excerpt: 'Basin states negotiate catchment allocations and monitoring as drought outlook firms.', readMins: 4 },
];

export type Membership = {
  id: string;
  org: string;
  category: string;
  location: string;
  price: string;
  benefits: string[];
  eligibility: string;
  link: string;
};

export const memberships: Membership[] = [
  { id: 'm1', org: 'Ecological Society of Australia', category: 'Professional Body', location: 'National', price: 'Student $55/yr · Pro $245/yr', benefits: ['Austral Ecology journal', 'Annual conference discount', 'Job board access'], eligibility: 'Open to ecology students and practitioners', link: '#' },
  { id: 'm2', org: 'Environment Institute of Australia & NZ (EIANZ)', category: 'Professional Body', location: 'AU & NZ', price: 'Student $90/yr · Pro $395/yr', benefits: ['CEnvP certification pathway', 'CPD events', 'Mentor program'], eligibility: 'Environmental professionals and students', link: '#' },
  { id: 'm3', org: 'Australian Conservation Foundation', category: 'Advocacy', location: 'National', price: 'From $5/month', benefits: ['Campaign updates', 'Member events', 'Volunteer pathways'], eligibility: 'Open to all', link: '#' },
  { id: 'm4', org: 'Climate Salad', category: 'Industry Network', location: 'National', price: 'Free for students', benefits: ['Climate tech directory', 'Slack community', 'Founder office hours'], eligibility: 'Climate tech students, builders and operators', link: '#' },
  { id: 'm5', org: 'Australian Marine Sciences Association', category: 'Scientific Society', location: 'National', price: 'Student $45/yr', benefits: ['Conference travel grants', 'Early career awards', 'Newsletter'], eligibility: 'Marine science researchers and students', link: '#' },
];

export type Mentor = {
  id: string;
  name: string;
  role: string;
  org: string;
  location: string;
  expertise: string[];
  bio: string;
  yearsExp: number;
  linkedinUrl: string;
  acceptingMentees: boolean;
  imageUrl: string;
};

export const mentors: Mentor[] = [
  { id: 'me1', name: 'Dr. Aisha Patel', role: 'Principal Climate Scientist', org: 'CSIRO', location: 'Hobart, TAS', expertise: ['Climate modelling', 'Marine systems', 'Research careers'], bio: 'PhD pathways and research career navigation. I help students decide between academia and applied research.', yearsExp: 14, linkedinUrl: 'https://linkedin.com', acceptingMentees: true, imageUrl: mentorHeadshotImage("me1") },
  { id: 'me2', name: 'Marcus Tjungurrayi', role: 'Indigenous Ranger Coordinator', org: 'Kimberley Land Council', location: 'Broome, WA', expertise: ['Land management', 'Cultural fire', 'Community programs'], bio: 'Mentoring early-career rangers and conservation workers entering Indigenous-led programs.', yearsExp: 11, linkedinUrl: 'https://linkedin.com', acceptingMentees: true, imageUrl: mentorHeadshotImage("me2") },
  { id: 'me3', name: 'Sophie Chen', role: 'Head of ESG', org: 'Atlassian', location: 'Sydney, NSW', expertise: ['Corporate sustainability', 'Disclosure', 'Career pivots'], bio: 'Moved from consulting into in-house ESG. Happy to chat with anyone weighing that path.', yearsExp: 9, linkedinUrl: 'https://linkedin.com', acceptingMentees: true, imageUrl: mentorHeadshotImage("me3") },
  { id: 'me4', name: 'James O\u2019Sullivan', role: 'Founder', org: 'Reflora (Climate Tech)', location: 'Melbourne, VIC', expertise: ['Founding', 'Climate tech', 'Fundraising'], bio: 'Built a soil-carbon MRV startup from PhD spinout. Open to founders and would-be founders.', yearsExp: 7, linkedinUrl: 'https://linkedin.com', acceptingMentees: false, imageUrl: mentorHeadshotImage("me4") },
];

export const interestTopics = [
  'Conservation', 'Climate Policy', 'Climate Tech', 'Marine Science', 'Renewable Energy',
  'Sustainable Finance', 'ESG & Reporting', 'Circular Economy', 'Indigenous Land Mgmt',
  'Environmental Law', 'Urban Sustainability', 'Agriculture', 'Water', 'Consulting',
];

export const auStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT', 'Australia-wide', 'Remote'];

export const careerStages = [
  { id: 'student', label: 'Student', desc: 'Currently studying' },
  { id: 'graduate', label: 'New Graduate', desc: '0–1 years experience' },
  { id: 'early', label: 'Early Career', desc: '1–4 years experience' },
  { id: 'mid', label: 'Mid-Career', desc: '5–10 years experience' },
  { id: 'senior', label: 'Senior', desc: '10+ years experience' },
];

export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }): string {
  return new Date(iso).toLocaleDateString('en-AU', opts);
}
