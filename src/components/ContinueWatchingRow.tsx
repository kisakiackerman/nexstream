import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import { catalog, type ContentItem } from "@/data/catalog";

type ContinueWatchingRowProps = {
  onPlay: (id: string) => void;
};

type HistoryEntry = {
  content_id: string;
  progress_seconds: number;
};

export default function ContinueWatchingRow({ onPlay }: ContinueWatchingRowProps) {
  const { activeProfile } = useViewerProfile();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (!activeProfile) return;
    supabase
      .from("watch_history")
      .select("content_id, progress_seconds")
      .eq("viewer_profile_id", activeProfile.id)
      .gt("progress_seconds", 10)
      .order("updated_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setEntries(data as HistoryEntry[]);
      });
  }, [activeProfile]);

  const items: (ContentItem & { progress: number })[] = entries
    .map((e) => {
      const content = catalog.find((c) => c.id === e.content_id);
      return content ? { ...content, progress: e.progress_seconds } : null;
    })
    .filter((c): c is ContentItem & { progress: number } => c !== null);

  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-white text-lg sm:text-xl font-bold px-6 lg:px-10 mb-3">
        Continuer à regarder
      </h2>
      <div className="flex gap-3 overflow-x-auto px-6 lg:px-10 pb-2 scrollbar-hide">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onPlay(item.id)}
            className="group relative flex-shrink-0 w-64 rounded-lg overflow-hidden bg-zinc-800"
          >
            <div className="relative aspect-video">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.includes("hqdefault")) {
                    img.src = `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Play
                  size={28}
                  fill="white"
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
                <div
                  className="h-full bg-red-600"
                  style={{
                    width: `${Math.min(100, (item.progress / 1200) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-white text-xs font-semibold text-left px-2 py-2 line-clamp-2">
              {item.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}