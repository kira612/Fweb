-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users table
create table public.users (
  id uuid default uuid_generate_v4() primary key, -- Changed from auth.users reference
  display_name text,
  avatar_url text,
  is_guest boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Posts table
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  content text not null, -- Markdown
  ui_type text not null check (ui_type in ('Article', 'Talk')), -- Article or Talk
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Comments table
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tags table
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null
);

-- 5. Post_Tags (Intermediate table)
create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  primary key (post_id, tag_id)
);

-- 6. Messages table (1:1 DM)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) on delete cascade not null,
  receiver_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Simplified for Guest Access)
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.messages enable row level security;

-- Allow read access to everyone
create policy "Public posts are viewable by everyone" on public.posts for select using (true);
create policy "Public comments are viewable by everyone" on public.comments for select using (true);
create policy "Tags are viewable by everyone" on public.tags for select using (true);
create policy "Post tags are viewable by everyone" on public.post_tags for select using (true);
create policy "Users are viewable by everyone" on public.users for select using (true);

-- Allow insert/update for everyone (Guest Mode)
-- Note: In a real app, you'd want to verify the user_id matches the cookie, but for now we trust the client/server action.
create policy "Everyone can insert users" on public.users for insert with check (true);
create policy "Everyone can insert posts" on public.posts for insert with check (true);
create policy "Everyone can update posts" on public.posts for update using (true);
create policy "Everyone can insert comments" on public.comments for insert with check (true);
create policy "Everyone can insert tags" on public.tags for insert with check (true);
create policy "Everyone can insert post_tags" on public.post_tags for insert with check (true);

-- Messages policies
create policy "Users can view their own messages" on public.messages for select using (true); -- Simplified
create policy "Users can send messages" on public.messages for insert with check (true); -- Simplified
