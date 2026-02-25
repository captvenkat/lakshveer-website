import { useState, useEffect } from "react";
import { SEO, PAGE_TITLES } from "@/components/seo";

interface Submission {
  id: number;
  name: string;
  email: string;
  organisation: string | null;
  category: string;
  message: string;
  created_at: string;
  read: number;
}

interface Supporter {
  handle: string;
  name: string;
  token: string;
  quote: string | null;
  submitted_at: string | null;
  sent_at: string | null;
}

interface Stats {
  total: number;
  unread: number;
  thisWeek: number;
  thisMonth: number;
  byCategory: { category: string; count: number }[];
  recentActivity: { date: string; count: number }[];
}

const categoryLabels: Record<string, string> = {
  hardware: "Hardware",
  sponsorship: "Sponsorship",
  mentorship: "Mentorship",
  media: "Media",
  collaboration: "Collaboration",
  other: "Other",
};

type Tab = "overview" | "messages" | "endorsements";

const PASSWORD = "insidenagole";

function Insider() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem("insider_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([fetchStats(), fetchSubmissions(), fetchSupporters()]).then(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      sessionStorage.setItem("insider_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("insider_auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/contact/submissions");
      const data = await res.json();
      if (data.success) setSubmissions(data.submissions);
    } catch (e) {
      console.error("Failed to fetch submissions:", e);
    }
  };

  const fetchSupporters = async () => {
    try {
      const res = await fetch("/api/supporters/admin");
      const data = await res.json();
      if (data.success) setSupporters(data.supporters);
    } catch (e) {
      console.error("Failed to fetch supporters:", e);
    }
  };

  const markAsRead = async (id: number) => {
    await fetch(`/api/contact/submissions/${id}/read`, { method: "POST" });
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, read: 1 } : s)));
    if (stats) setStats({ ...stats, unread: Math.max(0, stats.unread - 1) });
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/submissions/${id}`, { method: "DELETE" });
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setSelected(null);
    fetchStats();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "Z");
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <SEO title="Login | Insider" />
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Insider</h1>
            <p className="text-sm text-[var(--text-secondary)]">Enter password to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-[var(--text-primary)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity"
            >
              Enter
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SEO title={PAGE_TITLES.insider} />

      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] sticky top-0 bg-[var(--bg)] z-20">
        <div className="px-4 py-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">Insider</h1>
              <p className="text-sm text-[var(--text-secondary)]">Your dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                Site
              </a>
              <button
                onClick={handleLogout}
                className="text-sm text-[var(--text-secondary)] hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {(["overview", "messages", "endorsements"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSelected(null);
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? "text-[var(--text-primary)] border-b-2 border-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {t === "overview" ? "Overview" : t === "messages" ? "Messages" : "Endorsements"}
                {t === "messages" && stats && stats.unread > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-[var(--accent)] text-[var(--bg)] rounded-full">
                    {stats.unread}
                  </span>
                )}
                {t === "endorsements" && supporters.filter(s => s.quote).length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-emerald-500 text-[var(--bg)] rounded-full">
                    {supporters.filter(s => s.quote).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        {tab === "overview" && stats && <Overview stats={stats} supporters={supporters} onViewMessages={() => setTab("messages")} onViewEndorsements={() => setTab("endorsements")} />}
        {tab === "messages" && (
          <Messages
            submissions={submissions}
            selected={selected}
            onSelect={(s) => {
              setSelected(s);
              if (s && !s.read) markAsRead(s.id);
            }}
            onDelete={deleteSubmission}
            formatDate={formatDate}
          />
        )}
        {tab === "endorsements" && <Endorsements supporters={supporters} />}
      </main>
    </div>
  );
}

// Overview Tab
function Overview({ stats, supporters, onViewMessages, onViewEndorsements }: { stats: Stats; supporters: Supporter[]; onViewMessages: () => void; onViewEndorsements: () => void }) {
  const endorsedCount = supporters.filter(s => s.quote).length;
  const pendingCount = supporters.length - endorsedCount;
  
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Messages" value={stats.total} />
        <StatCard label="Unread" value={stats.unread} highlight={stats.unread > 0} />
        <StatCard label="Endorsements" value={endorsedCount} highlight={endorsedCount > 0} />
        <StatCard label="Pending" value={pendingCount} />
      </div>

      {/* Category Breakdown */}
      {stats.byCategory.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4 uppercase tracking-wider">
            By Category
          </h2>
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)]">
            {stats.byCategory.map((item) => (
              <div key={item.category} className="flex items-center justify-between px-4 py-3">
                <span className="text-[var(--text-primary)]">
                  {categoryLabels[item.category] || item.category}
                </span>
                <span className="text-[var(--text-secondary)]">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4 uppercase tracking-wider">
            Last 7 Days
          </h2>
          <div className="flex items-end gap-2 h-24">
            {stats.recentActivity.map((day) => {
              const maxCount = Math.max(...stats.recentActivity.map((d) => d.count));
              const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-[var(--accent)] rounded-t"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(day.date).toLocaleDateString("en-IN", { day: "numeric" })}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={onViewMessages}
            className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-left hover:border-[var(--accent)] transition-colors"
          >
            <p className="text-[var(--text-primary)] font-medium">View Messages</p>
            <p className="text-sm text-[var(--text-secondary)]">Read and respond to inquiries</p>
          </button>
          <button
            onClick={onViewEndorsements}
            className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-left hover:border-[var(--accent)] transition-colors"
          >
            <p className="text-[var(--text-primary)] font-medium">View Endorsements</p>
            <p className="text-sm text-[var(--text-secondary)]">Manage supporter quotes</p>
          </button>
          <a
            href="/"
            target="_blank"
            className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-left hover:border-[var(--accent)] transition-colors"
          >
            <p className="text-[var(--text-primary)] font-medium">View Site</p>
            <p className="text-sm text-[var(--text-secondary)]">See your live website</p>
          </a>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
      <p className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
        {highlight && value > 0 ? (
          <span className="text-[var(--accent)]">{value}</span>
        ) : (
          value
        )}
      </p>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}

// Messages Tab
function Messages({
  submissions,
  selected,
  onSelect,
  onDelete,
  formatDate,
}: {
  submissions: Submission[];
  selected: Submission | null;
  onSelect: (s: Submission | null) => void;
  onDelete: (id: number) => void;
  formatDate: (d: string) => string;
}) {
  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-[var(--text-secondary)]">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="md:flex md:h-[calc(100vh-130px)]">
      {/* List */}
      <div
        className={`md:w-80 lg:w-96 md:border-r border-[var(--border-subtle)] md:overflow-y-auto ${
          selected ? "hidden md:block" : ""
        }`}
      >
        {submissions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`w-full text-left px-4 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors ${
              selected?.id === s.id ? "bg-[var(--bg-elevated)]" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              {!s.read && (
                <span className="w-2 h-2 mt-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              )}
              <div className={`flex-1 min-w-0 ${s.read ? "ml-5" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      s.read ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)] font-medium"
                    }`}
                  >
                    {s.name}
                  </p>
                  <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                    {formatDate(s.created_at).split(",")[0]}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {categoryLabels[s.category] || s.category}
                </p>
                <p className="text-sm text-[var(--text-secondary)] truncate mt-1">{s.message}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div
        className={`flex-1 md:overflow-y-auto ${
          !selected ? "hidden md:flex md:items-center md:justify-center" : ""
        }`}
      >
        {!selected ? (
          <p className="text-[var(--text-secondary)]">Select a message to read</p>
        ) : (
          <div className="h-full flex flex-col">
            {/* Mobile back */}
            <div className="md:hidden px-4 py-3 border-b border-[var(--border-subtle)]">
              <button onClick={() => onSelect(null)} className="text-sm text-[var(--accent)]">
                ← Back
              </button>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">{selected.name}</h2>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-[var(--accent)] text-sm hover:underline"
                >
                  {selected.email}
                </a>
                {selected.organisation && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{selected.organisation}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  {categoryLabels[selected.category] || selected.category}
                </span>
                <span className="text-xs text-[var(--text-muted)] py-1">{formatDate(selected.created_at)}</span>
              </div>

              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-4 md:p-6">
                <p className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your message on lakshveer.com`}
                  className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Reply
                </a>
                <button
                  onClick={() => onDelete(selected.id)}
                  className="px-4 py-2 border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-red-400 hover:border-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Endorsements Tab
function Endorsements({ supporters: initialSupporters }: { supporters: Supporter[] }) {
  const [supporters, setSupporters] = useState(initialSupporters);
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);
  const [expandedHandle, setExpandedHandle] = useState<string | null>(null);
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});
  
  // Update supporters when prop changes
  useEffect(() => {
    setSupporters(initialSupporters);
  }, [initialSupporters]);
  
  // Categorize supporters
  const endorsed = supporters.filter(s => s.quote);
  const sent = supporters.filter(s => !s.quote && s.sent_at);
  const notSent = supporters.filter(s => !s.quote && !s.sent_at);
  
  const getFirstName = (name: string) => {
    if (name.startsWith("Dr. ")) {
      const parts = name.split(" ");
      return parts.length > 2 ? `Dr. ${parts[parts.length - 1]}` : name;
    }
    if (name === "M S Mihir") return "Mihir";
    if (name === "Besta Prem Sai") return "Prem";
    return name.split(" ")[0];
  };
  
  const getDefaultMessage = (s: Supporter) => {
    const firstName = getFirstName(s.name);
    return `Hi ${firstName},

You've been part of Laksh's journey - whether through advice, encouragement, or just watching him ship.

I'm adding a space on his website for supporters to leave a line. Totally optional, but if something comes to mind:

https://lakshveer.com/endorse/${s.token}

Takes 30 seconds. Helps him land more building opportunities, hackathons, grants, and talks.

Thanks for supporting a young builder.
- Capt Venkat`;
  };
  
  const getMessage = (s: Supporter) => {
    return customMessages[s.handle] ?? getDefaultMessage(s);
  };
  
  const copyMessage = (s: Supporter) => {
    navigator.clipboard.writeText(getMessage(s));
    setCopiedHandle(s.handle);
    setTimeout(() => setCopiedHandle(null), 2000);
  };
  
  const markAsSent = async (handle: string) => {
    try {
      await fetch(`/api/supporters/${handle}/sent`, { method: 'POST' });
      setSupporters(prev => prev.map(s => 
        s.handle === handle ? { ...s, sent_at: new Date().toISOString() } : s
      ));
    } catch (e) {
      console.error('Failed to mark as sent:', e);
    }
  };
  
  const unmarkAsSent = async (handle: string) => {
    try {
      await fetch(`/api/supporters/${handle}/sent`, { method: 'DELETE' });
      setSupporters(prev => prev.map(s => 
        s.handle === handle ? { ...s, sent_at: null } : s
      ));
    } catch (e) {
      console.error('Failed to unmark as sent:', e);
    }
  };
  
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "Z");
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const SupporterCard = ({ s, showSentActions = false }: { s: Supporter; showSentActions?: boolean }) => (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
      {/* Header row */}
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[var(--bg)]/50 transition-colors"
        onClick={() => setExpandedHandle(expandedHandle === s.handle ? null : s.handle)}
      >
        <div className="flex items-center gap-3">
          <svg 
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${expandedHandle === s.handle ? 'rotate-90' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[var(--text-primary)]">{s.name}</p>
              {s.sent_at && (
                <span className="text-xs text-emerald-400">Sent {formatDate(s.sent_at)}</span>
              )}
            </div>
            <p className="text-sm text-[var(--text-muted)]">@{s.handle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!s.sent_at && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyMessage(s);
              }}
              className="px-3 py-1 text-sm bg-[var(--accent)]/10 text-[var(--accent)] rounded hover:bg-[var(--accent)]/20 transition-colors"
            >
              {copiedHandle === s.handle ? "Copied!" : "Copy"}
            </button>
          )}
          {!s.sent_at ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAsSent(s.handle);
              }}
              className="px-3 py-1 text-sm bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors"
            >
              Mark Sent
            </button>
          ) : showSentActions && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                unmarkAsSent(s.handle);
              }}
              className="px-3 py-1 text-sm text-[var(--text-muted)] hover:text-red-400 transition-colors"
            >
              Undo
            </button>
          )}
        </div>
      </div>
      
      {/* Expanded message */}
      {expandedHandle === s.handle && (
        <div className="px-4 pb-4 border-t border-[var(--border-subtle)]">
          <textarea
            value={getMessage(s)}
            onChange={(e) => setCustomMessages(prev => ({ ...prev, [s.handle]: e.target.value }))}
            className="w-full mt-3 p-3 bg-[var(--bg)] border border-[var(--border-subtle)] rounded text-sm text-[var(--text-primary)] font-mono leading-relaxed resize-none focus:outline-none focus:border-[var(--accent)]"
            rows={12}
          />
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setCustomMessages(prev => {
                const newMessages = { ...prev };
                delete newMessages[s.handle];
                return newMessages;
              })}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              Reset to default
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => copyMessage(s)}
                className="px-3 py-1.5 text-xs bg-[var(--accent)] text-[var(--bg)] rounded hover:opacity-90 transition-opacity"
              >
                {copiedHandle === s.handle ? "Copied!" : "Copy Message"}
              </button>
              {!s.sent_at && (
                <button
                  onClick={() => markAsSent(s.handle)}
                  className="px-3 py-1.5 text-xs bg-emerald-500 text-[var(--bg)] rounded hover:opacity-90 transition-opacity"
                >
                  Mark as Sent
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Summary */}
      <div className="mb-8 flex flex-wrap gap-4 text-sm">
        <span className="text-[var(--text-secondary)]">
          <span className="text-emerald-400 font-medium">{endorsed.length}</span> endorsed
        </span>
        <span className="text-[var(--border-subtle)]">•</span>
        <span className="text-[var(--text-secondary)]">
          <span className="text-[var(--accent)] font-medium">{sent.length}</span> sent, awaiting
        </span>
        <span className="text-[var(--border-subtle)]">•</span>
        <span className="text-[var(--text-secondary)]">
          <span className="text-[var(--text-primary)] font-medium">{notSent.length}</span> not sent
        </span>
      </div>

      {/* Endorsed */}
      {endorsed.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-medium text-emerald-400 mb-4 uppercase tracking-wider">
            Endorsed ({endorsed.length})
          </h2>
          <div className="space-y-3">
            {endorsed.map((s) => (
              <div key={s.handle} className="bg-[var(--bg-elevated)] border border-emerald-500/20 p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">{s.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">@{s.handle}</p>
                  </div>
                  <span className="text-xs text-emerald-400">{formatDate(s.submitted_at)}</span>
                </div>
                <p className="text-[var(--text-secondary)] italic">"{s.quote}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Not Sent Yet */}
      {notSent.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-medium text-[var(--text-primary)] mb-4 uppercase tracking-wider">
            Not Sent Yet ({notSent.length})
          </h2>
          <div className="space-y-3">
            {notSent.map((s) => (
              <SupporterCard key={s.handle} s={s} />
            ))}
          </div>
        </section>
      )}

      {/* Sent, Awaiting Response */}
      {sent.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-[var(--accent)] mb-4 uppercase tracking-wider">
            Sent, Awaiting Response ({sent.length})
          </h2>
          <div className="space-y-3">
            {sent.map((s) => (
              <SupporterCard key={s.handle} s={s} showSentActions />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Insider;
