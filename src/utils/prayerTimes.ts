export interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerLocation {
  lat: number;
  lng: number;
  city: string;
}

export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method = 2
): Promise<PrayerTimings | null> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${method}`
    );
    if (!res.ok) {
      console.error('Aladhan timings a répondu avec le statut', res.status);
      return null;
    }
    const data = await res.json();
    const t = data.data.timings;
    return {
      Fajr: t.Fajr,
      Dhuhr: t.Dhuhr,
      Asr: t.Asr,
      Maghrib: t.Maghrib,
      Isha: t.Isha,
    };
  } catch (e) {
    console.error('Erreur récupération horaires de prière:', e);
    return null;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    if (!res.ok) return 'Position actuelle';
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.village || data.display_name?.split(',')[0] || 'Position actuelle';
  } catch {
    return 'Position actuelle';
  }
}

export async function geocodeCity(cityName: string): Promise<PrayerLocation | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      city: data[0].display_name.split(',')[0],
    };
  } catch {
    return null;
  }
}

export function getNextPrayer(timings: PrayerTimings): { name: string; time: string; msUntil: number } {
  const now = new Date();
  const prayers = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];

  for (const p of prayers) {
    const [h, m] = p.time.split(':').map(Number);
    const prayerDate = new Date(now);
    prayerDate.setHours(h, m, 0, 0);
    if (prayerDate.getTime() > now.getTime()) {
      return { name: p.name, time: p.time, msUntil: prayerDate.getTime() - now.getTime() };
    }
  }

  const [h, m] = timings.Fajr.split(':').map(Number);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(h, m, 0, 0);
  return { name: 'Fajr', time: timings.Fajr, msUntil: tomorrow.getTime() - now.getTime() };
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const PRAYER_NAMES_FR: Record<string, string> = {
  Fajr: 'Fajr',
  Dhuhr: 'Dhouhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
};