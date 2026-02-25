import { useState, useEffect } from "react";
import { SEO, PAGE_TITLES } from "@/components/seo";
import { ShareMenu } from "@/components/share-menu";
import { AnimatedCounter, parseStatValue } from "@/components/animated-counter";

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
    description: "Circuit-building trading card game. 300+ decks sold. Trademark registered.",
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
    title: "MotionX", 
    description: "Full-body motion-control gaming system. Built at RunTogether Hackathon.",
    href: "https://motionx.runable.site/",
    isInternal: false
  },
];

// Autonomous Systems Data
const autonomousSystems = [
  "Autonomous obstacle-avoiding vehicles",
  "Gesture-controlled & GPS-guided robotic cars",
  "Vision systems using OpenCV, MediaPipe, TensorFlow Lite",
  "AI-powered monitoring & assistance bots",
];

// Impact Data - Recent highlights
const impactEntries = [
  { year: "2026", event: "Youngest Innovator & Special Mention", detail: "Param × Vedanta Makeathon" },
  { year: "2026", event: "₹1,00,000 Grant", detail: "Malpani Ventures" },
  { year: "2026", event: "Gemini 3 Hackathon", detail: "Cerebral Valley × Google DeepMind" },
  { year: "", event: "Top-5 Finalist (Youngest)", detail: "Hardware Hackathon 2.0" },
  { year: "", event: "Youngest Founder", detail: "Delta-2 Cohort, The Residency" },
];

// Momentum Stats - Verified and accurate
const stats = [
  { label: "Ebook Sales", value: "100+" },
  { label: "Projects Documented", value: "170+" },
  { label: "Products Shipped", value: "3" },
  { label: "Workshops Conducted", value: "5+" },
  { label: "Grants & Scholarships", value: "₹1.4L+" },
  { label: "Trademark Owned", value: "1", highlight: true },
];

// Backed By - Updated with exact URLs per Task 15
const backers = [
  { name: "Malpani Ventures", href: "https://malpaniventures.com" },
  { name: "Lion Circuits", href: "https://lioncircuits.com" },
  { name: "Param Foundation", href: "https://paramfoundation.org" },
  { name: "AI Grants India", href: "https://aigrants.in" },
];

// Support Ecosystem - People who have helped guide Laksh's journey
interface Mentor {
  name: string;
  handle: string;
  guidance: string;
  href: string;
}

const mentors: Mentor[] = [
  { name: "Dr. Aniruddha Malpani", handle: "@malpani", guidance: "Angel investing & startup thinking", href: "https://x.com/malpani" },
  { name: "Besta Prem Sai", handle: "@besta_tweets", guidance: "Drone technology & GPS-denied autonomy", href: "https://x.com/besta_tweets" },
  { name: "PremPrasad Mirthinti", handle: "@premmirth", guidance: "EdgeAI & STEM education", href: "https://x.com/premmirth" },
  { name: "Nandini Chilkam", handle: "@NandiniChilkam", guidance: "Embedded systems & education", href: "https://x.com/NandiniChilkam" },
  { name: "Abhishek R", handle: "@aramanujaa", guidance: "Comics & storytelling for learning", href: "https://x.com/aramanujaa" },
  { name: "Ganesh Sonawane", handle: "@ganeshsonawane", guidance: "Product building & D2C manufacturing", href: "https://x.com/ganeshsonawane" },
  { name: "Aakash", handle: "@Dudechillkar", guidance: "Hardware building & making", href: "https://x.com/Dudechillkar" },
  { name: "Karthik Rangarajan", handle: "@karthikRanga92", guidance: "Drones, robotics & FPV systems", href: "https://x.com/karthikRanga92" },
  { name: "Darshan Savaliya", handle: "@dar_s_han", guidance: "Hardware devices & competitions", href: "https://x.com/dar_s_han" },
  { name: "Murali Srinivasa", handle: "@MuraliSrinivasa", guidance: "PCB design & electronics manufacturing", href: "https://x.com/MuraliSrinivasa" },
  { name: "Ravi Rangan", handle: "@RaviRangan", guidance: "STEM education & experiential learning", href: "https://x.com/RaviRangan" },
  { name: "Hanuma Aditya", handle: "@Aditya_SantoH", guidance: "EV building & hardware startups", href: "https://x.com/Aditya_SantoH" },
  { name: "M S Mihir", handle: "@M_S_MIHIR", guidance: "VC & founder community", href: "https://x.com/M_S_MIHIR" },
  { name: "Harish Ashok", handle: "@habril27", guidance: "Hardware projects & peer learning", href: "https://x.com/habril27" },
  { name: "Yuvraj Aaditya", handle: "@AadityaYuvraj", guidance: "Community building & acceleration", href: "https://x.com/AadityaYuvraj" },
  { name: "Arnav Bansal", handle: "@itsarnavb", guidance: "Electronics sourcing & education", href: "https://x.com/itsarnavb" },
  { name: "Joe Daniel", handle: "@very_daniel", guidance: "Embedded systems & hardware", href: "https://x.com/very_daniel" },
  { name: "Naman Chakraborty", handle: "@heisme", guidance: "Progression planning", href: "https://x.com/heisme" },
  { name: "Alysha Lobo", handle: "@alysha_lobo", guidance: "Robotics & hardware acceleration", href: "https://x.com/alysha_lobo" },
  { name: "Vishal Tejwani", handle: "@ivishaltejwani", guidance: "Hardware products & founder journey", href: "https://x.com/ivishaltejwani" },
  { name: "Nimisha Chanda", handle: "@NimishaChanda", guidance: "Builder community & hackathons", href: "https://x.com/NimishaChanda" },
  { name: "Aditya G", handle: "@IamAdiG", guidance: "AI agents & product building", href: "https://x.com/IamAdiG" },
  { name: "Reddy2Go", handle: "@reddy2go", guidance: "Play-based learning & creativity", href: "https://x.com/reddy2go" },
  { name: "Rohit Awasthi", handle: "@rohitawasthi", guidance: "Physics & electronics", href: "https://x.com/rohitawasthi" },
  { name: "Raunak Mahajan", handle: "@raunakmahajan", guidance: "Founder journey & storytelling", href: "https://x.com/raunakmahajan" },
  { name: "Vivek Shukla", handle: "@vivekshukla", guidance: "Startups & early-stage building", href: "https://x.com/vivekshukla" },
  { name: "Mehul Fanawala", handle: "@MehulFanawala", guidance: "RevOps & brand strategy", href: "https://x.com/MehulFanawala" },
  { name: "Fahd Tumbi", handle: "@thefahdtumbi", guidance: "Builder community", href: "https://x.com/thefahdtumbi" },
  { name: "Ankur Pandey", handle: "@AnkurPandey", guidance: "AI alignment & future tech", href: "https://x.com/AnkurPandey" },
  { name: "Amit Sethi", handle: "@amit_sethi", guidance: "Deep learning & AI research", href: "https://x.com/amit_sethi" },
  { name: "Kunal Gupta", handle: "@kunal_gupta01", guidance: "E-bikes & hardware startups", href: "https://x.com/kunal_gupta01" },
  { name: "Kiran Kumar", handle: "@mkirank", guidance: "Robotics & hardware products", href: "https://x.com/mkirank" },
  { name: "Rama Venu", handle: "@ramavenu", guidance: "Manufacturing & SME consulting", href: "https://x.com/ramavenu" },
  { name: "Aditya Vellanki", handle: "@aditya_vellanki", guidance: "Young builder & AI tools", href: "https://x.com/aditya_vellanki" },
  { name: "Parth Pandya", handle: "@phpandya28", guidance: "CubeSat & RF engineering", href: "https://x.com/phpandya28" },
  { name: "Bhasker Kode", handle: "@0xBosky", guidance: "AI Grants India & distributed systems", href: "https://x.com/0xBosky" },
  { name: "TX", handle: "@DotSlashTX", guidance: "Infosec & public speaking", href: "https://x.com/DotSlashTX" },
  { name: "Ronald Wilson", handle: "@RonxldWilson", guidance: "Builder support", href: "https://x.com/RonxldWilson" },
  { name: "Akash Bansal", handle: "@akashbnsal", guidance: "Content & entrepreneurship", href: "https://x.com/akashbnsal" },
  { name: "Khushi", handle: "@khushhhi_", guidance: "Young founder & India optimism", href: "https://x.com/khushhhi_" },
  { name: "Ramsri Goutham", handle: "@ramsri_goutham", guidance: "AI SaaS & data science", href: "https://x.com/ramsri_goutham" },
  { name: "Harshal Modi", handle: "@grondmaster", guidance: "Board games & culture", href: "https://x.com/grondmaster" },
  { name: "Inavamsi B Enaganti", handle: "@inav65", guidance: "Science & innovation at Param", href: "https://x.com/inav65" },
  { name: "CPK", handle: "@heyaCPK", guidance: "Kids wellness & food writing", href: "https://x.com/heyaCPK" },
  { name: "Murali Duggineni", handle: "@NarrativeNest", guidance: "Etymology & storytelling", href: "https://x.com/NarrativeNest" },
];

// As Featured In - Media coverage
const featuredIn = [
  { name: "Adil Mania", href: "https://x.com/adilmania/status/1998158073027043345" },
  { name: "Beats in Brief", href: "https://beatsinbrief.com/2026/01/11/lakshveer-rao-8-year-old-hardware-startup-founder-india/" },
  { name: "Runtime", href: "https://www.instagram.com/reel/DQJ34sdjxA0/" },
  { name: "Lion Circuits", href: "https://x.com/LionCircuits/status/1950132910667026934" },
  { name: "ThinkTac", href: "https://www.youtube.com/watch?v=8qmvDz-TJTE" },
  { name: "Maverick News", href: "https://mavericknews30.com/?p=103498" },
];

// Tech Stack - Hardware, Software, AI/LLM Platforms
interface TechCategory {
  title: string;
  items: string[];
}

const techStack: TechCategory[] = [
  {
    title: "Hardware",
    items: ["ESP32", "Arduino", "Raspberry Pi", "Vicharak", "BBC Micro:bit", "Sensors & Actuators", "3D Printing"],
  },
  {
    title: "Software",
    items: ["Python", "C++", "TensorFlow", "PyTorch", "TinyML", "OpenCV", "MediaPipe", "Fusion 360", "Canva", "PowerShell", "Bash", "Git", "Arduino IDE", "ESP-IDF", "Three.js"],
  },
  {
    title: "Claw Ecosystem",
    items: ["OpenClaw", "ZeroClaw", "zClaw"],
  },
  {
    title: "AI & Platforms",
    items: ["OpenAI", "Claude", "Gemini", "Google AI Studio", "Cursor", "Replit", "Runable", "Emergent", "Antigravity", "Ideogram", "NanoBanana"],
  },
  {
    title: "Models",
    items: ["YOLO", "SAM3", "Depth Estimation", "OpenCV DNN", "MediaPipe"],
  },
];

// What we're looking for - kept simple and honest
const seekingItems = [
  "Hardware sponsorship",
  "Manufacturing access",
  "Cloud credits",
  "Research mentorship",
  "Grants",
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

// Immersive Learning - Company visits for hands-on learning
interface CompanyVisit {
  name: string;
  type: string;
  location: string;
  href?: string;
}

const companyVisits: CompanyVisit[] = [
  { name: "Robu.in", type: "Electronics Components", location: "Pune", href: "https://robu.in" },
  { name: "Aerolyte", type: "Drone Manufacturing", location: "Hyderabad", href: "https://aerolyte.in" },
  { name: "LionCircuits", type: "PCB Manufacturing", location: "Bengaluru", href: "https://lioncircuits.com" },
  { name: "Clapstore Toys", type: "Toy Manufacturing", location: "Hyderabad" },
  { name: "T-Hub", type: "Startup Incubator", location: "Hyderabad", href: "https://t-hub.co" },
  { name: "Param Innovation", type: "Hardware Lab", location: "Bengaluru" },
  { name: "Agam Robotics", type: "Drone Systems", location: "Hyderabad", href: "https://agamrobotics.com" },
  { name: "IIT Hyderabad", type: "IoT + TinyML, Drone Lab", location: "Hyderabad", href: "https://iith.ac.in" },
  { name: "BITS Pilani", type: "Ethical Hacking Workshop", location: "Hyderabad", href: "https://bits-pilani.ac.in" },
  { name: "Ind Chip Technologies", type: "Semiconductor", location: "Hyderabad", href: "https://indchip.com" },
  { name: "Pongfox", type: "Gaming Hardware", location: "Bengaluru", href: "https://pongfox.com" },
  { name: "Vecros Tech", type: "Drone Technology", location: "Bengaluru", href: "https://vecros.com" },
  { name: "ThinkTac", type: "EdTech", location: "Bengaluru", href: "https://thinktac.com" },
  { name: "EMotorad", type: "Electric Vehicles", location: "Pune", href: "https://emotorad.com" },
  { name: "Bibox Labs", type: "Robotics & STEM", location: "Bengaluru", href: "https://biboxlabs.com" },
  { name: "Frido", type: "Healthcare Tech", location: "Pune", href: "https://frido.in" },
  { name: "T-Works", type: "Prototyping Lab", location: "Hyderabad", href: "https://t-works.in" },
  { name: "TDK Ventures", type: "Deep Tech VC", location: "Bengaluru", href: "https://tdkventures.com" },
];

// Featured Endorsements for Ecosystem Recognition section
// NOTE: These should be replaced with real, verifiable quotes from actual supporters
// Current placeholders - to be updated with verified testimonials
interface FeaturedEndorsement {
  slug: string;
  quote: string;
  name: string;
  role: string;
  organisation: string;
  proofUrl?: string;
}

const featuredEndorsements: FeaturedEndorsement[] = [
  {
    slug: "robu-nilesh-2025",
    quote: "Laksh is a remarkable young innovator. At just 7 years old, he demonstrates a deep understanding of electronics and robotics that is rare even in adults.",
    name: "Nilesh",
    role: "Founder",
    organisation: "Robu.in",
    proofUrl: "https://www.youtube.com/watch?v=Iztx6DofF98",
  },
  {
    slug: "aerolyte-2025",
    quote: "Don't buy a drone, build one! That's the advice I gave Laksh, and he's taken it to heart with his hands-on approach to learning.",
    name: "Aerolyte Founder",
    role: "Founder",
    organisation: "Aerolyte",
    proofUrl: "https://www.youtube.com/watch?v=-xrTa7I2FHg",
  },
];

// Twitter intent URL for public endorsements
const ENDORSE_TWITTER_URL = "https://twitter.com/intent/tweet?text=" + encodeURIComponent("I support @LakshveerRao's builder journey. \n\nlakshveer.com");

function Index() {
  const [supporterQuotes, setSupporterQuotes] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Fetch supporter quotes from API
    fetch("/api/supporters/quotes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.quotes) {
          const quotesMap: Record<string, string> = {};
          data.quotes.forEach((q: { handle: string; quote: string }) => {
            quotesMap[q.handle] = q.quote;
          });
          setSupporterQuotes(quotesMap);
        }
      })
      .catch(() => {}); // Silent fail
  }, []);
  
  return (
    <div className="min-h-screen">
      <SEO title={PAGE_TITLES.home} />
      
      {/* Action Bar */}
      <div className="bg-[var(--accent)]/5 border-b border-[var(--accent)]/10">
        <div className="container-main py-3">
          <div className="flex items-center justify-center gap-6 md:gap-8 text-sm">
            <a 
              href="https://twitter.com/intent/tweet?text=Watching%20%40IamLakshveer%20build%20is%20inspiring.%20At%208%2C%20he's%20shipping%20real%20hardware%20%2B%20AI%20projects.%20Check%20his%20work%3A%20lakshveer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              Endorse
            </a>
            <span className="text-[var(--border-subtle)]">|</span>
            <a href="/invite" className="text-[var(--accent)] font-medium hover:opacity-80 transition-opacity">
              Invite
            </a>
            <span className="text-[var(--border-subtle)]">|</span>
            <a href="/collaborate" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Enable
            </a>
          </div>
        </div>
      </div>
      
      <main className="container-main py-16 md:py-24">
        {/* ========== HERO SECTION ========== */}
        <header className="mb-24 md:mb-32">
          <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-12 md:gap-16">
            {/* Left side - Text content */}
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight mb-4 leading-[1.1]">
                Lakshveer Rao <span className="text-2xl md:text-3xl lg:text-4xl text-[var(--text-secondary)] font-normal">(Age 8)</span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-2">
                Hardware + AI Systems Builder
              </p>
              <p className="text-lg text-[var(--text-muted)] mb-6">
                Co-Founder & Partner — Projects by Laksh
              </p>
              <p className="text-lg text-[var(--text-secondary)] mb-10">
                Builds to learn.
              </p>
              <nav className="flex flex-wrap gap-6 md:gap-8">
                <InternalLink href="/systems">Systems</InternalLink>
                <InternalLink href="/impact">Impact</InternalLink>
                <InternalLink href="/journey">Journey</InternalLink>
                <InternalLink href="/venture">Venture</InternalLink>
                <InternalLink href="/collaborate">Collaborate</InternalLink>
              </nav>
            </div>
            
            {/* Right side - Portrait */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <div 
                className="w-[280px] h-[360px] md:w-[300px] md:h-[400px] overflow-hidden"
                aria-label="Lakshveer Rao portrait"
              >
                <img 
                  src="./864df3d9-9c02-4f36-85e9-c65cb04a3843.jpg"
                  alt="Lakshveer Rao - Hardware + AI Systems Builder wearing Projects by Laksh polo shirt"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </header>

        {/* ========== MOMENTUM STRIP (ANIMATED COUNTERS) ========== */}
        <section className="mb-24 md:mb-32">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
            {stats.map((stat: { label: string; value: string; highlight?: boolean }) => {
              const parsed = parseStatValue(stat.value);
              const canAnimate = parsed.numeric > 0;
              
              return (
                <div key={stat.label} className="text-center md:text-left">
                  <div className={`font-mono text-3xl md:text-4xl mb-1 ${stat.highlight ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                    {canAnimate ? (
                      <AnimatedCounter
                        endValue={parsed.numeric}
                        prefix={parsed.prefix}
                        suffix={parsed.suffix}
                        format={parsed.format}
                        duration={2000}
                      />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className={`text-sm ${stat.highlight ? 'text-[var(--text-secondary)] font-medium' : 'text-[var(--text-muted)]'}`}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
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
                <span className="text-[var(--text-secondary)] select-none">•</span>
                <span className="text-[var(--text-secondary)]">{item}</span>
              </li>
            ))}
          </ul>
          <InternalLink href="/systems">View All Systems</InternalLink>
        </section>

        {/* ========== TECH STACK ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techStack.map((category) => (
              <div key={category.title}>
                <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span 
                      key={item}
                      className="px-3 py-1 text-sm text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
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
                className="group aspect-[3/2] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center p-4 hover:border-[var(--text-muted)] transition-[border-color] duration-200"
                aria-label={backer.name}
              >
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-200 text-center">
                  {backer.name} ↗
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ========== SUPPORT ECOSYSTEM ========== */}
        <section className="mb-24 md:mb-32">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Support Ecosystem
            </h2>
            <a
              href={ENDORSE_TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors rounded-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Endorse Laksh
            </a>
          </div>
          <p className="text-[var(--text-secondary)] mb-10 max-w-2xl">
            Founders, engineers, and builders who've shared their time, expertise, and encouragement.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mentors.map((mentor) => {
              const quote = supporterQuotes[mentor.handle];
              return (
                <a
                  key={mentor.handle}
                  href={mentor.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-[border-color] duration-200"
                >
                  <p className="font-medium text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors duration-150">
                    {mentor.name} ↗
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mb-2 font-mono">
                    {mentor.handle}
                  </p>
                  {quote ? (
                    <p className="text-sm text-[var(--text-secondary)] italic">
                      "{quote}"
                    </p>
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)]">
                      {mentor.guidance}
                    </p>
                  )}
                </a>
              );
            })}
          </div>
        </section>

        {/* ========== IMMERSIVE LEARNING ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Immersive Learning
          </h2>
          <p className="text-[var(--text-secondary)] mb-10 max-w-2xl">
            25+ company visits across 4 cities. Half-day to 3-day intensive sessions with founders, engineers, and R&D teams.
          </p>
          <div className="space-y-0">
            {companyVisits.map((visit) => (
              <div
                key={visit.name}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0 py-3 border-b border-[var(--border-subtle)]"
              >
                <span className="font-medium text-[var(--text-primary)] sm:w-40 shrink-0">
                  {visit.href ? (
                    <a 
                      href={visit.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      {visit.name} ↗
                    </a>
                  ) : (
                    visit.name
                  )}
                </span>
                <span className="hidden sm:inline text-[var(--text-muted)] mx-4">—</span>
                <span className="text-sm text-[var(--text-secondary)] flex-1">
                  {visit.type}
                </span>
                <span className="text-sm text-[var(--text-muted)]">
                  {visit.location}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--text-muted)]">
            + EV startups, robotics firms, manufacturing floors, and advanced prototyping facilities
          </p>
        </section>

        {/* ========== AS FEATURED IN ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            As Featured In
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {featuredIn.map((media) => (
              <a
                key={media.name}
                href={media.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group py-4 px-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center hover:border-[var(--text-muted)] transition-[border-color] duration-200"
                aria-label={media.name}
              >
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-200 text-center">
                  {media.name} ↗
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
                    <span className="font-mono text-sm text-[var(--text-secondary)] sm:w-20 shrink-0">
                      {entry.year}
                    </span>
                    <span className="hidden sm:inline text-[var(--text-secondary)] mx-4">—</span>
                  </>
                )}
                <span className={`font-mono text-sm text-[var(--text-secondary)] ${entry.year ? 'sm:flex-1' : 'flex-1'}`}>
                  {entry.event}
                </span>
                <span className="hidden sm:inline text-[var(--text-secondary)] mx-4">—</span>
                <span className="font-mono text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-150">
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
            Voices
          </h2>
          <div className="space-y-0">
            {featuredEndorsements.map((endorsement) => (
              <article 
                key={endorsement.slug}
                className="py-8 border-b border-[var(--border-subtle)] last:border-b-0"
              >
                {/* Quote - displayed as paragraph, no quotation marks */}
                <p className="text-lg text-[var(--text-primary)] leading-relaxed mb-6">
                  "{endorsement.quote}"
                </p>
                
                {/* Attribution */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[var(--text-primary)] font-semibold">
                      — {endorsement.name}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {endorsement.role}, {endorsement.organisation}
                    </p>
                  </div>
                  
                  {/* Proof link */}
                  {endorsement.proofUrl && (
                    <a 
                      href={endorsement.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--accent)] hover:opacity-80 transition-opacity duration-150"
                    >
                      Watch Video ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <InternalLink href="/recognition">View All Voices</InternalLink>
          </div>
        </section>

        {/* ========== COLLABORATE SECTION ========== */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Enable
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl">
            If you believe in what we're building and want to help us go further, we'd love to hear from you.
          </p>
          
          <p className="text-[var(--text-secondary)] mb-4">Currently seeking:</p>
          <ul className="space-y-2 mb-10">
            {seekingItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-[var(--text-muted)] select-none">-</span>
                <span className="text-[var(--text-secondary)]">{item}</span>
              </li>
            ))}
          </ul>
          
          <InternalLink href="/collaborate">Get in Touch</InternalLink>
        </section>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="container-main pb-16">
        <div className="border-t border-[var(--border-subtle)] pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left column - Lakshveer info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">R Lakshveer Rao</h3>
              <p className="text-[var(--text-secondary)] mb-1">Co-Founder — Projects by Laksh</p>
              <p className="text-[var(--text-secondary)] text-sm mb-6">Based in Hyderabad, India (UTC+5:30)</p>
              
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
              <p className="text-sm text-[var(--text-secondary)] mb-4">Primary Contact:</p>
              <h4 className="text-lg font-semibold mb-1">Capt. Venkat</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Co-Founder | First Investor | Operations & Systems</p>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Primary Point of Contact</p>
              
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
          
          {/* Share Portfolio Link */}
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] text-center">
            <a 
              href="/share" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors duration-150 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Portfolio (QR Code, PDF, Print) →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;
