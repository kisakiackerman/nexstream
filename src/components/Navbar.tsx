import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Bell, X, Play, Sparkles, Clock, Mic } from "lucide-react";
import { catalog, type ContentItem } from "@/data/catalog";
import { smartSearch, searchSuggestions } from "@/lib/smartSearch";
import ProfileMenu from "@/components/ProfileMenu";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { useNewContentNotifications } from "@/hooks/useNewContentNotifications";

type NavbarProps = {
  onSelectContent: (id: string) => void;
  onOpenMyList: () => void;
  onOpenWatchHistory: () => void;
  onOpenAccountSettings: () => void;
  onSwitchProfile: () => void;
  onOpenCatalog: () => void;
  onOpenTasbih: () => void;
  onOpenDuas: () => void;
  onOpenQibla: () => void;
  onOpenZakat: () => void;
};

export default function Navbar({
  onSelectContent,
  onOpenMyList,
  onOpenWatchHistory,
  onOpenAccountSettings,
  onSwitchProfile,
  onOpenCatalog,
  onOpenTasbih,
  onOpenDuas,
  onOpenQibla,
  onOpenZakat,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  // B5 — Notifications de nouveaux contenus non vus par le profil actif
  const { readIds, markRead, unreadCount } = useNewContentNotifications();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-search-area]")) setSearchOpen(false);
      if (!target.closest("[data-notif-area]")) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchResults = useMemo(
    () => (searchQuery.trim().length > 1 ? smartSearch(searchQuery, 8) : []),
    [searchQuery]
  );

  // Latest videos: sorted by year descending, then isNew first
  const latestVideos = useMemo(
    () =>
      [...catalog]
        .sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          if (b.isNew && !a.isNew) return 1;
          if (a.isNew && !b.isNew) return -1;
          return 0;
        })
        .slice(0, 8),
    []
  );

  const handleSelect = (id: string) => {
    const item = catalog.find((c) => c.id === id);
    // B5 — Retire le marqueur "non lu" dès qu'on ouvre une vidéo isNew
    if (item?.isNew && !readIds.has(id)) {
      markRead(id);
    }
    onSelectContent(id);
    setSearchOpen(false);
    setSearchQuery("");
    setNotifOpen(false);
  };

  const handleVoiceResult = useCallback((transcript: string) => {
    setSearchQuery(transcript);
  }, []);

  const { supported: voiceSupported, listening, start: startVoice } = useVoiceSearch(handleVoiceResult);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-zinc-950/95 backdrop-blur-md shadow-2xl"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 h-16 flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0 select-none">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-6 bg-red-500 rounded-sm" />
            <div className="w-1.5 h-4 bg-red-400 rounded-sm" />
            <div className="w-1.5 h-7 bg-red-600 rounded-sm" />
          </div>
          <span className="text-white font-black text-xl tracking-tight ml-1">
            NEXSTREAM
          </span>
        </div>

      <div className="hidden md:flex items-center gap-6 text-sm">
  <button
    className={`text-zinc-300 hover:text-white transition-colors duration-200 font-medium`}
  >
    Home
  </button>
  <button
    onClick={onOpenMyList}
    className="text-zinc-300 hover:text-white transition-colors duration-200"
  >
    My List
  </button>
  <button
    onClick={onOpenCatalog}
    className="text-zinc-300 hover:text-white transition-colors duration-200"
  >
    Tout le catalogue
  </button>
</div>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-4">
          {/* Smart Search */}
          <div className="relative" data-search-area>
            {searchOpen ? (
              <div className="flex items-center bg-zinc-900/90 border border-zinc-700 rounded-md overflow-hidden">
                <Sparkles size={16} className="ml-3 text-emerald-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Recherche intelligente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-sm px-3 py-2 w-56 outline-none placeholder-zinc-500"
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
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="pr-3 text-zinc-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                <Search size={18} />
              </button>
            )}

            {/* Search dropdown */}
            {searchOpen && (
              <div className="absolute top-full mt-2 right-0 w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
                {searchQuery.trim().length <= 1 ? (
                  /* Suggestions when empty */
                  <div className="p-4">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-emerald-400" />
                      Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((sug) => (
                        <button
                          key={sug}
                          onClick={() => setSearchQuery(sug)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm rounded-full transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <p className="px-4 pt-3 pb-2 text-zinc-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Sparkles size={12} className="text-emerald-400" />
                      {searchResults.length} résultat{searchResults.length > 1 ? "s" : ""}
                    </p>
                    {searchResults.map((item: ContentItem) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-zinc-800 transition-colors text-left border-t border-zinc-800/50"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-10 object-cover rounded-md flex-shrink-0"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (!img.src.includes("hqdefault")) {
                              img.src = `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
                            }
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-medium leading-tight truncate">
                            {item.title}
                          </p>
                          <p className="text-zinc-500 text-xs mt-0.5">
                            {item.categories.slice(0, 2).join(" · ")} · {item.channel}
                          </p>
                        </div>
                        <Play size={14} className="text-zinc-500 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-zinc-400 text-sm">Aucun résultat trouvé</p>
                    <p className="text-zinc-600 text-xs mt-1">
                      Essayez un nom de prophète, un thème ou un mot-clé
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" data-notif-area>
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="text-zinc-300 hover:text-white transition-colors relative"
            >
              <Bell size={18} />
              {/* B5 — le point rouge n'apparaît que s'il y a des nouveautés non vues */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute top-full mt-2 right-0 w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <p className="text-white font-semibold text-sm flex items-center gap-2">
                    <Clock size={14} className="text-emerald-400" />
                    Dernières vidéos ajoutées
                  </p>
                </div>
                {latestVideos.map((item: ContentItem) => {
                  const isUnread = item.isNew && !readIds.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-zinc-800 transition-colors text-left border-b border-zinc-800/50 last:border-0"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-10 object-cover rounded-md"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (!img.src.includes("hqdefault")) {
                              img.src = `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
                            }
                          }}
                        />
                        {item.isNew && (
                          <span className="absolute -top-1 -left-1 px-1 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium leading-tight truncate">
                          {item.title}
                        </p>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          {item.channel} · {item.year}
                        </p>
                      </div>
                      {/* B5 — point rouge tant que la vidéo n'a pas été ouverte */}
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile avatar + dropdown menu */}
          <ProfileMenu
            onOpenMyList={onOpenMyList}
            onOpenWatchHistory={onOpenWatchHistory}
            onOpenAccountSettings={onOpenAccountSettings}
            onSwitchProfile={onSwitchProfile}
            onOpenTasbih={onOpenTasbih}
            onOpenDuas={onOpenDuas}
            onOpenQibla={onOpenQibla}
            onOpenZakat={onOpenZakat}
          />
        </div>
      </div>
    </nav>
  );
}