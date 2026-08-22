import { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import {
  fetchPrayerTimes, reverseGeocode, geocodeCity, getNextPrayer,
  formatCountdown, PRAYER_NAMES_FR, PrayerTimings, PrayerLocation,
} from '@/utils/prayerTimes';
import { useViewerProfile } from '@/hooks/useViewerProfile';

export default function PrayerTimesWidget({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const { activeProfile, updateProfile } = useViewerProfile();
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [location, setLocation] = useState<PrayerLocation | null>(null);
  const [countdown, setCountdown] = useState('');
  const [nextPrayerName, setNextPrayerName] = useState('');
  const [needsManualCity, setNeedsManualCity] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const saved = (activeProfile as any)?.prayer_location as PrayerLocation | undefined;
      if (saved) {
        if (!cancelled) {
          setLocation(saved);
          setLoading(false);
        }
        return;
      }

      if (!navigator.geolocation) {
        if (!cancelled) {
          setNeedsManualCity(true);
          setLoading(false);
        }
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const city = await reverseGeocode(latitude, longitude);
          const loc = { lat: latitude, lng: longitude, city };
          if (cancelled) return;
          setLocation(loc);
          if (activeProfile) {
            try {
              await updateProfile(activeProfile.id, { prayerLocation: loc } as any);
            } catch (e) {
              console.error('Impossible de sauvegarder la position:', e);
            }
          }
          setLoading(false);
        },
        () => {
          if (!cancelled) {
            setNeedsManualCity(true);
            setLoading(false);
          }
        }
      );
    }

    init();
    return () => { cancelled = true; };
  }, [activeProfile]);

  useEffect(() => {
    if (!location) return;
    fetchPrayerTimes(location.lat, location.lng).then(setTimings);
  }, [location]);

  useEffect(() => {
    if (!timings) return;
    const tick = () => {
      const next = getNextPrayer(timings);
      setNextPrayerName(next.name);
      setCountdown(formatCountdown(next.msUntil));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timings]);

  async function handleManualCity() {
    if (!cityInput.trim()) return;
    const loc = await geocodeCity(cityInput);
    if (loc) {
      setLocation(loc);
      setNeedsManualCity(false);
      if (activeProfile) {
        try {
          await updateProfile(activeProfile.id, { prayerLocation: loc } as any);
        } catch (e) {
          console.error('Impossible de sauvegarder la position:', e);
        }
      }
    }
  }

  if (loading) {
    return variant === 'compact'
      ? <div className="h-7 w-40 bg-zinc-900 rounded-full animate-pulse" />
      : <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />;
  }

  if (needsManualCity) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-zinc-300 text-sm mb-2">Géolocalisation refusée — entre ta ville :</p>
        <div className="flex gap-2">
          <input
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualCity()}
            placeholder="Ex: Dakar, Paris..."
            className="flex-1 bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none"
          />
          <button
            onClick={handleManualCity}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-2 rounded-lg"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  if (!timings || !location) {
    return variant === 'compact' ? null : (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-500 text-sm">
        Impossible de charger les horaires de prière pour le moment.
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-300 px-3 py-1.5 rounded-full bg-zinc-900/70 border border-zinc-800">
        <Clock size={14} className="text-emerald-400" />
        <span>{PRAYER_NAMES_FR[nextPrayerName]} dans {countdown}</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="text-emerald-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Horaires de prière</h3>
        </div>
        <div className="flex items-center gap-1 text-zinc-500 text-xs">
          <MapPin size={12} />
          {location.city}
        </div>
      </div>

      <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-4 mb-4 text-center">
        <p className="text-emerald-400 text-sm mb-1">Prochaine prière — {PRAYER_NAMES_FR[nextPrayerName]}</p>
        <p className="text-3xl font-bold text-white tabular-nums">{countdown}</p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((name) => (
          <div
            key={name}
            className={`text-center rounded-lg py-2 ${
              name === nextPrayerName ? 'bg-emerald-900/40 border border-emerald-700/40' : 'bg-zinc-800/60'
            }`}
          >
            <p className="text-zinc-400 text-xs">{PRAYER_NAMES_FR[name]}</p>
            <p className="text-white text-sm font-medium">{timings[name]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}