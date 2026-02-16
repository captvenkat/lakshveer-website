interface LinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
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

function Index() {
  return (
    <div className="min-h-screen">
      {/* Main container with max-width 1100px */}
      <main className="container-main py-24 md:py-32">
        {/* Hero Section */}
        <header className="mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Personal Site
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Designer, developer, and maker of things. Building tools and writing about technology, design, and the craft of creation.
          </p>
        </header>

        {/* Recent Work / Ledger Section */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold mb-8 text-[var(--text-primary)]">
            Recent
          </h2>
          
          <div className="space-y-6">
            <article className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
              <time className="ledger-date shrink-0">2024.12</time>
              <div>
                <InternalLink href="/writing/design-systems">
                  Building a design system from scratch
                </InternalLink>
              </div>
            </article>
            
            <article className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
              <time className="ledger-date shrink-0">2024.11</time>
              <div>
                <ExternalLink href="https://github.com">
                  Open source contributions
                </ExternalLink>
              </div>
            </article>
            
            <article className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
              <time className="ledger-date shrink-0">2024.10</time>
              <div>
                <InternalLink href="/projects/toolkit">
                  Developer toolkit release
                </InternalLink>
              </div>
            </article>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold mb-8 text-[var(--text-primary)]">
            About
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] max-w-2xl">
            <p>
              I build products and write code. Currently focused on developer tools and design systems that make building software more enjoyable.
            </p>
            <p>
              Previously worked on projects spanning fintech, creative tools, and infrastructure. Always interested in the intersection of design and engineering.
            </p>
          </div>
        </section>

        {/* Connect Section */}
        <section>
          <h2 className="text-xl font-semibold mb-8 text-[var(--text-primary)]">
            Connect
          </h2>
          <div className="flex flex-wrap gap-6">
            <ExternalLink href="https://twitter.com">Twitter</ExternalLink>
            <ExternalLink href="https://github.com">GitHub</ExternalLink>
            <ExternalLink href="mailto:hello@example.com">Email</ExternalLink>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container-main pb-12">
        <div className="border-t border-[var(--border-subtle)] pt-8">
          <p className="text-sm text-[var(--text-muted)]">
            <span className="font-mono">2024</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Index;
