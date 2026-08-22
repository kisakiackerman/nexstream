import { useState, useMemo } from 'react';
import { X, Coins, Info } from 'lucide-react';

const ZAKAT_RATE = 0.025; // 2.5%
const NISAB_GOLD_GRAMS = 85;
// Valeur indicative — l'utilisateur doit vérifier le cours du jour, le prix de l'or fluctue.
const DEFAULT_GOLD_PRICE_PER_GRAM = 55000;

function parseAmount(value: string): number {
  const n = parseFloat(value.replace(/\s/g, '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

function formatAmount(n: number): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function ZakatCalculator({ onClose }: { onClose: () => void }) {
  const [currency, setCurrency] = useState('FCFA');
  const [cash, setCash] = useState('');
  const [goldSilver, setGoldSilver] = useState('');
  const [business, setBusiness] = useState('');
  const [debts, setDebts] = useState('');
  const [goldPricePerGram, setGoldPricePerGram] = useState(String(DEFAULT_GOLD_PRICE_PER_GRAM));

  const result = useMemo(() => {
    const cashVal = parseAmount(cash);
    const goldSilverVal = parseAmount(goldSilver);
    const businessVal = parseAmount(business);
    const debtsVal = parseAmount(debts);
    const pricePerGram = parseAmount(goldPricePerGram);

    const netWealth = cashVal + goldSilverVal + businessVal - debtsVal;
    const nisabValue = pricePerGram * NISAB_GOLD_GRAMS;
    const isAboveNisab = netWealth >= nisabValue && nisabValue > 0;
    const zakatDue = isAboveNisab ? netWealth * ZAKAT_RATE : 0;

    return { netWealth, nisabValue, isAboveNisab, zakatDue };
  }, [cash, goldSilver, business, debts, goldPricePerGram]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Coins className="text-amber-400" size={22} />
          <h2 className="text-xl font-semibold text-white">Calculateur de Zakat</h2>
        </div>
        <p className="text-zinc-500 text-sm mb-6">
          Estimation basée sur 2,5% du patrimoine net, au-delà du nisab (référence : {NISAB_GOLD_GRAMS}g d'or).
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-xs mb-1.5">Devise</label>
            <input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="FCFA, EUR, USD..."
              className="w-32 bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-zinc-700 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs mb-1.5">Liquidités (cash, compte bancaire)</label>
            <input
              inputMode="decimal"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-zinc-700 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs mb-1.5">Or et argent détenus (valeur totale)</label>
            <input
              inputMode="decimal"
              value={goldSilver}
              onChange={(e) => setGoldSilver(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-zinc-700 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs mb-1.5">Biens commerciaux (marchandises, stock)</label>
            <input
              inputMode="decimal"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-zinc-700 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs mb-1.5">Dettes à déduire</label>
            <input
              inputMode="decimal"
              value={debts}
              onChange={(e) => setDebts(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-zinc-700 focus:border-emerald-600"
            />
          </div>

          <div className="bg-zinc-800/60 rounded-lg p-3">
            <label className="block text-zinc-400 text-xs mb-1.5">
              Prix de l'or au gramme ({currency || 'devise'})
            </label>
            <input
              inputMode="decimal"
              value={goldPricePerGram}
              onChange={(e) => setGoldPricePerGram(e.target.value)}
              className="w-full bg-zinc-900 text-white text-sm rounded-lg px-3 py-2 outline-none border border-zinc-700 focus:border-emerald-600"
            />
            <p className="flex items-start gap-1.5 text-zinc-500 text-xs mt-2">
              <Info size={12} className="mt-0.5 flex-shrink-0" />
              Valeur indicative — le prix de l'or fluctue quotidiennement. Vérifie le cours du jour
              pour un calcul précis avant de t'acquitter de ta Zakat.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-zinc-800">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-zinc-400">Patrimoine net</span>
            <span className="text-white font-medium">
              {formatAmount(result.netWealth)} {currency}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-zinc-400">Seuil du nisab ({NISAB_GOLD_GRAMS}g d'or)</span>
            <span className="text-white font-medium">
              {formatAmount(result.nisabValue)} {currency}
            </span>
          </div>

          {result.isAboveNisab ? (
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-4 text-center">
              <p className="text-emerald-400 text-sm mb-1">Zakat due (2,5%)</p>
              <p className="text-white text-3xl font-bold">
                {formatAmount(result.zakatDue)} {currency}
              </p>
            </div>
          ) : (
            <div className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-4 text-center">
              <p className="text-zinc-300 text-sm">
                Ton patrimoine net est en dessous du nisab — la Zakat n'est pas obligatoire cette année.
              </p>
            </div>
          )}
        </div>

        <p className="text-zinc-600 text-xs mt-5 text-center">
          Cet outil donne une estimation générale. Pour des cas particuliers (agriculture, bétail,
          Zakat al-Fitr...), consulte un savant qualifié.
        </p>
      </div>
    </div>
  );
}