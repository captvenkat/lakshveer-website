-- Supabase Schema for Lakshveer Rao Website
-- Run this in Supabase SQL Editor to set up the database

-- Systems Table
create table systems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  category text,
  link text,
  github_url text,
  demo_url text,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);

-- Impact Table
create table impact (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text,
  type text not null check (type in ('Grant', 'Award', 'Panel', 'Workshop', 'Product', 'Media')),
  organisation text,
  description text,
  link text,
  link_label text,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);

-- Supporters Table
create table supporters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  link text,
  is_featured boolean default true,
  created_at timestamp with time zone default now()
);

-- Collaboration Inquiries Table
create table collaboration_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  category text check (category in ('Hardware Sponsorship', 'Cloud Credits', 'Manufacturing Access', 'Research Collaboration', 'Institutional Grant', 'Media Feature', 'Other')),
  message text not null,
  is_handled boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table systems enable row level security;
alter table impact enable row level security;
alter table supporters enable row level security;
alter table collaboration_inquiries enable row level security;

-- Public Read Policies (for homepage featured items)
create policy "Public can read featured systems"
  on systems for select
  using (is_featured = true);

create policy "Public can read featured impact"
  on impact for select
  using (is_featured = true);

create policy "Public can read featured supporters"
  on supporters for select
  using (is_featured = true);

-- Public can insert collaboration inquiries
create policy "Public can submit collaboration inquiries"
  on collaboration_inquiries for insert
  with check (true);

-- Admin Full Access Policies (requires authenticated user)
create policy "Authenticated users can read all systems"
  on systems for select to authenticated using (true);

create policy "Authenticated users can insert systems"
  on systems for insert to authenticated with check (true);

create policy "Authenticated users can update systems"
  on systems for update to authenticated using (true);

create policy "Authenticated users can delete systems"
  on systems for delete to authenticated using (true);

create policy "Authenticated users can read all impact"
  on impact for select to authenticated using (true);

create policy "Authenticated users can insert impact"
  on impact for insert to authenticated with check (true);

create policy "Authenticated users can update impact"
  on impact for update to authenticated using (true);

create policy "Authenticated users can delete impact"
  on impact for delete to authenticated using (true);

create policy "Authenticated users can read all supporters"
  on supporters for select to authenticated using (true);

create policy "Authenticated users can insert supporters"
  on supporters for insert to authenticated with check (true);

create policy "Authenticated users can update supporters"
  on supporters for update to authenticated using (true);

create policy "Authenticated users can delete supporters"
  on supporters for delete to authenticated using (true);

create policy "Authenticated users can read all inquiries"
  on collaboration_inquiries for select to authenticated using (true);

create policy "Authenticated users can update inquiries"
  on collaboration_inquiries for update to authenticated using (true);

create policy "Authenticated users can delete inquiries"
  on collaboration_inquiries for delete to authenticated using (true);

-- Indexes for performance
create index idx_systems_featured on systems(is_featured) where is_featured = true;
create index idx_systems_slug on systems(slug);
create index idx_impact_featured on impact(is_featured) where is_featured = true;
create index idx_impact_type on impact(type);
create index idx_impact_year on impact(year);
create index idx_supporters_featured on supporters(is_featured) where is_featured = true;
create index idx_inquiries_handled on collaboration_inquiries(is_handled);
create index idx_inquiries_created on collaboration_inquiries(created_at desc);

-- Seed Data for Systems
insert into systems (title, slug, description, github_url, demo_url, is_featured) values
  ('Hardvare', 'hardvare', 'Hardware execution platform preventing unsafe wiring and invalid logic states.', '#', '#', true),
  ('CircuitHeroes', 'circuitheroes', 'Circuit-building trading card game. 300+ decks shipped.', null, '#', true),
  ('Autonomous Grant Agent', 'grant-agent', 'AI agent sourcing and filing global grants autonomously.', null, '#', true),
  ('Motion-Control Gaming Platform', 'motion', 'Full-body measurable gaming system driven by real movement.', null, '#', true),
  ('Vision-Based Robotics', 'vision', 'OpenCV and TensorFlow Lite deployments on edge devices.', '#', null, true),
  ('Autonomous Navigation Systems', 'navigation', 'GPS-guided and gesture-controlled robotic vehicles.', null, '#', true);

-- Seed Data for Impact
insert into impact (title, year, type, organisation, link, link_label, is_featured) values
  ('₹1,00,000 Grant', '2026', 'Grant', 'Malpani Ventures', '#', 'Official Announcement', true),
  ('AI Credits', '2026', 'Grant', 'AI Grants India', '#', 'Grant Page', true),
  ('Special Prize', '2026', 'Award', 'Vedanta × Param Foundation Makeathon', '#', 'Event Page', true),
  ('Prize Winner', '2024', 'Award', 'Hitex Kids Business Carnival', '#', 'Event Coverage', true),
  ('Participant Invite', '2025', 'Panel', 'Robotics & Hardware Founders Meet', '#', 'Event Page', true),
  ('Robotics Workshop', '2025', 'Workshop', 'Corporate Session', '#', 'Session Photos', false),
  ('AI Systems Workshop', '2025', 'Workshop', 'School Program', '#', 'Session Overview', false),
  ('CircuitHeroes', null, 'Product', '300+ Decks Shipped', '#', 'Website', false),
  ('Ebook', null, 'Product', 'Copies Sold', '#', 'Download Page', false),
  ('Runtime Magazine', null, 'Media', 'Feature', '#', 'Article', false),
  ('YouTube', null, 'Media', 'Hackathon Demo', '#', 'Watch', false);

-- Seed Data for Supporters
insert into supporters (name, logo_url, link, is_featured) values
  ('Malpani Ventures', '/logos/malpani.png', 'https://malpaniventures.com', true),
  ('Lion Circuits', '/logos/lion-circuits.png', 'https://lioncircuits.com', true),
  ('Param Foundation', '/logos/param.png', 'https://paramfoundation.org', true),
  ('AI Grants India', '/logos/ai-grants.png', 'https://aigrants.in', true);
