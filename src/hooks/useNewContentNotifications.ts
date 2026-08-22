import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import { catalog } from "@/data/catalog";

export function useNewContentNotifications() {
  const { activeProfile } = useViewerProfile();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchReads = useCallback(async () => {
    if (!activeProfile) {
      setReadIds(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("user_notification_reads")
      .select("content_id")
      .eq("viewer_profile_id", activeProfile.id);

    if (!error && data) {
      setReadIds(new Set(data.map((r) => r.content_id as string)));
    }
    setLoading(false);
  }, [activeProfile]);

  useEffect(() => {
    fetchReads();
  }, [fetchReads]);

  // Marque une vidéo comme vue — mise à jour optimiste + upsert Supabase
  const markRead = useCallback(
    async (contentId: string) => {
      if (!activeProfile) return;

      setReadIds((prev) => {
        if (prev.has(contentId)) return prev;
        const next = new Set(prev);
        next.add(contentId);
        return next;
      });

      await supabase.from("user_notification_reads").upsert(
        {
          viewer_profile_id: activeProfile.id,
          content_id: contentId,
        },
        { onConflict: "viewer_profile_id,content_id" }
      );
    },
    [activeProfile]
  );

  const newContentIds = catalog.filter((c) => c.isNew).map((c) => c.id);
  const unreadCount = newContentIds.filter((id) => !readIds.has(id)).length;

  return { readIds, markRead, loading, unreadCount };
}