import { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Plus,
  ThumbsUp,
  Share2,
  Loader2,
  Subtitles,
  Gauge,
} from "lucide-react";
import { ContentItem, catalog } from "@/data/catalog";
import { loadYouTubeAPI } from "@/lib/youtube";
import { supabase } from "@/lib/supabase";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import { useMyList } from "@/lib/useMyList";
import { useContentStats } from "@/hooks/useContentStats";
import { useContentRatings } from "@/hooks/useContentRatings";
import StarRating from "@/components/StarRating";

type PlayerModalProps = {
  item: ContentItem;
  onClose: () => void;
  onChangeItem: (id: string) => void;
};

const STATE_NAMES = {
  [-1]: "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "cued",
} as const;

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export default function PlayerModal({
  item,
  onClose,
  onChangeItem,
}: PlayerModalProps) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);

  const { activeProfile } = useViewerProfile();
  const { inList, toggle } = useMyList();
  const { userVote, vote, logView } = useContentStats(item.id);
  const { averageRating, ratingCount, userRating, rate } = useContentRatings(item.id);

  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();
  const progressTimer = useRef<ReturnType<typeof setInterval>>();
  const historyTimer = useRef<ReturnType<typeof setInterval>>();
  // Garde la dernière vitesse choisie, lue dans onReady (qui est capturé une
  // seule fois par montage du player, donc ne verrait pas les mises à jour de state)
  const playbackRateRef = useRef(1);

  // Related videos for "Up Next"
  const related = catalog
    .filter((c) => c.id !== item.id)
    .filter(
      (c) =>
        c.channel === item.channel ||
        c.categories.some((g) => item.categories.includes(g))
    )
    .slice(0, 8);

  const upNext = related.length > 0 ? related[0] : null;

  const fmt = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !playerDivRef.current) return;

      playerRef.current = new window.YT.Player(playerDivRef.current, {
        videoId: item.youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          cc_lang_pref: "fr",
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(volume);
            e.target.setPlaybackRate(playbackRateRef.current);
            setBuffering(false);
          },
          onStateChange: (e) => {
            const state = STATE_NAMES[e.data];
            setBuffering(state === "buffering" || state === "unstarted");
            setPlaying(state === "playing");

            if (state === "ended" && upNext) {
              onChangeItem(upNext.id);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (progressTimer.current) clearInterval(progressTimer.current);
      if (historyTimer.current) clearInterval(historyTimer.current);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.youtubeId]);

  useEffect(() => {
    logView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  useEffect(() => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    progressTimer.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const cur = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        if (dur > 0) {
          setProgress((cur / dur) * 100);
          setDuration(dur);
        }
      } catch {
        // player not ready
      }
    }, 500);
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [item.youtubeId]);

  useEffect(() => {
    if (!activeProfile) return;
    if (historyTimer.current) clearInterval(historyTimer.current);
    historyTimer.current = setInterval(async () => {
      if (!playerRef.current) return;
      try {
        const cur = Math.floor(playerRef.current.getCurrentTime() ?? 0);
        const dur = Math.floor(playerRef.current.getDuration?.() ?? 0);
        if (cur <= 0) return;
        await supabase
          .from("watch_history")
          .upsert(
            {
              viewer_profile_id: activeProfile.id,
              content_id: item.id,
              progress_seconds: cur,
              duration_seconds: dur,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "viewer_profile_id,content_id" }
          );
      } catch {
        // ignore
      }
    }, 12000);
    return () => {
      if (historyTimer.current) clearInterval(historyTimer.current);
    };
  }, [activeProfile, item.id]);

  useEffect(() => {
    return () => {
      if (activeProfile && playerRef.current) {
        try {
          const cur = Math.floor(playerRef.current.getCurrentTime() ?? 0);
          const dur = Math.floor(playerRef.current.getDuration?.() ?? 0);
          if (cur > 0) {
            supabase
              .from("watch_history")
              .upsert(
                {
                  viewer_profile_id: activeProfile.id,
                  content_id: item.id,
                  progress_seconds: cur,
                  duration_seconds: dur,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "viewer_profile_id,content_id" }
              )
              .then(() => {});
          }
        } catch {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile, item.id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "ArrowLeft" && playerRef.current) {
        const cur = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(Math.max(0, cur - 10), true);
      }
      if (e.key === "ArrowRight" && playerRef.current) {
        const cur = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        playerRef.current.seekTo(Math.min(dur, cur + 10), true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const resetControlsTimer = useCallback(() => {
    clearTimeout(controlsTimer.current);
    setShowControls(true);
    controlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3500);
  }, [playing]);

  useEffect(() => {
    resetControlsTimer();
    return () => clearTimeout(controlsTimer.current);
  }, [resetControlsTimer]);

  function togglePlay() {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (state === 1) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }

  function seekToPct(pct: number) {
    if (!playerRef.current || duration <= 0) return;
    playerRef.current.seekTo((pct / 100) * duration, true);
    setProgress(pct);
  }

  function handleVolume(v: number) {
    setVolume(v);
    setMuted(false);
    if (playerRef.current) {
      playerRef.current.setVolume(v);
      if (v === 0) playerRef.current.mute();
      else playerRef.current.unMute();
    }
  }

  function toggleMute() {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  }

  function skip(seconds: number) {
    if (!playerRef.current) return;
    const cur = playerRef.current.getCurrentTime();
    const dur = playerRef.current.getDuration();
    playerRef.current.seekTo(Math.max(0, Math.min(dur, cur + seconds)), true);
  }

  function toggleCaptions() {
    if (!playerRef.current) return;
    try {
      if (captionsOn) {
        playerRef.current.unloadModule("captions");
        playerRef.current.unloadModule("cc");
        setCaptionsOn(false);
      } else {
        playerRef.current.loadModule("captions");
        playerRef.current.loadModule("cc");
        setCaptionsOn(true);
      }
    } catch {
      // captions API not available for this video
    }
  }

  function goFullscreen() {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  }

  function handleSpeedChange(rate: number) {
    setPlaybackRateState(rate);
    playbackRateRef.current = rate;
    setSpeedMenuOpen(false);
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(rate);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-black"
        onMouseMove={resetControlsTimer}
      >
        <div ref={playerDivRef} className="absolute inset-0 w-full h-full" />

        {buffering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader2 size={48} className="text-white/80 animate-spin" />
          </div>
        )}

        <div
          className="absolute inset-0"
          onClick={togglePlay}
          style={{ cursor: showControls ? "pointer" : "default" }}
        />

        <div
          className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-4 px-6 py-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <X size={20} />
              <span className="text-sm font-medium hidden sm:block">Back</span>
            </button>
            <div className="ml-4 min-w-0">
              <p className="text-zinc-400 text-xs uppercase tracking-wider">
                Now Playing · {item.channel}
              </p>
              <h3 className="text-white font-bold text-lg leading-tight truncate max-w-[60vw]">
                {item.title}
              </h3>
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
            !playing && !buffering && showControls
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Play size={32} fill="white" className="text-white ml-1" />
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-6 pb-2">
            <div
              className="group/progress relative h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer transition-all duration-150"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                seekToPct(pct);
              }}
            >
              <div
                className="h-full bg-red-600 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-zinc-300 text-xs font-mono">
                {fmt((progress / 100) * duration)}
              </span>
              <span className="text-zinc-300 text-xs font-mono">
                {fmt(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 pb-5">
            <button
              onClick={() => skip(-10)}
              className="text-zinc-300 hover:text-white transition-colors"
              title="Rewind 10s"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:bg-zinc-200 transition-colors"
            >
              {playing ? (
                <Pause size={20} fill="black" className="text-black" />
              ) : (
                <Play size={20} fill="black" className="text-black ml-0.5" />
              )}
            </button>
            <button
              onClick={() => skip(10)}
              className="text-zinc-300 hover:text-white transition-colors"
              title="Forward 10s"
            >
              <SkipForward size={20} />
            </button>

            <div className="flex items-center gap-2 group/vol ml-2">
              <button
                onClick={toggleMute}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                {muted || volume === 0 ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={(e) => handleVolume(+e.target.value)}
                className="w-0 group-hover/vol:w-20 h-1 accent-red-500 cursor-pointer transition-all duration-300"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              {/* B1 — Vitesse de lecture */}
              <div className="relative">
                <button
                  onClick={() => setSpeedMenuOpen((o) => !o)}
                  className={`flex items-center gap-1 transition-colors ${
                    speedMenuOpen || playbackRate !== 1
                      ? "text-emerald-400"
                      : "text-zinc-300 hover:text-white"
                  }`}
                  title="Vitesse de lecture"
                >
                  <Gauge size={18} />
                  <span className="text-xs font-semibold font-mono">
                    {playbackRate}x
                  </span>
                </button>

                {speedMenuOpen && (
                  <>
                    {/* Zone invisible pour fermer le menu au clic extérieur */}
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setSpeedMenuOpen(false)}
                    />
                    <div className="absolute bottom-full right-0 mb-2 w-28 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden z-40">
                      {PLAYBACK_SPEEDS.map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handleSpeedChange(rate)}
                          className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                            rate === playbackRate
                              ? "bg-emerald-600 text-white"
                              : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                          }`}
                        >
                          {rate === 1 ? "Normal" : `${rate}x`}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={toggleCaptions}
                className={`transition-colors ${captionsOn ? "text-emerald-400" : "text-zinc-300 hover:text-white"}`}
                title={captionsOn ? "Désactiver les sous-titres" : "Activer les sous-titres"}
              >
                <Subtitles size={18} />
              </button>
              <span className="text-zinc-400 text-xs hidden md:block">
                {item.categories.join(" · ")}
              </span>
              <button
                onClick={goFullscreen}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-zinc-950 border-t border-zinc-800/50 max-h-[40vh] overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-5">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                  {item.channel}
                </span>
                <span className="text-emerald-400 font-bold text-xs">
                  {item.score}% Match
                </span>
                <span className="text-zinc-500 text-xs border border-zinc-700 px-1.5 rounded">
                  {item.rating}
                </span>
                <span className="text-zinc-500 text-xs">{item.year}</span>
                <span className="text-zinc-500 text-xs">{item.duration}</span>
              </div>

              {/* A4 — Notation par étoiles */}
              <div className="mb-3">
                <StarRating
                  averageRating={averageRating}
                  ratingCount={ratingCount}
                  userRating={userRating}
                  onRate={rate}
                  size={15}
                />
              </div>

              <h3 className="text-white font-bold text-xl leading-tight mb-2">
                {item.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(item)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    inList(item.id)
                      ? "border-emerald-500 text-emerald-400 bg-emerald-900/20"
                      : "border-zinc-600 text-white hover:bg-zinc-800"
                  }`}
                >
                  <Plus size={16} />
                  {inList(item.id) ? "Added" : "My List"}
                </button>
                <button
                  onClick={() => vote(true)}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                    userVote === true
                      ? "border-emerald-500 text-emerald-400 bg-emerald-900/20"
                      : "border-zinc-600 text-white hover:bg-zinc-800"
                  }`}
                >
                  <ThumbsUp size={16} fill={userVote === true ? "currentColor" : "none"} />
                </button>
                <button className="w-10 h-10 rounded-lg border border-zinc-600 text-white hover:bg-zinc-800 flex items-center justify-center transition-all">
                  <Share2 size={16} />
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
                >
                  Open on YouTube
                </a>
              </div>
            </div>

            {related.length > 0 && (
              <div className="lg:w-80 flex-shrink-0">
                <h4 className="text-zinc-300 font-bold text-sm uppercase tracking-wider mb-3">
                  Up Next
                </h4>
                <div className="space-y-2">
                  {related.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => onChangeItem(r.id)}
                      className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-zinc-800/60 transition-colors group"
                    >
                      <div className="relative w-28 h-16 flex-shrink-0 rounded-md overflow-hidden bg-zinc-800">
                        <img
                          src={r.thumbnail}
                          alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${r.youtubeId}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                          {r.title}
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">
                          {r.channel} · {r.duration}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}