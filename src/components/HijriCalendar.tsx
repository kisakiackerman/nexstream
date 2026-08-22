import { useEffect, useState } from 'react';
import { Moon } from 'lucide-react';
import { fetchHijriToday, formatHijri, IMPORTANT_DATES } from '@/utils/hijriCalendar';

interface UpcomingEvent {
  name: string;
  daysUntil: number;
}

export default function HijriCalendar({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const [hijriToday, setHijriToday] = useState<{ day: number; month: number; year: number } | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const today = await fetchHijriToday();
      if (cancelled) return;

      if (!today) {
        setLoading(false);
        return;
      }
      setHijriToday(today);

      const now = new Date();
      const results: UpcomingEvent[] = [];

      for (const ev of IMPORTANT_DATES) {
        for (const yearOffset of [0, 1]) {
          try {
            const hijriYear = today.year + yearOffset;
            const res = await fetch(
              `https://api.aladhan.com/v1/hToG?date=${ev.day}-${ev.month}-${hijriYear}`
            );
            if (!res.ok) continue;
            const data = await res.json();
            const g = data.data.gregorian;
            const gDate = new Date(`${g.year}-${String(g.month.number).padStart(2, '0')}-${String(g.day).padStart(2, '0')}`);
            const diffDays = Math.ceil((gDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0) {
              results.push({ name: ev.name, daysUntil: diffDays });
              break;
            }
          } catch {
            // ignore, passe à l'occasion suivante
          }
        }
      }

      if (cancelled) return;
      results.sort((a, b) => a.daysUntil - b.daysUntil);
      setUpcoming(results.slice(0, variant === 'compact' ? 1 : 5));
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [variant]);

  if (loading) {
    return variant === 'compact'
      ? <div className="h-7 w-32 bg-zinc-900 rounded-full animate-pulse" />
      : <div className="h-40 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />;
  }

  if (!hijriToday) {
    return variant === 'compact' ? null : (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-500 text-sm">
        Impossible de charger la date Hijri pour le moment.
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-300 px-3 py-1.5 rounded-full bg-zinc-900/70 border border-zinc-800">
        <Moon size={14} className="text-amber-400" />
        <span>{formatHijri(hijriToday)}</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="text-amber-400" size={20} />
        <h3 className="text-lg font-semibold text-white">Calendrier Hijri</h3>
      </div>
      <div className="mb-5">
        <p className="text-zinc-400 text-sm mb-1">Aujourd'hui</p>
        <p className="text-2xl font-bold text-white">{formatHijri(hijriToday)}</p>
      </div>
      <div>
        <p className="text-zinc-400 text-sm mb-2">Prochaines dates importantes</p>
        <ul className="space-y-2">
          {upcoming.map((ev) => (
            <li key={ev.name} className="flex items-center justify-between bg-zinc-800/60 rounded-lg px-3 py-2">
              <span className="text-zinc-200 text-sm">{ev.name}</span>
              <span className="text-emerald-400 text-xs font-medium whitespace-nowrap ml-2">
                {ev.daysUntil === 0 ? "Aujourd'hui" : `dans ${ev.daysUntil} j`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}