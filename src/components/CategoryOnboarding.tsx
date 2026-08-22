import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { Category } from "@/data/catalog";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import type { ViewerProfile } from "@/lib/supabase";

const ONBOARDING_CATEGORIES: Category[] = [
  "Prophètes",
  "Compagnons",
  "Anges & Djinns",
  "Eschatologie",
  "Miracles du Coran",
  "Héros & Personnages",
  "Histoire & Mystère",
];

const MIN_SELECTION = 2;
const MAX_SELECTION = 3;

type CategoryOnboardingProps = {
  profile: ViewerProfile;
  onDone: () => void;
};

// B4 — Étape optionnelle affichée juste après la création d'un profil,
// pour choisir 2 à 3 catégories favorites (utilisées ensuite par la
// rangée "Recommandé pour vous").
export default function CategoryOnboarding({ profile, onDone }: CategoryOnboardingProps) {
  const { updateProfile } = useViewerProfile();
  const [selected, setSelected] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  const toggle = (cat: Category) => {
    setSelected((prev) => {
      if (prev.includes(cat)) return prev.filter((c) => c !== cat);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, cat];
    });
  };

  const canConfirm = selected.length >= MIN_SELECTION;

  const handleConfirm = async () => {
    setSaving(true);
    await updateProfile(profile.id, { favoriteCategories: selected });
    setSaving(false);
    onDone();
  };

  const handleSkip = () => {
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-center px-4 py-10 overflow-y-auto">
      <div className="w-full max-w-lg text-center">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: profile.avatar_color }}
        >
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-white text-2xl sm:text-3xl font-black mb-2 tracking-tight">
          Bienvenue, {profile.name}
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mb-8">
          Choisissez 2 à 3 thèmes qui vous intéressent pour personnaliser vos
          recommandations. Vous pourrez changer cela plus tard.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {ONBOARDING_CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat);
            const isDisabled = !isSelected && selected.length >= MAX_SELECTION;
            return (
              <button
                key={cat}
                onClick={() => toggle(cat)}
                disabled={isDisabled}
                className={`relative px-4 py-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-900/30 text-white"
                    : isDisabled
                    ? "border-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                {cat}
              </button>
            );
          })}
        </div>

        <p className="text-zinc-600 text-xs mb-6">
          {selected.length}/{MAX_SELECTION} sélectionné{selected.length > 1 ? "s" : ""}
          {selected.length < MIN_SELECTION && " — choisissez-en au moins 2"}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleSkip}
            disabled={saving}
            className="px-6 py-2.5 text-zinc-400 hover:text-white text-sm font-semibold transition-colors disabled:opacity-40"
          >
            Passer cette étape
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}