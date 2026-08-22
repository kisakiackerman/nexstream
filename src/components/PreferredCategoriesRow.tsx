import { useViewerProfile } from "@/hooks/useViewerProfile";
import { catalog, type Category } from "@/data/catalog";
import ContentRow from "@/components/ContentRow";

type PreferredCategoriesRowProps = {
  onPlay: (id: string) => void;
  onInfo: (id: string) => void;
};

// B4 — Rangée basée sur favorite_categories, définie lors de l'onboarding
// du profil (ou modifiable plus tard). N'affiche rien si le profil n'a
// pas de préférences enregistrées.
export default function PreferredCategoriesRow({ onPlay, onInfo }: PreferredCategoriesRowProps) {
  const { activeProfile } = useViewerProfile();

  const favorites = (activeProfile?.favorite_categories ?? []) as Category[];
  if (favorites.length === 0) return null;

  const items = catalog
    .filter((c) => c.categories.some((cat) => favorites.includes(cat)))
    .sort((a, b) => {
      const aShared = a.categories.filter((cat) => favorites.includes(cat)).length;
      const bShared = b.categories.filter((cat) => favorites.includes(cat)).length;
      if (aShared !== bShared) return bShared - aShared;
      return b.score - a.score;
    })
    .slice(0, 20);

  if (items.length === 0) return null;

  return (
    <ContentRow
      label="Recommandé pour vous"
      items={items}
      onPlay={onPlay}
      onInfo={onInfo}
    />
  );
}