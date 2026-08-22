import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import { catalog, type ContentItem } from "@/data/catalog";
import ContentRow from "@/components/ContentRow";

type RecommendedRowProps = {
  onPlay: (id: string) => void;
  onInfo: (id: string) => void;
};

const MIN_PROGRESS_RATIO = 0.6;

export default function RecommendedRow({ onPlay, onInfo }: RecommendedRowProps) {
  const { activeProfile } = useViewerProfile();
  const [sourceItem, setSourceItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSource() {
      if (!activeProfile) {
        setSourceItem(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      // On récupère l'historique récent du profil, du plus récent au plus ancien,
      // puis on garde en mémoire le premier qui dépasse 60% de progression.
      const { data, error } = await supabase
        .from("watch_history")
        .select("content_id, progress_seconds, duration_seconds, updated_at")
        .eq("viewer_profile_id", activeProfile.id)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (cancelled) return;

      if (error || !data) {
        setSourceItem(null);
        setLoading(false);
        return;
      }

      const match = data.find(
        (h) =>
          h.duration_seconds > 0 &&
          h.progress_seconds / h.duration_seconds > MIN_PROGRESS_RATIO
      );

      if (!match) {
        setSourceItem(null);
        setLoading(false);
        return;
      }

      const found = catalog.find((c) => c.id === match.content_id) ?? null;
      setSourceItem(found);
      setLoading(false);
    }

    loadSource();
    return () => {
      cancelled = true;
    };
  }, [activeProfile]);

  if (loading || !sourceItem) return null;

  const similar = catalog
    .filter((c) => c.id !== sourceItem.id)
    .filter(
      (c) =>
        c.channel === sourceItem.channel ||
        c.categories.some((cat) => sourceItem.categories.includes(cat))
    )
    // Priorise les vidéos qui partagent le plus de catégories, puis la même chaîne
    .sort((a, b) => {
      const aShared = a.categories.filter((cat) =>
        sourceItem.categories.includes(cat)
      ).length;
      const bShared = b.categories.filter((cat) =>
        sourceItem.categories.includes(cat)
      ).length;
      if (aShared !== bShared) return bShared - aShared;
      const aSameChannel = a.channel === sourceItem.channel ? 1 : 0;
      const bSameChannel = b.channel === sourceItem.channel ? 1 : 0;
      return bSameChannel - aSameChannel;
    })
    .slice(0, 15);

  if (similar.length === 0) return null;

  return (
    <ContentRow
      label={`Parce que vous avez regardé « ${sourceItem.title} »`}
      items={similar}
      onPlay={onPlay}
      onInfo={onInfo}
    />
  );
}