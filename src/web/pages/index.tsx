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

// Plain cyan link without arrow
const PlainLink = ({ href, children }: LinkProps) => (
  <a href={href} className="link-plain">
    {children}
  </a>
);

// Selected Systems Data
const selectedSystems = [
  { title: "Autonomous Drone System", description: "Self-navigating quadcopter with obstacle avoidance" },
  { title: "Smart Irrigation Controller", description: "ML-powered water management for agriculture" },
  { title: "Voice-Controlled Robot Arm", description: "6-DOF robotic arm with natural language interface" },
  { title: "Solar Tracking Array", description: "Dual-axis sun tracker with 40% efficiency gain" },
  { title: "Air Quality Monitor Network", description: "Distributed IoT sensors with real-time mapping" },
  { title: "Gesture-Based Gaming Console", description: "Motion capture hardware for immersive play" },
];

// Impact Data
const impactEntries = [
  { year: "2026", event: "Grant Recipient", detail: "Malpani Ventures", amount: "₹1,00,000" },
  { year: "2026", event: "Panel Invite", detail: "TechSparks Conference", amount: null },
  { year: "2025", event: "Prize Winner", detail: "KBC Young Innovators", amount: "₹40,000" },
  { year: "2025", event: "Media Feature", detail: "Runtime Magazine", amount: null },
  { year: "2025", event: "Workshop Host", detail: "Hyderabad Maker Fest", amount: null },
  { year: "2024", event: "Competition Winner", detail: "National Robotics Challenge", amount: "₹25,000" },
];

// Momentum Stats
const stats = [
  { label: "Age", value: "8" },
  { label: "Systems Built", value: "25+" },
  { label: "Products Shipped", value: "3" },
  { label: "Workshops Delivered", value: "12+" },
  { label: "Grants Won", value: "₹1.4L+" },
];

// Active Build Focus Items
const activeFocus = [
  { title: "Hardvare", description: "Hardware execution platform" },
  { title: "Motion-Control Gaming Platform", description: "Gesture-based interactive entertainment" },
  { title: "Autonomous Grant Agent", description: "AI-powered funding discovery system" },
];

// Collaborate Items
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
                  href="/systems" 
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
                <span className="text-[var(--text-muted)]">—</span>
                <span className="text-[var(--text-secondary)]">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========== BACKED BY ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Backed By
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <a
                key={i}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group aspect-[3/2] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
                aria-label={`Backer logo ${i}`}
              >
                <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors duration-200">
                  Logo ↗
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
                <span className="text-[var(--text-secondary)] sm:mx-4">—</span>
                <span className="font-mono text-sm text-[var(--text-secondary)] sm:flex-1">
                  {entry.amount && <span className="text-[var(--text-primary)]">{entry.amount} </span>}
                  {entry.event}
                </span>
                <span className="text-[var(--text-secondary)] sm:mx-4">—</span>
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
                <span className="text-[var(--text-muted)] select-none">-</span>
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
