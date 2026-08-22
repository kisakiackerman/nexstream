import { useState, useEffect } from "react";
import { Play, Info, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { catalog, ContentItem } from "@/data/catalog";

type HeroProps = {
  onPlay: (id: string) => void;
  onInfo: (id: string) => void;
};

const featured = catalog.filter((c) => c.featured || c.score >= 90).slice(0, 5);

export default function Hero({ onPlay, onInfo }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const item: ContentItem | undefined = featured[current];

  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => changeTo((current + 1) % featured.length), 8000);
    return () => clearInterval(t);
  }, [current]);

  function changeTo(idx: number) {
    if (idx === current || featured.length === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 400);
  }

  if (!item) {
    return (
      <div className="relative w-full h-[85vh] min-h-[560px] overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex items-center justify-center">
        <div className="text-center px-8 max-w-2xl">
          <div className="flex items-center justify-center gap-1 mb-6">
            <div className="w-2 h-8 bg-red-500 rounded-sm" />
            <div className="w-2 h-6 bg-red-400 rounded-sm" />
            <div className="w-2 h-10 bg-red-600 rounded-sm" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight">
            Your library is empty
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            There are no videos in your catalog right now. Add content to see it
            featured here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[85vh] min-h-[560px] overflow-hidden bg-black">
      {/* Background image */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={item.heroImage ?? item.image}
          alt={item.title}
          className="w-full h-full object-cover scale-105"
          style={{ objectPosition: "center 30%" }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (!img.src.includes("hqdefault")) {
              img.src = `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
            }
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 h-full flex flex-col justify-end pb-24 px-8 lg:px-16 max-w-3xl transition-all duration-700 ${
          transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Badges */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded tracking-wider uppercase">
            NexStream Original
          </span>
          <span className="text-zinc-300 text-sm border border-zinc-600 px-2 py-0.5 rounded">
            {item.rating}
          </span>
          <span className="text-zinc-400 text-sm">{item.year}</span>
          <span className="text-zinc-400 text-sm">{item.duration}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl lg:text-7xl font-black text-white leading-none tracking-tight mb-4 drop-shadow-2xl">
          {item.title}
        </h1>

        {/* Score + genres */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-emerald-400 font-bold text-sm">
            {item.score}% Match
          </span>
          {item.categories.map((g) => (
            <span key={g} className="text-zinc-400 text-sm">
              {g}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-zinc-300 text-base leading-relaxed max-w-xl mb-8 line-clamp-3">
          {item.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPlay(item.id)}
            className="flex items-center gap-2.5 bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-zinc-200 active:scale-95 transition-all duration-150 text-base"
          >
            <Play size={20} fill="currentColor" />
            Play
          </button>
          <button
            onClick={() => onInfo(item.id)}
            className="flex items-center gap-2.5 bg-zinc-700/70 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-lg hover:bg-zinc-600/80 active:scale-95 transition-all duration-150 text-base border border-zinc-600/50"
          >
            <Info size={20} />
            More Info
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="ml-auto w-10 h-10 rounded-full border border-zinc-500 flex items-center justify-center text-white hover:border-white transition-colors"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Slide indicators */}
      {featured.length > 1 && (
        <div className="absolute bottom-6 right-10 z-10 flex items-center gap-2">
          <button
            onClick={() => changeTo((current - 1 + featured.length) % featured.length)}
            className="w-8 h-8 rounded-full border border-zinc-600 hover:border-white flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => changeTo(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-white" : "w-3 bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
          <button
            onClick={() => changeTo((current + 1) % featured.length)}
            className="w-8 h-8 rounded-full border border-zinc-600 hover:border-white flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
