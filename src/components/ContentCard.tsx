import { useEffect, useRef, useState } from "react";
import { Play, Plus, ThumbsUp, ChevronDown, Check } from "lucide-react";
import { ContentItem } from "@/data/catalog";
import { useMyList } from "@/lib/useMyList";

type ContentCardProps = {
  item: ContentItem;
  onPlay: (id: string) => void;
  onInfo: (id: string) => void;
};

const HOVER_PREVIEW_DELAY_MS = 1000;

export default function ContentCard({ item, onPlay, onInfo }: ContentCardProps) {
  const [liked, setLiked] = useState(false);
  const { inList, toggle } = useMyList();
  const saved = inList(item.id);

  // A3 — Bande-annonce automatique au survol
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearHoverTimeout() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }

  function handleThumbnailMouseEnter() {
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, HOVER_PREVIEW_DELAY_MS);
  }

  function handleThumbnailMouseLeave() {
    clearHoverTimeout();
    setShowPreview(false);
  }

  // Nettoyage si le composant est démonté pendant que le timer tourne
  useEffect(() => {
    return () => clearHoverTimeout();
  }, []);

  const previewSrc = `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${item.youtubeId}&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1`;

  return (
    <div className="group relative flex-shrink-0 w-48 lg:w-56 cursor-pointer select-none">
      {/* Card thumbnail */}
      <div
        onMouseEnter={handleThumbnailMouseEnter}
        onMouseLeave={handleThumbnailMouseLeave}
        className="relative overflow-hidden rounded-lg aspect-video bg-zinc-800 shadow-lg group-hover:shadow-2xl group-hover:scale-105 group-hover:z-10 transition-all duration-300 ease-out"
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (!img.src.includes("hqdefault")) {
              img.src = `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
            }
          }}
        />

        {/* Mini-lecteur YouTube — monté seulement après le délai de hover,
            démonté proprement au mouseleave (retire l'iframe du DOM) */}
        {showPreview && (
          <iframe
            key={item.youtubeId}
            src={previewSrc}
            title={`Aperçu — ${item.title}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ border: 0 }}
            allow="autoplay; encrypted-media"
            // Empêche l'iframe d'intercepter les clics/hover, gérés par le parent
            tabIndex={-1}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {item.isNew && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded tracking-wide">
            NEW
          </div>
        )}
        {item.isTrending && !item.isNew && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded tracking-wide">
            HOT
          </div>
        )}

        {/* Play button overlay */}
        <button
          onClick={() => onPlay(item.id)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 hover:bg-white/30 transition-colors">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </div>
        </button>
      </div>

      {/* Expanded hover card */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 translate-y-1 group-hover:translate-y-2 z-20 mt-1">
        <div className="p-4">
          {/* Action row */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => onPlay(item.id)}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-zinc-200 active:scale-90 transition-all"
            >
              <Play size={16} fill="black" className="text-black ml-0.5" />
            </button>
            <button
              onClick={() => toggle(item)}
              className="w-9 h-9 rounded-full border-2 border-zinc-500 hover:border-white flex items-center justify-center text-white hover:bg-zinc-700 active:scale-90 transition-all"
            >
              {saved ? <Check size={16} /> : <Plus size={16} />}
            </button>
            <button
              onClick={() => setLiked((v) => !v)}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center active:scale-90 transition-all ${
                liked
                  ? "border-emerald-500 text-emerald-400 bg-emerald-900/30"
                  : "border-zinc-500 hover:border-white text-white hover:bg-zinc-700"
              }`}
            >
              <ThumbsUp size={15} />
            </button>
            <button
              onClick={() => onInfo(item.id)}
              className="ml-auto w-9 h-9 rounded-full border-2 border-zinc-500 hover:border-white flex items-center justify-center text-white hover:bg-zinc-700 active:scale-90 transition-all"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <h3 className="text-white font-bold text-sm leading-tight mb-1.5">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-emerald-400 font-semibold text-xs">
              {item.score}% Match
            </span>
            <span className="text-zinc-500 text-xs border border-zinc-700 px-1.5 rounded">
              {item.rating}
            </span>
            <span className="text-zinc-400 text-xs">{item.duration}</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {item.categories.map((g) => (
              <span key={g} className="text-zinc-400 text-xs">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}