import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { BottomNav } from "./components/BottomNav";
import { FeatureCard } from "./components/FeatureCard";
import { PricingCard } from "./components/PricingCard";
import { SectionHeader } from "./components/SectionHeader";
import { TrialBanner } from "./components/TrialBanner";
import { TrustNotice } from "./components/TrustNotice";
import { trackEvent } from "./lib/analytics";
import { mentors, userProfile } from "./data/mockData";
import { useCloudActivity } from "./hooks/useCloudActivity";
import { useLiveContent } from "./hooks/useLiveContent";
import type { NavTab } from "./types";

type AppPage =
  | "home"
  | "opportunities"
  | "events"
  | "mentors"
  | "news"
  | "memberships"
  | "messages"
  | "my-activity"
  | "notifications"
  | "pricing"
  | "profile"
  | "auth"
  | "onboarding";

const menuGroups: { title: string; pages: { id: AppPage; label: string }[] }[] = [
  {
    title: "Account",
    pages: [
      { id: "profile", label: "Profile settings" },
      { id: "onboarding", label: "Personalization" },
      { id: "auth", label: "Account and sign-in" },
      { id: "notifications", label: "Notifications" },
    ],
  },
  {
    title: "Membership",
    pages: [
      { id: "pricing", label: "Manage subscription" },
      { id: "messages", label: "Message requests" },
      { id: "my-activity", label: "My activity" },
    ],
  },
  {
    title: "Explore",
    pages: [
      { id: "news", label: "News and insights" },
      { id: "memberships", label: "Membership directory" },
      { id: "opportunities", label: "Opportunities" },
      { id: "events", label: "Events" },
      { id: "mentors", label: "Mentors" },
      { id: "home", label: "Home" },
    ],
  },
];

const plantOfTheDay = {
  name: "Waratah",
  latin: "Telopea speciosissima",
  image:
    "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80",
  note: "A striking native flower known for resilience and biodiversity value in bush ecosystems.",
};

const animalOfTheDay = {
  name: "Koala",
  latin: "Phascolarctos cinereus",
  image:
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
  note: "An iconic native species that highlights the importance of habitat protection and restoration.",
};

function App() {
  const { articles, events, memberships, opportunities, lastRefreshedAt, sourceErrors, isLoading } =
    useLiveContent();
  const {
    savedItemIds,
    setSavedItemIds,
    appliedOpportunityIds,
    setAppliedOpportunityIds,
    liveMentorshipRequests,
    setLiveMentorshipRequests,
    cloudStatusLabel,
  } = useCloudActivity();
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [activePage, setActivePage] = useState<AppPage>("home");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState("");
  const [reviewPromptDismissed, setReviewPromptDismissed] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [oppQuery, setOppQuery] = useState("");
  const [oppType, setOppType] = useState("All types");
  const [oppLocation, setOppLocation] = useState("All locations");
  const [eventQuery, setEventQuery] = useState("");
  const [eventFormat, setEventFormat] = useState("All formats");
  const [eventLocation, setEventLocation] = useState("All locations");
  const [mentorQuery, setMentorQuery] = useState("");
  const [mentorExpertise, setMentorExpertise] = useState("All expertise");
  const [mentorAvailability, setMentorAvailability] = useState("Any availability");
  const [newsQuery, setNewsQuery] = useState("");
  const [newsTopic, setNewsTopic] = useState("All topics");
  const mentorshipRequestLimit = 5;
  const profileCompletion = 60;
  const weeklyDiscoveryCount = 7;
  const notificationCount = 3;
  const successActionCount = savedItemIds.length + appliedOpportunityIds.length;
  const shouldShowReviewPrompt = successActionCount >= 2 && !reviewPromptDismissed;

  const oppTypeOptions = useMemo(
    () => ["All types", ...new Set(opportunities.map((item) => item.type))],
    [opportunities],
  );
  const oppLocationOptions = useMemo(
    () => ["All locations", ...new Set(opportunities.map((item) => item.location))],
    [opportunities],
  );
  const eventFormatOptions = useMemo(
    () => ["All formats", ...new Set(events.map((item) => item.format))],
    [events],
  );
  const eventLocationOptions = useMemo(
    () => ["All locations", ...new Set(events.map((item) => item.location))],
    [events],
  );
  const mentorExpertiseOptions = useMemo(
    () => ["All expertise", ...new Set(mentors.flatMap((item) => item.expertise))],
    [],
  );
  const newsTopicOptions = useMemo(
    () => ["All topics", "Conservation", "Policy", "Consulting", "Biodiversity", "Climate"],
    [],
  );

  const filteredOpportunities = useMemo(
    () =>
      opportunities.filter((item) => {
        const query = oppQuery.toLowerCase();
        const matchesQuery =
          query.length === 0 ||
          item.title.toLowerCase().includes(query) ||
          item.organization.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query);
        const matchesType = oppType === "All types" || item.type === oppType;
        const matchesLocation =
          oppLocation === "All locations" || item.location === oppLocation;
        return matchesQuery && matchesType && matchesLocation;
      }),
    [oppLocation, oppQuery, oppType, opportunities],
  );

  const filteredEvents = useMemo(
    () =>
      events.filter((item) => {
        const query = eventQuery.toLowerCase();
        const matchesQuery =
          query.length === 0 ||
          item.title.toLowerCase().includes(query) ||
          item.host.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query);
        const matchesFormat =
          eventFormat === "All formats" || item.format === eventFormat;
        const matchesLocation =
          eventLocation === "All locations" || item.location === eventLocation;
        return matchesQuery && matchesFormat && matchesLocation;
      }),
    [eventFormat, eventLocation, eventQuery, events],
  );

  const filteredMentors = useMemo(
    () =>
      mentors.filter((item) => {
        const query = mentorQuery.toLowerCase();
        const matchesQuery =
          query.length === 0 ||
          item.name.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query) ||
          item.expertise.some((expertise) =>
            expertise.toLowerCase().includes(query),
          );
        const matchesExpertise =
          mentorExpertise === "All expertise" ||
          item.expertise.includes(mentorExpertise);
        const matchesAvailability =
          mentorAvailability === "Any availability" ||
          (mentorAvailability === "Open slots only" && item.mentoringSlots > 0) ||
          (mentorAvailability === "2+ slots" && item.mentoringSlots >= 2);
        return matchesQuery && matchesExpertise && matchesAvailability;
      }),
    [mentorAvailability, mentorExpertise, mentorQuery],
  );

  const filteredArticles = useMemo(
    () =>
      articles.filter((item) => {
        const query = newsQuery.toLowerCase();
        const matchesQuery =
          query.length === 0 ||
          item.title.toLowerCase().includes(query) ||
          item.source.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query);
        const matchesTopic =
          newsTopic === "All topics" ||
          item.title.toLowerCase().includes(newsTopic.toLowerCase()) ||
          item.summary.toLowerCase().includes(newsTopic.toLowerCase());
        return matchesQuery && matchesTopic;
      }),
    [articles, newsQuery, newsTopic],
  );

  const isSaved = useCallback((id: string) => savedItemIds.includes(id), [savedItemIds]);
  const isApplied = useCallback((id: string) => appliedOpportunityIds.includes(id), [
    appliedOpportunityIds,
  ]);
  const toggleSaved = useCallback((id: string) => {
    setSavedItemIds((previous) => {
      if (previous.includes(id)) {
        setLastActionMessage("Removed from saved.");
        trackEvent("item_unsaved", { itemId: id });
        return previous.filter((savedId) => savedId !== id);
      }
      setLastActionMessage("Saved successfully.");
      trackEvent("item_saved", { itemId: id });
      return [...previous, id];
    });
  }, [setSavedItemIds]);

  const applyToOpportunity = useCallback((id: string) => {
    setAppliedOpportunityIds((previous) => {
      if (previous.includes(id)) {
        return previous;
      }
      setLastActionMessage("Application marked as submitted.");
      trackEvent("opportunity_applied", { itemId: id });
      return [...previous, id];
    });
  }, [setAppliedOpportunityIds]);

  useEffect(() => {
    if (!lastActionMessage) {
      return;
    }
    const timeout = window.setTimeout(() => setLastActionMessage(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [lastActionMessage]);

  const openPageFromMenu = (page: AppPage) => {
    setActivePage(page);
    if (
      page === "home" ||
      page === "news" ||
      page === "opportunities" ||
      page === "events" ||
      page === "mentors"
    ) {
      setActiveTab(page);
    }
    setIsSideMenuOpen(false);
  };

  const getOpportunityUrgencyTag = (deadline: string) => {
    const match = deadline.match(/(\d+)\s*days?/i);
    if (!match) {
      return null;
    }
    const days = Number(match[1]);
    if (Number.isNaN(days)) {
      return null;
    }
    if (days <= 3) {
      return "Deadline soon";
    }
    if (days <= 7) {
      return "Apply this week";
    }
    return null;
  };

  const activeContent = useMemo(() => {
    if (activePage === "opportunities") {
      return (
        <>
          <SectionHeader
            eyebrow="Find your fit"
            title="Search opportunities"
            subtitle="Narrow by keyword, role type, and location."
          />
          <section className="filter-panel">
            <div className="filter-grid">
              <input
                value={oppQuery}
                onChange={(event) => setOppQuery(event.target.value)}
                placeholder="Search by title, org, or keywords"
              />
              <select value={oppType} onChange={(event) => setOppType(event.target.value)}>
                {oppTypeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                value={oppLocation}
                onChange={(event) => setOppLocation(event.target.value)}
              >
                {oppLocationOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <p className="results-note">{filteredOpportunities.length} results</p>
          </section>
          {filteredOpportunities.length === 0 ? (
            <p className="empty-state">No opportunities match these filters yet.</p>
          ) : (
            <div className="grid-cards">
              {filteredOpportunities.map((item) => (
                (() => {
                  const urgencyTag = getOpportunityUrgencyTag(item.deadline);
                  const composedTags = urgencyTag ? [...item.tags, urgencyTag] : item.tags;
                  return (
                <FeatureCard
                  key={item.id}
                  id={item.id}
                  layout="horizontal"
                  image={item.image}
                  title={item.title}
                  subtitle={item.summary}
                  meta={`${item.organization} · ${item.location} · ${item.deadline}`}
                  tags={composedTags}
                  reasonLabel={`${userProfile.location} · ${userProfile.interests[0]}`}
                  primaryAction={isApplied(item.id) ? "Applied" : "Apply now"}
                  onPrimaryAction={() => {
                    applyToOpportunity(item.id);
                    if (item.url) {
                      window.open(item.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  primaryDisabled={isApplied(item.id)}
                  secondaryAction={isSaved(item.id) ? "Saved" : "Save"}
                  onSecondaryAction={() => toggleSaved(item.id)}
                />
                  );
                })()
              ))}
            </div>
          )}
        </>
      );
    }

    if (activePage === "events") {
      return (
        <>
          <SectionHeader
            eyebrow="Plan your calendar"
            title="Search events"
            subtitle="Filter by topic relevance, format, and location."
          />
          <section className="filter-panel">
            <div className="filter-grid">
              <input
                value={eventQuery}
                onChange={(event) => setEventQuery(event.target.value)}
                placeholder="Search events, hosts, or focus topics"
              />
              <select
                value={eventFormat}
                onChange={(event) => setEventFormat(event.target.value)}
              >
                {eventFormatOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                value={eventLocation}
                onChange={(event) => setEventLocation(event.target.value)}
              >
                {eventLocationOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <p className="results-note">{filteredEvents.length} results</p>
          </section>
          {filteredEvents.length === 0 ? (
            <p className="empty-state">No events match these filters right now.</p>
          ) : (
            <div className="grid-cards">
              {filteredEvents.map((item) => (
                <FeatureCard
                  key={item.id}
                  id={item.id}
                  layout="horizontal"
                  image={item.image}
                  title={item.title}
                  subtitle={item.summary}
                  meta={`${item.host} · ${item.date} · ${item.format}`}
                  tags={[item.location, "Register open"]}
                  reasonLabel={`${userProfile.careerStage} · ${userProfile.interests[0]}`}
                  primaryAction="Learn more"
                  onPrimaryAction={() => {
                    if (item.url) {
                      window.open(item.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  secondaryAction={isSaved(item.id) ? "Saved" : "Save"}
                  onSecondaryAction={() => toggleSaved(item.id)}
                />
              ))}
            </div>
          )}
        </>
      );
    }

    if (activePage === "mentors") {
      return (
        <>
          <SectionHeader
            eyebrow="Connect with mentors"
            title="Search mentors"
            subtitle="Find people by expertise and availability."
          />
          <section className="mentor-limit-banner">
            <p>
              Live mentorship requests: {liveMentorshipRequests}/{mentorshipRequestLimit}
            </p>
            {liveMentorshipRequests >= mentorshipRequestLimit ? (
              <button className="primary-button">Upgrade for more requests</button>
            ) : (
              <button className="ghost-button">You can send more requests</button>
            )}
          </section>
          <section className="filter-panel">
            <div className="filter-grid">
              <input
                value={mentorQuery}
                onChange={(event) => setMentorQuery(event.target.value)}
                placeholder="Search by mentor name, role, or skill"
              />
              <select
                value={mentorExpertise}
                onChange={(event) => setMentorExpertise(event.target.value)}
              >
                {mentorExpertiseOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                value={mentorAvailability}
                onChange={(event) => setMentorAvailability(event.target.value)}
              >
                <option>Any availability</option>
                <option>Open slots only</option>
                <option>2+ slots</option>
              </select>
            </div>
            <p className="results-note">{filteredMentors.length} results</p>
          </section>
          {filteredMentors.length === 0 ? (
            <p className="empty-state">No mentors match this search yet.</p>
          ) : (
            <div className="grid-cards">
              {filteredMentors.map((item) => (
                <FeatureCard
                  key={item.id}
                  id={item.id}
                  layout="horizontal"
                  image={item.image}
                  title={item.name}
                  subtitle={item.role}
                  meta={`${item.mentoringSlots} live mentoring slots`}
                  tags={item.expertise}
                  reasonLabel={`${userProfile.interests[0]} pathway`}
                  primaryAction={
                    liveMentorshipRequests >= mentorshipRequestLimit
                      ? "Limit reached"
                      : "Request mentorship"
                  }
                  onPrimaryAction={() =>
                    setLiveMentorshipRequests((previous) => {
                      const next = Math.min(previous + 1, mentorshipRequestLimit);
                      if (next > previous) {
                        setLastActionMessage("Mentorship request sent.");
                      }
                      return next;
                    })
                  }
                  primaryDisabled={liveMentorshipRequests >= mentorshipRequestLimit}
                  secondaryAction="View on LinkedIn"
                  onSecondaryAction={() =>
                    window.open(item.linkedInUrl, "_blank", "noopener,noreferrer")
                  }
                />
              ))}
            </div>
          )}
        </>
      );
    }

    if (activePage === "news") {
      return (
        <>
          <SectionHeader
            eyebrow="Curated updates"
            title="News and insights"
            subtitle="Keep up with environmental science, policy, and consulting."
          />
          <section className="filter-panel">
            <div className="filter-grid">
              <input
                value={newsQuery}
                onChange={(event) => setNewsQuery(event.target.value)}
                placeholder="Search news by topic, source, or keyword"
              />
              <select value={newsTopic} onChange={(event) => setNewsTopic(event.target.value)}>
                {newsTopicOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <p className="results-note">{filteredArticles.length} results</p>
          </section>
          {filteredArticles.length === 0 ? (
            <p className="empty-state">No news items match those filters.</p>
          ) : (
            <div className="grid-cards">
              {filteredArticles.map((item) => (
                <FeatureCard
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  title={item.title}
                  subtitle={item.summary}
                  meta={`${item.source} · ${item.lastVerified}`}
                  tags={["Verified", "Curated"]}
                  reasonLabel={`${userProfile.interests[1]} updates`}
                  primaryAction="Learn more"
                  onPrimaryAction={() => {
                    if (item.url) {
                      window.open(item.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  secondaryAction={isSaved(item.id) ? "Saved" : "Save"}
                  onSecondaryAction={() => toggleSaved(item.id)}
                />
              ))}
            </div>
          )}
        </>
      );
    }

    if (activePage === "memberships") {
      return (
        <>
          <SectionHeader
            eyebrow="Professional growth"
            title="Membership directory"
            subtitle="Find environmental organisations and compare member benefits."
          />
          <div className="memberships">
            {memberships.map((membership) => (
              <article key={membership.id} className="membership-card">
                <h3>{membership.organization}</h3>
                <p className="card-meta">{membership.type}</p>
                <p>{membership.benefits}</p>
                <div className="card-actions">
                  <a href={membership.joinLink} className="primary-button">
                    Learn more
                  </a>
                  <button
                    className="ghost-button"
                    onClick={() => toggleSaved(membership.id)}
                  >
                    {isSaved(membership.id) ? "Saved" : "Save"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      );
    }

    if (activePage === "messages") {
      return (
        <>
          <SectionHeader
            eyebrow="Mentorship communication"
            title="Message requests and chats"
            subtitle="Users must approve a request before a chat opens."
          />
          <section className="list-panel">
            <article className="list-item">
              <div className="row-with-avatar">
                <img src={mentors[1].image} alt={mentors[1].name} className="inline-avatar" />
                <p className="card-meta">Pending request</p>
              </div>
              <h3>Marcus Reid sent a message request</h3>
              <p className="section-subtitle">Topic: Breaking into ESG consulting after uni.</p>
              <div className="card-actions">
                <button className="primary-button">Approve request</button>
                <button className="ghost-button">Decline</button>
              </div>
            </article>
            <article className="list-item">
              <div className="row-with-avatar">
                <img src={mentors[0].image} alt={mentors[0].name} className="inline-avatar" />
                <p className="card-meta">Active chat</p>
              </div>
              <h3>Dr. Chloe Tan</h3>
              <p className="section-subtitle">
                Last message: I can review your internship application this weekend.
              </p>
              <div className="card-actions">
                <button className="primary-button">Open chat</button>
                <button className="ghost-button">Add on LinkedIn</button>
              </div>
            </article>
          </section>
        </>
      );
    }

    if (activePage === "notifications") {
      return (
        <>
          <SectionHeader
            eyebrow="Notifications"
            title="Updates and reminders"
            subtitle="Stay on top of deadlines, mentorship, and billing reminders."
          />
          <section className="list-panel">
            <article className="list-item">
              <p className="card-meta">Retention timing</p>
              <h3>Reminder queued for ~23.5 hours after install</h3>
              <p className="section-subtitle">
                Trigger: likely similar daily context as first app session.
              </p>
            </article>
            <article className="list-item">
              <p className="card-meta">Deadline alert</p>
              <h3>Marine Conservation Internship closes in 6 days</h3>
              <p className="section-subtitle">Saved opportunity reminder.</p>
            </article>
            <article className="list-item">
              <p className="card-meta">Mentorship</p>
              <h3>Marcus Reid sent a message request</h3>
              <p className="section-subtitle">Approve to open the chat.</p>
            </article>
            <article className="list-item">
              <p className="card-meta">Billing</p>
              <h3>Trial reminder: 7 days left</h3>
              <p className="section-subtitle">We send clear reminders before billing.</p>
            </article>
          </section>
        </>
      );
    }

    if (activePage === "my-activity") {
      return (
        <>
          <SectionHeader
            eyebrow="My activity"
            title="Saved and applied"
            subtitle="Track actions so you can follow through quickly."
          />
          <section className="list-panel">
            <article className="list-item">
              <h3>{savedItemIds.length} saved items</h3>
              <p className="section-subtitle">
                Saved opportunities, events, news, and memberships are ready to revisit.
              </p>
            </article>
            <article className="list-item">
              <h3>{appliedOpportunityIds.length} applications marked complete</h3>
              <p className="section-subtitle">
                Keep momentum by checking event and mentorship activity weekly.
              </p>
            </article>
            <article className="list-item">
              <h3>{liveMentorshipRequests} live mentorship requests</h3>
              <p className="section-subtitle">
                Free tier cap is {mentorshipRequestLimit}. Upgrade to unlock more.
              </p>
            </article>
          </section>
        </>
      );
    }

    if (activePage === "pricing") {
      const isStudent = userProfile.careerStage === "Student";
      return (
        <>
          <SectionHeader
            eyebrow="Plans and billing"
            title="Pricing and trial settings"
            subtitle="Transparent billing with clear reminders before charges."
          />
          <section className="list-panel">
            <article className="list-item">
              <h3>{isStudent ? "Student-focused premium" : "Career acceleration premium"}</h3>
              <p className="section-subtitle">
                {isStudent
                  ? "Lower student pricing with benefits tuned to internships, events, and mentoring."
                  : "Professional pricing with stronger visibility, networking, and premium access."}
              </p>
            </article>
          </section>
          <div className="pricing-grid">
            <PricingCard
              title="Free"
              price="$0"
              description="Discover opportunities, events, and news with up to 5 live mentorship requests."
              features={["Unlimited browsing", "Personalized feed", "5 live mentorship requests"]}
            />
            <PricingCard
              title="Student Premium"
              price="AUD $5/month"
              priceDetail="AUD $4.17/mo billed annually (AUD $50/year)"
              description="Built for students who want faster career momentum."
              features={[
                "Higher mentorship limits",
                "Seminar access",
                "Priority opportunities",
              ]}
              highlighted
            />
            <PricingCard
              title="Professional Premium"
              price="AUD $10/month"
              priceDetail="AUD $8.33/mo billed annually (AUD $100/year)"
              description="For emerging professionals who want stronger visibility and growth."
              features={["Expanded networking", "Premium seminars", "Partner discount access"]}
            />
            <PricingCard
              title="Impact Partner"
              price="AUD $29/month"
              priceDetail="Premium anchor tier"
              description="For organizations and power users needing maximum visibility and priority placement."
              features={[
                "Everything in Professional",
                "Priority spotlight placement",
                "Priority support and early feature access",
              ]}
              ctaLabel="Contact us"
            />
          </div>
          <section className="list-panel">
            <article className="list-item">
              <h3>Billing transparency policy</h3>
              <ul className="policy-list">
                <li>14-day free trial with auto-convert unless canceled.</li>
                <li>Reminders sent at 7 days, 2 days, and 24 hours before billing.</li>
                <li>Annual plans shown as monthly equivalents for easier comparison.</li>
                <li>Email + in-app reminders for trust and clarity.</li>
                <li>One-time courtesy refund allowed within 7 days after conversion.</li>
              </ul>
            </article>
          </section>
          <TrialBanner />
          <TrustNotice />
        </>
      );
    }

    if (activePage === "auth") {
      return (
        <>
          <SectionHeader
            eyebrow="Welcome to EcoVerse"
            title="Create your account"
            subtitle="Built for the environmental field and designed to support meaningful career growth."
          />
          <section className="list-panel">
            <article className="list-item">
              <h3>Sign up</h3>
              <div className="form-grid">
                <input placeholder="Full name" />
                <input placeholder="Email address" />
                <input placeholder="Password" type="password" />
              </div>
              <div className="card-actions">
                <button className="primary-button">Create account</button>
                <button className="ghost-button">Continue with Google</button>
              </div>
            </article>
          </section>
        </>
      );
    }

    if (activePage === "onboarding") {
      return (
        <>
          <SectionHeader
            eyebrow="Optional setup"
            title="Personalize your feed"
            subtitle="Add details now or skip and complete later."
          />
          <section className="list-panel">
            <article className="list-item">
              <h3>Interests</h3>
              <div className="tag-row">
                {["Conservation", "Climate Policy", "ESG", "Marine", "Restoration"].map(
                  (tag) => (
                    <button key={tag} className="ghost-button">
                      {tag}
                    </button>
                  ),
                )}
              </div>
            </article>
            <article className="list-item">
              <h3>Location and stage</h3>
              <div className="form-grid">
                <select>
                  <option>Brisbane, QLD</option>
                  <option>Sydney, NSW</option>
                  <option>Melbourne, VIC</option>
                </select>
                <select>
                  <option>Student</option>
                  <option>Graduate</option>
                  <option>Early Career</option>
                </select>
              </div>
              <div className="card-actions">
                <button className="primary-button">Save preferences</button>
                <button className="ghost-button">Skip for now</button>
              </div>
            </article>
          </section>
        </>
      );
    }

    if (activePage === "profile") {
      return (
        <section className="profile-panel">
          <img src={userProfile.profilePhoto} alt={userProfile.name} className="profile-hero-avatar" />
          <h3>{userProfile.name}</h3>
          <p>{`${userProfile.careerStage} · ${userProfile.location}`}</p>
          <div className="tag-row">
            {userProfile.interests.map((interest) => (
              <span key={interest} className="tag-pill">
                {interest}
              </span>
            ))}
          </div>
          <p className="section-subtitle">LinkedIn companion profile ready for networking.</p>
          <a href={userProfile.linkedInUrl} className="primary-button profile-link">
            Open LinkedIn profile
          </a>
        </section>
      );
    }

    return (
      <>
        <section className="hero-block">
          <p className="eyebrow">Today in nature</p>
          <h1>Plant and animal of the day</h1>
          <p>
            Good morning, {userProfile.name}. Discover new flora and fauna while you explore
            opportunities, events, and mentors.
          </p>
          <div className="today-grid">
            <FeatureCard
              id="daily-plant"
              image={plantOfTheDay.image}
              title={plantOfTheDay.name}
              subtitle={plantOfTheDay.note}
              meta={`Plant of the day · ${plantOfTheDay.latin}`}
              tags={["Flora", "Native plant"]}
              reasonLabel="Daily discovery"
              primaryAction="Learn plant"
              secondaryAction={isSaved("daily-plant") ? "Saved" : "Save"}
              onSecondaryAction={() => toggleSaved("daily-plant")}
            />
            <FeatureCard
              id="daily-animal"
              image={animalOfTheDay.image}
              title={animalOfTheDay.name}
              subtitle={animalOfTheDay.note}
              meta={`Animal of the day · ${animalOfTheDay.latin}`}
              tags={["Fauna", "Native species"]}
              reasonLabel="Daily discovery"
              primaryAction="Learn animal"
              secondaryAction={isSaved("daily-animal") ? "Saved" : "Save"}
              onSecondaryAction={() => toggleSaved("daily-animal")}
            />
          </div>
        </section>

        <section className="quick-win-card">
          <div>
            <p className="eyebrow">Your momentum this week</p>
            <h3>Profile is {profileCompletion}% complete</h3>
            <p className="section-subtitle">
              Finish 2 more profile steps to unlock sharper recommendations.
            </p>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${profileCompletion}%` }} />
          </div>
          <div className="card-actions">
            <button className="primary-button" onClick={() => openPageFromMenu("onboarding")}>
              Complete profile
            </button>
            <button className="ghost-button" onClick={() => openPageFromMenu("opportunities")}>
              Find opportunities
            </button>
          </div>
        </section>

        {shouldShowReviewPrompt && (
          <section className="quick-win-card">
            <div>
              <p className="eyebrow">Quick favor</p>
              <h3>Enjoying EcoVerse so far?</h3>
              <p className="section-subtitle">
                You have completed {successActionCount} key actions. A short review really helps us grow.
              </p>
            </div>
            <div className="card-actions">
              <button
                className="primary-button"
                onClick={() => {
                  trackEvent("review_prompt_opened", { source: "home_quick_prompt" });
                  setIsReviewModalOpen(true);
                }}
              >
                Leave a review
              </button>
              <button
                className="ghost-button"
                onClick={() => {
                  trackEvent("review_prompt_dismissed", { source: "home_quick_prompt" });
                  setReviewPromptDismissed(true);
                }}
              >
                Maybe later
              </button>
            </div>
          </section>
        )}

        <section className="trust-strip">
          <span className="tag-pill">Sources verified daily</span>
          <span className="tag-pill">Curated for Australia</span>
          <span className="tag-pill">{weeklyDiscoveryCount} new items this week</span>
          <span className="tag-pill">{savedItemIds.length} saved items</span>
          <span className="tag-pill">{cloudStatusLabel}</span>
          {lastRefreshedAt && (
            <span className="tag-pill">
              Live refresh: {new Date(lastRefreshedAt).toLocaleTimeString("en-AU")}
            </span>
          )}
          {isLoading && <span className="tag-pill">Loading live data...</span>}
          {sourceErrors.length > 0 && <span className="tag-pill">Some sources temporarily unavailable</span>}
        </section>

        <SectionHeader
          eyebrow="For you"
          title="Recommended opportunities"
          subtitle="Personalized for your interests and career stage."
          actionLabel="See all"
        />
        <div className="grid-cards">
          {opportunities.slice(0, 2).map((item) => (
            (() => {
              const urgencyTag = getOpportunityUrgencyTag(item.deadline);
              const composedTags = urgencyTag ? [...item.tags, urgencyTag] : item.tags;
              return (
            <FeatureCard
              key={item.id}
              id={item.id}
              layout="horizontal"
              image={item.image}
              title={item.title}
              subtitle={item.summary}
              meta={`${item.organization} · ${item.deadline}`}
              tags={composedTags}
              reasonLabel={`${userProfile.location} · ${userProfile.interests[0]}`}
              primaryAction={isApplied(item.id) ? "Applied" : "Apply now"}
              onPrimaryAction={() => {
                applyToOpportunity(item.id);
                if (item.url) {
                  window.open(item.url, "_blank", "noopener,noreferrer");
                }
              }}
              primaryDisabled={isApplied(item.id)}
              secondaryAction={isSaved(item.id) ? "Saved" : "Save"}
              onSecondaryAction={() => toggleSaved(item.id)}
            />
              );
            })()
          ))}
        </div>
      </>
    );
  }, [
    activePage,
    appliedOpportunityIds,
    eventFormat,
    eventFormatOptions,
    eventLocation,
    eventLocationOptions,
    eventQuery,
    filteredArticles,
    filteredEvents,
    filteredMentors,
    filteredOpportunities,
    isApplied,
    isSaved,
    liveMentorshipRequests,
    mentorshipRequestLimit,
    mentorAvailability,
    mentorExpertise,
    mentorExpertiseOptions,
    mentorQuery,
    memberships,
    newsQuery,
    newsTopic,
    newsTopicOptions,
    oppLocation,
    oppLocationOptions,
    oppQuery,
    oppType,
    oppTypeOptions,
    opportunities,
    cloudStatusLabel,
    isLoading,
    lastRefreshedAt,
    savedItemIds,
    setLiveMentorshipRequests,
    sourceErrors.length,
    shouldShowReviewPrompt,
    successActionCount,
    applyToOpportunity,
    toggleSaved,
  ]);

  return (
    <AppShell
      profilePhoto={userProfile.profilePhoto}
      profileName={userProfile.name}
      onProfileMenuToggle={() => setIsSideMenuOpen(true)}
      onNotificationsClick={() => {
        setActivePage("notifications");
        setIsSideMenuOpen(false);
        trackEvent("notifications_opened", { source: "header_icon" });
      }}
      notificationCount={notificationCount}
    >
      {isSideMenuOpen && (
        <div className="side-menu-overlay" onClick={() => setIsSideMenuOpen(false)}>
          <aside className="side-menu-drawer" onClick={(event) => event.stopPropagation()}>
            <header className="side-menu-header">
              <div className="row-with-avatar">
                <img src={userProfile.profilePhoto} alt={userProfile.name} className="inline-avatar" />
                <div>
                  <h3>{userProfile.name}</h3>
                  <p className="section-subtitle">{userProfile.careerStage}</p>
                </div>
              </div>
              <button className="ghost-button" onClick={() => setIsSideMenuOpen(false)}>
                Close
              </button>
            </header>
            <div className="side-menu-content">
              {menuGroups.map((group) => (
                <section key={group.title} className="side-menu-group">
                  <p className="eyebrow">{group.title}</p>
                  {group.pages.map((page) => (
                    <button
                      key={page.id}
                      className={activePage === page.id ? "menu-link active" : "menu-link"}
                      onClick={() => openPageFromMenu(page.id)}
                    >
                      {page.label}
                    </button>
                  ))}
                </section>
              ))}
            </div>
          </aside>
        </div>
      )}
      <section className="page">
        <div key={activePage} className="page-transition">
          {activeContent}
        </div>
      </section>
      {isReviewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsReviewModalOpen(false)}>
          <section className="review-modal" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow">Quick review</p>
            <h3>How likely are you to recommend EcoVerse?</h3>
            <p className="section-subtitle">
              Your feedback helps us improve opportunities, events, and mentorship matching.
            </p>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className="ghost-button"
                  onClick={() => {
                    trackEvent("review_rating_selected", { rating });
                    setLastActionMessage("Thanks for your feedback.");
                    setIsReviewModalOpen(false);
                  }}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="card-actions">
              <button
                className="primary-button"
                onClick={() => {
                  trackEvent("review_submitted");
                  setLastActionMessage("Review submitted. Thank you!");
                  setIsReviewModalOpen(false);
                }}
              >
                Submit review
              </button>
              <button
                className="ghost-button"
                onClick={() => {
                  trackEvent("review_modal_dismissed");
                  setIsReviewModalOpen(false);
                }}
              >
                Maybe later
              </button>
            </div>
          </section>
        </div>
      )}
      {lastActionMessage && <div className="toast-feedback">{lastActionMessage}</div>}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActivePage(tab);
          trackEvent("bottom_nav_switched", { tab });
        }}
      />
    </AppShell>
  );
}

export default App;
