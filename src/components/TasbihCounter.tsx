import { useEffect, useState } from "react";
import { X, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useViewerProfile } from "@/hooks/useViewerProfile";

type TasbihCounterProps = {
  onClose: () => void;
};

const DHIKR_LIST = [
  { id: "subhanallah", arabic: "سُبْحَانَ اللَّهِ", translit: "SubhanAllah", translation: "Gloire à Allah" },
  { id: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", translit: "Alhamdulillah", translation: "Louange à Allah" },
  { id: "allahuakbar", arabic: "اللَّهُ أَكْبَرُ", translit: "Allahu Akbar", translation: "Allah est le plus grand" },
  { id: "astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", translit: "Astaghfirullah", translation: "Je demande pardon à Allah" },
  { id: "lailahaillallah", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", translit: "La ilaha illallah", translation: "Il n'y a de divinité qu'Allah" },
] as const;

const GOALS: { label: string; value: number | null }[] = [
  { label: "33", value: 33 },
  { label: "99", value: 99 },
  { label: "100", value: 100 },
  { label: "Illimité", value: null },
];

export default function TasbihCounter({ onClose }: TasbihCounterProps) {
  const { activeProfile } = useViewerProfile();
  const [dhikrId, setDhikrId] = useState<string>(DHIKR_LIST[0].id);
  const [goal, setGoal] = useState<number | null>(33);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(false);

  const activeDhikr = DHIKR_LIST.find((d) => d.id === dhikrId) ?? DHIKR_LIST[0];
  const goalReached = goal !== null && count >= goal && goal > 0;

  // Charge le total déjà enregistré aujourd'hui pour ce dhikr
  useEffect(() => {
    let cancelled = false;

    async function loadTodayCount() {
      if (!activeProfile) {
        setCount(0);
        setLoading(false);
        return;
      }
      setLoading(true);
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("dhikr_logs")
        .select("count")
        .eq("viewer_profile_id", activeProfile.id)
        .eq("dhikr_type", dhikrId)
        .eq("log_date", today)
        .maybeSingle();

      if (cancelled) return;
      setCount(!error && data ? data.count : 0);
      setLoading(false);
    }

    loadTodayCount();
    return () => {
      cancelled = true;
    };
  }, [activeProfile, dhikrId]);

  function handleTap() {
    if (loading) return;
    const next = count + 1;
    setCount(next);

    if (goal !== null && next === goal) {
      setPulse(true);
      setTimeout(() => setPulse(false), 700);
      if (navigator.vibrate) navigator.vibrate(60);
    } else if (navigator.vibrate) {
      navigator.vibrate(8);
    }

    // Persistance côté serveur — incrémentation atomique, sans bloquer l'UI
    if (activeProfile) {
      supabase
        .rpc("increment_dhikr_count", {
          p_profile_id: activeProfile.id,
          p_dhikr_type: dhikrId,
          p_amount: 1,
        })
        .then(() => {});
    }
  }

  async function handleReset() {
    setCount(0);
    if (!activeProfile) return;
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from("dhikr_logs")
      .update({ count: 0 })
      .eq("viewer_profile_id", activeProfile.id)
      .eq("dhikr_type", dhikrId)
      .eq("log_date", today);
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 flex-shrink-0">
        <div>
          <h2 className="text-white font-bold text-lg">Tasbih</h2>
          <p className="text-zinc-500 text-xs">Compteur de Dhikr</p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center">
        {/* Sélecteur de dhikr */}
        <div className="w-full max-w-md flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {DHIKR_LIST.map((d) => (
            <button
              key={d.id}
              onClick={() => setDhikrId(d.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                dhikrId === d.id
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {d.translit}
            </button>
          ))}
        </div>

        {/* Dhikr actif — arabe + traduction */}
        <div className="text-center mb-8">
          <p dir="rtl" className="text-white text-3xl sm:text-4xl font-semibold mb-2">
            {activeDhikr.arabic}
          </p>
          <p className="text-zinc-400 text-sm">{activeDhikr.translation}</p>
        </div>

        {/* Bouton tactile central */}
        <button
          onClick={handleTap}
          disabled={loading}
          className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center select-none transition-transform active:scale-95 disabled:opacity-50 ${
            goalReached
              ? "bg-gradient-to-br from-amber-500 to-emerald-600"
              : "bg-gradient-to-br from-emerald-700 to-emerald-900"
          } ${pulse ? "animate-pulse" : ""} shadow-2xl border-4 border-emerald-500/30`}
        >
          <div className="flex flex-col items-center">
            <span className="text-white text-6xl sm:text-7xl font-black tabular-nums">
              {count}
            </span>
            {goal !== null && (
              <span className="text-emerald-200 text-sm font-medium mt-1">
                objectif : {goal}
              </span>
            )}
          </div>
        </button>

        {goalReached && (
          <p className="text-amber-400 text-sm font-semibold mt-4">
            Objectif atteint — MashaAllah
          </p>
        )}

        {/* Objectif configurable */}
        <div className="mt-8 w-full max-w-md">
          <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-2 text-center">
            Objectif
          </p>
          <div className="flex items-center justify-center gap-2">
            {GOALS.map((g) => (
              <button
                key={g.label}
                onClick={() => setGoal(g.value)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  goal === g.value
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="mt-8 flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-medium transition-colors"
        >
          <RotateCcw size={15} />
          Réinitialiser le compteur du jour
        </button>
      </div>
    </div>
  );
}