import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";

interface Endorsement {
  slug: string;
  quote: string;
  name: string;
  role: string;
  organisation: string;
  linkedin_url: string | null;
}

// Sample placeholder endorsements as specified
const endorsements: Endorsement[] = [
  {
    slug: "lion-circuits-2026",
    quote: "Lakshveer demonstrates exceptional understanding of hardware systems for his age. His work on circuit design shows real engineering thinking.",
    name: "Arun Kumar",
    role: "Technical Director",
    organisation: "Lion Circuits",
    linkedin_url: "https://linkedin.com/in/example1",
  },
  {
    slug: "malpani-ventures-2026",
    quote: "One of the most impressive young builders we have funded. Clear vision, disciplined execution.",
    name: "Priya Malpani",
    role: "Partner",
    organisation: "Malpani Ventures",
    linkedin_url: "https://linkedin.com/in/example2",
  },
  {
    slug: "param-foundation-2026",
    quote: "Lakshveer brings a rare combination of creativity and technical rigor. His makeathon project stood out among participants twice his age.",
    name: "Rajesh Sharma",
    role: "Program Director",
    organisation: "Param Foundation",
    linkedin_url: "https://linkedin.com/in/example3",
  },
  {
    slug: "hardware-hackathon-2026",
    quote: "Consistently ships working prototypes. Does not just ideate - he builds.",
    name: "Vikram Rao",
    role: "Lead Organizer",
    organisation: "Hardware Hackathon 2.0",
    linkedin_url: null,
  },
];

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
          className="absolute left-full ml-3 text-xs text-[var(--text-muted)] whitespace-nowrap animate-fade-out"
        >
          Link copied
        </span>
      )}
    </div>
  );
};

interface EndorsementCardProps {
  endorsement: Endorsement;
}

const EndorsementCard = ({ endorsement }: EndorsementCardProps) => {
  return (
    <article className="py-8 border-b border-[var(--border-subtle)] last:border-b-0">
      {/* Quote - displayed as main content, no quotation marks */}
      <p className="text-lg text-[var(--text-primary)] leading-relaxed mb-6">
        {endorsement.quote}
      </p>
      
      {/* Attribution */}
      <div className="space-y-1 mb-4">
        <p className="text-[var(--text-primary)] font-semibold">
          — {endorsement.name}
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          {endorsement.role}
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          {endorsement.organisation}
        </p>
      </div>
      
      {/* Links */}
      <div className="flex items-center gap-6">
        {endorsement.linkedin_url && (
          <a
            href={endorsement.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
          >
            LinkedIn ↗
          </a>
        )}
        <ShareButton slug={endorsement.slug} />
      </div>
    </article>
  );
};

function Recognition() {
  return (
    <div className="min-h-screen">
      <SEO title="Recognition | Lakshveer Rao" />
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
            Ecosystem Recognition
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Recognition from collaborators, organisers, and ecosystem partners.
          </p>
        </header>

        {/* Endorsements - Newest first (already ordered that way in data) */}
        <div className="space-y-0">
          {endorsements.map((endorsement) => (
            <EndorsementCard key={endorsement.slug} endorsement={endorsement} />
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

export default Recognition;
