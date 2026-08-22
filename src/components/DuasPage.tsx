import { useMemo, useState } from "react";
import { X, BookOpen } from "lucide-react";
import { DUAS, DUA_THEMES, type DuaTheme } from "@/data/duas";

type DuasPageProps = {
  onClose: () => void;
};

export default function DuasPage({ onClose }: DuasPageProps) {
  const [theme, setTheme] = useState<DuaTheme>(DUA_THEMES[0]);

  const themeDuas = useMemo(() => DUAS.filter((d) => d.theme === theme), [theme]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-emerald-400" />
          <div>
            <h2 className="text-white font-bold text-lg">Douas</h2>
            <p className="text-zinc-500 text-xs">Invocations organisées par thème</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      {/* Navigation par thème */}
      <div className="flex-shrink-0 border-b border-zinc-800/50 px-6 py-3 overflow-x-auto scrollbar-none">
        <div className="flex gap-2">
          {DUA_THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                theme === t
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des douas du thème actif */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          {themeDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6"
            >
              <p
                dir="rtl"
                lang="ar"
                className="text-white text-2xl sm:text-3xl leading-loose font-semibold mb-4 text-right"
              >
                {dua.arabic}
              </p>
              <p className="text-emerald-400 text-sm italic mb-2">
                {dua.transliteration}
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                {dua.translation}
              </p>
              <p className="text-zinc-600 text-xs uppercase tracking-wider font-semibold">
                {dua.reference}
              </p>
            </div>
          ))}

          {themeDuas.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-12">
              Aucune doua pour ce thème pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}