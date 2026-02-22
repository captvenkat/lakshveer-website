import { Hono } from 'hono';
import { cors } from "hono/cors"

interface ContactFormData {
  name: string;
  email: string;
  organisation?: string;
  category: string;
  message: string;
}

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>().basePath('api');

app.use(cors({ origin: "*" }));

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

// Portfolio data - single source of truth for PDF generation
const portfolioData = {
  name: "R Lakshveer Rao",
  age: 8,
  tagline: "Builds to Learn",
  title: "Hardware + AI Systems Builder",
  role: "Co-Founder — Projects by Laksh",
  location: "Hyderabad, India",
  website: "https://lakshveer.com",
  
  stats: [
    { label: "Ebook Sales", value: "100+" },
    { label: "Projects Documented", value: "170+" },
    { label: "Products Shipped", value: "3" },
    { label: "Workshops Conducted", value: "5+" },
    { label: "Grants & Scholarships", value: "₹1.4L+" },
    { label: "Trademark Owned", value: "1" },
  ],
  
  achievements: [
    "Youngest Innovator & Special Mention — Param × Vedanta Makeathon 2026",
    "₹1,00,000 Grant — Malpani Ventures 2026",
    "Gemini 3 Hackathon — Cerebral Valley × Google DeepMind 2026",
    "Top-5 Finalist (Youngest) — Hardware Hackathon 2.0",
    "Youngest Founder — Delta-2 Cohort, The Residency",
  ],
  
  products: [
    { name: "CircuitHeroes.com", desc: "Circuit-building trading card game. 300+ decks sold. Trademark registered." },
    { name: "ChhotaCreator.com", desc: "Peer-learning platform for hands-on learning." },
    { name: "Hardvare", desc: "Hardware execution platform enforcing safe electrical and logical states." },
    { name: "MotionX", desc: "Full-body motion-control gaming system." },
  ],
  
  backers: ["Malpani Ventures", "Lion Circuits", "Param Foundation", "AI Grants India"],
  
  media: ["Beats in Brief", "Runtime", "Lion Circuits", "ThinkTac", "Maverick News"],
  
  contact: {
    primary: "Capt. Venkat (Father & Co-Founder)",
    twitter: "@LakshveerRao",
    linkedin: "linkedin.com/in/lakshveerrao",
  },
};

// Generate PDF portfolio
app.get('/portfolio.pdf', async (c) => {
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  
  // Generate HTML that will be converted to PDF-like format
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Portfolio - ${portfolioData.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #09090b; 
      color: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 32px; 
      padding-bottom: 24px; 
      border-bottom: 1px solid #27272a;
    }
    .accent-bar { width: 4px; height: 32px; background: #22d3ee; margin-bottom: 12px; }
    .name { font-size: 36px; font-weight: bold; }
    .age { color: #71717a; font-size: 18px; }
    .tagline { font-size: 24px; margin-top: 8px; }
    .title { color: #a1a1aa; margin-top: 4px; }
    .role { color: #71717a; margin-top: 12px; }
    .location { color: #22d3ee; }
    .qr-section { text-align: right; }
    .qr-placeholder { 
      width: 100px; height: 100px; 
      background: #27272a; 
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #71717a;
    }
    .qr-url { font-size: 12px; color: #71717a; margin-top: 8px; }
    
    .section { margin-bottom: 24px; }
    .section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #fff; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .stat-box { 
      background: #18181b; 
      padding: 16px; 
      border-radius: 8px;
      text-align: center;
    }
    .stat-value { font-size: 24px; font-weight: bold; }
    .stat-label { font-size: 12px; color: #a1a1aa; margin-top: 4px; }
    
    .achievement-list { list-style: none; }
    .achievement-item { 
      padding: 8px 0; 
      padding-left: 16px;
      position: relative;
      color: #d4d4d8;
      font-size: 14px;
    }
    .achievement-item::before {
      content: "•";
      color: #22d3ee;
      position: absolute;
      left: 0;
    }
    
    .products-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .product-box { 
      background: #18181b; 
      padding: 16px; 
      border-radius: 8px;
    }
    .product-name { font-weight: 600; margin-bottom: 4px; }
    .product-desc { font-size: 12px; color: #a1a1aa; }
    
    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { 
      background: #27272a; 
      padding: 6px 12px; 
      border-radius: 999px;
      font-size: 12px;
      color: #d4d4d8;
    }
    
    .two-col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    
    .footer { 
      margin-top: 32px; 
      padding-top: 24px; 
      border-top: 1px solid #27272a;
      font-size: 14px;
    }
    .footer p { margin-bottom: 4px; color: #a1a1aa; }
    .footer strong { color: #fff; }
    .footer .accent { color: #22d3ee; }
    .footer .meta { font-size: 12px; color: #52525b; margin-top: 16px; }
    
    @media print {
      body { background: #fff; color: #000; padding: 20px; }
      .accent-bar { background: #0891b2; }
      .stat-box, .product-box { background: #f4f4f5; border: 1px solid #e4e4e7; }
      .tag { background: #f4f4f5; border: 1px solid #e4e4e7; color: #3f3f46; }
      .achievement-item::before { color: #0891b2; }
      .achievement-item, .product-desc, .stat-label, .footer p { color: #52525b; }
      .location, .footer .accent { color: #0891b2; }
      .qr-placeholder { background: #f4f4f5; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="accent-bar"></div>
      <h1 class="name">${portfolioData.name}</h1>
      <p class="age">(Age ${portfolioData.age})</p>
      <p class="tagline">${portfolioData.tagline}</p>
      <p class="title">${portfolioData.title}</p>
      <p class="role">${portfolioData.role}</p>
      <p class="location">${portfolioData.location}</p>
    </div>
    <div class="qr-section">
      <img src="https://lakshveer.com/qr-code.png" alt="QR Code" width="100" height="100" style="border-radius: 8px;" />
      <p class="qr-url">lakshveer.com</p>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Momentum</h2>
    <div class="stats-grid">
      ${portfolioData.stats.map(s => `
        <div class="stat-box">
          <div class="stat-value">${s.value}</div>
          <div class="stat-label">${s.label}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Key Achievements</h2>
    <ul class="achievement-list">
      ${portfolioData.achievements.map(a => `<li class="achievement-item">${a}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h2 class="section-title">Products & Platforms</h2>
    <div class="products-grid">
      ${portfolioData.products.map(p => `
        <div class="product-box">
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section two-col">
    <div>
      <h2 class="section-title">Backed By</h2>
      <div class="tags">
        ${portfolioData.backers.map(b => `<span class="tag">${b}</span>`).join('')}
      </div>
    </div>
    <div>
      <h2 class="section-title">Featured In</h2>
      <div class="tags">
        ${portfolioData.media.map(m => `<span class="tag">${m}</span>`).join('')}
      </div>
    </div>
  </div>

  <div class="footer">
    <p><strong>Primary Contact:</strong> ${portfolioData.contact.primary}</p>
    <p><strong>Twitter:</strong> <span class="accent">${portfolioData.contact.twitter}</span> | <strong>LinkedIn:</strong> <span class="accent">${portfolioData.contact.linkedin}</span></p>
    <p class="meta">Verified portfolio: lakshveer.com • Generated ${date}</p>
  </div>
</body>
</html>
  `;

  return c.html(html);
});

// Portfolio data JSON endpoint (for programmatic access)
app.get('/portfolio.json', (c) => {
  return c.json({
    ...portfolioData,
    generated: new Date().toISOString(),
    verifyAt: "https://lakshveer.com",
  });
});

// Contact form submission
app.post('/contact', async (c) => {
  try {
    const body = await c.req.json<ContactFormData>();
    
    if (!body.name || !body.email || !body.category || !body.message) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    const result = await c.env.DB.prepare(
      `INSERT INTO contact_submissions (name, email, organisation, category, message) VALUES (?, ?, ?, ?, ?)`
    )
      .bind(body.name, body.email, body.organisation || null, body.category, body.message)
      .run();

    return c.json({ success: true, id: result.meta.last_row_id });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ success: false, error: 'Failed to save message' }, 500);
  }
});

// Get all submissions
app.get('/contact/submissions', async (c) => {
  try {
    const results = await c.env.DB.prepare(
      `SELECT * FROM contact_submissions ORDER BY created_at DESC`
    ).all();
    
    return c.json({ success: true, submissions: results.results });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return c.json({ success: false, error: 'Failed to fetch submissions' }, 500);
  }
});

// Mark as read
app.post('/contact/submissions/:id/read', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare(
      `UPDATE contact_submissions SET read = 1 WHERE id = ?`
    ).bind(id).run();
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update' }, 500);
  }
});

// Delete submission
app.delete('/contact/submissions/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare(
      `DELETE FROM contact_submissions WHERE id = ?`
    ).bind(id).run();
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete' }, 500);
  }
});

// Dashboard stats
app.get('/stats', async (c) => {
  try {
    // Total messages
    const totalMessages = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM contact_submissions`
    ).first<{ count: number }>();

    // Unread messages
    const unreadMessages = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM contact_submissions WHERE read = 0`
    ).first<{ count: number }>();

    // Messages by category
    const byCategory = await c.env.DB.prepare(
      `SELECT category, COUNT(*) as count FROM contact_submissions GROUP BY category ORDER BY count DESC`
    ).all();

    // Messages this week
    const thisWeek = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM contact_submissions WHERE created_at >= datetime('now', '-7 days')`
    ).first<{ count: number }>();

    // Messages this month
    const thisMonth = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM contact_submissions WHERE created_at >= datetime('now', '-30 days')`
    ).first<{ count: number }>();

    // Recent activity (last 7 days by day)
    const recentActivity = await c.env.DB.prepare(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM contact_submissions 
       WHERE created_at >= datetime('now', '-7 days')
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    ).all();

    return c.json({
      success: true,
      stats: {
        total: totalMessages?.count || 0,
        unread: unreadMessages?.count || 0,
        thisWeek: thisWeek?.count || 0,
        thisMonth: thisMonth?.count || 0,
        byCategory: byCategory.results || [],
        recentActivity: recentActivity.results || [],
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

export default app;
