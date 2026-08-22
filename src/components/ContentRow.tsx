import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "@/components/ContentCard";
import { ContentItem } from "@/data/catalog";

type ContentRowProps = {
  label: string;
  items: ContentItem[];
  onPlay: (id: string) => void;
  onInfo: (id: string) => void;
  onSeeAll?: () => void;
  limit?: number;
};

export default function ContentRow({
  label,
  items,
  onPlay,
  onInfo,
  onSeeAll,
  limit = 10,
}: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayedItems = items.slice(0, limit);
  const hasMore = items.length > limit;

  function scroll(dir: "left" | "right") {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  }

  function checkScroll() {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }

  return (
    <div className="group/row relative mb-10">
      <div className="flex items-center justify-between px-8 lg:px-16 mb-4">
        <h2 className="text-white text-xl font-bold tracking-tight">
          {label}
          <span className="text-zinc-500 font-medium text-sm ml-2">
            {items.length}
          </span>
        </h2>
        {hasMore && onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-zinc-400 hover:text-white text-sm font-semibold transition-colors flex-shrink-0"
          >
            Voir tout &rarr;
          </button>
        )}
      </div>

      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-12 bottom-0 z-10 w-14 bg-gradient-to-r from-zinc-950 to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-white hover:bg-zinc-700 hover:scale-110 transition-all">
            <ChevronLeft size={18} />
          </div>
        </button>
      )}
      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-12 bottom-0 z-10 w-14 bg-gradient-to-l from-zinc-950 to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-white hover:bg-zinc-700 hover:scale-110 transition-all">
            <ChevronRight size={18} />
          </div>
        </button>
      )}

      {/* Scrollable row */}
      <div
        ref={rowRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto scrollbar-none px-8 lg:px-16 pb-16"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayedItems.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onPlay={onPlay}
            onInfo={onInfo}
          />
        ))}

        {hasMore && onSeeAll && (
          <button
            onClick={onSeeAll}
            className="flex-shrink-0 w-32 flex flex-col items-center justify-center gap-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white text-sm font-semibold transition-colors"
          >
            <span>Voir tout</span>
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}