import { Link } from "wouter";
import { SEO, PAGE_TITLES } from "@/components/seo";

interface ImpactEntry {
  title: string;
  organization?: string;
  link?: { label: string; href: string };
}

interface ImpactCategory {
  name: string;
  entries: ImpactEntry[];
}

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="link-external text-sm"
  >
    {children}
  </a>
);

// Impact Data - EXACT content from task 17
const impactCategories: ImpactCategory[] = [
  {
    name: "Competition Wins & Recognition",
    entries: [
      {
        title: "Special Mention Winner",
        organization: "Vedanta × Param Foundation Makeathon",
        link: { label: "View", href: "#" },
      },
      {
        title: "Top-5 Finalist",
        organization: "Hardware Hackathon 2.0",
        link: { label: "View", href: "#" },
      },
      {
        title: "Youngest Finalist",
        organization: "VibeHack by Emergent",
        link: { label: "View", href: "#" },
      },
      {
        title: "Youngest Participant",
        organization: "Yugantar Tech Fest",
        link: { label: "View", href: "#" },
      },
    ],
  },
  {
    name: "Hackathons & Live Builds",
    entries: [
      {
        title: "RunTogether Hackathon",
        organization: "shipped live project",
        link: { label: "View", href: "#" },
      },
    ],
  },
  {
    name: "Invitations & Speaking",
    entries: [
      {
        title: "Special Invite",
        organization: "Robotics & Hardware Founders Meet",
        link: { label: "View", href: "#" },
      },
    ],
  },
  {
    name: "Accelerators & Programs",
    entries: [
      {
        title: "Selected",
        organization: "Delta-2 Cohort, The Residency (USA)",
        link: { label: "View", href: "#" },
      },
    ],
  },
  {
    name: "Pitches & Investor Exposure",
    entries: [
      {
        title: "Pitched",
        organization: "South Park Commons",
        link: { label: "View", href: "#" },
      },
      {
        title: "Pitched",
        organization: "AI Collective Hyderabad",
        link: { label: "View", href: "#" },
      },
    ],
  },
  {
    name: "Partnerships",
    entries: [
      {
        title: "Co-creation Agreement",
        organization: "Lion Circuits",
        link: { label: "View", href: "#" },
      },
    ],
  },
  {
    name: "Competitions (Advanced Rounds)",
    entries: [
      {
        title: "Shortlisted",
        organization: "Shark Tank India S5 (Level 2)",
        link: { label: "View", href: "#" },
      },
      {
        title: "Shortlisted",
        organization: "ISF Junicorns (Level 3)",
        link: { label: "View", href: "#" },
      },
    ],
  },
  {
    name: "Grants & Scholarships",
    entries: [
      {
        title: "₹1,00,000 Grant",
        organization: "Malpani Ventures",
        link: { label: "View", href: "#" },
      },
      {
        title: "Grants",
        organization: "AI Grants India",
        link: { label: "View", href: "#" },
      },
      {
        title: "₹40,000 Creator Micro-Scholarship",
        link: { label: "View", href: "#" },
      },
    ],
  },
  {
    name: "Media",
    entries: [
      {
        title: "Covered twice",
        organization: "Runtime Magazine",
        link: { label: "Read", href: "#" },
      },
    ],
  },
];

function Impact() {
  return (
    <div className="min-h-screen">
      <SEO title={PAGE_TITLES.impact} />
      <main className="container-main py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 md:mb-20">
          <Link
            href="/"
            className="inline-block mb-8 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-opacity duration-150"
          >
            ← Back
          </Link>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Impact
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Real-world outcomes across grants, awards, panels, workshops, product sales, and media coverage.
          </p>
        </header>

        {/* Impact Categories */}
        <div className="space-y-12 md:space-y-16">
          {impactCategories.map((category) => (
            <section key={category.name}>
              <h2 className="text-lg md:text-xl font-semibold mb-6 text-[var(--text-primary)] pb-3 border-b border-[var(--border-subtle)]">
                {category.name}
              </h2>
              <div className="space-y-0">
                {category.entries.map((entry, idx) => (
                  <article
                    key={`${entry.title}-${idx}`}
                    className="py-4 border-b border-[var(--border-subtle)] last:border-b-0"
                  >
                    {/* Main entry line - ledger style */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {entry.title}
                        </span>
                        {entry.organization && (
                          <>
                            <span className="hidden sm:inline text-[var(--text-muted)] mx-3">—</span>
                            <span className="text-[var(--text-secondary)]">
                              {entry.organization}
                            </span>
                          </>
                        )}
                      </div>

                      {/* External link */}
                      {entry.link && (
                        <div className="shrink-0">
                          <ExternalLink href={entry.link.href}>
                            {entry.link.label}
                          </ExternalLink>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="container-main pb-16">
        <div className="border-t border-[var(--border-subtle)] pt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-[var(--text-muted)] text-sm">
              Lakshveer Rao — Projects by Laksh
            </p>
            <Link
              href="/"
              className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
            >
              ← Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Impact;
