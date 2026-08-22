import { useEffect, useState } from "react";
import { X, Play, Clock, Trash2 } from "lucide-react";
import { supabase, type WatchHistoryItem } from "@/lib/supabase";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import { catalog } from "@/data/catalog";

type WatchHistoryModalProps = {
  onClose: () => void;
  onPlay: (contentId: string) => void;
};

export default function WatchHistoryModal({ onClose, onPlay }: WatchHistoryModalProps) {
  const { activeProfile } = useViewerProfile();
  const [items, setItems] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  useEffect(() => {
    if (!activeProfile) return;
    (async () => {
      const { data } = await supabase
        .from("watch_history")
        .select("*")
        .eq("viewer_profile_id", activeProfile.id)
        .order("updated_at", { ascending: false });
      setItems(data ?? []);
      setLoading(false);
    })();
  }, [activeProfile]);

  const fmtTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
  };

  const handleDelete = async (contentId: string) => {
    if (!activeProfile) return;
    await supabase
      .from("watch_history")
      .delete()
      .eq("viewer_profile_id", activeProfile.id)
      .eq("content_id", contentId);
    setItems((prev) => prev.filter((i) => i.content_id !== contentId));
  };

  const handlePlay = (contentId: string) => {
    onClose();
    onPlay(contentId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-3xl max-h-[90vh] bg-zinc-900 sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl mt-16 sm:mt-0">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800 flex-shrink-0">
          <Clock size={20} className="text-emerald-400" />
          <h2 className="text-white font-bold text-lg flex-1">Historique de visionnage</h2>
          <span className="text-zinc-500 text-sm">{items.length} vidéo{items.length > 1 ? "s" : ""}</span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-zinc-500 text-sm">Chargement...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock size={40} className="text-zinc-700 mb-4" />
              <p className="text-zinc-400 text-base font-medium mb-2">Aucun historique</p>
              <p className="text-zinc-600 text-sm max-w-xs">
                Les vidéos que vous regardez apparaîtront ici pour reprendre la lecture.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const content = catalog.find((c) => c.id === item.content_id);
                if (!content) return null;
                return (
                  <div
                    key={item.id}
                    className="group flex gap-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => handlePlay(item.content_id)}
                      className="relative flex-shrink-0 w-40 aspect-video overflow-hidden"
                    >
                      <img
                        src={content.image}
                        alt={content.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (!img.src.includes("hqdefault")) {
                            img.src = `https://i.ytimg.com/vi/${content.youtubeId}/hqdefault.jpg`;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={24} fill="white" className="text-white ml-0.5" />
                      </div>
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-600"
                            style={{ width: `${Math.min(100, (item.progress_seconds / 100) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </button>
                    <div className="flex flex-col flex-1 py-2 pr-2 min-w-0">
                      <button onClick={() => handlePlay(item.content_id)} className="text-left">
                        <p className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-1.5 hover:text-emerald-300 transition-colors">
                          {content.title}
                        </p>
                      </button>
                      <p className="text-zinc-500 text-xs mb-1">
                        {content.channel} · {fmtTime(item.progress_seconds)}
                      </p>
                      <button
                        onClick={() => handleDelete(item.content_id)}
                        className="mt-auto flex items-center gap-1 text-zinc-500 hover:text-red-400 text-xs transition-colors pt-2"
                      >
                        <Trash2 size={12} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
