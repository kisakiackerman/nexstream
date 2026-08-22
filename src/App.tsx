import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ViewerProfileProvider, useViewerProfile } from "@/hooks/useViewerProfile";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import PlayerModal from "@/components/PlayerModal";
import InfoModal from "@/components/InfoModal";
import MyListModal from "@/components/MyListModal";
import WatchHistoryModal from "@/components/WatchHistoryModal";
import AccountSettingsModal from "@/components/AccountSettingsModal";
import ProfileSelector from "@/components/ProfileSelector";
import { catalog, rows } from "@/data/catalog";
import { MyListProvider } from "@/lib/useMyList";
import LegalModal from "@/components/LegalModal";
import CatalogPage from "@/components/CatalogPage";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import RecommendedRow from "@/components/RecommendedRow";
import PreferredCategoriesRow from "@/components/PreferredCategoriesRow";
import TasbihCounter from "@/components/TasbihCounter";
import DuasPage from "@/components/DuasPage";
import HijriCalendar from "@/components/HijriCalendar";
import PrayerTimesWidget from "@/components/PrayerTimes";
import QiblaCompass from "@/components/QiblaCompass";
import ZakatCalculator from "@/components/ZakatCalculator";

type ModalState =
  | { type: "none" }
  | { type: "player"; id: string }
  | { type: "info"; id: string }
  | { type: "mylist" }
  | { type: "history" }
  | { type: "settings" }
  | { type: "catalog" }
  | { type: "tasbih" }
  | { type: "duas" }
  | { type: "qibla" }
  | { type: "zakat" };

function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-1 mb-8">
        <div className="w-2 h-8 bg-red-500 rounded-sm" />
        <div className="w-2 h-6 bg-red-400 rounded-sm" />
        <div className="w-2 h-10 bg-red-600 rounded-sm" />
        <span className="text-white font-black text-3xl tracking-tight ml-2">
          NEXSTREAM
        </span>
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-white text-3xl sm:text-4xl font-black mb-3 tracking-tight text-center">
          Bienvenue
        </h1>
        <p className="text-zinc-400 text-base mb-8 leading-relaxed text-center">
          Récits islamiques immersifs, histoires des prophètes et mystères du Coran.
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.4 0-13.8 4.2-17 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.6C29.6 34.9 27 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.9 39.6 16.4 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.5 36.1 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z"
            />
          </svg>
          {loading ? "Connexion..." : "Continuer avec Google"}
        </button>
      </div>

      <p className="text-zinc-600 text-xs mt-12">
        En continuant, vous acceptez les conditions d'utilisation de NexStream.
      </p>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 size={40} className="text-red-500 animate-spin" />
    </div>
  );
}

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { activeProfile, loading: profileLoading } = useViewerProfile();
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  if (authLoading) return <LoadingScreen />;

  if (!user) return <LoginScreen />;

  if (profileLoading) return <LoadingScreen />;

  if (!activeProfile) {
    return <ProfileSelector onSelect={() => {}} />;
  }

  const playingItem =
    modal.type === "player" ? catalog.find((c) => c.id === modal.id) : null;
  const infoItem =
    modal.type === "info" ? catalog.find((c) => c.id === modal.id) : null;

  return (
    <MyListProvider>
      <div className="min-h-screen bg-zinc-950 text-white font-sans">
        <Navbar
  onSelectContent={(id) => setModal({ type: "player", id })}
  onOpenMyList={() => setModal({ type: "mylist" })}
  onOpenWatchHistory={() => setModal({ type: "history" })}
  onOpenAccountSettings={() => setModal({ type: "settings" })}
  onSwitchProfile={() => {
    window.dispatchEvent(new CustomEvent("nexstream-switch-profile"));
  }}
  onOpenCatalog={() => setModal({ type: "catalog" })}
  onOpenTasbih={() => setModal({ type: "tasbih" })}
  onOpenDuas={() => setModal({ type: "duas" })}
  onOpenQibla={() => setModal({ type: "qibla" })}
  onOpenZakat={() => setModal({ type: "zakat" })}
/>

        <Hero
          onPlay={(id) => setModal({ type: "player", id })}
          onInfo={(id) => setModal({ type: "info", id })}
        />

              {/* Content library */}
        <div className="relative z-10 -mt-16 pb-16">
       {/* C3/C4 — widgets Hijri + horaires de prière */}
       <div className="px-8 lg:px-16 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
         <PrayerTimesWidget variant="full" />
         <HijriCalendar variant="full" />
       </div>

       {/* B4 — juste après le Hero, basé sur les préférences de l'onboarding */}
       <PreferredCategoriesRow
         onPlay={(id) => setModal({ type: "player", id })}
         onInfo={(id) => setModal({ type: "info", id })}
       />
       <ContinueWatchingRow onPlay={(id) => setModal({ type: "player", id })} />
       <RecommendedRow
         onPlay={(id) => setModal({ type: "player", id })}
         onInfo={(id) => setModal({ type: "info", id })}
       />
          {rows.map((row) => (
      <ContentRow
        key={row.id}
        label={row.label}
        items={row.items}
        onPlay={(id) => setModal({ type: "player", id })}
        onInfo={(id) => setModal({ type: "info", id })}
        />
    ))}
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 px-8 lg:px-16 py-12">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-1">
                <div className="w-1 h-4 bg-red-500 rounded-sm" />
                <div className="w-1 h-3 bg-red-400 rounded-sm" />
                <div className="w-1 h-5 bg-red-600 rounded-sm" />
              </div>
              <span className="text-white font-black text-lg tracking-tight ml-1">
                NEXSTREAM
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-zinc-500 mb-8">
              {[
                ["FAQ", "Help Center", "Account", "Media Center"],
                ["Investor Relations", "Jobs", "Redeem Gift Cards", "Buy Gift Cards"],
                ["Privacy", "Terms of Use", "Cookie Preferences", "Impressum"],
                ["Contact Us", "Speed Test", "Ad Choices", "Legal Notices"],
              ].map((col, i) => (
                <ul key={i} className="space-y-3">
                  {col.map((item) => (
                    <li key={item}>
                      <button className="hover:text-zinc-300 transition-colors">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <p className="text-zinc-600 text-xs">
              &copy; 2026 NexStream. All rights reserved. This is a demonstration
              interface.
            </p>
          </div>
        </footer>

        {/* Player modal */}
        {modal.type === "player" && playingItem && (
          <PlayerModal
            item={playingItem}
            onClose={() => setModal({ type: "none" })}
            onChangeItem={(id) => setModal({ type: "player", id })}
          />
        )}

        {/* Info modal */}
        {modal.type === "info" && infoItem && (
          <InfoModal
            item={infoItem}
            onClose={() => setModal({ type: "none" })}
            onPlay={(id) => setModal({ type: "player", id })}
          />
        )}

        {/* My List modal */}
        {modal.type === "mylist" && (
          <MyListModal
            onClose={() => setModal({ type: "none" })}
            onPlay={(id) => setModal({ type: "player", id })}
          />
        )}

        {/* Watch history modal */}
        {modal.type === "history" && (
          <WatchHistoryModal
            onClose={() => setModal({ type: "none" })}
            onPlay={(id) => setModal({ type: "player", id })}
          />
        )}

        {/* Account settings modal */}
        {modal.type === "settings" && (
          <AccountSettingsModal onClose={() => setModal({ type: "none" })} />
        )}
        {/* Catalog page */}
{modal.type === "catalog" && (
  <CatalogPage
    onClose={() => setModal({ type: "none" })}
    onPlay={(id) => setModal({ type: "player", id })}
    onInfo={(id) => setModal({ type: "info", id })}
  />
)}
{/* C1 — Tasbih */}
{modal.type === "tasbih" && (
  <TasbihCounter onClose={() => setModal({ type: "none" })} />
)}
{/* C2 — Douas */}
{modal.type === "duas" && (
  <DuasPage onClose={() => setModal({ type: "none" })} />
)}
{/* C5 — Qibla */}
{modal.type === "qibla" && (
  <QiblaCompass onClose={() => setModal({ type: "none" })} />
)}
{/* C7 — Zakat */}
{modal.type === "zakat" && (
  <ZakatCalculator onClose={() => setModal({ type: "none" })} />
)}
      </div>
    </MyListProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ViewerProfileProvider>
        <ProfileSwitchListener />
        <AppContent />
      </ViewerProfileProvider>
    </AuthProvider>
  );
}

function ProfileSwitchListener() {
  const { clearActiveProfile } = useViewerProfile();
  useEffect(() => {
    const handler = () => clearActiveProfile();
    window.addEventListener("nexstream-switch-profile", handler);
    return () => window.removeEventListener("nexstream-switch-profile", handler);
  }, [clearActiveProfile]);
  return null;
}