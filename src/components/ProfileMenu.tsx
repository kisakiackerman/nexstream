import { useState, useEffect, useRef } from "react";
import {
  User,
  Bookmark,
  Clock,
  RefreshCw,
  Settings,
  LogOut,
  ChevronDown,
  Hand,
  BookOpen,
  Compass,
  Coins,
} from "lucide-react";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import { useAuth } from "@/hooks/useAuth";
import AvatarIcon from "@/components/AvatarIcon";

type ProfileMenuProps = {
  onOpenMyList: () => void;
  onOpenWatchHistory: () => void;
  onOpenAccountSettings: () => void;
  onSwitchProfile: () => void;
  onOpenTasbih: () => void;
  onOpenDuas: () => void;
  onOpenQibla: () => void;
  onOpenZakat: () => void;
};

export default function ProfileMenu({
  onOpenMyList,
  onOpenWatchHistory,
  onOpenAccountSettings,
  onSwitchProfile,
  onOpenTasbih,
  onOpenDuas,
  onOpenQibla,
  onOpenZakat,
}: ProfileMenuProps) {
  const { activeProfile } = useViewerProfile();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const handleAction = (fn?: () => void) => {
    setOpen(false);
    fn?.();
  };
  if (!activeProfile) return null;
  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 group"
      >
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-105"
          style={{ backgroundColor: activeProfile.avatar_color }}
        >
          {activeProfile.avatar_icon ? (
            <AvatarIcon iconId={activeProfile.avatar_icon} className="w-4.5 h-4.5" />
          ) : (
            activeProfile.name.charAt(0).toUpperCase()
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-zinc-400 group-hover:text-white transition-all hidden md:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Profil actif</p>
            <p className="text-white font-semibold text-sm mt-0.5">{activeProfile.name}</p>
          </div>
          <div className="py-1">
            <MenuItem icon={<User size={16} />} label="Mon Profil" onClick={() => handleAction(onOpenAccountSettings)} />
            <MenuItem icon={<Bookmark size={16} />} label="Ma Liste" onClick={() => handleAction(onOpenMyList)} />
            <MenuItem icon={<Clock size={16} />} label="Historique de visionnage" onClick={() => handleAction(onOpenWatchHistory)} />
            <MenuItem icon={<Hand size={16} />} label="Tasbih (Dhikr)" onClick={() => handleAction(onOpenTasbih)} />
            <MenuItem icon={<BookOpen size={16} />} label="Douas" onClick={() => handleAction(onOpenDuas)} />
            <MenuItem icon={<Compass size={16} />} label="Direction de la Qibla" onClick={() => handleAction(onOpenQibla)} />
            <MenuItem icon={<Coins size={16} />} label="Calculateur de Zakat" onClick={() => handleAction(onOpenZakat)} />
            <MenuItem icon={<RefreshCw size={16} />} label="Changer de profil" onClick={() => handleAction(onSwitchProfile)} />
            <MenuItem icon={<Settings size={16} />} label="Paramètres du compte" onClick={() => handleAction(onOpenAccountSettings)} />
          </div>
          <div className="border-t border-zinc-800 py-1">
            <MenuItem
              icon={<LogOut size={16} />}
              label="Se déconnecter"
              onClick={() => handleAction(() => signOut())}
              danger
            />
          </div>
        </div>
      )}
    </div>
  );
}
function MenuItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors ${
        danger
          ? "text-red-400 hover:bg-red-900/20"
          : "text-zinc-300 hover:text-white hover:bg-zinc-800"
      }`}
    >
      <span className={danger ? "text-red-400" : "text-zinc-500"}>{icon}</span>
      {label}
    </button>
  );
}