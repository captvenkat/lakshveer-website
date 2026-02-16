import { Link } from "wouter";
import { SEO, PAGE_TITLES } from "@/components/seo";

interface ImpactEntry {
  year?: string;
  title: string;
  organization?: string;
  links?: { label: string; href: string }[];
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

// Impact Data organized by type - EXACT content from task
const impactCategories: ImpactCategory[] = [
  {
    name: "Grants & Scholarships",
    entries: [
      {
        year: "2026",
        title: "₹1,00,000 Grant",
        organization: "Malpani Ventures",
        links: [{ label: "Official Announcement", href: "#" }],
      },
      {
        year: "2026",
        title: "AI Credits",
        organization: "AI Grants India",
        links: [{ label: "Grant Page", href: "#" }],
      },
    ],
  },
  {
    name: "Awards & Prizes",
    entries: [
      {
        year: "2026",
        title: "Special Prize",
        organization: "Vedanta × Param Foundation Makeathon",
        links: [{ label: "Event Page", href: "#" }],
      },
      {
        year: "2024",
        title: "Prize Winner",
        organization: "Hitex Kids Business Carnival",
        links: [{ label: "Event Coverage", href: "#" }],
      },
    ],
  },
  {
    name: "Panels & Invited Participation",
    entries: [
      {
        year: "2025",
        title: "Participant Invite",
        organization: "Robotics & Hardware Founders Meet",
        links: [{ label: "Event Page", href: "#" }],
      },
    ],
  },
  {
    name: "Workshops Delivered",
    entries: [
      {
        year: "2025",
        title: "Robotics Workshop",
        organization: "Corporate Session",
        links: [{ label: "Session Photos", href: "#" }],
      },
      {
        year: "2025",
        title: "AI Systems Workshop",
        organization: "School Program",
        links: [{ label: "Session Overview", href: "#" }],
      },
    ],
  },
  {
    name: "Product Sales",
    entries: [
      {
        title: "CircuitHeroes",
        organization: "300+ Decks Shipped",
        links: [{ label: "Website", href: "#" }],
      },
      {
        title: "Ebook",
        organization: "Copies Sold",
        links: [{ label: "Download Page", href: "#" }],
      },
    ],
  },
  {
    name: "Media Coverage",
    entries: [
      {
        title: "Runtime Magazine",
        organization: "Feature",
        links: [{ label: "Article", href: "#" }],
      },
      {
        title: "YouTube",
        organization: "Hackathon Demo",
        links: [{ label: "Watch", href: "#" }],
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
        <div className="space-y-16 md:space-y-20">
          {impactCategories.map((category) => (
            <section key={category.name}>
              <h2 className="text-xl md:text-2xl font-semibold mb-8 text-[var(--text-primary)] pb-3 border-b border-[var(--border-subtle)]">
                {category.name}
              </h2>
              <div className="space-y-0">
                {category.entries.map((entry, idx) => (
                  <article
                    key={`${entry.title}-${idx}`}
                    className="py-5 border-b border-[var(--border-subtle)]"
                  >
                    {/* Main entry line - ledger style */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0 mb-3">
                      {entry.year && (
                        <>
                          <span className="font-mono text-sm text-[var(--text-muted)] sm:w-16 shrink-0">
                            {entry.year}
                          </span>
                          <span className="hidden sm:inline text-[var(--text-muted)] mx-3">—</span>
                        </>
                      )}
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

                    {/* External links */}
                    {entry.links && entry.links.length > 0 && (
                      <div className={`flex flex-wrap gap-5 ${entry.year ? 'sm:pl-[calc(4rem+1.5rem)]' : ''}`}>
                        {entry.links.map((link) => (
                          <ExternalLink key={link.label} href={link.href}>
                            {link.label}
                          </ExternalLink>
                        ))}
                      </div>
                    )}
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
