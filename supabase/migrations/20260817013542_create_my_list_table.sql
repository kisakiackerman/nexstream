/*
# Create my_list table (single-tenant, no auth)

1. New Tables
- `my_list`
  - `id` (uuid, primary key)
  - `content_id` (text, not null) — the catalog item identifier (e.g. "n1", "y5")
  - `youtube_id` (text, not null) — YouTube video ID for fallback lookups
  - `title` (text, not null) — video title (cached for display)
  - `thumbnail` (text, not null) — thumbnail URL (cached for display)
  - `channel` (text, not null) — channel name (cached for display)
  - `categories` (text[], default '{}') — category tags (cached for display)
  - `year` (int, default 0) — release year (cached for display)
  - `created_at` (timestamptz, default now()) — when the item was saved

2. Security
- Enable RLS on `my_list`.
- This is a single-tenant app with no sign-in screen, so all CRUD is open
  to the anon role. The data is intentionally shared/public.
- 4 separate policies (select/insert/update/delete) for anon + authenticated.

3. Indexes
- Unique index on `content_id` to prevent duplicate saves.
- Index on `created_at` descending for "latest saved" ordering.
*/

CREATE TABLE IF NOT EXISTS my_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id text NOT NULL,
  youtube_id text NOT NULL,
  title text NOT NULL,
  thumbnail text NOT NULL,
  channel text NOT NULL,
  categories text[] NOT NULL DEFAULT '{}',
  year int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE my_list ENABLE ROW LEVEL SECURITY;

-- Unique constraint to prevent duplicate saves
CREATE UNIQUE INDEX IF NOT EXISTS my_list_content_id_unique
  ON my_list (content_id);

-- Index for ordering by most recently saved
CREATE INDEX IF NOT EXISTS my_list_created_at_idx
  ON my_list (created_at DESC);

DROP POLICY IF EXISTS "anon_select_my_list" ON my_list;
CREATE POLICY "anon_select_my_list"
  ON my_list FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_my_list" ON my_list;
CREATE POLICY "anon_insert_my_list"
  ON my_list FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_my_list" ON my_list;
CREATE POLICY "anon_update_my_list"
  ON my_list FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_my_list" ON my_list;
CREATE POLICY "anon_delete_my_list"
  ON my_list FOR DELETE
  TO anon, authenticated USING (true);
