export interface HijriDate {
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  weekday: { en: string };
}

const HIJRI_MONTHS_FR = [
  'Mouharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Joumada al-Oula', 'Joumada al-Thania', 'Rajab', 'Chaabane',
  'Ramadan', 'Chawwal', "Dhou al-Qi'da", 'Dhou al-Hijja',
];

export async function fetchHijriToday(): Promise<{ day: number; month: number; year: number } | null> {
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`);
    if (!res.ok) {
      console.error('Aladhan gToH a répondu avec le statut', res.status);
      return null;
    }
    const data = await res.json();
    const h = data.data.hijri;
    return { day: parseInt(h.day), month: parseInt(h.month.number), year: parseInt(h.year) };
  } catch (e) {
    console.error('Erreur récupération date Hijri:', e);
    return null;
  }
}

export function formatHijri(h: { day: number; month: number; year: number }): string {
  return `${h.day} ${HIJRI_MONTHS_FR[h.month - 1]} ${h.year} H`;
}

const IMPORTANT_DATES = [
  { name: 'Achoura', month: 1, day: 10 },
  { name: 'Mawlid (naissance du Prophète ﷺ)', month: 3, day: 12 },
  { name: "Isra et Mi'raj", month: 7, day: 27 },
  { name: 'Début du Ramadan', month: 9, day: 1 },
  { name: 'Aïd al-Fitr', month: 10, day: 1 },
  { name: "Jour d'Arafat", month: 12, day: 9 },
  { name: 'Aïd al-Adha', month: 12, day: 10 },
];

export { IMPORTANT_DATES };