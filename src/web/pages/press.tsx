import { SEO } from "@/components/seo";
import { Header } from "@/components/header";
import { portfolioData, getCurrentDate } from "@/data/portfolio";

export default function Press() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Press Kit | Lakshveer Rao" 
        description="Press kit for Lakshveer Rao - downloadable assets, bio, facts, and media resources."
      />
      <Header />
      
      <main className="container-main py-8 md:py-16">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Press Kit
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Everything you need to write about {portfolioData.shortName}. Bio, facts, images, and key information — all in one place.
          </p>
        </div>

        {/* Quick Copy Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Quick Copy</h2>
          <div className="space-y-4">
            {/* One-liner */}
            <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-[var(--text-secondary)]">One-Liner</h3>
                <button 
                  onClick={() => navigator.clipboard.writeText(portfolioData.oneLiner)}
                  className="text-xs text-[var(--accent)] hover:opacity-80"
                >
                  Copy
                </button>
              </div>
              <p className="text-lg">{portfolioData.oneLiner}</p>
            </div>

            {/* Short Bio */}
            <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-[var(--text-secondary)]">Short Bio (50 words)</h3>
                <button 
                  onClick={() => navigator.clipboard.writeText(`${portfolioData.name} is an ${portfolioData.age}-year-old hardware and AI builder from ${portfolioData.location}. Co-founder of Projects by Laksh, he has shipped ${portfolioData.stats.productsShipped} products including CircuitHeroes (a circuit-building card game with 300+ sales and registered trademark), secured ${portfolioData.stats.grantsReceived} in grants, and documented ${portfolioData.stats.projectsDocumented} projects.`)}
                  className="text-xs text-[var(--accent)] hover:opacity-80"
                >
                  Copy
                </button>
              </div>
              <p className="text-[var(--text-secondary)]">
                {portfolioData.name} is an {portfolioData.age}-year-old hardware and AI builder from {portfolioData.location}. 
                Co-founder of Projects by Laksh, he has shipped {portfolioData.stats.productsShipped} products including CircuitHeroes 
                (a circuit-building card game with 300+ sales and registered trademark), secured {portfolioData.stats.grantsReceived} in grants, 
                and documented {portfolioData.stats.projectsDocumented} projects.
              </p>
            </div>

            {/* Long Bio */}
            <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-[var(--text-secondary)]">Long Bio (100 words)</h3>
                <button 
                  onClick={() => navigator.clipboard.writeText(`${portfolioData.name}, ${portfolioData.age}, is one of India's youngest hardware entrepreneurs. Based in ${portfolioData.location}, he runs Projects by Laksh alongside his father, Capt. Venkat. His flagship product, CircuitHeroes.com, is a circuit-building trading card game that has sold 300+ decks and holds a registered trademark. Laksh works with ESP32, Arduino, Raspberry Pi, Python, TensorFlow, and computer vision tools like OpenCV and MediaPipe. He has received ${portfolioData.stats.grantsReceived} in grants from Malpani Ventures, Param Foundation, and AI Grants India. A participant in Gemini 3 Hackathon (Google DeepMind) and top-5 finalist at Hardware Hackathon 2.0, he continues to build and ship.`)}
                  className="text-xs text-[var(--accent)] hover:opacity-80"
                >
                  Copy
                </button>
              </div>
              <p className="text-[var(--text-secondary)]">
                {portfolioData.name}, {portfolioData.age}, is one of India's youngest hardware entrepreneurs. 
                Based in {portfolioData.location}, he runs Projects by Laksh alongside his father, Capt. Venkat. 
                His flagship product, CircuitHeroes.com, is a circuit-building trading card game that has sold 300+ decks 
                and holds a registered trademark. Laksh works with ESP32, Arduino, Raspberry Pi, Python, TensorFlow, 
                and computer vision tools like OpenCV and MediaPipe. He has received {portfolioData.stats.grantsReceived} in grants 
                from Malpani Ventures, Param Foundation, and AI Grants India. A participant in Gemini 3 Hackathon (Google DeepMind) 
                and top-5 finalist at Hardware Hackathon 2.0, he continues to build and ship.
              </p>
            </div>
          </div>
        </section>

        {/* Key Facts */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Key Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <h3 className="font-semibold mb-4">Numbers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Age</span>
                  <span className="font-medium">{portfolioData.age} years old</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Products Shipped</span>
                  <span className="font-medium">{portfolioData.stats.productsShipped}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Projects Documented</span>
                  <span className="font-medium">{portfolioData.stats.projectsDocumented}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Grants Received</span>
                  <span className="font-medium">{portfolioData.stats.grantsReceived}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Ebook Sales</span>
                  <span className="font-medium">{portfolioData.stats.ebookSales}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Trademarks Owned</span>
                  <span className="font-medium">{portfolioData.stats.trademarksOwned}</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <h3 className="font-semibold mb-4">Milestones</h3>
              <ul className="space-y-2 text-sm">
                {portfolioData.achievements.map((a) => (
                  <li key={a.title} className="flex items-start gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>{a.title} — {a.event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioData.products.map((product) => (
              <div key={product.name} className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${product.status === 'live' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {product.status}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm mb-2">{product.desc}</p>
                {product.highlight && (
                  <p className="text-[var(--accent)] text-sm">{product.highlight}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Backers */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Backed By</h2>
          <div className="flex flex-wrap gap-3">
            {portfolioData.backers.map((backer) => (
              <a 
                key={backer.name}
                href={backer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-colors text-sm"
              >
                {backer.name} ↗
              </a>
            ))}
          </div>
        </section>

        {/* Media Coverage */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Media Coverage</h2>
          <div className="space-y-3">
            {portfolioData.media.map((item) => (
              <a 
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-colors"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-[var(--accent)] ml-2">↗</span>
              </a>
            ))}
          </div>
        </section>

        {/* Social Links */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Official Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href={portfolioData.website} className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-colors text-center">
              <p className="font-semibold">Website</p>
              <p className="text-sm text-[var(--text-secondary)]">lakshveer.com</p>
            </a>
            <a href={portfolioData.social.twitter.url} target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-colors text-center">
              <p className="font-semibold">Twitter/X</p>
              <p className="text-sm text-[var(--text-secondary)]">{portfolioData.social.twitter.handle}</p>
            </a>
            <a href={portfolioData.social.linkedin.url} target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-colors text-center">
              <p className="font-semibold">LinkedIn</p>
              <p className="text-sm text-[var(--text-secondary)]">{portfolioData.social.linkedin.handle}</p>
            </a>
            <a href={portfolioData.social.youtube.url} target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-colors text-center">
              <p className="font-semibold">YouTube</p>
              <p className="text-sm text-[var(--text-secondary)]">{portfolioData.social.youtube.handle}</p>
            </a>
          </div>
        </section>

        {/* Downloadable Assets */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Downloadable Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/qr-code.png" 
              download="lakshveer-qr-code.png"
              className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-colors text-center"
            >
              <div className="flex justify-center mb-4">
                <img src="/qr-code.png" alt="QR Code" className="w-24 h-24" />
              </div>
              <p className="font-semibold">QR Code</p>
              <p className="text-sm text-[var(--text-secondary)]">PNG • High Resolution</p>
            </a>
            <a 
              href="/api/portfolio.pdf" 
              target="_blank"
              className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-colors text-center"
            >
              <div className="flex justify-center mb-4">
                <svg className="w-24 h-24 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-semibold">Portfolio PDF</p>
              <p className="text-sm text-[var(--text-secondary)]">One-page summary</p>
            </a>
            <a 
              href="/og-image.png" 
              download="lakshveer-og-image.png"
              className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-colors text-center"
            >
              <div className="flex justify-center mb-4">
                <img src="/og-image.png" alt="OG Image" className="w-full max-w-[200px] h-auto rounded" />
              </div>
              <p className="font-semibold">Social Image</p>
              <p className="text-sm text-[var(--text-secondary)]">1200×630 • OG Ready</p>
            </a>
          </div>
        </section>

        {/* Contact for Media */}
        <section className="p-8 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-center">
          <h2 className="text-2xl font-semibold mb-4">Media Inquiries</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            For interviews, quotes, or additional information, contact:
          </p>
          <p className="font-semibold">{portfolioData.contact.primary.name}</p>
          <p className="text-[var(--text-secondary)] text-sm mb-4">{portfolioData.contact.primary.role}</p>
          <div className="flex justify-center gap-4">
            <a 
              href={`https://x.com/${portfolioData.contact.primary.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:opacity-80"
            >
              {portfolioData.contact.primary.twitter} ↗
            </a>
            <a 
              href={portfolioData.contact.primary.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:opacity-80"
            >
              LinkedIn ↗
            </a>
          </div>
        </section>

        {/* Footer note */}
        <p className="text-center text-sm text-[var(--text-muted)] mt-12">
          Last updated: {getCurrentDate()} • All stats auto-synced
        </p>
      </main>
    </div>
  );
}
