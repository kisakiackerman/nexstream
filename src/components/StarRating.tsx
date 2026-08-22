import { useState } from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  averageRating: number | null;
  ratingCount: number;
  userRating: number | null;
  onRate: (rating: number) => void;
  size?: number;
  disabled?: boolean;
};

export default function StarRating({
  averageRating,
  ratingCount,
  userRating,
  onRate,
  size = 16,
  disabled = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? userRating ?? 0;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div
        className="flex items-center"
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onMouseEnter={() => !disabled && setHovered(n)}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) onRate(n);
            }}
            className={`p-0.5 transition-transform ${
              disabled ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95"
            }`}
            title={disabled ? undefined : `Noter ${n} étoile${n > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={n <= displayValue ? "text-amber-400" : "text-zinc-600"}
              fill={n <= displayValue ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>

      {averageRating !== null ? (
        <span className="text-zinc-400 text-xs">
          {averageRating.toFixed(1)} ({ratingCount} avis)
        </span>
      ) : (
        <span className="text-zinc-500 text-xs">Pas encore noté</span>
      )}
    </div>
  );
}