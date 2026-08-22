export type Channel = "NARRO" | "Yacine" | "Towards Eternity" | "Croyant Rationnel" | "Récitateurs";

export type Category =
  | "Prophètes"
  | "Compagnons"
  | "Anges & Djinns"
  | "Eschatologie"
  | "Miracles du Coran"
  | "Héros & Personnages"
  | "Histoire & Mystère"
  | "Récitation";

export type ContentItem = {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  channel: Channel;
  categories: Category[];
  year: number;
  rating: string;
  duration: string;
  score: number;
  thumbnail: string;
  image: string;
  heroImage?: string;
  featured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
};

const yt = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

// Métadonnées légères utilisées pour enrichir chaque vidéo avant construction
type VideoMeta = {
  cats?: Category[];
  year?: number;
  featured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
};

// ─── NARRO videos ─────────────────────────────────────────────
const N: Record<string, VideoMeta> = {
  // Prophet stories series
  "FRCyad2J81o": { cats: ["Prophètes"], year: 2024 },
  "PPZRSJyMEh0": { cats: ["Prophètes"], year: 2024 },
  "ALoYVyoXBqM": { cats: ["Prophètes"], year: 2024 },
  "Du-hjQjzDI4": { cats: ["Prophètes"], year: 2025 },
  "Ha_Wwmtcz2Y": { cats: ["Prophètes", "Héros & Personnages"], year: 2024 },
  "VZJLHaqxZw4": { cats: ["Prophètes"], year: 2025 },
  "EK-lMsID6_U": { cats: ["Prophètes"], year: 2025 },
  "_Hr6yBbTIM0": { cats: ["Prophètes"], year: 2025 },
  "rPPlFnKVS2A": { cats: ["Prophètes", "Eschatologie"], year: 2024 },
  "sMxBVKavPO8": { cats: ["Prophètes", "Héros & Personnages"], year: 2024 },
  "xohQqtH1v9k": { cats: ["Prophètes"], year: 2024 },
  "YxBKtvmQS-M": { cats: ["Prophètes"], year: 2024 },
  "VT14KYY0jWA": { cats: ["Prophètes"], year: 2025 },
  "MBa9gBXa-18": { cats: ["Prophètes", "Histoire & Mystère"], year: 2024 },
  // Standalone narratives
  "Xs26kdKEwlg": { cats: ["Prophètes", "Histoire & Mystère"], year: 2025, featured: true, isTrending: true },
  "utZ20jFavhU": { cats: ["Histoire & Mystère"], year: 2025, isTrending: true },
  "SWe239O2q6I": { cats: ["Héros & Personnages", "Anges & Djinns"], year: 2025, isTrending: true },
  "5NRBBvu7Lcs": { cats: ["Prophètes", "Histoire & Mystère"], year: 2025 },
  "FJH_e5pwMzk": { cats: ["Prophètes", "Histoire & Mystère"], year: 2025, isNew: true },
  "X7b8kSW3PB0": { cats: ["Eschatologie"], year: 2025, isNew: true },
  "vDI4EzrKEQ8": { cats: ["Eschatologie"], year: 2024, isNew: true },
  // Companions & Heroes
  "UE0Ult3AtrU": { cats: ["Compagnons", "Héros & Personnages"], year: 2025, isTrending: true },
  "NN1CwPcgcCU": { cats: ["Compagnons", "Héros & Personnages"], year: 2025 },
  "FJguj-Pi59w": { cats: ["Héros & Personnages"], year: 2025 },
  "WKGSN68aBkI": { cats: ["Héros & Personnages", "Histoire & Mystère"], year: 2024 },
  // Djinns, Dajjal & End times
  "n-zTOILPVp4": { cats: ["Anges & Djinns", "Eschatologie"], year: 2026, isTrending: true, featured: true },
  "CuxJEvI3eto": { cats: ["Anges & Djinns", "Histoire & Mystère"], year: 2026, isNew: true },
  "ShAjaaV2YjM": { cats: ["Eschatologie", "Histoire & Mystère"], year: 2026, isNew: true },
  "1zks1SMNvIY": { cats: ["Anges & Djinns", "Histoire & Mystère"], year: 2024 },
  "4KNarj80mnY": { cats: ["Eschatologie", "Anges & Djinns"], year: 2024 },
  "77a2ywhTNhY": { cats: ["Eschatologie", "Anges & Djinns"], year: 2025 },
  "CG1BG1U5jXU": { cats: ["Eschatologie"], year: 2025, isTrending: true },
  "CzfGmFN6iao": { cats: ["Prophètes", "Histoire & Mystère"], year: 2025 },
  "MQZnYFWTgJs": { cats: ["Eschatologie", "Histoire & Mystère"], year: 2024 },
  "h3SbP3FDd28": { cats: ["Histoire & Mystère", "Miracles du Coran"], year: 2024 },
  "i0okdKbT788": { cats: ["Prophètes", "Histoire & Mystère"], year: 2024 },
  "UnmxHm8y5a4": { cats: ["Prophètes", "Histoire & Mystère"], year: 2024 },
  // History & mystery
  "Nv-bAdXllkk": { cats: ["Histoire & Mystère"], year: 2026, isTrending: true },
  "ZxhTqFuSAzg": { cats: ["Histoire & Mystère"], year: 2025 },
  "4WQnXfkWygs": { cats: ["Héros & Personnages", "Histoire & Mystère"], year: 2025 },
  "VCkkV5RSQMQ": { cats: ["Histoire & Mystère"], year: 2025, isNew: true },
  "EZh-MCNkicc": { cats: ["Histoire & Mystère"], year: 2025 },
  "lZ7B_dZfvPA": { cats: ["Prophètes", "Héros & Personnages"], year: 2026, isNew: true },
  "xDdF3LCbaGI": { cats: ["Eschatologie"], year: 2024 },
  // Exclude: puYY5tfN0CU (hymne algérien), SdDuBzUTFT0 (Ahmed Zabana), 4W8uaeXSQyc (Saint Sylvestre), z6gp6VkXvek (Père Noël) — not Islamic narratives
};

// ─── Yacine videos ────────────────────────────────────────────
const Y: Record<string, VideoMeta> = {
  // Prophet stories
  "fuX7BViVyno": { cats: ["Prophètes", "Eschatologie"], year: 2023, isTrending: true },
  "gl0GKDB3Nvo": { cats: ["Prophètes"], year: 2023, featured: true },
  "DE6eRTl43DI": { cats: ["Prophètes"], year: 2023 },
  "XKl4Y36qREs": { cats: ["Prophètes"], year: 2024, isTrending: true },
  "Kx6yF2PtsHg": { cats: ["Prophètes", "Histoire & Mystère"], year: 2023 },
  "pjyGmUKhx14": { cats: ["Prophètes", "Histoire & Mystère"], year: 2023 },
  "EGJndSj_-SI": { cats: ["Prophètes", "Anges & Djinns"], year: 2023 },
  "m8PSuC3HmpA": { cats: ["Prophètes", "Histoire & Mystère"], year: 2023 },
  "juNul3I0z94": { cats: ["Prophètes"], year: 2023 },
  "-zn3YHu_-ME": { cats: ["Prophètes", "Eschatologie"], year: 2023 },
  // Companions
  "njgXO6BrLsA": { cats: ["Compagnons"], year: 2022, isTrending: true },
  "bppu48Ew4QA": { cats: ["Compagnons", "Anges & Djinns"], year: 2023 },
  "UjGV8zqtdl0": { cats: ["Compagnons", "Héros & Personnages"], year: 2023 },
  "rSDp4XAo7qk": { cats: ["Compagnons", "Héros & Personnages"], year: 2024, isNew: true },
  "8uqZxbv3-CM": { cats: ["Compagnons", "Héros & Personnages"], year: 2024, isNew: true },
  // Anges & Djinns
  "JcHMx17vdRE": { cats: ["Anges & Djinns"], year: 2023, isNew: true },
  "iwM8rTPueGI": { cats: ["Anges & Djinns", "Histoire & Mystère"], year: 2023 },
  "p3gneZAtQOs": { cats: ["Anges & Djinns", "Prophètes"], year: 2023 },
  "qLGc1bPyHiw": { cats: ["Anges & Djinns"], year: 2023 },
  "xoK96rMnQuU": { cats: ["Anges & Djinns"], year: 2023 },
  "ZHPQEk7N6jY": { cats: ["Anges & Djinns", "Prophètes"], year: 2023 },
  "6SgZdJUHchk": { cats: ["Anges & Djinns"], year: 2023 },
  "KePZWT2nCec": { cats: ["Anges & Djinns"], year: 2023 },
  "b1b1-uRfJGk": { cats: ["Anges & Djinns", "Eschatologie"], year: 2023 },
  "_T-ka-OFs60": { cats: ["Anges & Djinns", "Prophètes"], year: 2023 },
  // Eschatologie
  "pgo08KSRQU4": { cats: ["Eschatologie", "Anges & Djinns"], year: 2024, isTrending: true },
  "XSt2PV7MYQI": { cats: ["Eschatologie"], year: 2024 },
  "w71TTKHSX98": { cats: ["Eschatologie"], year: 2024, isNew: true },
  "PiJuYXJyRsM": { cats: ["Eschatologie"], year: 2023 },
  "ESs8FC08MVI": { cats: ["Eschatologie", "Prophètes"], year: 2023 },
  "JFhFnBWxD-s": { cats: ["Eschatologie", "Prophètes"], year: 2023 },
  "rMgQVmmpyeI": { cats: ["Eschatologie"], year: 2023 },
  "880zNwqJho4": { cats: ["Eschatologie"], year: 2023 },
  // Miracles du Coran
  "JCtF62S2TDI": { cats: ["Miracles du Coran"], year: 2023 },
  "Pn778jWiP-U": { cats: ["Miracles du Coran"], year: 2023 },
  "U4Cdzsu0uaA": { cats: ["Miracles du Coran", "Prophètes"], year: 2023 },
  "Sj4JboSZ-qQ": { cats: ["Miracles du Coran", "Anges & Djinns"], year: 2023 },
  // Héros & Personnages / Batailles
  "LItRZaIf3yY": { cats: ["Héros & Personnages", "Histoire & Mystère"], year: 2023 },
  "spF8Fwo0wIk": { cats: ["Prophètes", "Histoire & Mystère"], year: 2023 },
  "u4k1mgLtdVE": { cats: ["Prophètes", "Eschatologie"], year: 2023 },
  "P0fLsMrOAA0": { cats: ["Héros & Personnages"], year: 2023 },
  "pIuOqdEy2xs": { cats: ["Héros & Personnages", "Miracles du Coran"], year: 2023 },
  "VDsqYf0Obvg": { cats: ["Héros & Personnages"], year: 2023 },
  // Catastrophe / recent
  "wxBzydEYsdU": { cats: ["Histoire & Mystère", "Eschatologie"], year: 2026, isTrending: true, featured: true },
  "_HV3aU0cx-g": { cats: ["Héros & Personnages"], year: 2026, isNew: true },
  // Exclude: U1XwgIo0ylk (app promo), RHJYQG_DiOA (marriage advice), IxgdQuXMWj8 (athar.fr promo),
  // wkOEqVLoztU, fQX6CmVsUIk, llFOl_tVhIw, WGIfVknXDE4, HhKtIsr453c, XVqx0SLFoA0 (short reminders),
  // FuXLtiLt_2w (unrelated), 1JcyxMztr0w (quran recitation), bLZHi1dzaq0 (Omar Suleiman english)
};

// ─── Towards Eternity videos ──────────────────────────────────
const TE: Record<string, VideoMeta> = {
  "c01ys_5EKSI": { cats: ["Prophètes"], year: 2024, featured: true, isTrending: true },
  "vT-GmNItVJo": { cats: ["Prophètes"], year: 2024 },
  "EeFh25K24x8": { cats: ["Prophètes", "Compagnons"], year: 2024 },
  "LmLo4CO0LNw": { cats: ["Prophètes", "Miracles du Coran"], year: 2024 },
  "52C7ExmyPTw": { cats: ["Prophètes", "Histoire & Mystère"], year: 2024 },
  "SFXsnEfVC1s": { cats: ["Prophètes", "Histoire & Mystère"], year: 2024, isTrending: true },
  "D9RaH5IoMCU": { cats: ["Prophètes", "Compagnons", "Héros & Personnages"], year: 2024 },
  "yfF7IXb1q9Q": { cats: ["Prophètes", "Histoire & Mystère"], year: 2024 },
  "YwOFj8edxaU": { cats: ["Prophètes"], year: 2024, isNew: true },
  "TJL2ganDyBc": { cats: ["Compagnons"], year: 2024, isNew: true, isTrending: true },
  "3C4U5WGmFs0": { cats: ["Héros & Personnages", "Histoire & Mystère"], year: 2024 },
  "Yst8jgGviA8": { cats: ["Histoire & Mystère"], year: 2024 },
  "7NKz_Ixu4kc": { cats: ["Prophètes", "Histoire & Mystère"], year: 2024, isNew: true },
  "nISqIWdpYQ8": { cats: ["Prophètes"], year: 2024, isTrending: true },
  "WgPuTsCwhpc": { cats: ["Compagnons", "Héros & Personnages"], year: 2024, isTrending: true },
  "aM14o1R2fkk": { cats: ["Miracles du Coran"], year: 2025, isNew: true },
  "APx0E7O0x6c": { cats: ["Héros & Personnages", "Histoire & Mystère"], year: 2025, isNew: true },
  "IjNfRBnR3Pk": { cats: ["Héros & Personnages", "Histoire & Mystère"], year: 2025, isNew: true },
  "8JcKbq06HRM": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "6nYvhq7rtaU": { cats: ["Prophètes"], year: 2024 },
  "50ExPJin0Ho": { cats: ["Miracles du Coran"], year: 2024 },
  "9Nig8R3mHh4": { cats: ["Miracles du Coran"], year: 2025, isNew: true },
  "HPlRgzr3g_c": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "HVoEpbeehnU": { cats: ["Histoire & Mystère"], year: 2025, isTrending: true },
  "LR3rQ8EG498": { cats: ["Héros & Personnages", "Histoire & Mystère"], year: 2025, isNew: true },
  "Pcwmler30yk": { cats: ["Eschatologie", "Histoire & Mystère"], year: 2025, isNew: true },
  "QwN7qtPeOBg": { cats: ["Compagnons", "Héros & Personnages"], year: 2025, isNew: true },
  "RyH0Ic_xMnw": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "TottSdGMDfM": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "U_KEkklNgE8": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "WXHW3Ac4CWo": { cats: ["Histoire & Mystère"], year: 2025, isTrending: true },
  "bUsQT_fDBdw": { cats: ["Prophètes", "Héros & Personnages"], year: 2025, isNew: true },
  "guKvNzcL4rQ": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "hFKDclO3EY0": { cats: ["Prophètes"], year: 2025, isNew: true },
  "sW1m8S1plOw": { cats: ["Prophètes", "Miracles du Coran"], year: 2025, isNew: true },
  "vnLKa4RkpAA": { cats: ["Prophètes", "Histoire & Mystère"], year: 2025, isTrending: true },
  "xsQmE7GAGyA": { cats: ["Prophètes", "Héros & Personnages"], year: 2025, isNew: true },
  "y2mevKuOKjo": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "AKfptpvAI1g": { cats: ["Miracles du Coran"], year: 2025, isNew: true },
  "BYsk3Lz27Ho": { cats: ["Miracles du Coran"], year: 2025, isNew: true },
  "EkfZS5kCUVY": { cats: ["Miracles du Coran", "Prophètes"], year: 2025, isNew: true },
  "GN71AKyWUbg": { cats: ["Miracles du Coran"], year: 2025, isNew: true },
  "VUAaZoCe-bc": { cats: ["Miracles du Coran"], year: 2025, isNew: true },
  "X3RLnBVL8Jc": { cats: ["Miracles du Coran"], year: 2025, isNew: true },
  "qTUhSeWtCis": { cats: ["Miracles du Coran"], year: 2025, isNew: true },
  "x3On4hWht00": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
};

// ─── Croyant Rationnel videos ──────────────────────────────────
const CR: Record<string, VideoMeta> = {
  "E-3Opi2yDjs": { cats: ["Eschatologie", "Histoire & Mystère"], year: 2025, isTrending: true },
  "Mt6LA6mtk9Q": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "ewyOBQy66-4": { cats: ["Histoire & Mystère"], year: 2025, isTrending: true },
  "h4e25tydSxI": { cats: ["Histoire & Mystère", "Héros & Personnages"], year: 2025, isNew: true },
  "h671xDi-hAA": { cats: ["Eschatologie"], year: 2025, isNew: true },
  "hnp4sw7Zw0c": { cats: ["Histoire & Mystère"], year: 2025, isTrending: true },
  "s-R9ALodR6I": { cats: ["Anges & Djinns"], year: 2025, isNew: true },
  "CNfOSXQsGsg": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "JAVM9SJlrig": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "KzXH2Io3LtM": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "PpuOdplk-B8": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "TClsJ1F398s": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "Vqhwihm-R8c": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "Vz3KE3CdvxU": { cats: ["Compagnons", "Héros & Personnages"], year: 2025, isNew: true },
  "WJ_o3NYI3RA": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "eeLYvyGSTgo": { cats: ["Héros & Personnages", "Histoire & Mystère"], year: 2025, isNew: true },
  "mGf0E0jfeNc": { cats: ["Histoire & Mystère"], year: 2025, isNew: true },
  "nZx97arDIHE": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "qlhM54Cptxw": { cats: ["Eschatologie", "Anges & Djinns"], year: 2025, isNew: true, isTrending: true },
  "xmzTjT-hwJ8": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
  "zLR8DEOThwc": { cats: ["Héros & Personnages"], year: 2025, isNew: true },
};

// ─── Récitateurs videos ───────────────────────────────────────
const REC: Record<string, VideoMeta> = {
  // Ali Jaber
  "keE6RWj5rPA": { cats: ["Récitation"], year: 2018 },
  "lP9BXqigxbc": { cats: ["Récitation"], year: 2018 },
  "3g5pbjvVno4": { cats: ["Récitation"], year: 2014, featured: true },
  "kj551yVmQY8": { cats: ["Récitation"], year: 2018 },
  "LLc623B20ls": { cats: ["Récitation"], year: 2022, isTrending: true },
  "U9dIE3N2tIE": { cats: ["Récitation"], year: 2018 },
  // Mishary Alafasy
  "iJ2TxRjBCnE": { cats: ["Récitation"], year: 2013 },
  "G1Qf9bi8AmY": { cats: ["Récitation"], year: 2013 },
  "r7q71e68H4M": { cats: ["Récitation"], year: 2013, isTrending: true },
  "h8jxPzu5YVs": { cats: ["Récitation"], year: 2013 },
  "RivEU-QOT0I": { cats: ["Récitation"], year: 2013, isTrending: true },
  "Qri9w4pPM5E": { cats: ["Récitation"], year: 2013 },
  // Saad Al-Ghamdi
  "4vet7DHCa5U": { cats: ["Récitation"], year: 2011 },
  "Dm9jXulPVOY": { cats: ["Récitation"], year: 2016 },
  "SHkgkPtMAjk": { cats: ["Récitation"], year: 2011 },
  "mX8DQyrffCM": { cats: ["Récitation"], year: 2025, isNew: true, isTrending: true },
  "oFYbqXBx_PM": { cats: ["Récitation"], year: 2016 },
  "Ns2Gos9jta8": { cats: ["Récitation"], year: 2024, isNew: true },
  // Yasser Al-Dosari
  "i9BjHNjfg30": { cats: ["Récitation"], year: 2024, isNew: true, isTrending: true },
  "dh8zAGxdgUU": { cats: ["Récitation"], year: 2023 },
  "1jXGcuUo0-g": { cats: ["Récitation"], year: 2021 },
  "xseWxg5XN_s": { cats: ["Récitation"], year: 2024, isNew: true },
  "hBvY0CrdGYw": { cats: ["Récitation"], year: 2021 },
  "dXneZvtmlDU": { cats: ["Récitation"], year: 2024, isNew: true },
  // Saud Al-Shuraim
  "pBqCm1T3VfI": { cats: ["Récitation"], year: 2021 },
  "vKrTBwLb1eQ": { cats: ["Récitation"], year: 2021 },
  "c9ITg8WhiLc": { cats: ["Récitation"], year: 2016, isTrending: true },
  "GxDq4ET5ZxI": { cats: ["Récitation"], year: 2011 },
  "gWcZ_mb0YRE": { cats: ["Récitation"], year: 2024, isNew: true },
  // Muhammad Al-Luhaidan
  "ivRXkWVOBXA": { cats: ["Récitation"], year: 2025, isNew: true },
  "ENLA8VAu1Q8": { cats: ["Récitation"], year: 2023 },
  "kt0aWCMqjrw": { cats: ["Récitation"], year: 2025, isNew: true },
  "8n2n4kR0zcg": { cats: ["Récitation"], year: 2023, isTrending: true },
  "7xB_7Q2tvMg": { cats: ["Récitation"], year: 2019 },
  // Muhammad Ayyub (Ayoub)
  "hqBr4YWTRTk": { cats: ["Récitation"], year: 2021 },
  "j2XVqp6sDis": { cats: ["Récitation"], year: 2021 },
  "hChXKoXJ5WM": { cats: ["Récitation"], year: 2021, isTrending: true },
  "bdDC-uu2vuM": { cats: ["Récitation"], year: 2020 },
  "n61YM0m1hD4": { cats: ["Récitation"], year: 2022 },
};

const recitationData: [string, string, string][] = [
  // Ali Jaber
  ["keE6RWj5rPA", "Joz 27 avec traduction en français — Cheikh Ali Jaber", "Récitation du 27ème Joz du Coran par le Cheikh Ali Jaber, accompagnée de la traduction française."],
  ["lP9BXqigxbc", "Sourate As-Saff (61) — Cheikh Ali Jaber", "La sourate du Rang, récitée par le Cheikh Ali Jaber avec traduction française."],
  ["3g5pbjvVno4", "Le Coran Complet, Partie 1 — Cheikh Ali Jaber", "La première partie de la récitation intégrale du Coran par le regretté Cheikh Ali Jaber."],
  ["kj551yVmQY8", "Sourate An-Nur (24) — Cheikh Ali Jaber", "La sourate de la Lumière, magnifiquement récitée par le Cheikh Ali Jaber."],
  ["LLc623B20ls", "Sourate Al-Anbiya, Les Prophètes (21) — Cheikh Ali Jaber", "La sourate des Prophètes, sous-titrée en français, récitée par le Cheikh Ali Jaber."],
  ["U9dIE3N2tIE", "Le Coran Complet, Partie 3 — Cheikh Ali Jaber", "La troisième partie de la récitation intégrale du Saint Coran par le Cheikh Ali Jaber."],
  // Mishary Alafasy
  ["iJ2TxRjBCnE", "Sourate Fâtir (35) — Mishary Rashid Alafasy", "La sourate du Créateur, récitée par Cheikh Mishary Rashid Alafasy et traduite en français."],
  ["G1Qf9bi8AmY", "Sourate At-Tûr (52) — Mishary Rashid Alafasy", "La sourate du Mont Sinaï, récitée par Cheikh Mishary Rashid Alafasy."],
  ["r7q71e68H4M", "Sourate Yâ-Sîn (36) — Mishary Rashid Alafasy", "L'une des sourates les plus récitées, par la voix emblématique de Cheikh Mishary Rashid Alafasy."],
  ["h8jxPzu5YVs", "Sourate Âl 'Imrân (3) — Mishary Rashid Alafasy", "La sourate de la Famille d'Imran, récitée par Cheikh Mishary Rashid Alafasy avec traduction."],
  ["RivEU-QOT0I", "Sourate Al-Baqarah (2) — Mishary Rashid Alafasy", "La sourate de la Vache, la plus longue du Coran, récitée intégralement par Cheikh Mishary Rashid Alafasy."],
  ["Qri9w4pPM5E", "Sourate Al-Kahf (18) — Mishary Rashid Alafasy", "La sourate de la Caverne, traditionnellement récitée le vendredi, par Cheikh Mishary Rashid Alafasy."],
  // Saad Al-Ghamdi
  ["4vet7DHCa5U", "Sourate Yûsuf (12) — Saad Al-Ghamdi", "L'histoire du Prophète Joseph, récitée par Cheikh Saad Al-Ghamdi avec traduction française."],
  ["Dm9jXulPVOY", "Sourate An-Nahl, Les Abeilles (16) — Saad Al-Ghamdi", "La sourate des Abeilles, sous-titrée en français et anglais, par Cheikh Saad Al-Ghamdi."],
  ["SHkgkPtMAjk", "Sourate Maryam (19) — Saad Al-Ghamdi", "La sourate consacrée à Marie, récitée par Cheikh Saad Al-Ghamdi."],
  ["mX8DQyrffCM", "Sourate Al-Kahf complète (18) — Saad Al-Ghamdi", "Récitation intégrale de la sourate de la Caverne par Cheikh Saad Al-Ghamdi, sous-titrée en français."],
  ["oFYbqXBx_PM", "Sourate Al-Baqarah, Partie 2 — Saad Al-Ghamdi", "La sourate de la Vache, sous-titrée en français et anglais, par Cheikh Saad Al-Ghamdi."],
  ["Ns2Gos9jta8", "Sourate Hud (11) — Saad Al-Ghamdi", "Une récitation captivante de la sourate Hud par Cheikh Saad Al-Ghamdi."],
  // Yasser Al-Dosari
  ["i9BjHNjfg30", "Sourate Fussilat (41), récitation émouvante — Yasser Al-Dosari", "Une récitation particulièrement émouvante de la sourate Fussilat par Cheikh Yasser Al-Dosari, avec traduction française."],
  ["dh8zAGxdgUU", "Sourate As-Saffat (37) — Yasser Al-Dosari", "Récitation émouvante de la sourate des Rangés par Cheikh Yasser Al-Dosari, traduite en français."],
  ["1jXGcuUo0-g", "Sourate As-Sajdah (32) — Yasser Al-Dosari", "La sourate de la Prosternation, avec texte arabe et traduction française, par Cheikh Yasser Al-Dosari."],
  ["xseWxg5XN_s", "Sourate An-Nur (24) — Yasser Al-Dosari", "La sourate de la Lumière, récitée par Cheikh Yasser Al-Dosari avec traduction française."],
  ["hBvY0CrdGYw", "Sourate Al-Kahf (18) — Yasser Al-Dosari", "La sourate de la Caverne, récitée par Cheikh Yasser Al-Dosari."],
  ["dXneZvtmlDU", "Sourate Taha (20) — Yasser Al-Dosari", "Une récitation envoûtante de la sourate Taha par Cheikh Yasser Al-Dosari."],
  // Saud Al-Shuraim
  ["pBqCm1T3VfI", "Sourate Al-Kahf (18) — Saud Al-Shuraim", "La sourate de la Caverne, texte arabe et traduction française, par Cheikh Saud Al-Shuraim, ancien imam de la Mosquée Sacrée."],
  ["vKrTBwLb1eQ", "Sourate As-Sajdah (32) — Saud Al-Shuraim", "La sourate de la Prosternation, récitée par Cheikh Saud Al-Shuraim avec traduction française."],
  ["c9ITg8WhiLc", "Sourate Al-Baqarah complète (2) — Saud Al-Shuraim", "Récitation intégrale de la sourate de la Vache par Cheikh Saud Al-Shuraim."],
  ["GxDq4ET5ZxI", "Sourate At-Tawbah, Le Repentir (9) — Saud Al-Shuraim", "Une magnifique récitation de la sourate du Repentir par Cheikh Saud Al-Shuraim."],
  ["gWcZ_mb0YRE", "Sourate Al-Baqarah intégrale — Saud Al-Shuraim", "Récitation complète et apaisante de la sourate Al-Baqarah par Cheikh Saud Al-Shuraim."],
  // Muhammad Al-Luhaidan
  ["ivRXkWVOBXA", "Sourate At-Tawbah, Le Repentir (9) — Muhammad Al-Luhaidan", "Une magnifique récitation de la sourate du Repentir par le Cheikh Muhammad Al-Luhaidan."],
  ["ENLA8VAu1Q8", "Sourate Al-Baqarah, versets 284-286 — Muhammad Al-Luhaidan", "Les derniers versets de la sourate Al-Baqarah, sous-titrés en français, par Cheikh Muhammad Al-Luhaidan."],
  ["kt0aWCMqjrw", "Sourate Ibrahim (14) — Muhammad Al-Luhaidan", "Une récitation empreinte d'humilité de la sourate Ibrahim par Cheikh Muhammad Al-Luhaidan."],
  ["8n2n4kR0zcg", "Récitation poignante — Cheikh Muhammad Al-Luhaidan", "Une récitation particulièrement touchante par Cheikh Muhammad Al-Luhaidan, connu pour sa voix bouleversante."],
  ["7xB_7Q2tvMg", "Récitation émouvante 2019 — Cheikh Muhammad Al-Luhaidan", "Considérée comme l'une des récitations les plus émouvantes, par Cheikh Muhammad Al-Luhaidan."],
  // Muhammad Ayyub
  ["hqBr4YWTRTk", "Sourate As-Sajdah (32) — Muhammad Ayyub", "La sourate de la Prosternation, texte arabe et traduction française, par Cheikh Muhammad Ayyub, ancien imam de la Mosquée du Prophète."],
  ["j2XVqp6sDis", "Sourate Al-Ikhlas (112) — Muhammad Ayyub", "La sourate du Monothéisme Pur, récitée par Cheikh Muhammad Ayyub."],
  ["hChXKoXJ5WM", "Sourate Al-Mulk (67) — Muhammad Ayyub", "La sourate de la Royauté, avec traduction française, par Cheikh Muhammad Ayyub."],
  ["bdDC-uu2vuM", "Sourate Fâtir (35), récitation émouvante — Muhammad Ayyub", "Une récitation empreinte d'émotion de la sourate du Créateur par Cheikh Muhammad Ayyub."],
  ["n61YM0m1hD4", "Sourate An-Nahl (16) — Muhammad Ayyub", "La sourate des Abeilles, récitée par Cheikh Muhammad Ayyub."],
];

const towardsEternityData: [string, string, string][] = [
  ["c01ys_5EKSI", "La Vie du Prophète Muhammad ﷺ — Ô Messager (Ép.1)", "La toute première série au monde retraçant la Sîra du Prophète ﷺ, visualisée par intelligence artificielle. Le début d'un voyage extraordinaire à travers sa vie."],
  ["vT-GmNItVJo", "Les Jours les Plus Durs de l'Islam — Ô Messager (Ép.2)", "Les premières années de la Révélation furent marquées par la persécution. Revivez les épreuves des tout premiers musulmans."],
  ["EeFh25K24x8", "Hamza et Omar Deviennent Musulmans — Ô Messager (Ép.3)", "Deux hommes redoutés se convertissent à l'Islam, changeant à jamais le destin de la communauté naissante à La Mecque."],
  ["LmLo4CO0LNw", "Le Miracle Qui Choqua Quraysh — Ô Messager (Ép.4)", "Un événement surnaturel bouleverse les Quraysh et confirme aux yeux de tous la véracité du message du Prophète ﷺ."],
  ["52C7ExmyPTw", "Le Prophète Muhammad ﷺ a Dû Quitter La Mecque — Ô Messager (Ép.5)", "Face à une persécution croissante, le Prophète ﷺ et ses compagnons entament l'Hégire vers Médine, un tournant décisif de l'Islam."],
  ["SFXsnEfVC1s", "Bataille de Badr – 2 Miracles d'Allah pour Son Messager — Ô Messager (Ép.6)", "Une armée en infériorité numérique triomphe grâce à l'aide divine. Le récit de la bataille de Badr et de ses miracles."],
  ["D9RaH5IoMCU", "Hamza (RA) est Tombé en Martyr — Bataille d'Uhud — Ô Messager (Ép.7)", "La bataille d'Uhud coûte la vie à Hamza, l'oncle du Prophète ﷺ et Lion d'Allah. Un moment de grand sacrifice pour l'Islam naissant."],
  ["yfF7IXb1q9Q", "La Forteresse de Khaybar est Tombée ! — Ô Messager (Ép.9)", "La prise de la forteresse de Khaybar marque une victoire décisive pour la communauté musulmane grandissante."],
  ["YwOFj8edxaU", "Le Dernier Sermon du Prophète ﷺ — Ô Messager (Ép.11)", "Les derniers mots du Prophète ﷺ à son peuple lors du Pèlerinage d'Adieu, un testament spirituel pour toute l'humanité."],
  ["TJL2ganDyBc", "L'Histoire de Khadijah (RA) en IA — Mères du Paradis (Ép.1)", "Première épouse du Prophète ﷺ et première croyante, Khadijah incarna la foi, le soutien et le sacrifice dès les premiers instants de l'Islam."],
  ["3C4U5WGmFs0", "\"Je préférerais que tu sois une pr*stituée plutôt qu'une musulmane\" — Juive convertie à l'Islam", "Le témoignage bouleversant d'une femme juive dont la conversion à l'Islam provoqua le rejet total de sa famille."],
  ["Yst8jgGviA8", "La Nouvelle Preuve Irréfutable de l'Existence de Dieu ! — La Fin de l'Agnosticisme", "Une argumentation qui bouscule l'agnosticisme moderne et propose une preuve renouvelée de l'existence de Dieu."],
  ["7NKz_Ixu4kc", "Le Miracle Du Déluge De Noé — L'Incroyable Histoire du Prophète Noé et Son Arche", "Plongez dans l'histoire fascinante du Prophète Noé (psl), du grand déluge et de la construction de son arche. Un récit captivant sur la foi et la persévérance."],
  ["nISqIWdpYQ8", "La Vie du Prophète Muhammad ﷺ en 21 Minutes", "La vie complète du Prophète Muhammad ﷺ résumée en 21 minutes : de sa naissance à la Révélation, un parcours extraordinaire."],
  ["WgPuTsCwhpc", "L'Histoire des Plus Grands Compagnons du Prophète ﷺ", "Une compilation des récits des plus grands compagnons du Prophète ﷺ, un travail réalisé avec passion et dévotion."],
  ["aM14o1R2fkk", "Les Miracles du Coran Que Vous Allez Entendre pour la Première Fois", "Des miracles scientifiques du Coran que vous n'avez jamais entendus. Une exploration fascinante des preuves divines."],
  ["APx0E7O0x6c", "\"Mon Père M'a Renié Après L'Islam…\" — Un Ex-Chrétien Raconte Son Histoire", "Le témoignage bouleversant d'un ex-chrétien dont la conversion à l'Islam provoqua le rejet de sa famille. Une histoire de foi et de sacrifice."],
  ["IjNfRBnR3Pk", "\"Je me Suis Converti à L'Islam à Hollywood\" — Un Rêve du Propos Divin", "L'histoire incroyable d'une conversion à l'Islam à Hollywood. Quand le rêve divin guide vers la vérité."],
  ["8JcKbq06HRM", "Futur Prêtre se Convertit à L'Islam — \"J'ai Défié le Coran\"", "L'histoire émouvante de la conversion de Yusha Evans, futur prêtre qui défia le Coran avant de trouver la vérité de l'Islam."],
  ["6nYvhq7rtaU", "L'Histoire Complète du Prophète Youssouf (Joseph) — Un Récit Émouvant", "L'histoire complète du Prophète Youssouf (Joseph), trahi par ses frères, vendu comme esclave, puis élevé au plus haut rang par la volonté d'Allah."],
  ["50ExPJin0Ho", "Les Miracles du Coran Que Vous Découvrirez pour la Première Fois", "Une exploration fascinante de miracles du Coran encore méconnus, qui renforcent la foi et émerveillent l'esprit."],
  ["9Nig8R3mHh4", "Allah a Caché ce Miracle dans ta Respiration — Cela va Renforcer ta Foi", "Un miracle divin caché dans l'acte le plus naturel de la vie : la respiration. Une réflexion qui va renforcer votre foi."],
  ["HPlRgzr3g_c", "Un Bouddhiste se Convertit à l'Islam — « Je ne Peux pas Voir Dieu, Pourquoi Croire ? »", "Le témoignage d'un bouddhiste qui trouva la vérité de l'Islam malgré ses questions existentielles sur l'existence de Dieu."],
  ["HVoEpbeehnU", "La Jeunesse qu'Israël Craint — La Génération Z", "Une analyse de la génération Z qui se tourne vers l'Islam en nombre, un phénomène qui inquiète les puissances dominantes."],
  ["LR3rQ8EG498", "La Génération Z se Convertit à l'Islam — La Jeunesse que l'Occident N'attendait Pas", "Un phénomène de masse : les jeunes de la génération Z embrassent l'Islam dans le monde entier. Une révolution spirituelle silencieuse."],
  ["Pcwmler30yk", "Un Bon Non-Musulman en Enfer, Un Musulman Pécheur au Paradis ? — La Réponse Islamique", "Une question philosophique profonde : la justice divine face à la foi et aux actes. La réponse islamique à un dilemme éternel."],
  ["QwN7qtPeOBg", "Fatima (RA) : La Fille du Prophète Muhammad ﷺ — Mères du Paradis (Ép.7)", "Fatima, la fille bien-aimée du Prophète ﷺ, l'une des quatre femmes parfaites de l'histoire. Sa vie, sa foi et son héritage spirituel."],
  ["RyH0Ic_xMnw", "J'ai Abandonné une Vie de Millionnaire pour l'Islam — Histoire de Conversion Émouvante", "Le témoignage d'un homme qui quitta tout — richesse, statut, confort — pour embrasser l'Islam. Un sacrifice inspirant."],
  ["TottSdGMDfM", "De la Boîte de Nuit à l'Islam — Un Entrepreneur de 23 ans se Convertit", "L'histoire d'un jeune entrepreneur de 23 ans qui quitta une vie de fêtes et de nuit pour trouver la vérité dans l'Islam."],
  ["U_KEkklNgE8", "Comment Allah m'a Sauvé — L'Histoire d'un Reconversion Spirituelle", "Un témoignage puissant sur la manière dont Allah guide et sauve ceux qui Le cherchent sincèrement."],
  ["WXHW3Ac4CWo", "J'ai Été Viré de la Mosquée à Cause de mes Tatouages — Non-Croyant vs Musulman", "Un échange fascinant entre un non-croyant et un musulman sur les préjugés, l'apparence et la foi."],
  ["bUsQT_fDBdw", "Bataille de la Tranchée : le Duel Épique d'Ali (RA) — Ô Messager (Ép.8)", "La bataille de la Tranchée et le duel héroïque d'Ali ibn Abi Talib (RA) face au guerrier Amr ibn Abd-Wudd. Un moment de légende."],
  ["guKvNzcL4rQ", "Je chantais dans des églises… jusqu'au jour où j'ai découvert l'islam — Noor Saadeh", "Le témoignage de Noor Saadeh, qui grandit en chantant dans les églises avant de trouver la vérité de l'Islam."],
  ["hFKDclO3EY0", "La Première Série de Sîra Visualisée par IA au Monde — Bande-annonce Ô Messager", "La bande-annonce officielle de la première série au monde retraçant la vie du Prophète ﷺ visualisée par intelligence artificielle."],
  ["sW1m8S1plOw", "Hajar (AS) : Seule dans le Désert avec Ismaïl (AS) — Le Miracle de Zamzam (Ép.6)", "Hajar, seule dans le désert avec son bébé Ismaïl, et le miracle de Zamzam. Un récit de patience et de confiance en Allah."],
  ["vnLKa4RkpAA", "La Conquête de la Mecque — Personne Ne S'attendait à Cela — Ô Messager (Ép.10)", "La conquête de la Mecque par le Prophète ﷺ : un retour triomphal sans effusion de sang. Un tournant historique de l'Islam."],
  ["xsQmE7GAGyA", "Eve (AS) — La Première Femme sur Terre — Mères du Paradis (Ép.8)", "Eve (Hawwa), la première femme de l'humanité. Son histoire, son rôle dans la création et les leçons éternelles de sa vie."],
  ["y2mevKuOKjo", "La Mort Tragique de Ma Mère M'a Conduit à l'Islam — Le Témoignage d'un Ex-Athée Suédois", "L'histoire bouleversante d'un athée suédois dont le deuil maternel fut le point de départ d'un voyage spirituel vers l'Islam."],
  ["AKfptpvAI1g", "Le Scientifique Musulman qui a Découvert la Gravité avant Newton", "Un short fascinant sur les savants musulmans qui ont découvert la gravité bien avant Newton. Un héritage scientifique oublié."],
  ["BYsk3Lz27Ho", "Le Miracle du Coran : Pourquoi la Fourmi a Dit « Écrase-la »", "Un miracle linguistique du Coran dans l'histoire de la fourmi et du Prophète Souleyman. La précision divine des mots du Coran."],
  ["EkfZS5kCUVY", "Pourquoi le Coran N'Appelle Jamais le Souverain de Joseph « Pharaon »", "Une précision étonnante du Coran : il ne nomme jamais « Pharaon » le souverain de l'époque de Joseph. Un miracle historique."],
  ["GN71AKyWUbg", "Le Coran Décrivait Déjà le Ciel Protecteur de la Terre il y a 1 400 Ans", "Le Coran décrivait le rôle protecteur de l'atmosphère terrestre 14 siècles avant la science moderne. Un miracle scientifique."],
  ["VUAaZoCe-bc", "Le Miracle des Montagnes dans le Coran", "Les montagnes, décrites dans le Coran comme des pieux stabilisateurs de la Terre. Un miracle scientifique confirmé par la géologie."],
  ["X3RLnBVL8Jc", "Pourquoi le Coran Parle d'un Moustique Femelle ?", "Pourquoi le Coran mentionne-t-il spécifiquement le moustique femelle ? Une précision biologique étonnante du Livre Saint."],
  ["qTUhSeWtCis", "Le Miracle du Coran : La Lettre qui Révèle la Fin du Soleil", "Une lettre du Coran qui décrit la fin du Soleil. Un miracle linguistique et scientifique qui défie l'entendement."],
  ["x3On4hWht00", "Gagne des Hassanates Pendant que tu Dors — Sunnahs du Coucher ﷺ", "Les sunnahs du coucher du Prophète ﷺ : comment gagner des bonnes actions même pendant son sommeil."],
];

const croyantRationnelData: [string, string, string][] = [
  ["E-3Opi2yDjs", "EBO Noah : Il Annonce la Fin du Monde sur TikTok et Arnaque des Milliers de Personnes", "Une enquête sur EBO Noah, ce influenceur qui annonça la fin du monde sur TikTok et trompa des milliers de croyants. Un rappel sur les faux prophètes."],
  ["Mt6LA6mtk9Q", "Voici le Vrai Visage de Croyant Rationnel", "La présentation et le parcours du créateur de Croyant Rationnel, sa vision et sa démarche pour transmettre l'Islam avec rationalité."],
  ["ewyOBQy66-4", "Epstein a Volé un Morceau de la Kaaba", "Les liens troublants entre Jeffrey Epstein et les mystères de la Kaaba. Une enquête fascinante au croisement de l'histoire et du complot."],
  ["h4e25tydSxI", "Elle a Épousé 40 Hommes, Aucun N'en est Sorti Vivant", "L'histoire mystérieuse d'une femme qui épousa 40 hommes sans qu'aucun n'en réchappe. Un récit fascinant sur la trahison et la justice divine."],
  ["h671xDi-hAA", "Le Faux Mahdi est Arrivé", "Un faux Mahdi fait son apparition. Comment reconnaître les imposteurs de la fin des temps selon les textes islamiques."],
  ["hnp4sw7Zw0c", "24H avec une Tribu Africaine Coupée du Monde", "Une immersion fascinante au sein d'une tribu africaine isolée du reste du monde. Une réflexion sur la foi, la nature et la modernité."],
  ["s-R9ALodR6I", "Un Djin Nous Attaque — On a Tout Filmé", "Une expérience saisissante : une rencontre avec un djinn, filmée en direct. Quand le monde invisible se manifeste."],
  ["CNfOSXQsGsg", "URGENT : Achoura Commence Demain", "Un rappel important sur le jeûne d'Achoura, sa signification spirituelle et les mérites de ce jour sacré dans la tradition islamique."],
  ["JAVM9SJlrig", "Se Plaindre de la Chaleur Peut T'Emmener en Enfer", "Une réflexion sur la gratitude et la patience face aux épreuves du quotidien. Se plaindre peut-il nous nuire spirituellement ?"],
  ["KzXH2Io3LtM", "7 Choses Haram pour les Hommes", "Une liste de 7 choses interdites (haram) spécifiquement pour les hommes en Islam. Un rappel important pour les croyants."],
  ["PpuOdplk-B8", "Explication du Jeûne de Achoura", "Une explication détaillée du jeûne d'Achoura : son histoire, sa signification, et la manière de l'observer selon la Sunna."],
  ["TClsJ1F398s", "Raser sa Barbe est Dangereux pour la Santé", "Une réflexion sur la barbe en Islam et les risques sanitaires du rasage. Entre Sunna, science et conseils pratiques."],
  ["Vqhwihm-R8c", "Il Fait des Rappels mais Il S'en Rappelle Plus", "Une critique de ceux qui transmettent des rappels islamiques sans les appliquer eux-mêmes. Un appel à la sincérité spirituelle."],
  ["Vz3KE3CdvxU", "La Femme de Ousmane Dembélé", "L'histoire et la foi de la femme du footballeur Ousmane Dembélé. Quand l'Islam guide les choix de vie des stars du sport."],
  ["WJ_o3NYI3RA", "URGENT : Arafat Mardi 26 Mai 2026", "Un rappel sur le jour d'Arafat, l'un des jours les plus sacrés de l'année. Les mérites du jeûne et des invocations de ce jour."],
  ["eeLYvyGSTgo", "L'Acteur de Breaking Bad, Giancarlo Esposito, s'est Converti à l'Islam", "L'histoire de la conversion de Giancarlo Esposito, l'acteur de Breaking Bad. Quand les stars d'Hollywood trouvent l'Islam."],
  ["mGf0E0jfeNc", "Les Signes de Main de Naruto sont-ils du Shirk ?", "Une analyse islamique des signes de main dans l'anime Naruto : relèvent-ils du shirk ? Une réflexion entre pop culture et religion."],
  ["nZx97arDIHE", "3 Remèdes Islamiques pour Augmenter sa Testostérone", "Des remèdes issus de la tradition islamique pour booster naturellement la testostérone. Entre Sunna et santé masculine."],
  ["qlhM54Cptxw", "Les Animaux Parlent ! Nouveau Signe de la Fin du Monde", "Un nouveau signe de la fin du monde : les animaux qui parlent. Que disent les textes islamiques sur ce signe majeur ?"],
  ["xmzTjT-hwJ8", "Toutes Tes Duas Seront Acceptées ce Mardi 26 Mai 2026 (Jour d'Arafat)", "Le jour d'Arafat : le jour où toutes les invocations sont exaucées. Un rappel sur l'importance de ce jour béni."],
  ["zLR8DEOThwc", "Elle a Forniqué avec son Cousin", "Une histoire sur les conséquences du péché et le chemin du repentir. Un rappel sur la gravité de la fornication en Islam."],
];

// ─── Build catalog ────────────────────────────────────────────
const narroData: [string, string, string][] = [
  ["FRCyad2J81o", "L'HISTOIRE DU PROPHETE ADAM (EP.1)", "L'origine de l'humanité : la création d'Adam, son entrée au Paradis, et la première désobéissance. Le commencement de toute l'histoire humaine."],
  ["PPZRSJyMEh0", "L'HISTOIRE DU PROPHETE ADAM (EP.2)", "La descente sur Terre, l'épreuve de la vie mortelle, et le premier repentir. Adam et Hawwa apprennent à vivre dans ce monde nouveau."],
  ["ALoYVyoXBqM", "L'HISTOIRE DU PROPHETE ADAM (EP.3)", "Les premiers enfants de l'humanité, la rivalité entre Qabil et Habil, et les leçons éternelles de cette tragédie originelle."],
  ["Du-hjQjzDI4", "L'HISTOIRE DU PROPHETE ADAM (EP.4)", "La fin du récit d'Adam : sa vieillesse, sa succession, et l'héritage spirituel qu'il transmet à l'humanité entière."],
  ["Ha_Wwmtcz2Y", "L'HISTOIRE DE QABIL & HABIL (ABEL ET CAIN)", "Le premier meurtre de l'histoire de l'humanité : la jalousie, la colère, et la tragédie entre les deux fils d'Adam."],
  ["VZJLHaqxZw4", "L'HISTOIRE DU PROPHETE IBRAHIM (EP.1)", "La jeunesse d'Ibrahim : sa quête de vérité face à un peuple idolâtre, et son affrontement avec le roi Nimrod."],
  ["EK-lMsID6_U", "L'HISTOIRE DU PROPHETE IBRAHIM (EP.2)", "Le miracle du feu, l'exil, et la construction de la Kaaba. La foi inébranlable du père des prophètes."],
  ["_Hr6yBbTIM0", "L'HISTOIRE DU PROPHETE IBRAHIM (EP.3)", "Le sacrifice suprême et la construction de la Kaaba. L'épreuve ultime d'Ibrahim et sa soumission totale à Allah."],
  ["rPPlFnKVS2A", "La 1ère fin du monde: L'histoire du Prophète Nouh", "Le déluge, l'arche, et un peuple entier anéanti. L'histoire du prophète Nouh et de la première fin du monde."],
  ["sMxBVKavPO8", "Hud contre Les Géants : le Prophète face au peuple qui défiait Allah", "Le peuple de 'Ad, des géants arrogants qui défièrent Allah. Le prophète Hud face à la plus grande civilisation de son époque."],
  ["xohQqtH1v9k", "L'homme le plus patient de l'Histoire : le Prophète Ayoub", "L'histoire du prophète Ayoub (Job), l'homme qui perdit tout — sa famille, sa santé, sa richesse — mais ne cessa jamais de remercier Allah."],
  ["YxBKtvmQS-M", "L'HISTOIRE DU PROPHÈTE YUNUS", "Le prophète avalé par la baleine, les ténèbres de la mer, et le duo le plus puissant de l'histoire : la patience et le pardon."],
  ["VT14KYY0jWA", "L'HISTOIRE DU PROPHETE YUSUF", "Trahi par ses frères, vendu comme esclave, jeté en prison — puis élevé au plus haut rang. L'histoire extraordinaire de Yusuf (Joseph)."],
  ["MBa9gBXa-18", "La véritable histoire du Prophète Lut (Sodome & Gomorrhe)", "La destruction de Sodome et Gomorrhe : un peuple corrompu, un prophète averti, et une destruction divine sans précédent."],
  ["Xs26kdKEwlg", "Le Prophète Moussa VS le Géant de 3000 ans", "Le face-à-face entre le Prophète Moussa et un géant âgé de 3000 ans. L'un des récits les plus mystérieux de l'Islam."],
  ["utZ20jFavhU", "LES 4 ROIS qui ont possédé entièrement la TERRE", "Quatre rois ont régné sur l'intégralité de la Terre. Qui étaient-ils ? Comment ont-ils obtenu un tel pouvoir ?"],
  ["SWe239O2q6I", "Il était le plus grand adorateur de son époque… voilà comment Iblis l'a détruit", "L'histoire bouleversante de l'homme le plus pieux de son époque, et comment Iblis a réussi à le faire tomber."],
  ["5NRBBvu7Lcs", "Les 4 Prophètes les plus mystérieux du Coran", "Certains prophètes mentionnés dans le Coran restent entourés de mystère. Découvrez les histoires de quatre d'entre eux."],
  ["FJH_e5pwMzk", "Al Khidr: Pourquoi ce Prophète a tué un enfant ?", "Al Khidr, ce mystérieux prophète qui voyagea avec Moussa et commit des actes apparemment incompréhensibles."],
  ["X7b8kSW3PB0", "FIN DU MONDE: Ces SIGNES MINEURS que tout le monde ignore", "Les signes mineurs de l'Heure que nous ignorons pourtant tous. Une exploration détaillée des prophéties."],
  ["vDI4EzrKEQ8", "Nouveau signe de la fin du monde en Arabie !", "Des nouveaux signes de la fin du monde sont apparus en péninsule arabique. Que disent les textes ?"],
  ["UE0Ult3AtrU", "L'Histoire incroyable de HAMZA (Le Lion d'Allah)", "Hamza ibn Abdul Muttalib, l'oncle du Prophète ﷺ, surnommé le Lion d'Allah. Un homme de courage et de conviction."],
  ["NN1CwPcgcCU", "Comment Othman Ibn Affan est devenu milliardaire en Dollar ?", "L'histoire d'Othman Ibn Affan, l'un des plus riches compagnons, qui utilisa sa fortune au service de l'Islam."],
  ["FJguj-Pi59w", "Pourquoi ce mort de 23 ans ne pouvait pas entrer à la mosquée ?", "Une histoire troublante sur un jeune homme décédé et ce qui s'est passé lors de son enterrement."],
  ["WKGSN68aBkI", "Imam Malik: Il a défié le pouvoir au nom de la vérité", "L'Imam Malik, l'un des plus grands savants de l'Islam, qui affronta le calife pour défendre la vérité."],
  ["n-zTOILPVp4", "Djinns, Dajjal, Rothschild : ce que cache VRAIMENT l'Antarctique", "L'Antarctique, ses mystères, et les connexions étranges entre Djinns, Dajjal et les puissances mondiales."],
  ["CuxJEvI3eto", "Aïcha Kandicha : La djinn la plus dangereuse du Maghreb ? (enquête)", "Une enquête fascinante sur Aïcha Kandicha, la créature surnaturelle la plus redoutée du Maghreb."],
  ["ShAjaaV2YjM", "BALENCIAGA et le culte satanique de BAAL ?", "Les liens troublants entre les marques de luxe, le culte de Baal et les pratiques occultes antiques."],
  ["1zks1SMNvIY", "Ce livre de magie a ruiné un milliardaire de la Silicon Valley", "L'histoire d'un milliardaire de la Silicon Valley détruit par un livre de magie ancienne."],
  ["4KNarj80mnY", "Ils ont vu le Dajjal !", "Des hommes ont rencontré le Dajjal. Que leur a-t-il dit ? Que leur a-t-il montré ? Un récit saisissant."],
  ["77a2ywhTNhY", "Qui a enchainé le Dajjal sur une île ?", "Le Dajjal est enchaîné sur une île mystérieuse, attendant l'Heure. Qui l'y a attaché et pourquoi ?"],
  ["CG1BG1U5jXU", "7 Milliards contre Gog et Magog : Le récit de la fin", "Gog et Magog, les peuples qui dévasteront la Terre à la fin des temps. Le récit terrifiant de leur libération."],
  ["CzfGmFN6iao", "Dhul Qarnayn: Le roi qui a conquis toute la Terre", "Dhul Qarnayn, ce roi mystérieux mentionné dans le Coran, qui voyagea d'un bout à l'autre de la Terre."],
  ["MQZnYFWTgJs", "Un explorateur musulman découvre la Barriere de Gog & Magog ?", "La quête pour retrouver la barrière construite par Dhul Qarnayn pour emprisonner Gog et Magog."],
  ["h3SbP3FDd28", "Ils dorment 300 ans et se réveillent.", "L'histoire des Gens de la Caverne : sept jeunes hommes qui dormirent 300 ans et se réveillèrent dans un autre monde."],
  ["i0okdKbT788", "Les gens du Rass: Ce peuple méconnu qui a fondu comme du fer", "L'histoire méconnue du peuple du Rass, mentionné dans le Coran, et leur destruction fulgurante."],
  ["UnmxHm8y5a4", "Les 3 hommes les plus mystérieux du Coran", "Trois hommes mentionnés dans le Coran dont l'identité reste un mystère. Qui sont-ils réellement ?"],
  ["Nv-bAdXllkk", "Qui a vendu la Palestine à un pays qui n'existe pas ?", "Une plongée dans l'histoire de la Palestine et les manipulations géopolitiques qui ont conduit à sa situation actuelle."],
  ["ZxhTqFuSAzg", "La Momie Maudite qui a Coulé le Titanic (Histoire VRAIE)", "L'histoire vraie de la momie maudite qui aurait causé le naufrage du Titanic. Récit ou réalité ?"],
  ["4WQnXfkWygs", "Pourquoi ce jeune homme SOURIAIT encore après sa mort ? (histoire vraie)", "Une histoire vraie et bouleversante : un jeune homme retrouvé souriant après son décès."],
  ["VCkkV5RSQMQ", "Ils ouvrent une tombe de 11 ans et découvrent l'impossible...", "Une découverte stupéfiante dans une tombe de 11 ans. Ce qu'ils y ont trouvé dépasse l'entendement."],
  ["EZh-MCNkicc", "L'HORRIBLE histoire de JEFFREY EPSTEIN", "L'histoire sombre de Jeffrey Epstein et les réseaux de pouvoir qu'il révèle. Une enquête fascinante."],
  ["lZ7B_dZfvPA", "Brûlés pour leur Foi : La Véritable Tragédie des Gens du Fossé", "L'histoire des Gens du Fossé : des croyants brûlés vifs pour leur foi. L'un des récits les plus poignants du Coran."],
  ["xDdF3LCbaGI", "1H après TA MORT", "Que se passe-t-il une heure après votre mort ? Un récit saisissant sur le passage de l'âme."],
];

const yacineData: [string, string, string][] = [
  ["fuX7BViVyno", "L'HISTOIRE DU prophète NOUH (La première fin du monde)", "L'histoire complète du prophète Nouh : l'arche, le déluge, et la destruction d'un peuple entier qui refusa de croire."],
  ["gl0GKDB3Nvo", "Pourquoi on est sur terre ? - Adam Vs Moussa -", "Une conversation fascinante entre les prophètes Adam et Moussa sur le sens de notre existence sur Terre."],
  ["DE6eRTl43DI", "L'HISTOIRE DU PROPHÈTE IBRAHIM : Le Père des Prophètes", "L'histoire complète du prophète Ibrahim, le père des prophètes, et son combat pour le monothéisme."],
  ["XKl4Y36qREs", "L'histoire de Jésus le messie de L'ISLAM", "L'histoire de Jésus (Îsâ) dans la perspective islamique : sa naissance miraculeuse, ses miracles, et son retour."],
  ["Kx6yF2PtsHg", "FACE à des géants...il libère la PALESTINE (Prophète Yoshu Ibn Noun)", "Le prophète Yoshu ibn Noun face à des géants pour libérer la Terre Sainte. Un récit épique de courage et de foi."],
  ["pjyGmUKhx14", "DES GÉANTS ANÉANTIS PAR ALLAH ? (PROPHÈTE HUD & SALEH)", "Les prophètes Hud et Saleh face à des peuples de géants arrogants. La destruction divine de 'Ad et Thamud."],
  ["EGJndSj_-SI", "Y avait-il Des prophètes DJINNS ?", "Existe-t-il des prophètes parmi les Djinns ? Une exploration fascinante d'une question méconnue."],
  ["m8PSuC3HmpA", "Y avait-il Des prophètes NOIRS ?", "L'histoire des prophètes originaires d'Afrique. Une réflexion sur la diversité des prophètes mentionnés dans le Coran."],
  ["juNul3I0z94", "L'histoire du prophète Mohamed ﷺ - En 8 minutes", "La vie du Prophète Mohammed ﷺ résumée en 8 minutes : de sa naissance à son héritage spirituel."],
  ["-zn3YHu_-ME", "La noyade du fils de Noé (Nouh)", "L'histoire déchirante du fils de Nouh qui refusa de monter dans l'arche et périt dans le déluge."],
  ["njgXO6BrLsA", "Crucifié… son histoire fait trembler le prophète ﷺ", "L'histoire d'un compagnon crucifié pour son amour du Prophète ﷺ. Un récit poignant sur la foi et le sacrifice."],
  ["bppu48Ew4QA", "Un ANGE est venu à son secours !!! - L'histoire du compagnon et des anges", "L'histoire d'un compagnon sauvé par l'intervention d'un ange. Quand le monde invisible vient au secours des croyants."],
  ["UjGV8zqtdl0", "Il brûle le CORAN… Un héros de l'Islam", "L'histoire d'un homme qui défia la persécution pour protéger le Coran. Un héros méconnu de l'Islam."],
  ["rSDp4XAo7qk", "Cette FEMME a CHANGÉ la Mecque À tout jamais … Khadija bint Khuwaylid", "Khadija, la première épouse du Prophète ﷺ, la première à croire en lui, et la femme qui changea la Mecque."],
  ["8uqZxbv3-CM", "Découvrez l'histoire de Khadija !", "L'histoire de Khadija bint Khuwaylid : sa foi, sa générosité, et son rôle fondamental dans les premières années de l'Islam."],
  ["JcHMx17vdRE", "La guerre entre les anges et les djinns", "La guerre légendaire entre les anges et les djinns. Un récit épique sur les forces invisibles qui peuplent notre monde."],
  ["iwM8rTPueGI", "Le Djinn qui volait le trésor des Musulmans", "L'histoire d'un djinn qui volait le trésor des musulmans. Quand le monde invisible s'immisce dans les affaires humaines."],
  ["p3gneZAtQOs", "Le plus Puissant DJINN face au prophète Souleyman", "Le prophète Souleyman face au plus puissant des Djinns. La soumission du monde invisible au plus grand roi de l'Islam."],
  ["qLGc1bPyHiw", "La création des djinns, leur réalité ?", "D'où viennent les Djinns ? Comment ont-ils été créés ? Une exploration de leur réalité selon les textes islamiques."],
  ["xoK96rMnQuU", "L'affrontement ANGES vs DJINNS, l'accession du DIABLE", "L'affrontement originel entre les anges et les djinns, et la chute d'Iblis. Le récit de la première rébellion."],
  ["ZHPQEk7N6jY", "Quand les Djinns sont venus voir le prophète ﷺ", "Le récit extraordinaire de la rencontre entre les Djinns et le Prophète ﷺ. Quand le monde invisible vient écouter la Révélation."],
  ["6SgZdJUHchk", "Qui sont l'élite des Anges ?", "Découvrez l'élite des anges : Djibril, Mikael, Israfil, et les plus puissants serviteurs d'Allah."],
  ["KePZWT2nCec", "L'ANGE ISRAFIL a pleuré de PEUR", "L'ange Israfil, celui qui soufflera dans la trompette, a pleuré de peur devant la majesté d'Allah."],
  ["b1b1-uRfJGk", "L'ange de la MORT était choqué ....", "L'ange de la mort (Azraël) face à une situation qui l'a choqué. Un récit sur le mystère de la mort."],
  ["_T-ka-OFs60", "L'ange qui n'a pas SOURIT au PROPHETE ﷺ", "L'histoire d'un ange qui ne sourit jamais et sa rencontre avec le Prophète ﷺ. Un récit sur la gravité et la révérence."],
  ["pgo08KSRQU4", "Le SEUL homme à avoir vu le DAJJAL - Tamim el Dari", "Tamim el Dari, le seul compagnon à avoir rencontré le Dajjal de son vivant. Un récit authentique saisissant."],
  ["XSt2PV7MYQI", "Que se passe-t-il après TA mort ?", "Une exploration de ce qui nous attend après la mort, selon les textes islamiques. Un récit qui invite à la réflexion."],
  ["w71TTKHSX98", "La PREMIÈRE nuit dans TA tombe...", "La première nuit dans la tombe : un récit saisissant sur ce que vit l'âme après son départ de ce monde."],
  ["PiJuYXJyRsM", "Cette vache causera la destruction d'Al-Aqsa ? (La prophétie de la vache rouge)", "La prophétie de la vache rouge et son lien avec la destruction d'Al-Aqsa. Un signe des temps messianiques."],
  ["ESs8FC08MVI", "Pourquoi la Prophétie du Messie HANTE Netanyahu ??", "Les liens troublants entre la prophétie du Messie, le Machiah, et les ambitions politiques contemporaines."],
  ["JFhFnBWxD-s", "2023 PRÉDIT par Le prophète ﷺ (c'est incroyable)", "Des événements contemporains prédits par le Prophète ﷺ il y a 1400 ans. Les signes de notre époque."],
  ["rMgQVmmpyeI", "ON ASSISTE à la réalisation de la PROPHETIE !", "Les prophéties se réalisent sous nos yeux. Un rappel puissant que nous vivons des temps exceptionnels."],
  ["880zNwqJho4", "The Arrival Of Imam Al-Mahdi", "L'arrivée de l'Imam Al-Mahdi : qui est-il ? Quand viendra-t-il ? Que disent les textes sur ce guide de la fin des temps ?"],
  ["JCtF62S2TDI", "Le CORAN révèle un SECRET d'Égypte", "Un secret archéologique d'Égypte révélé par le Coran. Quand les miracles scientifiques rejoignent l'histoire."],
  ["Pn778jWiP-U", "UN MIRACLE scientifique Révélé par le CORAN - Le Mystère du fer", "Le mystère du fer dans le Coran : un miracle scientifique qui défie les explications humaines."],
  ["U4Cdzsu0uaA", "Le SECRET de cette CITÉ est révélé (VILLE DU PROPHÈTE Ibrahim)", "Les découvertes archéologiques qui confirment les récits coraniques sur la cité du prophète Ibrahim."],
  ["Sj4JboSZ-qQ", "Des anges entendus par la NASA !?", "Des sons mystérieux de l'espace captés par la NASA : les anges sont-ils responsables ? Un récit fascinant."],
  ["LItRZaIf3yY", "LA bataille de BADR : Quand les anges ont écrit l'histoire", "La bataille de Badr : 313 musulmans face à 1000 ennemis, et les anges qui combattirent à leurs côtés."],
  ["spF8Fwo0wIk", "IL A DÉTRUIT LA FAUSSE KAABA DU YÉMEN ...Des diables la protégeaient", "L'histoire d'un roi qui détruisit la fausse Kaaba du Yémen protégée par des diables. Quand la foi triomphe des ténèbres."],
  ["u4k1mgLtdVE", "ASSASSINER le Prophète ﷺ A MEKKAH (La réunion secrète du Diable)", "Le complot des Quraysh pour assassiner le Prophète ﷺ et la réunion secrète du Diable à La Mecque."],
  ["P0fLsMrOAA0", "Est-ce qu'Allah t'aime ?", "Comment savoir si Allah nous aime ? Les signes de l'amour divin dans nos vies, selon les enseignements prophétiques."],
  ["pIuOqdEy2xs", "ALLAH a conclu un PACTE avec TOI (tu ne t'en souviens plus)", "Le pacte originel entre Allah et chaque âme humaine avant la création. Un rappel profond de notre engagement éternel."],
  ["VDsqYf0Obvg", "Un récit sur la foi et l'épreuve", "Une histoire puissante sur la foi face à l'épreuve, et la manière dont Allah éprouve ceux qu'Il aime."],
  ["wxBzydEYsdU", "La PIRE catastrophe de l'Histoire islamique", "La pire catastrophe de l'histoire islamique : un récit bouleversant qui marqua la communauté musulmane pour toujours."],
  ["_HV3aU0cx-g", "Cette histoire est une véritable leçon sur le pardon et la miséricorde", "Une histoire touchante sur le pardon, la miséricorde, et la grandeur d'âme dans la tradition islamique."],
];

function hashScore(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return 85 + (hash % 14);
}

function buildItem(
  id: string,
  youtubeId: string,
  title: string,
  description: string,
  channel: Channel,
  meta: VideoMeta
): ContentItem {
  const categories = meta.cats ?? [];
  return {
    id,
    youtubeId,
    title,
    description,
    channel,
    categories,
    year: meta.year ?? 2024,
    rating: "TV-PG",
    duration: "—",
    score: hashScore(id),
    thumbnail: yt(youtubeId),
    image: yt(youtubeId),
    heroImage: meta.featured ? yt(youtubeId) : undefined,
    featured: meta.featured,
    isNew: meta.isNew,
    isTrending: meta.isTrending,
  };
}

// Build the full catalog
const narroItems: ContentItem[] = narroData.map(([vid, title, desc], i) => {
  const meta = N[vid] ?? {};
  return buildItem(`n${i + 1}`, vid, title, desc, "NARRO", meta);
});

const yacineItems: ContentItem[] = yacineData.map(([vid, title, desc], i) => {
  const meta = Y[vid] ?? {};
  return buildItem(`y${i + 1}`, vid, title, desc, "Yacine", meta);
});

const towardsEternityItems: ContentItem[] = towardsEternityData.map(([vid, title, desc], i) => {
  const meta = TE[vid] ?? {};
  return buildItem(`te${i + 1}`, vid, title, desc, "Towards Eternity", meta);
});

const croyantRationnelItems: ContentItem[] = croyantRationnelData.map(([vid, title, desc], i) => {
  const meta = CR[vid] ?? {};
  return buildItem(`cr${i + 1}`, vid, title, desc, "Croyant Rationnel", meta);
});

const recitationItems: ContentItem[] = recitationData.map(([vid, title, desc], i) => {
  const meta = REC[vid] ?? {};
  return buildItem(`rec${i + 1}`, vid, title, desc, "Récitateurs", meta);
});

export const catalog: ContentItem[] = [...narroItems, ...yacineItems, ...towardsEternityItems, ...croyantRationnelItems, ...recitationItems];

// ─── Category rows ────────────────────────────────────────────
const allCategories: Category[] = [
  "Prophètes",
  "Compagnons",
  "Anges & Djinns",
  "Eschatologie",
  "Miracles du Coran",
  "Héros & Personnages",
  "Histoire & Mystère",
  "Récitation",
];

export const rows: { id: string; label: string; items: ContentItem[] }[] = [
  {
    id: "trending",
    label: "Tendances",
    items: catalog.filter((c) => c.isTrending),
  },
  ...allCategories.map((cat) => ({
    id: cat
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    label: cat,
    items: catalog.filter((c) => c.categories.includes(cat)),
  })),
  {
    id: "narro",
    label: "NARRO — Récits Immersifs",
    items: catalog.filter((c) => c.channel === "NARRO"),
  },
  {
    id: "yacine",
    label: "Yacine — Histoires Islamiques",
    items: catalog.filter((c) => c.channel === "Yacine"),
  },
  {
    id: "towards-eternity",
    label: "Towards Eternity — Ô Messager",
    items: catalog.filter((c) => c.channel === "Towards Eternity"),
  },
  {
    id: "recitateurs",
    label: "Récitateurs — Coran",
    items: catalog.filter((c) => c.channel === "Récitateurs"),
  },
  {
    id: "new",
    label: "Nouveautés",
    items: catalog.filter((c) => c.isNew),
  },
].filter((row) => row.items.length > 0);