/** Deep links to major boards (no public RSS for aggregated listings — opens search in a new tab). */
export const EXTERNAL_JOB_BOARD_LINKS: { id: string; label: string; description: string; href: string }[] = [
  {
    id: "seek",
    label: "Seek",
    description: "Environmental science, sustainability & related roles",
    href: "https://www.seek.com.au/jobs?keywords=environmental",
  },
  {
    id: "indeed",
    label: "Indeed Australia",
    description: "Broad keyword search — environmental, ecology, ESG",
    href: "https://au.indeed.com/jobs?q=environmental+OR+ecology+OR+sustainability&l=Australia",
  },
  {
    id: "linkedin",
    label: "LinkedIn Jobs",
    description: "Environmental keywords, Australia-wide",
    href: "https://www.linkedin.com/jobs/search/?keywords=environmental&location=Australia",
  },
  {
    id: "gradconnection",
    label: "GradConnection",
    description: "Graduate & intern programs (AU)",
    href: "https://au.gradconnection.com/employers-and-jobs/jobs?keyword=environment",
  },
  {
    id: "nrmjobs",
    label: "NRM Jobs",
    description: "Natural resource management & landcare-style roles (AU)",
    href: "https://www.nrmjobs.com.au/jobs/",
  },
  {
    id: "aps",
    label: "APS jobs",
    description: "Australian Government — environment & science groups",
    href: "https://www.apsjobs.gov.au/s/search?keywords=environment",
  },
];
