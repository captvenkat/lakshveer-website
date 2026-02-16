import { SEO, PAGE_TITLES } from "@/components/seo";

interface LeaderCardProps {
  name: string;
  role: string;
  description?: string;
}

const LeaderCard = ({ name, role, description }: LeaderCardProps) => (
  <div className="py-6 border-b border-[var(--border-subtle)] last:border-0">
    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
      {name}
    </h3>
    <p className="text-[var(--text-secondary)]">
      {role}
    </p>
    {description && (
      <p className="text-[var(--text-secondary)] mt-3 leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

function Venture() {
  return (
    <div className="min-h-screen">
      <SEO title={PAGE_TITLES.venture} />
      <main className="container-main py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Projects by Laksh
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Projects by Laksh is a legally registered partnership operating in India with full GST and PAN compliance.
          </p>
        </header>

        {/* Registered Address */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            Registered Address
          </h2>
          <address className="not-italic text-[var(--text-secondary)] leading-relaxed">
            Plot 149, Road No. 6<br />
            Krushi Nagar Colony<br />
            Bandlaguda, Nagole<br />
            Hyderabad – 500068<br />
            Telangana, India
          </address>
        </section>

        {/* Operating Model */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            Operating Model
          </h2>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 font-mono text-lg md:text-xl text-[var(--text-secondary)]">
            <span className="text-[var(--text-primary)]">Build</span>
            <span className="text-[var(--text-muted)]">→</span>
            <span className="text-[var(--text-primary)]">Test</span>
            <span className="text-[var(--text-muted)]">→</span>
            <span className="text-[var(--text-primary)]">Deploy</span>
            <span className="text-[var(--text-muted)]">→</span>
            <span className="text-[var(--text-primary)]">Iterate</span>
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            Leadership
          </h2>
          <div className="max-w-xl">
            <LeaderCard 
              name="Lakshveer Rao"
              role="Co-Founder & Lead Builder"
            />
            <LeaderCard 
              name="Capt. Venkat (Age 48)"
              role="Co-Founder | First Investor | Operations, Logistics & Systems"
              description="Capt. Venkat provides founder-level operational backing — handling logistics, vendor coordination, travel, documentation, compliance, partnerships, and execution support."
            />
          </div>
        </section>

        {/* Navigation back */}
        <nav className="pt-8 border-t border-[var(--border-subtle)]">
          <a href="/" className="link-internal">
            Back to Home
          </a>
        </nav>
      </main>
    </div>
  );
}

export default Venture;
