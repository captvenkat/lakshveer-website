import { useState } from "react";
import { SEO, PAGE_TITLES } from "@/components/seo";

// ============================================
// TYPES
// ============================================

interface System {
  id: string;
  title: string;
  description: string;
  category: "flagship" | "robotics" | "vision" | "experimental";
  link: string;
  featured: boolean;
}

interface ImpactEntry {
  id: string;
  title: string;
  type: "grant" | "award" | "panel" | "workshop" | "product" | "media";
  organisation: string;
  description: string;
  link: string;
  featured: boolean;
}

interface Supporter {
  id: string;
  name: string;
  logoUrl: string;
  link: string;
  featured: boolean;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  organisation: string;
  category: string;
  message: string;
  date: string;
  handled: boolean;
}

type TabId = "systems" | "impact" | "supporters" | "inquiries";

// ============================================
// MOCK DATA (Replace with Supabase queries)
// ============================================

const initialSystems: System[] = [
  { id: "1", title: "Hardvare", description: "Hardware execution platform for deployable systems", category: "flagship", link: "#", featured: true },
  { id: "2", title: "GrantBot", description: "Autonomous grant discovery and application agent", category: "flagship", link: "#", featured: true },
  { id: "3", title: "LineBot v3", description: "Advanced line-following robot with PID control", category: "robotics", link: "#", featured: false },
  { id: "4", title: "FaceDetect Edge", description: "Real-time face detection on Raspberry Pi", category: "vision", link: "#", featured: false },
];

const initialImpact: ImpactEntry[] = [
  { id: "1", title: "₹1,00,000 Grant", type: "grant", organisation: "Malpani Ventures", description: "Selected for hardware innovation track", link: "#", featured: true },
  { id: "2", title: "First Place", type: "award", organisation: "KBC Young Innovators", description: "National robotics competition winner", link: "#", featured: true },
  { id: "3", title: "Panel Speaker", type: "panel", organisation: "EdTech Summit", description: "Youth in hardware innovation panel", link: "#", featured: false },
];

const initialSupporters: Supporter[] = [
  { id: "1", name: "Malpani Ventures", logoUrl: "", link: "#", featured: true },
  { id: "2", name: "Tech Foundation", logoUrl: "", link: "#", featured: true },
];

const initialInquiries: Inquiry[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul@techcorp.com", organisation: "TechCorp", category: "Hardware Sponsorship", message: "We are interested in sponsoring your hardware projects. Our company manufactures IoT components and we'd like to discuss a potential partnership.", date: "2024-01-15", handled: false },
  { id: "2", name: "Priya Patel", email: "priya@makerlabs.in", organisation: "MakerLabs India", category: "Research Collaboration", message: "Would love to collaborate on robotics research. We have a dedicated lab space and could provide testing environments for your prototypes.", date: "2024-01-12", handled: true },
];

// ============================================
// CATEGORY MAPPINGS
// ============================================

const categoryLabels: Record<System["category"], string> = {
  flagship: "Flagship Platforms",
  robotics: "Robotics",
  vision: "Vision & Edge AI",
  experimental: "Experimental Devices",
};

const impactTypeLabels: Record<ImpactEntry["type"], string> = {
  grant: "Grant",
  award: "Award",
  panel: "Panel",
  workshop: "Workshop",
  product: "Product",
  media: "Media",
};

// ============================================
// LINK COMPONENTS
// ============================================

interface LinkProps {
  href: string;
  children: React.ReactNode;
}

const InternalLink = ({ href, children }: LinkProps) => (
  <a href={href} className="link-internal">
    {children}
  </a>
);

// ============================================
// MAIN COMPONENT
// ============================================

function Admin() {
  // Authentication state
  // TODO: Replace with Supabase Auth
  // Example:
  // const { user, signIn, signOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab state
  const [activeTab, setActiveTab] = useState<TabId>("systems");

  // Data state (replace with Supabase queries)
  const [systems, setSystems] = useState<System[]>(initialSystems);
  const [impact, setImpact] = useState<ImpactEntry[]>(initialImpact);
  const [supporters, setSupporters] = useState<Supporter[]>(initialSupporters);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);

  // Modal/form state
  const [editingSystem, setEditingSystem] = useState<System | null>(null);
  const [editingImpact, setEditingImpact] = useState<ImpactEntry | null>(null);
  const [editingSupporter, setEditingSupporter] = useState<Supporter | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [isAddingSystem, setIsAddingSystem] = useState(false);
  const [isAddingImpact, setIsAddingImpact] = useState(false);
  const [isAddingSupporter, setIsAddingSupporter] = useState(false);

  // Input base classes
  const inputClasses =
    "w-full px-4 py-3 bg-[var(--bg)] border border-[#27272a] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#06b6d4] transition-[border-color] duration-150";

  // ============================================
  // AUTH HANDLERS
  // ============================================

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // TODO: Replace with Supabase Auth
    // Example:
    // const { error } = await supabase.auth.signInWithPassword({
    //   email: loginEmail,
    //   password: loginPassword,
    // });
    // if (error) setLoginError(error.message);

    // Demo mode - accept any non-empty credentials
    if (loginEmail && loginPassword) {
      setIsAuthenticated(true);
    } else {
      setLoginError("Please enter email and password");
    }
  };

  const handleLogout = () => {
    // TODO: Replace with Supabase Auth
    // await supabase.auth.signOut();
    setIsAuthenticated(false);
    setLoginEmail("");
    setLoginPassword("");
  };

  // ============================================
  // SYSTEM CRUD HANDLERS
  // ============================================

  const handleSaveSystem = (system: System) => {
    // TODO: Replace with Supabase CRUD
    // const { error } = await supabase.from('systems').upsert(system);
    
    if (editingSystem) {
      setSystems(prev => prev.map(s => s.id === system.id ? system : s));
      setEditingSystem(null);
    } else {
      setSystems(prev => [...prev, { ...system, id: Date.now().toString() }]);
      setIsAddingSystem(false);
    }
  };

  const handleDeleteSystem = (id: string) => {
    // TODO: Replace with Supabase CRUD
    // const { error } = await supabase.from('systems').delete().eq('id', id);
    
    if (confirm("Are you sure you want to delete this system?")) {
      setSystems(prev => prev.filter(s => s.id !== id));
    }
  };

  // ============================================
  // IMPACT CRUD HANDLERS
  // ============================================

  const handleSaveImpact = (entry: ImpactEntry) => {
    // TODO: Replace with Supabase CRUD
    // const { error } = await supabase.from('impact').upsert(entry);
    
    if (editingImpact) {
      setImpact(prev => prev.map(i => i.id === entry.id ? entry : i));
      setEditingImpact(null);
    } else {
      setImpact(prev => [...prev, { ...entry, id: Date.now().toString() }]);
      setIsAddingImpact(false);
    }
  };

  const handleDeleteImpact = (id: string) => {
    // TODO: Replace with Supabase CRUD
    // const { error } = await supabase.from('impact').delete().eq('id', id);
    
    if (confirm("Are you sure you want to delete this impact entry?")) {
      setImpact(prev => prev.filter(i => i.id !== id));
    }
  };

  // ============================================
  // SUPPORTER CRUD HANDLERS
  // ============================================

  const handleSaveSupporter = (supporter: Supporter) => {
    // TODO: Replace with Supabase CRUD
    // const { error } = await supabase.from('supporters').upsert(supporter);
    
    if (editingSupporter) {
      setSupporters(prev => prev.map(s => s.id === supporter.id ? supporter : s));
      setEditingSupporter(null);
    } else {
      setSupporters(prev => [...prev, { ...supporter, id: Date.now().toString() }]);
      setIsAddingSupporter(false);
    }
  };

  const handleDeleteSupporter = (id: string) => {
    // TODO: Replace with Supabase CRUD
    // const { error } = await supabase.from('supporters').delete().eq('id', id);
    
    if (confirm("Are you sure you want to delete this supporter?")) {
      setSupporters(prev => prev.filter(s => s.id !== id));
    }
  };

  // ============================================
  // INQUIRY HANDLERS
  // ============================================

  const handleToggleInquiryHandled = (id: string) => {
    // TODO: Replace with Supabase CRUD
    // const { error } = await supabase.from('inquiries').update({ handled: !current }).eq('id', id);
    
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, handled: !i.handled } : i));
  };

  const handleDeleteInquiry = (id: string) => {
    // TODO: Replace with Supabase CRUD
    // const { error } = await supabase.from('inquiries').delete().eq('id', id);
    
    if (confirm("Are you sure you want to delete this inquiry?")) {
      setInquiries(prev => prev.filter(i => i.id !== id));
      if (viewingInquiry?.id === id) setViewingInquiry(null);
    }
  };

  // ============================================
  // RENDER: LOGIN FORM
  // ============================================

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <SEO title={PAGE_TITLES.admin} />
        <main className="container-main py-16 md:py-24">
          <div className="max-w-md mx-auto">
            <header className="mb-12 text-center">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                Admin Login
              </h1>
              <p className="text-[var(--text-secondary)]">
                Sign in to manage content
              </p>
            </header>

            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                  {loginError}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={inputClasses}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={inputClasses}
                  placeholder="Your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[var(--text-primary)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity duration-150"
              >
                Sign In →
              </button>

              <p className="text-xs text-[var(--text-muted)] text-center mt-4">
                Demo mode: Enter any email and password to access the dashboard
              </p>
            </form>

            <div className="mt-12 text-center">
              <InternalLink href="/">Back to Home</InternalLink>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // RENDER: DASHBOARD
  // ============================================

  return (
    <div className="min-h-screen">
      <SEO title={PAGE_TITLES.admin} />
      <main className="container-main py-8 md:py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Manage systems, impact entries, supporters, and inquiries
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start px-4 py-2 text-sm border border-[#27272a] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors duration-150"
          >
            Sign Out
          </button>
        </header>

        {/* Tab Navigation */}
        <nav className="flex flex-wrap gap-2 mb-8 border-b border-[var(--border-subtle)] pb-4">
          {[
            { id: "systems" as TabId, label: "Manage Systems" },
            { id: "impact" as TabId, label: "Manage Impact" },
            { id: "supporters" as TabId, label: "Manage Supporters" },
            { id: "inquiries" as TabId, label: "Collaboration Inquiries" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                activeTab === tab.id
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[#27272a]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ========== SYSTEMS TAB ========== */}
        {activeTab === "systems" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Systems</h2>
              <button
                onClick={() => setIsAddingSystem(true)}
                className="px-4 py-2 text-sm bg-[var(--text-primary)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity duration-150"
              >
                Add New System
              </button>
            </div>

            {/* Add/Edit System Form */}
            {(isAddingSystem || editingSystem) && (
              <SystemForm
                system={editingSystem}
                onSave={handleSaveSystem}
                onCancel={() => {
                  setIsAddingSystem(false);
                  setEditingSystem(null);
                }}
                inputClasses={inputClasses}
              />
            )}

            {/* Systems Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium">Title</th>
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium hidden sm:table-cell">Category</th>
                    <th className="text-center py-3 pr-4 text-[var(--text-muted)] font-medium">Featured</th>
                    <th className="text-right py-3 text-[var(--text-muted)] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {systems.map((system) => (
                    <tr key={system.id} className="border-b border-[var(--border-subtle)]">
                      <td className="py-4 pr-4">
                        <span className="text-[var(--text-primary)]">{system.title}</span>
                        <span className="block text-xs text-[var(--text-muted)] sm:hidden mt-1">
                          {categoryLabels[system.category]}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-[var(--text-secondary)] hidden sm:table-cell">
                        {categoryLabels[system.category]}
                      </td>
                      <td className="py-4 pr-4 text-center">
                        <span className={system.featured ? "text-[#06b6d4]" : "text-[var(--text-muted)]"}>
                          {system.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingSystem(system)}
                            className="px-3 py-1 text-xs border border-[#27272a] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors duration-150"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSystem(system.id)}
                            className="px-3 py-1 text-xs border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors duration-150"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========== IMPACT TAB ========== */}
        {activeTab === "impact" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Impact Entries</h2>
              <button
                onClick={() => setIsAddingImpact(true)}
                className="px-4 py-2 text-sm bg-[var(--text-primary)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity duration-150"
              >
                Add New Impact
              </button>
            </div>

            {/* Add/Edit Impact Form */}
            {(isAddingImpact || editingImpact) && (
              <ImpactForm
                entry={editingImpact}
                onSave={handleSaveImpact}
                onCancel={() => {
                  setIsAddingImpact(false);
                  setEditingImpact(null);
                }}
                inputClasses={inputClasses}
              />
            )}

            {/* Impact Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium">Title</th>
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium hidden sm:table-cell">Type</th>
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium hidden md:table-cell">Organisation</th>
                    <th className="text-center py-3 pr-4 text-[var(--text-muted)] font-medium">Featured</th>
                    <th className="text-right py-3 text-[var(--text-muted)] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {impact.map((entry) => (
                    <tr key={entry.id} className="border-b border-[var(--border-subtle)]">
                      <td className="py-4 pr-4">
                        <span className="text-[var(--text-primary)]">{entry.title}</span>
                        <span className="block text-xs text-[var(--text-muted)] sm:hidden mt-1">
                          {impactTypeLabels[entry.type]} - {entry.organisation}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-[var(--text-secondary)] hidden sm:table-cell">
                        {impactTypeLabels[entry.type]}
                      </td>
                      <td className="py-4 pr-4 text-[var(--text-secondary)] hidden md:table-cell">
                        {entry.organisation}
                      </td>
                      <td className="py-4 pr-4 text-center">
                        <span className={entry.featured ? "text-[#06b6d4]" : "text-[var(--text-muted)]"}>
                          {entry.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingImpact(entry)}
                            className="px-3 py-1 text-xs border border-[#27272a] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors duration-150"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteImpact(entry.id)}
                            className="px-3 py-1 text-xs border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors duration-150"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========== SUPPORTERS TAB ========== */}
        {activeTab === "supporters" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Supporters</h2>
              <button
                onClick={() => setIsAddingSupporter(true)}
                className="px-4 py-2 text-sm bg-[var(--text-primary)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity duration-150"
              >
                Add New Supporter
              </button>
            </div>

            {/* Add/Edit Supporter Form */}
            {(isAddingSupporter || editingSupporter) && (
              <SupporterForm
                supporter={editingSupporter}
                onSave={handleSaveSupporter}
                onCancel={() => {
                  setIsAddingSupporter(false);
                  setEditingSupporter(null);
                }}
                inputClasses={inputClasses}
              />
            )}

            {/* Supporters Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium">Name</th>
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium hidden sm:table-cell">Logo URL</th>
                    <th className="text-center py-3 pr-4 text-[var(--text-muted)] font-medium">Featured</th>
                    <th className="text-right py-3 text-[var(--text-muted)] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supporters.map((supporter) => (
                    <tr key={supporter.id} className="border-b border-[var(--border-subtle)]">
                      <td className="py-4 pr-4">
                        <span className="text-[var(--text-primary)]">{supporter.name}</span>
                      </td>
                      <td className="py-4 pr-4 text-[var(--text-secondary)] hidden sm:table-cell">
                        <span className="truncate max-w-[200px] block">
                          {supporter.logoUrl || "(none)"}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-center">
                        <span className={supporter.featured ? "text-[#06b6d4]" : "text-[var(--text-muted)]"}>
                          {supporter.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingSupporter(supporter)}
                            className="px-3 py-1 text-xs border border-[#27272a] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors duration-150"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSupporter(supporter.id)}
                            className="px-3 py-1 text-xs border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors duration-150"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========== INQUIRIES TAB ========== */}
        {activeTab === "inquiries" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Collaboration Inquiries</h2>
              <span className="text-sm text-[var(--text-muted)]">
                {inquiries.filter(i => !i.handled).length} pending
              </span>
            </div>

            {/* Inquiry Detail Modal */}
            {viewingInquiry && (
              <div className="mb-8 p-6 bg-[var(--bg-elevated)] border border-[#27272a]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {viewingInquiry.name}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {viewingInquiry.email} - {viewingInquiry.organisation}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewingInquiry(null)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150"
                  >
                    Close
                  </button>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 text-xs bg-[var(--bg)] border border-[#27272a] text-[var(--text-secondary)] mb-3">
                    {viewingInquiry.category}
                  </span>
                  <p className="font-mono text-xs text-[var(--text-muted)] mb-2">
                    {viewingInquiry.date}
                  </p>
                </div>
                <div className="p-4 bg-[var(--bg)] border border-[var(--border-subtle)]">
                  <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                    {viewingInquiry.message}
                  </p>
                </div>
              </div>
            )}

            {/* Inquiries Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium">Name</th>
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium hidden sm:table-cell">Email</th>
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium hidden md:table-cell">Organisation</th>
                    <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium hidden lg:table-cell">Category</th>
                    <th className="text-center py-3 pr-4 text-[var(--text-muted)] font-medium">Date</th>
                    <th className="text-right py-3 text-[var(--text-muted)] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className={`border-b border-[var(--border-subtle)] ${
                        inquiry.handled ? "opacity-60" : ""
                      }`}
                    >
                      <td className="py-4 pr-4">
                        <span className="text-[var(--text-primary)]">{inquiry.name}</span>
                        <span className="block text-xs text-[var(--text-muted)] sm:hidden mt-1">
                          {inquiry.email}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-[var(--text-secondary)] hidden sm:table-cell">
                        {inquiry.email}
                      </td>
                      <td className="py-4 pr-4 text-[var(--text-secondary)] hidden md:table-cell">
                        {inquiry.organisation}
                      </td>
                      <td className="py-4 pr-4 text-[var(--text-secondary)] hidden lg:table-cell">
                        {inquiry.category}
                      </td>
                      <td className="py-4 pr-4 text-center font-mono text-xs text-[var(--text-muted)]">
                        {inquiry.date}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => setViewingInquiry(inquiry)}
                            className="px-3 py-1 text-xs border border-[#27272a] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors duration-150"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleToggleInquiryHandled(inquiry.id)}
                            className={`px-3 py-1 text-xs border transition-colors duration-150 ${
                              inquiry.handled
                                ? "border-[#06b6d4]/30 text-[#06b6d4] hover:border-[#06b6d4]/60"
                                : "border-[#27272a] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                          >
                            {inquiry.handled ? "Handled" : "Mark Done"}
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(inquiry.id)}
                            className="px-3 py-1 text-xs border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors duration-150"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
          <InternalLink href="/">Back to Home</InternalLink>
        </div>
      </main>
    </div>
  );
}

// ============================================
// FORM COMPONENTS
// ============================================

interface SystemFormProps {
  system: System | null;
  onSave: (system: System) => void;
  onCancel: () => void;
  inputClasses: string;
}

function SystemForm({ system, onSave, onCancel, inputClasses }: SystemFormProps) {
  const [form, setForm] = useState<System>(
    system || {
      id: "",
      title: "",
      description: "",
      category: "robotics",
      link: "",
      featured: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-[var(--bg-elevated)] border border-[#27272a]">
      <h3 className="text-lg font-semibold mb-6">
        {system ? "Edit System" : "Add New System"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClasses}
            placeholder="System title"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as System["category"] })}
            className={`${inputClasses} appearance-none cursor-pointer`}
          >
            <option value="flagship">Flagship Platforms</option>
            <option value="robotics">Robotics</option>
            <option value="vision">Vision & Edge AI</option>
            <option value="experimental">Experimental Devices</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClasses}
          placeholder="One-line description"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Link</label>
        <input
          type="url"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className={inputClasses}
          placeholder="https://..."
        />
      </div>
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="w-4 h-4 accent-[#06b6d4]"
          />
          <span className="text-sm text-[var(--text-secondary)]">Is Featured</span>
        </label>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-[var(--text-primary)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity duration-150"
        >
          {system ? "Save Changes" : "Add System"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-[#27272a] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors duration-150"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface ImpactFormProps {
  entry: ImpactEntry | null;
  onSave: (entry: ImpactEntry) => void;
  onCancel: () => void;
  inputClasses: string;
}

function ImpactForm({ entry, onSave, onCancel, inputClasses }: ImpactFormProps) {
  const [form, setForm] = useState<ImpactEntry>(
    entry || {
      id: "",
      title: "",
      type: "grant",
      organisation: "",
      description: "",
      link: "",
      featured: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-[var(--bg-elevated)] border border-[#27272a]">
      <h3 className="text-lg font-semibold mb-6">
        {entry ? "Edit Impact Entry" : "Add New Impact Entry"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClasses}
            placeholder="e.g. ₹1,00,000 Grant"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ImpactEntry["type"] })}
            className={`${inputClasses} appearance-none cursor-pointer`}
          >
            <option value="grant">Grant</option>
            <option value="award">Award</option>
            <option value="panel">Panel</option>
            <option value="workshop">Workshop</option>
            <option value="product">Product</option>
            <option value="media">Media</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Organisation</label>
        <input
          type="text"
          value={form.organisation}
          onChange={(e) => setForm({ ...form, organisation: e.target.value })}
          className={inputClasses}
          placeholder="Organisation name"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClasses}
          placeholder="Short context description"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Link</label>
        <input
          type="url"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className={inputClasses}
          placeholder="https://..."
        />
      </div>
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="w-4 h-4 accent-[#06b6d4]"
          />
          <span className="text-sm text-[var(--text-secondary)]">Is Featured</span>
        </label>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-[var(--text-primary)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity duration-150"
        >
          {entry ? "Save Changes" : "Add Impact Entry"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-[#27272a] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors duration-150"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface SupporterFormProps {
  supporter: Supporter | null;
  onSave: (supporter: Supporter) => void;
  onCancel: () => void;
  inputClasses: string;
}

function SupporterForm({ supporter, onSave, onCancel, inputClasses }: SupporterFormProps) {
  const [form, setForm] = useState<Supporter>(
    supporter || {
      id: "",
      name: "",
      logoUrl: "",
      link: "",
      featured: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-[var(--bg-elevated)] border border-[#27272a]">
      <h3 className="text-lg font-semibold mb-6">
        {supporter ? "Edit Supporter" : "Add New Supporter"}
      </h3>
      <div className="mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClasses}
          placeholder="Supporter name"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Logo URL</label>
        <input
          type="url"
          value={form.logoUrl}
          onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
          className={inputClasses}
          placeholder="https://..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Link</label>
        <input
          type="url"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className={inputClasses}
          placeholder="https://..."
        />
      </div>
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="w-4 h-4 accent-[#06b6d4]"
          />
          <span className="text-sm text-[var(--text-secondary)]">Is Featured</span>
        </label>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-[var(--text-primary)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity duration-150"
        >
          {supporter ? "Save Changes" : "Add Supporter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-[#27272a] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors duration-150"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default Admin;
