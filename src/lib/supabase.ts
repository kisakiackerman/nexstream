import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type MyListItem = {
  id: string;
  content_id: string;
  viewer_profile_id: string;
  created_at: string;
};

export type ViewerProfile = {
  id: string;
  account_id: string;
  name: string;
  avatar_color: string;
  is_kid: boolean;
  created_at: string;
};

export type WatchHistoryItem = {
  id: string;
  viewer_profile_id: string;
  content_id: string;
  progress_seconds: number;
  updated_at: string;
};
