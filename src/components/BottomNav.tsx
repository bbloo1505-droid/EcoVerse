import type { NavTab } from "../types";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const tabs: { id: NavTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "news", label: "News" },
  { id: "opportunities", label: "Opportunities" },
  { id: "mentors", label: "Mentors" },
  { id: "events", label: "Events" },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary mobile navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? "nav-item active" : "nav-item"}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-dot" aria-hidden="true" />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
