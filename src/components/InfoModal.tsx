import { useEffect } from "react";
import { X, Play, Plus, ThumbsUp, Share2, Star, Check } from "lucide-react";
import { ContentItem, catalog } from "@/data/catalog";
import { useMyList } from "@/lib/useMyList";
import { useContentStats } from "@/hooks/useContentStats";
import { useContentRatings } from "@/hooks/useContentRatings";
import StarRating from "@/components/StarRating";

type InfoModalProps = {
  item: ContentItem;
  onClose: () => void;
  onPlay: (id: string) => void;
};

export default function InfoModal({ item, onClose, onPlay }: InfoModalProps) {
  const { inList, toggle } = useMyList();
  const saved = inList(item.id);
  const { likes, dislikes, views, userVote, vote, logView } = useContentStats(item.id);
  const { averageRating, ratingCount, userRating, rate } = useContentRatings(item.id);
  const related = catalog
    .filter((c) => c.id !== item.id && c.categories.some((g) => item.categories.includes(g)))
    .slice(0, 6);

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full sm:max-w-2xl max-h-[90vh] bg-zinc-900 sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Hero */}
        <div className="relative h-72 flex-shrink-0">
          <img
            src={item.heroImage ?? item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (!img.src.includes("hqdefault")) {
                img.src = `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
          >
            <X size={17} />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                NexStream Original
              </span>
            </div>
            <h2 className="text-white text-3xl font-black leading-tight">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {/* Actions */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                onClose();
                onPlay(item.id);
              }}
              className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors text-sm"
            >
              <Play size={17} fill="currentColor" />
              Play
            </button>
            <button
              onClick={() => toggle(item)}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                saved
                  ? "border-emerald-500 bg-emerald-900/30 text-emerald-400"
                  : "border-zinc-600 hover:border-white text-white hover:bg-zinc-700"
              }`}
            >
              {saved ? <Check size={18} /> : <Plus size={18} />}
            </button>
           <button
  onClick={() => vote(true)}
  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
    userVote === true
      ? "border-emerald-500 bg-emerald-900/30 text-emerald-400"
      : "border-zinc-600 hover:border-white text-white hover:bg-zinc-700"
  }`}
>
  <ThumbsUp size={16} fill={userVote === true ? "currentColor" : "none"} />
</button>
{likes > 0 && <span className="text-zinc-500 text-xs -ml-1">{likes}</span>}
            <button className="w-10 h-10 rounded-full border-2 border-zinc-600 hover:border-white flex items-center justify-center text-white hover:bg-zinc-700 transition-all ml-auto">
              <Share2 size={16} />
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
              <Star size={14} fill="currentColor" />
              {item.score}% Match
            </span>
            <span className="text-zinc-400 text-sm border border-zinc-700 px-2 py-0.5 rounded">
              {item.rating}
            </span>
            <span className="text-zinc-400 text-sm">{item.year}</span>
            <span className="text-zinc-400 text-sm">{item.duration}</span> {views > 0 && (
  <span className="text-zinc-400 text-sm">{views} vue{views > 1 ? "s" : ""}</span>
)}
          </div>

          {/* A4 — Notation par étoiles */}
          <div className="mb-6">
            <StarRating
              averageRating={averageRating}
              ratingCount={ratingCount}
              userRating={userRating}
              onRate={rate}
              size={18}
            />
          </div>

          {/* Description */}
          <p className="text-zinc-300 text-sm leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {item.categories.map((g) => (
              <span
                key={g}
                className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-full border border-zinc-700"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Related content */}
          {related.length > 0 && (
            <>
              <h3 className="text-white font-bold text-base mb-4">
                More Like This
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {related.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onClose();
                      onPlay(r.id);
                    }}
                    className="group relative rounded-lg overflow-hidden aspect-video bg-zinc-800"
                  >
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (!img.src.includes("hqdefault")) {
                          img.src = `https://i.ytimg.com/vi/${r.youtubeId}/hqdefault.jpg`;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-bold leading-tight">
                        {r.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}