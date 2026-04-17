export const seedContent = {
  opportunities: [
    {
      id: "opp-seed-1",
      title: "Bushcare Volunteer Program",
      organization: "Landcare Australia",
      location: "Multiple locations, AU",
      type: "Volunteer",
      deadline: "Always open",
      image:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
      summary: "Join local habitat restoration projects and practical conservation days.",
      tags: ["Volunteer", "Community", "Habitat"],
      url: "https://landcareaustralia.org.au/",
      source: "Landcare Australia",
      publishedAt: new Date().toISOString(),
    },
  ],
  events: [
    {
      id: "event-seed-1",
      title: "National Landcare Conference",
      host: "Landcare Australia",
      date: "See event schedule",
      format: "Hybrid",
      location: "Australia",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      summary: "Conference sessions on ecosystem restoration, policy, and community engagement.",
      url: "https://landcareaustralia.org.au/events/",
      source: "Landcare Australia",
      publishedAt: new Date().toISOString(),
    },
  ],
  articles: [],
  memberships: [
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
  ],
};
