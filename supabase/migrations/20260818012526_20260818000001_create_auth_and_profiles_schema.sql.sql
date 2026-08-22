/*
# NexStream: Auth, viewer profiles, favorites, watch history

## Overview
Adds full multi-user support with Netflix-style viewer profiles. Each Google
OAuth account can have up to 4 viewer profiles. Favorites and watch history are
scoped to a viewer profile (not the account), so each profile has its own
My List and its own resume-watching state.

## 1. New Tables

### profiles
- `id` (uuid, PK, references auth.users ON DELETE CASCADE) — one row per account
- `full_name` (text) — display name from Google
- `avatar_url` (text) — Google avatar URL
- `created_at` (timestamptz, default now())

### viewer_profiles
- `id` (uuid, PK, default gen_random_uuid())
- `account_id` (uuid, references auth.users ON DELETE CASCADE) — owning account
- `name` (text, NOT NULL) — profile name (e.g. "Ahmed", "Kids")
- `avatar_color` (text, default '#ef4444') — hex color for avatar background
- `is_kid` (boolean, default false) — kids profile flag
- `created_at` (timestamptz, default now())
- Unique constraint on (account_id, name) to prevent duplicate profile names per account

### favorites
- `id` (uuid, PK, default gen_random_uuid())
- `viewer_profile_id` (uuid, references viewer_profiles ON DELETE CASCADE)
- `content_id` (text, NOT NULL) — matches catalog ids (e.g. "n1", "y5")
- `created_at` (timestamptz, default now())
- Unique (viewer_profile_id, content_id) — one favorite per content per profile

### watch_history
- `id` (uuid, PK, default gen_random_uuid())
- `viewer_profile_id` (uuid, references viewer_profiles ON DELETE CASCADE)
- `content_id` (text, NOT NULL)
- `progress_seconds` (integer, default 0)
- `updated_at` (timestamptz, default now())
- Unique (viewer_profile_id, content_id) — one row per content per profile

## 2. Security (RLS)

All tables have RLS enabled. Policies are scoped to `authenticated` users.

- **profiles**: a user can SELECT/UPDATE only their own row (id = auth.uid()).
- **viewer_profiles**: SELECT/INSERT/UPDATE/DELETE only where account_id = auth.uid().
  INSERT has a WITH CHECK that enforces account_id = auth.uid().
- **favorites**: SELECT/INSERT/UPDATE/DELETE only where the favorite's
  viewer_profile belongs to the calling user (EXISTS subquery on viewer_profiles).
  INSERT WITH CHECK also enforces ownership.
- **watch_history**: same ownership-via-viewer-profile pattern as favorites.

## 3. Triggers / Functions

- `enforce_max_four_profiles()`: BEFORE INSERT on viewer_profiles — raises an
  exception if the account already has 4 profiles. Prevents a 5th profile.
- `handle_new_user()`: AFTER INSERT on auth.users — auto-creates a `profiles`
  row from the Google OAuth metadata (full_name, avatar_url).

## 4. Notes
- The old single-tenant `my_list` table is left in place; the app now uses
  `favorites` instead. It can be dropped manually later if desired.
- viewer_profiles INSERT policy relies on the client sending account_id; a
  DEFAULT auth.uid() is not used here because the client explicitly provides it
  and the WITH CHECK enforces ownership.
*/

-- ─── profiles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─── viewer_profiles ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS viewer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_color text NOT NULL DEFAULT '#ef4444',
  is_kid boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE viewer_profiles ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS viewer_profiles_account_name_idx
  ON viewer_profiles (account_id, name);

DROP POLICY IF EXISTS "select_own_viewer_profiles" ON viewer_profiles;
CREATE POLICY "select_own_viewer_profiles"
  ON viewer_profiles FOR SELECT TO authenticated
  USING (auth.uid() = account_id);

DROP POLICY IF EXISTS "insert_own_viewer_profiles" ON viewer_profiles;
CREATE POLICY "insert_own_viewer_profiles"
  ON viewer_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = account_id);

DROP POLICY IF EXISTS "update_own_viewer_profiles" ON viewer_profiles;
CREATE POLICY "update_own_viewer_profiles"
  ON viewer_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = account_id) WITH CHECK (auth.uid() = account_id);

DROP POLICY IF EXISTS "delete_own_viewer_profiles" ON viewer_profiles;
CREATE POLICY "delete_own_viewer_profiles"
  ON viewer_profiles FOR DELETE TO authenticated
  USING (auth.uid() = account_id);

-- ─── favorites ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_profile_id uuid NOT NULL REFERENCES viewer_profiles(id) ON DELETE CASCADE,
  content_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS favorites_profile_content_idx
  ON favorites (viewer_profile_id, content_id);

CREATE INDEX IF NOT EXISTS favorites_profile_idx
  ON favorites (viewer_profile_id);

DROP POLICY IF EXISTS "select_own_favorites" ON favorites;
CREATE POLICY "select_own_favorites"
  ON favorites FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM viewer_profiles vp
      WHERE vp.id = favorites.viewer_profile_id
        AND vp.account_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_own_favorites" ON favorites;
CREATE POLICY "insert_own_favorites"
  ON favorites FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM viewer_profiles vp
      WHERE vp.id = favorites.viewer_profile_id
        AND vp.account_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_own_favorites" ON favorites;
CREATE POLICY "delete_own_favorites"
  ON favorites FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM viewer_profiles vp
      WHERE vp.id = favorites.viewer_profile_id
        AND vp.account_id = auth.uid()
    )
  );

-- ─── watch_history ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS watch_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_profile_id uuid NOT NULL REFERENCES viewer_profiles(id) ON DELETE CASCADE,
  content_id text NOT NULL,
  progress_seconds integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS watch_history_profile_content_idx
  ON watch_history (viewer_profile_id, content_id);

CREATE INDEX IF NOT EXISTS watch_history_profile_idx
  ON watch_history (viewer_profile_id);

DROP POLICY IF EXISTS "select_own_watch_history" ON watch_history;
CREATE POLICY "select_own_watch_history"
  ON watch_history FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM viewer_profiles vp
      WHERE vp.id = watch_history.viewer_profile_id
        AND vp.account_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "upsert_own_watch_history" ON watch_history;
CREATE POLICY "upsert_own_watch_history"
  ON watch_history FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM viewer_profiles vp
      WHERE vp.id = watch_history.viewer_profile_id
        AND vp.account_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "update_own_watch_history" ON watch_history;
CREATE POLICY "update_own_watch_history"
  ON watch_history FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM viewer_profiles vp
      WHERE vp.id = watch_history.viewer_profile_id
        AND vp.account_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM viewer_profiles vp
      WHERE vp.id = watch_history.viewer_profile_id
        AND vp.account_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_own_watch_history" ON watch_history;
CREATE POLICY "delete_own_watch_history"
  ON watch_history FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM viewer_profiles vp
      WHERE vp.id = watch_history.viewer_profile_id
        AND vp.account_id = auth.uid()
    )
  );

-- ─── Trigger: max 4 viewer profiles per account ──────────────
CREATE OR REPLACE FUNCTION enforce_max_four_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_count integer;
BEGIN
  SELECT COUNT(*) INTO profile_count
  FROM viewer_profiles
  WHERE account_id = NEW.account_id;

  IF profile_count >= 4 THEN
    RAISE EXCEPTION 'Maximum de 4 profils spectateurs atteint pour ce compte.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_max_four_profiles ON viewer_profiles;
CREATE TRIGGER trg_enforce_max_four_profiles
  BEFORE INSERT ON viewer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION enforce_max_four_profiles();

-- ─── Trigger: auto-create profile row on signup ──────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();