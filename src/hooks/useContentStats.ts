import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useViewerProfile } from "@/hooks/useViewerProfile";

export function useContentStats(contentId: string) {
  const { activeProfile } = useViewerProfile();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [likeCountsRes, viewCountsRes] = await Promise.all([
      supabase.from("content_like_counts").select("*").eq("content_id", contentId).maybeSingle(),
      supabase.from("content_view_counts").select("*").eq("content_id", contentId).maybeSingle(),
    ]);
    setLikes(likeCountsRes.data?.likes ?? 0);
    setDislikes(likeCountsRes.data?.dislikes ?? 0);
    setViews(viewCountsRes.data?.views ?? 0);
    if (activeProfile) {
      const { data } = await supabase
        .from("content_likes")
        .select("is_like")
        .eq("viewer_profile_id", activeProfile.id)
        .eq("content_id", contentId)
        .maybeSingle();
      setUserVote(data?.is_like ?? null);
    } else {
      setUserVote(null);
    }
    setLoading(false);
  }, [contentId, activeProfile]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const vote = useCallback(
    async (isLike: boolean) => {
      if (!activeProfile) return;
      if (userVote === isLike) {
        await supabase
          .from("content_likes")
          .delete()
          .eq("viewer_profile_id", activeProfile.id)
          .eq("content_id", contentId);
      } else {
        await supabase.from("content_likes").upsert(
          {
            viewer_profile_id: activeProfile.id,
            content_id: contentId,
            is_like: isLike,
          },
          { onConflict: "viewer_profile_id,content_id" }
        );
      }
      refresh();
    },
    [activeProfile, contentId, userVote, refresh]
  );

  const logView = useCallback(async () => {
    if (!activeProfile) return;
    await supabase.from("content_views").insert({
      viewer_profile_id: activeProfile.id,
      content_id: contentId,
    });
    setViews((v) => v + 1);
  }, [activeProfile, contentId]);

  return { likes, dislikes, views, userVote, loading, vote, logView };
}