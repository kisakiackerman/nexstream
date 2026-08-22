import { catalog, type ContentItem } from "@/data/catalog";

// Normalize French text: remove accents, lowercase, strip punctuation
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Synonym map — maps common search terms to canonical concepts
const SYNONYMS: Record<string, string[]> = {
  // Prophets
  "adam": ["adam", "homme", "creation", "premier homme"],
  "ibrahim": ["ibrahim", "abraham", "pere des prophetes", "kaaba", "feu"],
  "moussa": ["moussa", "moses", "moise", "pharaon", "geant"],
  "nouh": ["nouh", "noe", "deluge", "arche", "fin du monde"],
  "yusuf": ["yusuf", "joseph", "prison", "freres"],
  "yunus": ["yunus", "jonas", "baleine", "poisson"],
  "isa": ["isa", "jesus", "messie", "maryam", "vierge"],
  "souleyman": ["souleyman", "salomon", "djinn", "roi"],
  "ayoub": ["ayoub", "job", "patience", "maladie"],
  "lut": ["lut", "lot", "sodome", "gomorrhe"],
  "hud": ["hud", "geants", "ad"],
  "saleh": ["saleh", "thamud", "vache"],
  "khidr": ["khidr", "al khidr", "enfant"],
  "yoshu": ["yoshu", "palestine", "geants"],
  "mohammed": ["mohammed", "muhammad", "prophete", "mecque", "medine"],
  // Companions
  "hamza": ["hamza", "lion", "oncle"],
  "othman": ["othman", "rich", "milliardaire"],
  "khadija": ["khadija", "femme", "epouse", "premier croyant"],
  "tamim": ["tamim", "dajjal", "ile"],
  // Angels & Jinn
  "ange": ["ange", "anges", "djibril", "mikael", "israfil", "azrael"],
  "djinn": ["djinn", "djinns", "iblis", "diable", "satan", "shaytan"],
  "dajjal": ["dajjal", "antechrist", "faux messie"],
  "gog": ["gog", "magog", "yajuj", "majuj", "barriere"],
  "dhul": ["dhul qarnayn", "roi", "conquerant"],
  // End times
  "fin": ["fin", "fin du monde", "signes", "heure", "jugement", "mort", "tombe"],
  "mahdi": ["mahdi", "imam", "fin des temps"],
  "prophetie": ["prophetie", "prediction", "signe", "realisation"],
  // Topics
  "miracle": ["miracle", "coran", "scientifique", "egypte", "fer"],
  "bataille": ["bataille", "badr", "guerre", "combat"],
  "pardon": ["pardon", "misericorde", "lecon"],
  "pacte": ["pacte", "alliance", "ame"],
};

function getSynonyms(term: string): string[] {
  const norm = normalize(term);
  for (const [key, vals] of Object.entries(SYNONYMS)) {
    if (norm.includes(key) || vals.some((v) => norm.includes(v))) {
      return vals;
    }
  }
  return [norm];
}

function scoreItem(item: ContentItem, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const title = normalize(item.title);
  const desc = normalize(item.description);
  const cats = item.categories.map(normalize).join(" ");
  const channel = normalize(item.channel);

  let score = 0;

  // Exact title match (highest priority)
  if (title === q) score += 100;
  if (title.includes(q)) score += 50;

  // Title word matches
  const qWords = q.split(" ").filter((w) => w.length > 1);
  for (const word of qWords) {
    if (title.includes(word)) score += 20;
  }

  // Description matches
  for (const word of qWords) {
    if (desc.includes(word)) score += 8;
  }

  // Category matches
  for (const word of qWords) {
    if (cats.includes(word)) score += 15;
  }

  // Synonym expansion
  for (const word of qWords) {
    const synonyms = getSynonyms(word);
    for (const syn of synonyms) {
      if (title.includes(syn) && !title.includes(word)) score += 12;
      if (desc.includes(syn) && !desc.includes(word)) score += 6;
      if (cats.includes(syn) && !cats.includes(word)) score += 10;
    }
  }

  // Channel match
  if (channel.includes(q)) score += 15;

  // Boost trending and featured
  if (item.isTrending) score += 5;
  if (item.featured) score += 3;

  return score;
}

export function smartSearch(query: string, limit = 8): ContentItem[] {
  const q = query.trim();
  if (q.length < 2) return [];

  return catalog
    .map((item) => ({ item, score: scoreItem(item, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}

// Suggestions when the search field is focused but empty
export const searchSuggestions = [
  "Prophète Ibrahim",
  "Fin du monde",
  "Djinns",
  "Compagnons du Prophète",
  "Anges",
  "Miracles du Coran",
  "Bataille de Badr",
  "Khadija",
  "Dajjal",
  "Prophète Moussa",
];
