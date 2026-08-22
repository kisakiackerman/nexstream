import { useState, useMemo, useCallback } from "react";
import { X, Search, Sparkles, Play, SlidersHorizontal, ChevronDown, Calendar, Mic } from "lucide-react";
import { catalog, type ContentItem, type Category, type Channel } from "@/data/catalog";
import { smartSearch } from "@/lib/smartSearch";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";

type CatalogPageProps = {
  onClose: () => void;
  onPlay: (id: string) => void;
  onInfo: (id: string) => void;
};

const allCategories: Category[] = [
  "Prophètes",
  "Compagnons",
  "Anges & Djinns",
  "Eschatologie",
  "Miracles du Coran",
  "Héros & Personnages",
  "Histoire & Mystère",
];

const allChannels: Channel[] = ["NARRO", "Yacine", "Towards Eternity", "Croyant Rationnel"];

type SortMode = "score" | "recent" | "title";

export default function CatalogPage({ onClose, onPlay, onInfo }: CatalogPageProps) {
  const [query, setQuery] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minYear, setMinYear] = useState<number>(2022);
  const [maxYear, setMaxYear] = useState<number>(2026);

  const channelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ch of allChannels) {
      counts[ch] = catalog.filter((c) => c.channel === ch).length;
    }
    return counts;
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of allCategories) {
      counts[cat] = catalog.filter((c) => c.categories.includes(cat)).length;
    }
    return counts;
  }, []);

  const toggleChannel = (ch: Channel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered: ContentItem[] = useMemo(() => {
    let result: ContentItem[] = catalog;

    // Recherche intelligente
    if (query.trim().length > 1) {
      result = smartSearch(query, 500);
    }

    if (selectedChannels.length > 0) {
      result = result.filter((c) => selectedChannels.includes(c.channel));
    }

    if (selectedCategories.length > 0) {
      result = result.filter((c) =>
        c.categories.some((cat) => selectedCategories.includes(cat))
      );
    }

    if (minYear > 2022 || maxYear < 2026) {
      result = result.filter((c) => c.year >= minYear && c.year <= maxYear);
    }

    const sorted = [...result].sort((a, b) => {
      if (sortMode === "score") return b.score - a.score;
      if (sortMode === "title") return a.title.localeCompare(b.title, "fr");
      return b.year - a.year;
    });

    return sorted;
  }, [query, selectedChannels, selectedCategories, sortMode, minYear, maxYear]);

  const hasActiveFilters = selectedChannels.length > 0 || selectedCategories.length > 0 || minYear > 2022 || maxYear < 2026;

  const clearFilters = () => {
    setSelectedChannels([]);
    setSelectedCategories([]);
    setMinYear(2022);
    setMaxYear(2026);
  };

  const handleVoiceResult = useCallback((transcript: string) => {
    setQuery(transcript);
  }, []);

  const { supported: voiceSupported, listening, start: startVoice } = useVoiceSearch(handleVoiceResult);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors flex-shrink-0"
            >
              <X size={17} />
            </button>
            <h1 className="text-white text-2xl font-black flex-1">
              Tout le catalogue
              <span className="text-zinc-500 font-medium text-base ml-2">
                {catalog.length} vidéos
              </span>
            </h1>
          </div>

          {/* Search bar */}
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden mb-3">
            <Sparkles size={16} className="ml-4 text-emerald-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Recherche intelligente dans tout le catalogue..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-white text-sm px-3 py-3 flex-1 outline-none placeholder-zinc-500"
            />
            {voiceSupported && (
              <button
                onClick={startVoice}
                className={`px-2 flex-shrink-0 transition-colors ${
                  listening
                    ? "text-red-400 animate-pulse"
                    : "text-zinc-400 hover:text-emerald-400"
                }`}
                title={listening ? "Écoute en cours..." : "Recherche vocale"}
              >
                <Mic size={16} />
              </button>
            )}
            {query && (
              <button
                onClick={() => setQuery("")}
                className="pr-4 text-zinc-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter toggle + sort */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                hasActiveFilters
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filtres
              {hasActiveFilters && (
                <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-xs">
                  {selectedChannels.length + selectedCategories.length}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div className="flex items-center bg-zinc-800 rounded-lg overflow-hidden text-sm">
              <button
                onClick={() => setSortMode("score")}
                className={`px-4 py-2 font-medium transition-colors ${
                  sortMode === "score" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Mieux notées
              </button>
              <button
                onClick={() => setSortMode("recent")}
                className={`px-4 py-2 font-medium transition-colors ${
                  sortMode === "recent" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Récentes
              </button>
              <button
                onClick={() => setSortMode("title")}
                className={`px-4 py-2 font-medium transition-colors ${
                  sortMode === "title" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Titre A-Z
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-zinc-500 hover:text-white text-sm transition-colors"
              >
                Réinitialiser
              </button>
            )}

            <span className="text-zinc-500 text-sm ml-auto">
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Filters panel */}
          {filtersOpen && (
            <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-2">
                  Créateurs
                </p>
                <div className="flex flex-wrap gap-2">
                  {allChannels.map((ch) => (
                    <button
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedChannels.includes(ch)
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {ch} ({channelCounts[ch]})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-2">
                  Catégories
                </p>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategories.includes(cat)
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {cat} ({categoryCounts[cat]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Year range filter */}
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-2">
                  Année
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Calendar size={14} className="text-zinc-500" />
                  <div className="flex items-center gap-2">
                    <select
                      value={minYear}
                      onChange={(e) => setMinYear(Math.min(Number(e.target.value), maxYear))}
                      className="bg-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-1.5 border border-zinc-700 outline-none focus:border-emerald-500"
                    >
                      {[2022, 2023, 2024, 2025, 2026].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <span className="text-zinc-500 text-sm">à</span>
                    <select
                      value={maxYear}
                      onChange={(e) => setMaxYear(Math.max(Number(e.target.value), minYear))}
                      className="bg-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-1.5 border border-zinc-700 outline-none focus:border-emerald-500"
                    >
                      {[2022, 2023, 2024, 2025, 2026].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vertical list */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-base">Aucun résultat trouvé</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onInfo(item.id)}
                className="group flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-800 rounded-xl overflow-hidden transition-colors p-2 text-left"
              >
                <div className="relative flex-shrink-0 w-40 sm:w-48 aspect-video rounded-lg overflow-hidden">
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
                      size={22}
                      fill="white"
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlay(item.id);
                      }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1 py-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="bg-zinc-800 text-zinc-400 text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                      {item.channel}
                    </span>
                    <span className="text-emerald-400 text-xs font-semibold">
                      {item.score}% Match
                    </span>
                    <span className="text-zinc-600 text-xs">{item.year}</span>
                  </div>
                  <p className="text-white text-sm sm:text-base font-semibold leading-tight line-clamp-2 mb-1">
                    {item.title}
                  </p>
                  <p className="text-zinc-500 text-xs line-clamp-1">
                    {item.categories.join(" · ")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}