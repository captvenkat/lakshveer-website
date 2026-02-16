import { SEO, PAGE_TITLES } from "@/components/seo";

interface LinkProps {
  href: string;
  children: React.ReactNode;
}

const InternalLink = ({ href, children }: LinkProps) => (
  <a href={href} className="link-internal">
    {children}
  </a>
);

const ExternalLink = ({ href, children }: LinkProps) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="link-external">
    {children}
  </a>
);

// Selected Systems Data - Exact content as specified
const selectedSystems = [
  { 
    title: "Hardvare", 
    description: "Hardware execution platform preventing unsafe wiring and invalid logic states.",
    href: "/systems#hardvare"
  },
  { 
    title: "CircuitHeroes", 
    description: "Circuit-building trading card game. 300+ decks shipped.",
    href: "/systems#circuitheroes"
  },
  { 
    title: "Autonomous Grant Agent", 
    description: "AI agent sourcing, evaluating, and filing global grants.",
    href: "/systems#grant-agent"
  },
  { 
    title: "Motion-Control Gaming Platform", 
    description: "Full-body measurable gaming system driven by physical movement.",
    href: "/systems#motion"
  },
  { 
    title: "Vision-Based Robotics", 
    description: "OpenCV and edge AI deployments on ESP32 and Raspberry Pi.",
    href: "/systems#vision"
  },
  { 
    title: "Autonomous Navigation Systems", 
    description: "GPS-guided and gesture-controlled robotic vehicles.",
    href: "/systems#navigation"
  },
];

// Impact Data - Exact content as specified
const impactEntries = [
  { year: "2026", event: "Special Prize", detail: "Vedanta × Param Foundation Makeathon" },
  { year: "2026", event: "₹1,00,000 Grant", detail: "Malpani Ventures" },
  { year: "2025", event: "Participant Invite", detail: "Robotics & Hardware Founders Meet" },
  { year: "2024", event: "Prize Winner", detail: "Hitex Kids Business Carnival" },
];

// Momentum Stats - Exact values as specified
const stats = [
  { label: "Age", value: "8" },
  { label: "Systems Built", value: "25+" },
  { label: "Products Shipped", value: "3" },
  { label: "Workshops Delivered", value: "12+" },
  { label: "Grants Won", value: "₹1.4L+" },
];

// Active Build Focus Items - Exact content as specified
const activeFocus = [
  { title: "Hardvare", description: "Hardware execution platform" },
  { title: "Motion-Control Gaming Platform", description: "" },
  { title: "Autonomous Grant Agent", description: "" },
];

// Backed By - Exact list as specified
const backers = [
  { name: "Malpani Ventures", href: "#" },
  { name: "Lion Circuits", href: "#" },
  { name: "Param Foundation", href: "#" },
  { name: "AI Grants India", href: "#" },
];

// Collaborate Items - Exact list as specified
const collaborateItems = [
  "Hardware sponsorship",
  "Cloud infrastructure credits",
  "Manufacturing access",
  "Research collaboration",
  "Institutional grants",
  "Media features",
];

function Index() {
  return (
    <div className="min-h-screen">
      <SEO title={PAGE_TITLES.home} />
      <main className="container-main py-16 md:py-24">
        {/* ========== HERO SECTION ========== */}
        <header className="mb-24 md:mb-32">
          <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-12 md:gap-16">
            {/* Left side - Text content */}
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight mb-4 leading-[1.1]">
                Lakshveer Rao <span className="text-[var(--text-secondary)] font-normal">(Age 8)</span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-2">
                Hardware + AI Systems Builder
              </p>
              <p className="text-lg text-[var(--text-muted)] mb-6">
                Co-Founder — Projects by Laksh
              </p>
              <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed max-w-xl">
                Building deployable autonomous hardware and AI systems from India.
              </p>
              <nav className="flex flex-wrap gap-6 md:gap-8">
                <InternalLink href="/systems">Systems</InternalLink>
                <InternalLink href="/impact">Impact</InternalLink>
                <InternalLink href="/collaborate">Collaborate</InternalLink>
              </nav>
            </div>
            
            {/* Right side - Portrait placeholder */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <div 
                className="w-[280px] h-[360px] md:w-[300px] md:h-[400px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center"
                aria-label="Portrait placeholder"
              >
                <span className="text-[var(--text-muted)] font-mono text-sm">Portrait</span>
              </div>
            </div>
          </div>
        </header>

        {/* ========== MOMENTUM STRIP ========== */}
        <section className="mb-24 md:mb-32">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="font-mono text-3xl md:text-4xl text-[var(--text-primary)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== SELECTED SYSTEMS ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Selected Systems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSystems.map((system) => (
              <article 
                key={system.title}
                className="group p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-[border-color] duration-200"
              >
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                  {system.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                  {system.description}
                </p>
                <a 
                  href={system.href} 
                  className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
                >
                  View System →
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ========== ACTIVE BUILD FOCUS ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Active Build Focus
          </h2>
          <div className="space-y-4">
            {activeFocus.map((item) => (
              <div 
                key={item.title}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3 border-b border-[var(--border-subtle)]"
              >
                <span className="text-lg font-semibold text-[var(--text-primary)]">
                  {item.title}
                </span>
                {item.description && (
                  <>
                    <span className="text-[var(--text-muted)]">—</span>
                    <span className="text-[var(--text-secondary)]">
                      {item.description}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ========== BACKED BY ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Backed By
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {backers.map((backer) => (
              <a
                key={backer.name}
                href={backer.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group aspect-[3/2] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center p-4 opacity-60 hover:opacity-100 transition-opacity duration-200"
                aria-label={backer.name}
              >
                <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors duration-200 text-center">
                  {backer.name} ↗
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ========== IMPACT SNAPSHOT ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Recent Impact
          </h2>
          <div className="space-y-0">
            {impactEntries.map((entry, idx) => (
              <a
                key={idx}
                href="/impact"
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors duration-150 group"
              >
                <span className="font-mono text-sm text-[var(--text-muted)] sm:w-20 shrink-0">
                  {entry.year}
                </span>
                <span className="hidden sm:inline text-[var(--text-secondary)] mx-4">—</span>
                <span className="font-mono text-sm text-[var(--text-secondary)] sm:flex-1">
                  {entry.event}
                </span>
                <span className="hidden sm:inline text-[var(--text-secondary)] mx-4">—</span>
                <span className="font-mono text-sm text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors duration-150">
                  {entry.detail}
                </span>
              </a>
            ))}
          </div>
          <div className="mt-8">
            <InternalLink href="/impact">View Full Impact</InternalLink>
          </div>
        </section>

        {/* ========== COLLABORATE SECTION ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Collaborate / Enable
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            We are actively seeking:
          </p>
          <ul className="space-y-3 mb-10">
            {collaborateItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-[var(--text-muted)] select-none">•</span>
                <span className="text-[var(--text-secondary)]">{item}</span>
              </li>
            ))}
          </ul>
          <InternalLink href="/collaborate">Collaborate</InternalLink>
        </section>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="container-main pb-16">
        <div className="border-t border-[var(--border-subtle)] pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left column - Lakshveer info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Lakshveer Rao</h3>
              <p className="text-[var(--text-secondary)] mb-1">Co-Founder — Projects by Laksh</p>
              <p className="text-[var(--text-muted)] text-sm">Based in Hyderabad, India (UTC+5:30)</p>
            </div>
            
            {/* Right column - Contact info */}
            <div className="md:text-right">
              <p className="text-sm text-[var(--text-muted)] mb-4">Primary Contact:</p>
              <h4 className="text-lg font-semibold mb-1">Capt. Venkat</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-1">First Backer, Investor & Operations Lead</p>
              <p className="text-sm text-[var(--text-muted)] mb-4">Primary Point of Contact</p>
              <div className="flex flex-col md:items-end gap-2">
                <a 
                  href="mailto:contact@projectsbylaksh.com" 
                  className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
                >
                  contact@projectsbylaksh.com
                </a>
                <ExternalLink href="https://linkedin.com">LinkedIn</ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;
