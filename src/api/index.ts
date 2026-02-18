import { Hono } from 'hono';
import { cors } from "hono/cors"

// Endorsements data for OG image generation
// In production, this would be fetched from a database
const endorsements = [
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
  {
    slug: "hardware-hackathon-2026",
    quote: "Consistently ships working prototypes. Does not just ideate - he builds.",
    name: "Vikram Rao",
    role: "Lead Organizer",
    organisation: "Hardware Hackathon 2.0",
  },
];

// Helper to escape XML entities
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Helper to word wrap text
const wrapText = (text: string, maxCharsPerLine: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Limit to 4 lines and add ellipsis if needed
  if (lines.length > 4) {
    lines.length = 4;
    lines[3] = lines[3].slice(0, -3) + '...';
  }
  
  return lines;
};

const app = new Hono()
  .basePath('api');

app.use(cors({
  origin: "*"
}))

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

// Dynamic OG image endpoint for recognition pages
// Returns an SVG image that can be used as OG image
app.get('/og/recognition/:slug', (c) => {
  const slug = c.req.param('slug');
  const endorsement = endorsements.find(e => e.slug === slug);

  if (!endorsement) {
    // Return default OG image info if endorsement not found
    return c.redirect('/og-image.png');
  }

  // SVG dimensions (1200x630 is standard OG size)
  const width = 1200;
  const height = 630;
  
  // Wrap quote text
  const quoteLines = wrapText(endorsement.quote, 50);
  const lineHeight = 42;
  const startY = 140;

  // Generate SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#09090b"/>
  
  <!-- Quote text -->
  ${quoteLines.map((line, i) => `
  <text x="80" y="${startY + (i * lineHeight)}" font-family="system-ui, -apple-system, sans-serif" font-size="32" fill="#f4f4f5" font-weight="400">
    ${escapeXml(line)}
  </text>`).join('')}
  
  <!-- Attribution line -->
  <line x1="80" x2="160" y1="${startY + (quoteLines.length * lineHeight) + 30}" y2="${startY + (quoteLines.length * lineHeight) + 30}" stroke="#a1a1aa" stroke-width="2"/>
  
  <!-- Attribution name -->
  <text x="80" y="${startY + (quoteLines.length * lineHeight) + 70}" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="#f4f4f5" font-weight="600">
    ${escapeXml(endorsement.name)}
  </text>
  
  <!-- Role and Organisation -->
  <text x="80" y="${startY + (quoteLines.length * lineHeight) + 105}" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#a1a1aa">
    ${escapeXml(endorsement.role)}, ${escapeXml(endorsement.organisation)}
  </text>
  
  <!-- Footer: Lakshveer info -->
  <text x="80" y="${height - 100}" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#f4f4f5" font-weight="600">
    Lakshveer Rao (Age 8)
  </text>
  <text x="80" y="${height - 60}" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#a1a1aa">
    Hardware + AI Systems Builder
  </text>
  
  <!-- Decorative accent line at bottom -->
  <rect x="0" y="${height - 8}" width="${width}" height="8" fill="#22d3ee"/>
</svg>`;

  return c.body(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
});

export default app;