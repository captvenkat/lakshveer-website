import { Link } from "wouter";
import { SEO, PAGE_TITLES } from "@/components/seo";

interface ImpactEntry {
  year: string;
  title: string;
  organization: string;
  context: string;
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

// Impact Data organized by type
const impactCategories: ImpactCategory[] = [
  {
    name: "Grants & Scholarships",
    entries: [
      {
        year: "2026",
        title: "₹1,00,000 Grant",
        organization: "Malpani Ventures",
        context: "Selected for hardware innovation track",
        links: [{ label: "Official Announcement", href: "#" }],
      },
      {
        year: "2025",
        title: "₹25,000 Scholarship",
        organization: "Tech Foundation",
        context: "Young innovator scholarship recipient",
        links: [{ label: "Announcement", href: "#" }],
      },
      {
        year: "2025",
        title: "₹15,000 Grant",
        organization: "Maker Movement India",
        context: "Hardware prototyping grant",
        links: [{ label: "Event Page", href: "#" }],
      },
    ],
  },
  {
    name: "Awards & Prizes",
    entries: [
      {
        year: "2025",
        title: "First Place",
        organization: "KBC Young Innovators",
        context: "National robotics competition winner",
        links: [
          { label: "Watch Demo", href: "#" },
          { label: "Official Results", href: "#" },
        ],
      },
      {
        year: "2025",
        title: "Gold Medal",
        organization: "Science Olympiad",
        context: "Regional engineering category",
        links: [{ label: "Announcement", href: "#" }],
      },
      {
        year: "2024",
        title: "Best Project",
        organization: "Maker Faire Hyderabad",
        context: "Featured for autonomous robot project",
        links: [{ label: "Event Page", href: "#" }],
      },
    ],
  },
  {
    name: "Panels & Invited Talks",
    entries: [
      {
        year: "2026",
        title: "Panel Speaker",
        organization: "EdTech Summit",
        context: "Youth in hardware innovation panel",
        links: [{ label: "Event Page", href: "#" }],
      },
      {
        year: "2025",
        title: "Keynote",
        organization: "Young Makers Conference",
        context: "Building autonomous systems at age 7",
        links: [{ label: "Watch Talk", href: "#" }],
      },
    ],
  },
  {
    name: "Paid Workshops",
    entries: [
      {
        year: "2025",
        title: "Robotics Workshop",
        organization: "Delhi Public School",
        context: "50+ students, full-day hands-on session",
      },
      {
        year: "2025",
        title: "AI Basics Workshop",
        organization: "Oakridge International",
        context: "30 students, introduction to computer vision",
      },
    ],
  },
  {
    name: "Products Sold",
    entries: [
      {
        year: "2025",
        title: "LineBot Kit",
        organization: "Direct Sales",
        context: "15 units sold to schools and hobbyists",
      },
      {
        year: "2025",
        title: "Custom Sensor Module",
        organization: "B2B",
        context: "Commissioned by local makerspace",
      },
    ],
  },
  {
    name: "Media Coverage",
    entries: [
      {
        year: "2025",
        title: "Cover Feature",
        organization: "Runtime Magazine",
        context: "Profile on youngest hardware builder",
        links: [{ label: "Read Article", href: "#" }],
      },
      {
        year: "2025",
        title: "Interview",
        organization: "Tech Today Podcast",
        context: "Episode on youth in robotics",
        links: [{ label: "Listen", href: "#" }],
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
            className="inline-block mb-8 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150"
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
                    key={`${entry.year}-${entry.title}-${idx}`}
                    className="py-5 border-b border-[var(--border-subtle)]"
                  >
                    {/* Main entry line */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0 mb-2">
                      <span className="font-mono text-sm text-[var(--text-muted)] sm:w-16 shrink-0">
                        {entry.year}
                      </span>
                      <span className="hidden sm:inline text-[var(--text-muted)] mx-3">—</span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {entry.title}
                      </span>
                      <span className="hidden sm:inline text-[var(--text-muted)] mx-3">—</span>
                      <span className="text-[var(--text-secondary)]">
                        {entry.organization}
                      </span>
                    </div>

                    {/* Context line */}
                    <p className="text-sm text-[var(--text-muted)] sm:pl-[calc(4rem+1.5rem)] mb-3">
                      {entry.context}
                    </p>

                    {/* External links */}
                    {entry.links && entry.links.length > 0 && (
                      <div className="flex flex-wrap gap-5 sm:pl-[calc(4rem+1.5rem)]">
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
