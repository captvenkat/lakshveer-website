import { useState } from "react";
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

// Selected Platforms Data - Exactly 4 entries as specified
const selectedPlatforms = [
  { 
    title: "Hardvare", 
    description: "Hardware execution platform enforcing safe electrical and logical states.",
    href: "/systems#hardvare",
    isInternal: true
  },
  { 
    title: "CircuitHeroes.com", 
    description: "Circuit-building trading card game. 300+ decks sold.",
    href: "https://circuitheroes.com",
    isInternal: false
  },
  { 
    title: "ChhotaCreator.com", 
    description: "Peer-learning platform for hands-on learning.",
    href: "https://chhotacreator.com",
    isInternal: false
  },
  { 
    title: "IdeasByKids / FirstClue", 
    description: "AI system decoding children's ideas into structured development insights.",
    href: "/systems#firstclue",
    isInternal: true
  },
];

// Autonomous Systems Data
const autonomousSystems = [
  "Autonomous obstacle-avoiding vehicles",
  "Gesture-controlled & GPS-guided robotic cars",
  "Vision systems using OpenCV, MediaPipe, TensorFlow Lite",
  "AI-powered monitoring & assistance bots",
];

// Impact Data - Updated per Task 15
const impactEntries = [
  { year: "2026", event: "Special Mention Winner", detail: "Vedanta × Param Foundation Makeathon" },
  { year: "2026", event: "₹1,00,000 Grant", detail: "Malpani Ventures" },
  { year: "2026", event: "Special Invite", detail: "Robotics & Hardware Founders Meet" },
  { year: "", event: "Top-5 Finalist", detail: "Hardware Hackathon 2.0" },
  { year: "", event: "Youngest Finalist", detail: "VibeHack by Emergent" },
];

// Momentum Stats - Updated as specified
const stats = [
  { label: "Age", value: "8" },
  { label: "Systems Built", value: "25+" },
  { label: "Products Shipped", value: "3" },
  { label: "Workshops Delivered", value: "12+" },
  { label: "Grants & Scholarships", value: "₹1.4L+" },
];

// Backed By - Updated with exact URLs per Task 15
const backers = [
  { name: "Malpani Ventures", href: "https://malpaniventures.com" },
  { name: "Lion Circuits", href: "https://lioncircuits.com" },
  { name: "Param Foundation", href: "https://paramfoundation.org" },
  { name: "AI Grants India", href: "https://aigrantsindia.com" },
];

// Collaborate Items - Updated per Task 15
const collaborateItems = [
  "Hardware sponsorship",
  "Manufacturing collaboration",
  "Research partnerships",
  "Institutional grants",
  "Cloud credits",
  "Media features",
];

// Laksh Social Links
const lakshSocialLinks = [
  { label: "Website", href: "https://www.lakshveer.com" },
  { label: "GitHub", href: "https://github.com/lakshveerrao" },
  { label: "X", href: "https://x.com/LakshveerRao" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lakshveerrao/" },
  { label: "YouTube", href: "https://www.youtube.com/@ProjectsByLaksh" },
  { label: "Runable Hackathon Build", href: "https://motionx.runable.site/" },
];

// Founder / Ops Links
const founderLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/captvenkat/" },
  { label: "X", href: "https://x.com/CaptVenk" },
];

// Featured Endorsements for Ecosystem Recognition section
interface FeaturedEndorsement {
  slug: string;
  quote: string;
  name: string;
  role: string;
  organisation: string;
}

const featuredEndorsements: FeaturedEndorsement[] = [
  {
    slug: "lion-circuits-2026",
    quote: "Lakshveer demonstrates exceptional understanding of hardware systems for his age. His work on circuit design shows real engineering thinking.",
    name: "Arun Kumar",
    role: "Technical Director",
    organisation: "Lion Circuits",
  },
  {
    slug: "malpani-ventures-2026",
    quote: "One of the most impressive young builders we have funded. Clear vision, disciplined execution.",
    name: "Priya Malpani",
    role: "Partner",
    organisation: "Malpani Ventures",
  },
  {
    slug: "param-foundation-2026",
    quote: "Lakshveer brings a rare combination of creativity and technical rigor. His makeathon project stood out among participants twice his age.",
    name: "Rajesh Sharma",
    role: "Program Director",
    organisation: "Param Foundation",
  },
];

// ShareButton component for endorsements
interface ShareButtonProps {
  slug: string;
}

const ShareButton = ({ slug }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/recognition/${slug}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ecosystem Recognition - Lakshveer Rao",
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed, fallback to copy
        await copyToClipboard(shareUrl);
      }
    } else {
      // Fallback: copy to clipboard
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleShare}
        className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
      >
        Share ↗
      </button>
      {copied && (
        <span 
          className="absolute left-full ml-3 text-xs text-[var(--text-muted)] whitespace-nowrap"
          style={{ animation: "fadeOut 2s forwards" }}
        >
          Link copied
        </span>
      )}
    </div>
  );
};

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
                Co-Founder | Builder | Hardware + AI Systems Engineer | Game Designer
              </p>
              <p className="text-lg text-[var(--text-muted)] mb-6">
                Co-Founder & Partner — Projects by Laksh
              </p>
              <p className="text-lg text-[var(--text-secondary)] mb-4 leading-relaxed max-w-xl">
                Lakshveer Rao builds to learn. He builds end-to-end deployable systems across electronics, robotics, autonomous machines, computer vision, AI-driven devices, and motion-controlled games.
              </p>
              <p className="text-base text-[var(--text-muted)] mb-10">
                Operating Principle: build → fail → debug → ship.
              </p>
              <nav className="flex flex-wrap gap-6 md:gap-8">
                <InternalLink href="/systems">Systems</InternalLink>
                <InternalLink href="/impact">Impact</InternalLink>
                <InternalLink href="/venture">Venture</InternalLink>
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

        {/* ========== SELECTED PLATFORMS ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Selected Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedPlatforms.map((platform) => (
              <article 
                key={platform.title}
                className="group p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-[border-color] duration-200"
              >
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                  {platform.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                  {platform.description}
                </p>
                {platform.isInternal ? (
                  <a 
                    href={platform.href} 
                    className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
                  >
                    View System →
                  </a>
                ) : (
                  <a 
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
                  >
                    Website ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ========== AUTONOMOUS SYSTEMS SUMMARY ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Autonomous Systems
          </h2>
          <ul className="space-y-3 mb-10">
            {autonomousSystems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-[var(--text-muted)] select-none">•</span>
                <span className="text-[var(--text-secondary)]">{item}</span>
              </li>
            ))}
          </ul>
          <InternalLink href="/systems">View All Systems</InternalLink>
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
                {entry.year && (
                  <>
                    <span className="font-mono text-sm text-[var(--text-muted)] sm:w-20 shrink-0">
                      {entry.year}
                    </span>
                    <span className="hidden sm:inline text-[var(--text-secondary)] mx-4">—</span>
                  </>
                )}
                <span className={`font-mono text-sm text-[var(--text-secondary)] ${entry.year ? 'sm:flex-1' : 'flex-1'}`}>
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

        {/* ========== ECOSYSTEM RECOGNITION ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Ecosystem Recognition
          </h2>
          <div className="space-y-0">
            {featuredEndorsements.map((endorsement) => (
              <article 
                key={endorsement.slug}
                className="py-8 border-b border-[var(--border-subtle)] last:border-b-0"
              >
                {/* Quote - displayed as paragraph, no quotation marks */}
                <p className="text-lg text-[var(--text-primary)] leading-relaxed mb-6">
                  {endorsement.quote}
                </p>
                
                {/* Attribution */}
                <div className="space-y-1 mb-4">
                  <p className="text-[var(--text-primary)] font-semibold">
                    — {endorsement.name}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {endorsement.role}, {endorsement.organisation}
                  </p>
                </div>
                
                {/* Share button */}
                <ShareButton slug={endorsement.slug} />
              </article>
            ))}
          </div>
          <div className="mt-8">
            <InternalLink href="/recognition">View All Recognition</InternalLink>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left column - Lakshveer info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Lakshveer Rao</h3>
              <p className="text-[var(--text-secondary)] mb-1">Co-Founder — Projects by Laksh</p>
              <p className="text-[var(--text-muted)] text-sm mb-6">Based in Hyderabad, India (UTC+5:30)</p>
              
              {/* Laksh Social Links */}
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {lakshSocialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
            
            {/* Right column - Primary Contact info */}
            <div className="lg:text-right">
              <p className="text-sm text-[var(--text-muted)] mb-4">Primary Contact:</p>
              <h4 className="text-lg font-semibold mb-1">Capt. Venkat</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Co-Founder | First Investor | Operations & Systems</p>
              <p className="text-sm text-[var(--text-muted)] mb-6">Primary Point of Contact</p>
              
              {/* Founder / Ops Links */}
              <div className="flex flex-wrap lg:justify-end gap-x-4 gap-y-2">
                {founderLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;
