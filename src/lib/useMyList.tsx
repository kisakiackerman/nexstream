import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import { catalog, type ContentItem } from "@/data/catalog";

type FavoriteRow = {
  id: string;
  content_id: string;
  viewer_profile_id: string;
  created_at: string;
};

type MyListContextValue = {
  items: ContentItem[];
  inList: (contentId: string) => boolean;
  toggle: (item: ContentItem) => Promise<void>;
  remove: (contentId: string) => Promise<void>;
  loading: boolean;
};

const MyListContext = createContext<MyListContextValue | null>(null);

export function MyListProvider({ children }: { children: ReactNode }) {
  const { activeProfile } = useViewerProfile();
  const [rows, setRows] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async (profileId: string | null) => {
    if (!profileId) {
      setRows([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("viewer_profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load favorites:", error.message);
      setRows([]);
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems(activeProfile?.id ?? null);
  }, [activeProfile?.id, fetchItems]);

  const items: ContentItem[] = rows
    .map((r) => catalog.find((c) => c.id === r.content_id))
    .filter((c): c is ContentItem => c !== undefined);

  const inList = useCallback(
    (contentId: string) => rows.some((r) => r.content_id === contentId),
    [rows]
  );

  const toggle = useCallback(
    async (item: ContentItem) => {
      if (!activeProfile) return;
      const exists = rows.some((r) => r.content_id === item.id);
      if (exists) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("viewer_profile_id", activeProfile.id)
          .eq("content_id", item.id);
        if (error) {
          console.error("Failed to remove favorite:", error.message);
          return;
        }
        setRows((prev) => prev.filter((r) => r.content_id !== item.id));
      } else {
        const { data, error } = await supabase
          .from("favorites")
          .insert({
            viewer_profile_id: activeProfile.id,
            content_id: item.id,
          })
          .select()
          .maybeSingle();
        if (error) {
          console.error("Failed to add favorite:", error.message);
          return;
        }
        if (data) {
          setRows((prev) => [data as FavoriteRow, ...prev]);
        }
      }
    },
    [activeProfile, rows]
  );

  const remove = useCallback(
    async (contentId: string) => {
      if (!activeProfile) return;
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("viewer_profile_id", activeProfile.id)
        .eq("content_id", contentId);
      if (error) {
        console.error("Failed to remove favorite:", error.message);
        return;
      }
      setRows((prev) => prev.filter((r) => r.content_id !== contentId));
    },
    [activeProfile]
  );

  return (
    <MyListContext.Provider value={{ items, inList, toggle, remove, loading }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const ctx = useContext(MyListContext);
  if (!ctx) throw new Error("useMyList must be used within MyListProvider");
  return ctx;
}
