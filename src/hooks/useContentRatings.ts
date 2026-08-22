import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useViewerProfile } from "@/hooks/useViewerProfile";

export function useContentRatings(contentId: string) {
  const { activeProfile } = useViewerProfile();
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAverage = useCallback(async () => {
    const { data, error } = await supabase
      .from("content_rating_averages")
      .select("average_rating, rating_count")
      .eq("content_id", contentId)
      .maybeSingle();

    if (!error && data) {
      setAverageRating(data.average_rating);
      setRatingCount(data.rating_count);
    } else {
      setAverageRating(null);
      setRatingCount(0);
    }
  }, [contentId]);

  const fetchUserRating = useCallback(async () => {
    if (!activeProfile) {
      setUserRating(null);
      return;
    }
    const { data, error } = await supabase
      .from("content_ratings")
      .select("rating")
      .eq("content_id", contentId)
      .eq("viewer_profile_id", activeProfile.id)
      .maybeSingle();

    if (!error && data) {
      setUserRating(data.rating);
    } else {
      setUserRating(null);
    }
  }, [contentId, activeProfile]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchAverage(), fetchUserRating()]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchAverage, fetchUserRating]);

  const rate = useCallback(
    async (rating: number) => {
      if (!activeProfile) return { error: "Aucun profil actif" };

      // Mise à jour optimiste
      const previous = userRating;
      setUserRating(rating);

      const { error } = await supabase.from("content_ratings").upsert(
        {
          viewer_profile_id: activeProfile.id,
          content_id: contentId,
          rating,
        },
        { onConflict: "viewer_profile_id,content_id" }
      );

      if (error) {
        setUserRating(previous);
        return { error: error.message };
      }

      await fetchAverage();
      return { error: null };
    },
    [activeProfile, contentId, userRating, fetchAverage]
  );

  return { averageRating, ratingCount, userRating, loading, rate };
}