import { Link } from "wouter";

interface SystemEntry {
  title: string;
  description: string;
  github?: string;
  demo?: string;
}

interface SystemCategory {
  name: string;
  systems: SystemEntry[];
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

// Systems Data organized by category
const systemCategories: SystemCategory[] = [
  {
    name: "Flagship Platforms",
    systems: [
      {
        title: "Hardvare",
        description: "Hardware execution platform for deployable systems",
        github: "#",
        demo: "#",
      },
      {
        title: "GrantBot",
        description: "Autonomous grant discovery and application agent",
        github: "#",
        demo: "#",
      },
      {
        title: "Motion-Control Gaming",
        description: "Gesture-based gaming interface",
        github: "#",
        demo: "#",
      },
    ],
  },
  {
    name: "Robotics",
    systems: [
      {
        title: "LineBot v3",
        description: "Advanced line-following robot with PID control",
        github: "#",
        demo: "#",
      },
      {
        title: "ObstacleBot Pro",
        description: "Multi-sensor obstacle avoidance system",
        github: "#",
        demo: "#",
      },
      {
        title: "ArmBot Mini",
        description: "3-DOF robotic arm with precision control",
        github: "#",
        demo: "#",
      },
      {
        title: "SwarmBot Alpha",
        description: "Coordinated multi-robot swarm prototype",
        github: "#",
        demo: "#",
      },
    ],
  },
  {
    name: "Vision & Edge AI",
    systems: [
      {
        title: "FaceDetect Edge",
        description: "Real-time face detection on Raspberry Pi",
        github: "#",
        demo: "#",
      },
      {
        title: "ObjectTracker v2",
        description: "Computer vision object tracking system",
        github: "#",
        demo: "#",
      },
      {
        title: "GestureAI",
        description: "Hand gesture recognition for HCI",
        github: "#",
        demo: "#",
      },
      {
        title: "EdgeClassifier",
        description: "On-device image classification",
        github: "#",
        demo: "#",
      },
    ],
  },
  {
    name: "Experimental Devices",
    systems: [
      {
        title: "SensorHub",
        description: "Multi-sensor data aggregation platform",
        github: "#",
        demo: "#",
      },
      {
        title: "IoT Gateway",
        description: "Edge computing gateway for sensor networks",
        github: "#",
        demo: "#",
      },
      {
        title: "PowerMonitor",
        description: "Real-time power consumption tracker",
        github: "#",
        demo: "#",
      },
    ],
  },
];

function Systems() {
  return (
    <div className="min-h-screen">
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

        {/* Systems Categories */}
        <div className="space-y-16 md:space-y-20">
          {systemCategories.map((category) => (
            <section key={category.name}>
              <h2 className="text-xl md:text-2xl font-semibold mb-8 text-[var(--text-primary)] pb-3 border-b border-[var(--border-subtle)]">
                {category.name}
              </h2>
              <div className="space-y-0">
                {category.systems.map((system) => (
                  <article 
                    key={system.title}
                    className="py-5 border-b border-[var(--border-subtle)] group"
                  >
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 md:gap-8">
                      {/* Title and description */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                          {system.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm md:text-base">
                          {system.description}
                        </p>
                      </div>
                      
                      {/* Links */}
                      <div className="flex items-center gap-6 shrink-0">
                        {system.github && (
                          <ExternalLink href={system.github}>GitHub</ExternalLink>
                        )}
                        {system.demo && (
                          <ExternalLink href={system.demo}>Demo</ExternalLink>
                        )}
                      </div>
                    </div>
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
