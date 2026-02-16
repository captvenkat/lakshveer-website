import { Link } from "wouter";
import { SEO, PAGE_TITLES } from "@/components/seo";

interface SystemEntry {
  id: string;
  title: string;
  description: string;
  links: { label: string; href: string }[];
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

// Systems Data - flat list
const systems: SystemEntry[] = [
  {
    id: "hardvare",
    title: "Hardvare",
    description: "Hardware execution platform preventing unsafe wiring and invalid logic states.",
    links: [
      { label: "GitHub", href: "#" },
      { label: "Demo", href: "#" },
    ],
  },
  {
    id: "circuitheroes",
    title: "CircuitHeroes",
    description: "Circuit-building trading card game. 300+ decks shipped.",
    links: [
      { label: "Website", href: "#" },
      { label: "Gameplay Demo", href: "#" },
    ],
  },
  {
    id: "grant-agent",
    title: "Autonomous Grant Agent",
    description: "AI agent sourcing and filing global grants autonomously.",
    links: [
      { label: "Architecture Overview", href: "#" },
    ],
  },
  {
    id: "motion",
    title: "Motion-Control Gaming Platform",
    description: "Full-body measurable gaming system driven by real movement.",
    links: [
      { label: "Demo", href: "#" },
    ],
  },
  {
    id: "vision",
    title: "Vision-Based Robotics",
    description: "OpenCV and TensorFlow Lite deployments on edge devices.",
    links: [
      { label: "GitHub", href: "#" },
    ],
  },
  {
    id: "navigation",
    title: "Autonomous Navigation Systems",
    description: "GPS-guided and gesture-controlled robotic vehicles.",
    links: [
      { label: "Demo", href: "#" },
    ],
  },
  {
    id: "firstclue",
    title: "IdeasByKids / FirstClue",
    description: "AI system decoding children's ideas into structured development insights.",
    links: [
      { label: "Architecture Overview", href: "#" },
    ],
  },
];

function Systems() {
  return (
    <div className="min-h-screen">
      <SEO title={PAGE_TITLES.systems} />
      <main className="container-main py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 md:mb-20">
          <Link href="/" className="inline-block mb-8 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150">
            ← Back
          </Link>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Systems
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Engineering-first systems across robotics, edge AI, autonomous agents, and hardware execution platforms.
          </p>
        </header>

        {/* Systems List - Flat, no categories */}
        <div className="space-y-0">
          {systems.map((system) => (
            <article 
              key={system.id}
              id={system.id}
              className="py-6 border-b border-[var(--border-subtle)] group scroll-mt-24"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 md:gap-8">
                {/* Title and description */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                    {system.title}
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base">
                    {system.description}
                  </p>
                </div>
                
                {/* Links */}
                <div className="flex items-center gap-6 shrink-0">
                  {system.links.map((link) => (
                    <ExternalLink key={link.label} href={link.href}>
                      {link.label}
                    </ExternalLink>
                  ))}
                </div>
              </div>
            </article>
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
            <Link href="/" className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150">
              ← Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Systems;
