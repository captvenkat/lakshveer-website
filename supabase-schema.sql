-- Supabase Schema for Lakshveer Rao Website
-- Run this in Supabase SQL Editor to set up the database

-- Systems Table
create table systems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('Flagship Platforms', 'Robotics', 'Vision & Edge AI', 'Experimental Devices')),
  link text,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);

-- Impact Table
create table impact (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('Grant', 'Award', 'Panel', 'Workshop', 'Product', 'Media')),
  organisation text,
  description text,
  link text,
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
-- Note: In production, add additional role checks

create policy "Authenticated users can read all systems"
  on systems for select
  to authenticated
  using (true);

create policy "Authenticated users can insert systems"
  on systems for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update systems"
  on systems for update
  to authenticated
  using (true);

create policy "Authenticated users can delete systems"
  on systems for delete
  to authenticated
  using (true);

create policy "Authenticated users can read all impact"
  on impact for select
  to authenticated
  using (true);

create policy "Authenticated users can insert impact"
  on impact for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update impact"
  on impact for update
  to authenticated
  using (true);

create policy "Authenticated users can delete impact"
  on impact for delete
  to authenticated
  using (true);

create policy "Authenticated users can read all supporters"
  on supporters for select
  to authenticated
  using (true);

create policy "Authenticated users can insert supporters"
  on supporters for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update supporters"
  on supporters for update
  to authenticated
  using (true);

create policy "Authenticated users can delete supporters"
  on supporters for delete
  to authenticated
  using (true);

create policy "Authenticated users can read all inquiries"
  on collaboration_inquiries for select
  to authenticated
  using (true);

create policy "Authenticated users can update inquiries"
  on collaboration_inquiries for update
  to authenticated
  using (true);

create policy "Authenticated users can delete inquiries"
  on collaboration_inquiries for delete
  to authenticated
  using (true);

-- Indexes for performance
create index idx_systems_featured on systems(is_featured) where is_featured = true;
create index idx_systems_category on systems(category);
create index idx_impact_featured on impact(is_featured) where is_featured = true;
create index idx_impact_type on impact(type);
create index idx_supporters_featured on supporters(is_featured) where is_featured = true;
create index idx_inquiries_handled on collaboration_inquiries(is_handled);
create index idx_inquiries_created on collaboration_inquiries(created_at desc);

-- Sample Data (Optional - uncomment to seed)
/*
insert into systems (title, description, category, link, is_featured) values
  ('Hardvare', 'Hardware execution platform for deployable systems', 'Flagship Platforms', 'https://github.com/projectsbylaksh/hardvare', true),
  ('GrantBot', 'Autonomous grant discovery and application agent', 'Flagship Platforms', 'https://github.com/projectsbylaksh/grantbot', true),
  ('Motion-Control Gaming', 'Gesture-based gaming interface', 'Flagship Platforms', 'https://github.com/projectsbylaksh/motion-gaming', true),
  ('LineBot v3', 'Advanced line-following robot with PID control', 'Robotics', 'https://github.com/projectsbylaksh/linebot', true),
  ('FaceDetect Edge', 'Real-time face detection on Raspberry Pi', 'Vision & Edge AI', 'https://github.com/projectsbylaksh/facedetect', true),
  ('SensorHub', 'Multi-sensor data aggregation platform', 'Experimental Devices', 'https://github.com/projectsbylaksh/sensorhub', true);

insert into impact (title, type, organisation, description, link, is_featured) values
  ('₹1,00,000 Grant', 'Grant', 'Malpani Ventures', 'Selected for hardware innovation track', 'https://example.com/announcement', true),
  ('First Place', 'Award', 'KBC Young Innovators', 'National robotics competition winner', 'https://example.com/results', true),
  ('Panel Speaker', 'Panel', 'EdTech Summit', 'Youth in hardware innovation panel', 'https://example.com/event', true),
  ('Cover Feature', 'Media', 'Runtime Magazine', 'Profile on youngest hardware builder', 'https://example.com/article', true),
  ('Robotics Workshop', 'Workshop', 'Delhi Public School', '50+ students, full-day hands-on session', null, true),
  ('LineBot Kit', 'Product', 'Direct Sales', '15 units sold to schools and hobbyists', null, true);

insert into supporters (name, logo_url, link, is_featured) values
  ('Malpani Ventures', '/logos/malpani.png', 'https://malpaniventures.com', true),
  ('Maker Movement India', '/logos/maker-movement.png', 'https://makermovement.in', true),
  ('Tech Foundation', '/logos/tech-foundation.png', 'https://techfoundation.org', true);
*/
