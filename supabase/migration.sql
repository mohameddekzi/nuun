-- ================================================================
-- NUUN MEDIA — Full Database Migration
-- Run this in: https://errgvllopzeyehuiluda.supabase.co/project/errgvllopzeyehuiluda/sql
-- ================================================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------
-- ROLES
-- ----------------------------------------------------------------
create table if not exists public.roles (
  id          uuid primary key default extensions.uuid_generate_v4(),
  name        text unique not null,
  description text,
  permissions jsonb default '{}',
  created_at  timestamptz default now()
);
alter table public.roles enable row level security;
create policy "roles_read" on public.roles for select using (true);
create policy "roles_write" on public.roles for all using (auth.role() = 'authenticated');

insert into public.roles (id, name, description, permissions) values
  ('77c0ea16-71d6-4acc-88fa-1e011add7f14', 'super_admin',     'Full access',        '{"all":true}'),
  ('14ef2d8d-422e-4d55-9d6c-ce9283d00041', 'admin',           'Admin access',       '{"media":true,"pages":true,"users":true,"content":true,"settings":true}'),
  ('9759c411-dae5-4f57-981b-dcf0c0542b7f', 'editor',          'Edit content',       '{"media":true,"pages":true,"content":true}'),
  ('2bb78f9f-fb2b-4faf-afcc-eb64fa8b4ed2', 'content_manager', 'Manage content',     '{"media":true,"content":true}')
on conflict (id) do nothing;

-- ----------------------------------------------------------------
-- PROFILES
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  role_id     uuid references public.roles(id),
  is_active   boolean default true,
  last_login  timestamptz,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "profiles_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_write" on public.profiles for all using (auth.role() = 'authenticated');

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------
-- SETTINGS
-- ----------------------------------------------------------------
create table if not exists public.settings (
  id         uuid primary key default extensions.uuid_generate_v4(),
  key        text unique not null,
  value      jsonb,
  category   text default 'general',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.settings enable row level security;
create policy "settings_read" on public.settings for select using (true);
create policy "settings_write" on public.settings for all using (auth.role() = 'authenticated');

insert into public.settings (key, value, category) values
  ('site_name',        '"Nuun Media"',                                                         'general'),
  ('site_tagline',     '"From Vision to Reality"',                                             'general'),
  ('site_description', '"A next-generation creative and media company"',                       'general'),
  ('contact_email',    '"info@nuun.so"',                                                       'contact'),
  ('contact_phone',    '"+252 61 4272760"',                                                    'contact'),
  ('contact_address',  '"KM5 Zoobe, Mogadishu, Somalia"',                                     'contact'),
  ('social_links',     '{"twitter":"","facebook":"","linkedin":"","instagram":""}',            'social'),
  ('theme_colors',     '{"primary":"#0A0A0A","accent":"#FFD400","white":"#FFFFFF"}',           'theme')
on conflict (key) do nothing;

-- ----------------------------------------------------------------
-- SERVICES
-- ----------------------------------------------------------------
create table if not exists public.services (
  id                uuid primary key default extensions.uuid_generate_v4(),
  title             text not null,
  slug              text unique,
  short_description text,
  description       text,
  icon              text,
  image_url         text,
  features          jsonb default '[]',
  order_index       integer default 0,
  is_active         boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
alter table public.services enable row level security;
create policy "services_read" on public.services for select using (true);
create policy "services_write" on public.services for all using (auth.role() = 'authenticated');

insert into public.services (id, title, slug, short_description, description, icon, order_index) values
  ('bc3712f3-e441-4d5f-a455-d0e96ecb2f57', 'Brand & Visual Identity',    'brand-visual-identity',  'Scalable brand ecosystems and corporate identity systems',       'Design and development of scalable brand ecosystems, including corporate identity, brand guidelines, and structured visual systems.', 'Palette', 1),
  ('e9e2b631-3bcc-4624-8f23-e4169a3deed6', 'Media Production',           'media-production',       'Full-cycle video production optimized for corporate communication','Full-cycle video production services from concept to filming and post-production.',                                                    'Video',   2),
  ('7f5b894f-f1f4-4f98-bae4-778d26e91c1f', 'Motion & Digital Content',   'motion-digital-content', 'High-quality motion graphics and animations',                    'Creation of high-quality motion graphics and animations that enhance storytelling.',                                                    'Zap',     3),
  ('594a8981-1014-43fc-9fb8-481dfddd87ce', 'Social Media & Digital',     'social-media-digital',   'Strategic content development and performance-focused campaigns', 'Strategic content development, platform management, and performance-focused campaigns.',                                               'Share2',  4),
  ('3693b49a-ae6f-4c72-965f-7f157fcccc4f', 'Event Branding',             'event-branding',         'End-to-end branding solutions for events and campaigns',         'End-to-end branding solutions for events, including creative direction and campaign rollout.',                                         'Star',    5)
on conflict (id) do nothing;

-- ----------------------------------------------------------------
-- TESTIMONIALS
-- ----------------------------------------------------------------
create table if not exists public.testimonials (
  id          uuid primary key default extensions.uuid_generate_v4(),
  name        text not null,
  position    text,
  company     text,
  avatar_url  text,
  content     text not null,
  rating      integer default 5,
  video_url   text,
  is_featured boolean default false,
  is_active   boolean default true,
  order_index integer default 0,
  created_at  timestamptz default now()
);
alter table public.testimonials enable row level security;
create policy "testimonials_read" on public.testimonials for select using (true);
create policy "testimonials_write" on public.testimonials for all using (auth.role() = 'authenticated');

insert into public.testimonials (id, name, position, company, content, rating, is_featured, is_active, order_index) values
  ('55c13f6e-834c-4df1-b235-cb5fb6c3ec79', 'Ahmed Hassan', 'CEO',               'Somali Business Hub',  'Nuun Media transformed our brand identity completely. Their strategic approach and creative excellence elevated our company to a whole new level.', 5, true,  true, 0),
  ('e920eb26-eee2-498b-945d-7ae8c5d48c77', 'Fatima Ali',   'Marketing Director','East Africa Finance',  'The team at Nuun delivered exceptional results. From concept to execution, every detail was handled with professionalism and precision.',            5, true,  true, 0),
  ('0365ecb9-a581-4369-9449-a372a33619de', 'Omar Khalif',  'Founder',           'TechStart Somalia',    'Working with Nuun Media was a game-changer. Their understanding of our vision exceeded our expectations.',                                          5, false, true, 0)
on conflict (id) do nothing;

-- ----------------------------------------------------------------
-- FAQ
-- ----------------------------------------------------------------
create table if not exists public.faq (
  id          uuid primary key default extensions.uuid_generate_v4(),
  question    text not null,
  answer      text not null,
  category    text default 'general',
  order_index integer default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);
alter table public.faq enable row level security;
create policy "faq_read" on public.faq for select using (true);
create policy "faq_write" on public.faq for all using (auth.role() = 'authenticated');

insert into public.faq (id, question, answer, category, order_index) values
  ('78c7ffe2-59c4-42e9-977d-8d37d87cf807', 'What services does Nuun Media offer?',    'Nuun Media offers Brand & Visual Identity, Media Production, Motion & Digital Content, Social Media & Digital Communication, and Event Branding & Campaign Execution.', 'general', 1),
  ('dcf091dc-3270-47cb-b1d9-4c6ebfbbff6f', 'Where is Nuun Media located?',            'We are headquartered at KM5 Zoobe, Mogadishu, Somalia. We serve clients across East Africa and internationally.',                                                        'general', 2),
  ('313ec36a-ad7a-4db8-9c46-b154de0e2ba5', 'How long does a typical project take?',   'Project timelines vary based on scope. Brand identity projects typically take 4-8 weeks, while media production and campaigns may range from 2-12 weeks.',               'process', 3),
  ('cff941b9-eb8f-4108-b064-1dd3fa37d1e9', 'What industries do you serve?',           'We serve Corporate Institutions, Financial Organizations, NGOs & Development Agencies, and Growth-Oriented Businesses.',                                                   'general', 4),
  ('8fe44107-f90e-4630-8902-6bcee044c0d4', 'How do I start a project?',               'Simply reach out via our contact form, email info@nuun.so, or call +252 61 4272760. We will schedule a consultation.',                                                    'process', 5)
on conflict (id) do nothing;

-- ----------------------------------------------------------------
-- BLOG CATEGORIES
-- ----------------------------------------------------------------
create table if not exists public.blog_categories (
  id          uuid primary key default extensions.uuid_generate_v4(),
  name        text not null,
  slug        text unique,
  description text,
  created_at  timestamptz default now()
);
alter table public.blog_categories enable row level security;
create policy "blog_categories_read" on public.blog_categories for select using (true);
create policy "blog_categories_write" on public.blog_categories for all using (auth.role() = 'authenticated');

insert into public.blog_categories (id, name, slug) values
  ('ccd8c1a3-d350-4c09-91cd-eba955d5fa33', 'Branding',         'branding'),
  ('007ce773-0ec9-4c9d-88a1-d1162c89daee', 'Design',           'design'),
  ('a037f137-6ddb-433a-8b68-fbd0706ef187', 'Digital Marketing','digital-marketing'),
  ('c39d6c97-545e-4b4e-90b3-1724d86609fb', 'Industry News',    'industry-news'),
  ('ccf1812d-ee1f-4daa-92d3-e101678974ea', 'Technology',       'technology')
on conflict (id) do nothing;

-- ----------------------------------------------------------------
-- BLOG POSTS
-- ----------------------------------------------------------------
create table if not exists public.blog_posts (
  id              uuid primary key default extensions.uuid_generate_v4(),
  title           text not null,
  slug            text unique,
  excerpt         text,
  content         text,
  cover_image     text,
  author_id       uuid,
  category_id     uuid references public.blog_categories(id),
  tags            jsonb default '[]',
  is_published    boolean default false,
  is_featured     boolean default false,
  view_count      integer default 0,
  read_time       integer default 5,
  seo_title       text,
  seo_description text,
  published_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
alter table public.blog_posts enable row level security;
create policy "blog_posts_read" on public.blog_posts for select using (true);
create policy "blog_posts_write" on public.blog_posts for all using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- PROJECT CATEGORIES
-- ----------------------------------------------------------------
create table if not exists public.project_categories (
  id         uuid primary key default extensions.uuid_generate_v4(),
  name       text not null,
  slug       text unique,
  created_at timestamptz default now()
);
alter table public.project_categories enable row level security;
create policy "project_categories_read" on public.project_categories for select using (true);
create policy "project_categories_write" on public.project_categories for all using (auth.role() = 'authenticated');

insert into public.project_categories (id, name, slug) values
  ('f9e505d4-9add-491f-ad9b-ae68499ce42f', 'Branding',         'branding'),
  ('d7036ddd-fc20-4fba-8c05-592616504696', 'Motion Graphics',  'motion-graphics'),
  ('ffd7ab7a-d040-49a2-ae09-f21ceeee432b', 'Social Media',     'social-media'),
  ('e4febffb-da7c-4cc6-b841-0470c19ed7c8', 'Video Production', 'video-production'),
  ('f54bbea5-e2b6-417b-b0df-1b530cc6f620', 'Web Design',       'web-design')
on conflict (id) do nothing;

-- ----------------------------------------------------------------
-- PROJECTS
-- ----------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default extensions.uuid_generate_v4(),
  title       text not null,
  slug        text unique,
  description text,
  client      text,
  category_id uuid references public.project_categories(id),
  cover_image text,
  images      jsonb default '[]',
  tags        jsonb default '[]',
  year        integer,
  is_featured boolean default false,
  is_active   boolean default true,
  order_index integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.projects enable row level security;
create policy "projects_read" on public.projects for select using (true);
create policy "projects_write" on public.projects for all using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- PAGES
-- ----------------------------------------------------------------
create table if not exists public.pages (
  id              uuid primary key default extensions.uuid_generate_v4(),
  slug            text unique not null,
  title           text not null,
  description     text,
  content         jsonb default '[]',
  seo_title       text,
  seo_description text,
  og_image        text,
  is_published    boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
alter table public.pages enable row level security;
create policy "pages_read" on public.pages for select using (true);
create policy "pages_write" on public.pages for all using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- SECTIONS
-- ----------------------------------------------------------------
create table if not exists public.sections (
  id          uuid primary key default extensions.uuid_generate_v4(),
  page_id     uuid references public.pages(id) on delete cascade,
  type        text not null,
  title       text,
  content     jsonb default '{}',
  order_index integer default 0,
  is_visible  boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.sections enable row level security;
create policy "sections_read" on public.sections for select using (true);
create policy "sections_write" on public.sections for all using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- PRICING PLANS
-- ----------------------------------------------------------------
create table if not exists public.pricing_plans (
  id          uuid primary key default extensions.uuid_generate_v4(),
  name        text not null,
  slug        text unique,
  description text,
  price       numeric,
  currency    text default 'USD',
  period      text default 'month',
  features    jsonb default '[]',
  is_popular  boolean default false,
  is_active   boolean default true,
  order_index integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.pricing_plans enable row level security;
create policy "pricing_read" on public.pricing_plans for select using (true);
create policy "pricing_write" on public.pricing_plans for all using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- CONTACT MESSAGES
-- ----------------------------------------------------------------
create table if not exists public.contact_messages (
  id         uuid primary key default extensions.uuid_generate_v4(),
  name       text not null,
  email      text not null,
  phone      text,
  company    text,
  subject    text,
  message    text not null,
  service    text,
  status     text default 'new',
  is_read    boolean default false,
  created_at timestamptz default now()
);
alter table public.contact_messages enable row level security;
create policy "contact_insert" on public.contact_messages for insert with check (true);
create policy "contact_read" on public.contact_messages for select using (auth.role() = 'authenticated');
create policy "contact_write" on public.contact_messages for update using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- SUBSCRIBERS
-- ----------------------------------------------------------------
create table if not exists public.subscribers (
  id         uuid primary key default extensions.uuid_generate_v4(),
  email      text unique not null,
  name       text,
  is_active  boolean default true,
  created_at timestamptz default now()
);
alter table public.subscribers enable row level security;
create policy "subscribers_insert" on public.subscribers for insert with check (true);
create policy "subscribers_read" on public.subscribers for select using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- MEDIA
-- ----------------------------------------------------------------
create table if not exists public.media (
  id          uuid primary key default extensions.uuid_generate_v4(),
  name        text not null,
  file_path   text not null,
  file_url    text not null,
  file_type   text,
  file_size   integer,
  folder      text default 'root',
  alt_text    text,
  caption     text,
  uploaded_by uuid,
  created_at  timestamptz default now()
);
alter table public.media enable row level security;
create policy "media_read" on public.media for select using (true);
create policy "media_write" on public.media for all using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- ANALYTICS
-- ----------------------------------------------------------------
create table if not exists public.analytics (
  id         uuid primary key default extensions.uuid_generate_v4(),
  page       text not null,
  referrer   text,
  user_agent text,
  country    text,
  created_at timestamptz default now()
);
alter table public.analytics enable row level security;
create policy "analytics_insert" on public.analytics for insert with check (true);
create policy "analytics_read" on public.analytics for select using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- PRICING PLANS (seed)
-- ----------------------------------------------------------------
insert into public.pricing_plans (name, slug, description, price, currency, period, features, is_popular, is_active, order_index) values
(
  'Starter',
  'starter',
  'Perfect for small businesses and startups looking to establish their brand presence.',
  500, 'USD', 'project',
  '["Brand identity consultation","Logo design (3 concepts)","Business card design","Social media kit (5 templates)","2 revision rounds","Delivery in 2 weeks"]'::jsonb,
  false, true, 1
),
(
  'Professional',
  'professional',
  'Comprehensive solution for growing businesses that need a full brand and media presence.',
  1500, 'USD', 'project',
  '["Everything in Starter","Full brand guidelines document","10 social media templates","1 promotional video (60s)","Website UI design (5 pages)","4 revision rounds","Delivery in 4 weeks","3 months post-launch support"]'::jsonb,
  true, true, 2
),
(
  'Enterprise',
  'enterprise',
  'End-to-end creative partnership for large organizations with ongoing media needs.',
  null, 'USD', 'project',
  '["Everything in Professional","Dedicated creative team","Monthly content calendar","Video production (up to 5 min)","Event branding package","Motion graphics & animations","Unlimited revisions","Priority 24/7 support","Quarterly strategy review"]'::jsonb,
  false, true, 3
)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------
-- PORTFOLIO PROJECTS (seed)
-- ----------------------------------------------------------------
insert into public.projects (title, slug, description, client, category_id, year, is_featured, is_active, order_index) values
(
  'Hormuud Telecom Rebrand',
  'hormuud-rebrand',
  'Complete visual identity overhaul for Somalia''s leading telecommunications company. Delivered a modern, scalable brand system with updated logo, color palette, and comprehensive brand guidelines.',
  'Hormuud Telecom',
  (select id from public.project_categories where slug = 'branding'),
  2025, true, true, 1
),
(
  'Somali Investment Forum',
  'somali-investment-forum',
  'Full event branding package for the annual Somali Investment Forum. Included stage design, print materials, digital assets, and live event media coverage.',
  'Ministry of Finance',
  (select id from public.project_categories where slug = 'branding'),
  2025, false, true, 2
),
(
  'East Africa Finance Campaign',
  'eaf-digital-campaign',
  'Multi-channel digital marketing campaign targeting East African financial markets. Included social media strategy, motion graphics, and performance-driven ad creatives.',
  'East Africa Finance',
  (select id from public.project_categories where slug = 'social-media'),
  2024, true, true, 3
),
(
  'TechStart Brand Launch',
  'techstart-launch',
  'End-to-end brand launch for a Mogadishu-based technology startup. From naming and logo to launch video and digital presence.',
  'TechStart Somalia',
  (select id from public.project_categories where slug = 'branding'),
  2024, false, true, 4
),
(
  'Nuun Media Showreel 2025',
  'nuun-showreel-2025',
  'Annual showreel showcasing the best work produced by Nuun Media. High-energy motion graphics and cinematic footage representing the breadth of our creative output.',
  'Nuun Media',
  (select id from public.project_categories where slug = 'video-production'),
  2025, false, true, 5
),
(
  'Amal Bank Motion Identity',
  'amal-bank-motion',
  'Motion graphics package for Amal Bank''s internal and external communications. Included animated logo, lower-thirds, and a suite of social media animations.',
  'Amal Bank',
  (select id from public.project_categories where slug = 'motion-graphics'),
  2024, false, true, 6
)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------
-- BLOG POSTS (seed)
-- ----------------------------------------------------------------
insert into public.blog_posts (title, slug, excerpt, content, category_id, tags, is_published, is_featured, read_time, published_at) values
(
  'The Future of Branding in East Africa',
  'future-of-branding-east-africa',
  'East Africa is experiencing a branding renaissance. Here''s how forward-thinking companies are building identities that resonate locally and compete globally.',
  'East Africa is experiencing a branding renaissance. Here''s how forward-thinking companies are building identities that resonate locally and compete globally.

The most successful brands in the region are those that authentically blend cultural heritage with modern design sensibilities. They don''t try to copy Western aesthetics — they forge their own visual language.

Key trends we''re seeing:

**1. Cultural authenticity over imitation**
Brands that lean into local cultural motifs, colors, and storytelling are seeing stronger consumer connections. The Somali geometric patterns, the vibrant East African color palettes — these are assets, not limitations.

**2. Mobile-first brand experiences**
With smartphone penetration driving most digital interactions, brands must be optimized for small screens first. This means simpler logos, bold typography, and visual systems that work at thumbnail scale.

**3. Video as the primary communication medium**
Short-form video content is now the most effective way to build brand awareness in the region. Brands that invest in video production — even at modest budgets — see dramatically higher engagement rates.

At Nuun Media, we help organizations navigate these trends with strategic clarity and creative precision.',
  (select id from public.blog_categories where slug = 'branding'),
  '["branding","east africa","design trends"]'::jsonb,
  true, true, 6,
  now() - interval '10 days'
),
(
  '5 Motion Design Trends Shaping Digital Communication',
  'motion-design-trends-2025',
  'Motion graphics have evolved from decorative elements to essential communication tools. Discover the five trends redefining how brands tell their stories through motion.',
  'Motion graphics have evolved from decorative elements to essential communication tools. Discover the five trends redefining how brands tell their stories through motion.

**1. Kinetic typography**
Text that moves with purpose. Words that emphasize, reveal, and guide attention. When typography becomes motion, messages land harder.

**2. Minimalist micro-animations**
Subtle, purposeful animations in UI and brand touchpoints. A button that breathes, a logo that draws itself in — these small moments build memorable brand experiences.

**3. 3D integration with 2D design**
Mixing flat design with dimensional elements creates visual depth that stands out in crowded feeds. The contrast between flat and 3D creates visual tension that captures attention.

**4. Loop-optimized social content**
Animations designed to loop seamlessly for social media consumption. Content that rewards repeated viewing builds deeper brand familiarity.

**5. Data visualization in motion**
Turning complex information into engaging animated infographics. Data that moves is data that sticks.',
  (select id from public.blog_categories where slug = 'design'),
  '["motion design","animation","digital","trends"]'::jsonb,
  true, false, 5,
  now() - interval '20 days'
),
(
  'Building a Corporate Social Media Strategy That Actually Works',
  'corporate-social-media-strategy',
  'Most corporate social media accounts blend into the noise. Here''s how to build a strategy that cuts through and drives real business outcomes.',
  'Most corporate social media accounts blend into the noise. Here''s how to build a strategy that cuts through and drives real business outcomes.

The biggest mistake corporate accounts make is treating social media as a broadcast channel. They push messages out without inviting conversation, without showing the human side of their organization.

**Start with your audience, not your product**
Your followers don''t want to hear about your products every day. They want to learn something, be entertained, or feel connected to something bigger than a transaction.

**The 70-20-10 content rule**
- 70% educational or entertaining content related to your industry
- 20% content that builds your brand personality
- 10% direct promotional content

**Consistency beats frequency**
Posting three times a week consistently outperforms posting daily for a month then going dark. Build a sustainable content calendar that your team can actually maintain.

**Video first, always**
Algorithms across all major platforms favor video content. Even simple, well-lit phone videos outperform static images in reach and engagement.',
  (select id from public.blog_categories where slug = 'digital-marketing'),
  '["social media","strategy","corporate","content"]'::jsonb,
  true, false, 7,
  now() - interval '32 days'
),
(
  'Why Every Business Needs Professional Video Production',
  'why-professional-video-production',
  'In a world where attention is the scarcest resource, video is the most effective tool for capturing and holding it. Here''s why professional production quality matters more than ever.',
  'In a world where attention is the scarcest resource, video is the most effective tool for capturing and holding it.

Consumer expectations for video quality have risen dramatically. Audiences trained on Netflix and high-production social content can immediately feel the difference between professional and amateur production — and that quality gap affects how they perceive your brand.

**The ROI of professional video**
Research consistently shows that professionally produced video content:
- Increases landing page conversions by up to 80%
- Improves email open rates when included in subject lines
- Extends average time spent on websites significantly
- Generates more social shares than any other content format

**What professional production actually means**
It''s not just about expensive cameras. Professional production means:
- Intentional lighting that flatters subjects and creates mood
- Clean, professional audio (often more important than video quality)
- Thoughtful composition and movement
- Post-production color grading and sound design
- A clear narrative structure that serves your communication goals

At Nuun Media, we approach every video project as a storytelling opportunity — not just a recording session.',
  (select id from public.blog_categories where slug = 'design'),
  '["video production","marketing","brand"]'::jsonb,
  true, false, 5,
  now() - interval '45 days'
)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------
-- TEAM MEMBERS
-- ----------------------------------------------------------------
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  position    text,
  bio         text,
  avatar_url  text,
  social_links jsonb default '{}',
  order_index integer default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);
alter table public.team_members enable row level security;
create policy "team_read"  on public.team_members for select using (true);
create policy "team_write" on public.team_members for all using (auth.role() = 'authenticated');

insert into public.team_members (name, position, bio, order_index, is_active) values
  ('Hassan Nur',     'Founder & Creative Director',   'With over a decade of experience in brand strategy and visual communication, Hassan founded Nuun Media with a vision to elevate creative standards across East Africa.',                                                                        1, true),
  ('Fatima Warsame', 'Head of Motion & Production',   'Fatima leads our video and motion graphics department, bringing cinematic quality and narrative depth to every production. She has directed over 80 corporate films.',                                                                            2, true),
  ('Abdi Mohamed',   'Brand Strategy Lead',           'Abdi bridges the gap between business objectives and creative execution. His strategic frameworks have shaped brand transformations for clients across finance, telecom, and government.',                                                         3, true),
  ('Amina Hassan',   'Digital & Social Media Director','Amina oversees digital strategy and social media execution for all client accounts, combining data analytics with creative instinct to deliver measurable results.',                                                                              4, true),
  ('Omar Sheikh',    'Senior Designer',               'Omar''s work spans brand identity, print, and digital design. His attention to craft and precision makes him the studio''s go-to for complex visual systems.',                                                                                    5, true);

-- ----------------------------------------------------------------
-- Done! All tables created and seeded.
-- ----------------------------------------------------------------
