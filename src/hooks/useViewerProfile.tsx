import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { supabase, type ViewerProfile } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEY = "nexstream_active_profile";
const AVATAR_COLORS = [
  "#ef4444",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

// Colonnes explicites — ne JAMAIS inclure pin_code (le hash du PIN) ici.
const PROFILE_COLUMNS =
  "id, account_id, name, avatar_color, avatar_icon, is_kid, has_pin, favorite_categories, prayer_location, created_at";

type ViewerProfileContextValue = {
  profiles: ViewerProfile[];
  activeProfile: ViewerProfile | null;
  loading: boolean;
  error: string | null;
  selectProfile: (profile: ViewerProfile) => void;
  clearActiveProfile: () => void;
  createProfile: (
    name: string,
    color: string,
    isKid: boolean,
    avatarIcon?: string | null
  ) => Promise<{ error: string | null; profile: ViewerProfile | null }>;
  updateProfile: (
    id: string,
    updates: {
      name?: string;
      color?: string;
      isKid?: boolean;
      avatarIcon?: string | null;
      favoriteCategories?: string[] | null;
      prayerLocation?: { lat: number; lng: number; city: string } | null;
    }
  ) => Promise<{ error: string | null }>;
  deleteProfile: (id: string) => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
  setProfilePin: (id: string, pin: string | null) => Promise<{ error: string | null }>;
  verifyProfilePin: (id: string, attempt: string) => Promise<{ ok: boolean; error: string | null }>;
};

const ViewerProfileContext = createContext<ViewerProfileContextValue | null>(null);

export function ViewerProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ViewerProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<ViewerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!user) {
      setProfiles([]);
      setActiveProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("viewer_profiles")
      .select(PROFILE_COLUMNS)
      .eq("account_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      setError(error.message);
      setProfiles([]);
      setLoading(false);
      return;
    }

    setError(null);
    setProfiles((data ?? []) as ViewerProfile[]);

    const storedId = localStorage.getItem(STORAGE_KEY);
    const stored = storedId ? (data ?? []).find((p) => p.id === storedId) : null;
    setActiveProfile((stored as ViewerProfile) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const selectProfile = useCallback((profile: ViewerProfile) => {
    localStorage.setItem(STORAGE_KEY, profile.id);
    setActiveProfile(profile);
  }, []);

  const clearActiveProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setActiveProfile(null);
  }, []);

  const createProfile = useCallback(
    async (name: string, color: string, isKid: boolean, avatarIcon?: string | null) => {
      if (!user) return { error: "Not authenticated", profile: null };
      const { data, error } = await supabase
        .from("viewer_profiles")
        .insert({
          account_id: user.id,
          name,
          avatar_color: color,
          avatar_icon: avatarIcon ?? null,
          is_kid: isKid,
        })
        .select(PROFILE_COLUMNS)
        .maybeSingle();

      if (error) {
        return { error: error.message, profile: null };
      }

      if (data) {
        setProfiles((prev) => [...prev, data as ViewerProfile]);
      }
      return { error: null, profile: (data as ViewerProfile) ?? null };
    },
    [user]
  );

  const updateProfile = useCallback(
    async (
      id: string,
      updates: {
        name?: string;
        color?: string;
        isKid?: boolean;
        avatarIcon?: string | null;
        favoriteCategories?: string[] | null;
        prayerLocation?: { lat: number; lng: number; city: string } | null;
      }
    ) => {
      const patch: Record<string, unknown> = {};
      if (updates.name !== undefined) patch.name = updates.name;
      if (updates.color !== undefined) patch.avatar_color = updates.color;
      if (updates.isKid !== undefined) patch.is_kid = updates.isKid;
      if (updates.avatarIcon !== undefined) patch.avatar_icon = updates.avatarIcon;
      if (updates.favoriteCategories !== undefined) patch.favorite_categories = updates.favoriteCategories;
      if (updates.prayerLocation !== undefined) patch.prayer_location = updates.prayerLocation;

      const { data, error } = await supabase
        .from("viewer_profiles")
        .update(patch)
        .eq("id", id)
        .select(PROFILE_COLUMNS)
        .maybeSingle();

      if (error) return { error: error.message };

      if (data) {
        setProfiles((prev) => prev.map((p) => (p.id === id ? (data as ViewerProfile) : p)));
        setActiveProfile((prev) => (prev?.id === id ? (data as ViewerProfile) : prev));
      }
      return { error: null };
    },
    []
  );

  const deleteProfile = useCallback(async (id: string) => {
    const { error } = await supabase.from("viewer_profiles").delete().eq("id", id);
    if (error) return { error: error.message };

    setProfiles((prev) => prev.filter((p) => p.id !== id));
    setActiveProfile((prev) => {
      if (prev?.id === id) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return prev;
    });
    return { error: null };
  }, []);

  const refresh = useCallback(async () => {
    await fetchProfiles();
  }, [fetchProfiles]);

  const setProfilePin = useCallback(
    async (id: string, pin: string | null) => {
      const { error } = await supabase.rpc("set_profile_pin", {
        profile_id: id,
        new_pin: pin,
      });
      if (error) return { error: error.message };
      await fetchProfiles();
      return { error: null };
    },
    [fetchProfiles]
  );

  const verifyProfilePin = useCallback(async (id: string, attempt: string) => {
    const { data, error } = await supabase.rpc("verify_profile_pin", {
      profile_id: id,
      attempt,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: Boolean(data), error: null };
  }, []);

  return (
    <ViewerProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        loading,
        error,
        selectProfile,
        clearActiveProfile,
        createProfile,
        updateProfile,
        deleteProfile,
        refresh,
        setProfilePin,
        verifyProfilePin,
      }}
    >
      {children}
    </ViewerProfileContext.Provider>
  );
}

export function useViewerProfile() {
  const ctx = useContext(ViewerProfileContext);
  if (!ctx) throw new Error("useViewerProfile must be used within ViewerProfileProvider");
  return ctx;
}

export { AVATAR_COLORS };