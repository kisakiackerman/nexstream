import { useEffect } from "react";
import { X, LogOut, Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useViewerProfile } from "@/hooks/useViewerProfile";
import AvatarIcon from "@/components/AvatarIcon";

type AccountSettingsModalProps = {
  onClose: () => void;
};

export default function AccountSettingsModal({ onClose }: AccountSettingsModalProps) {
  const { user, signOut } = useAuth();
  const { profiles, activeProfile } = useViewerProfile();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-md max-h-[90vh] bg-zinc-900 sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl mt-16 sm:mt-0">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800 flex-shrink-0">
          <h2 className="text-white font-bold text-lg flex-1">Paramètres du compte</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Google account info */}
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-3">
              Compte
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-zinc-800/50 rounded-xl px-4 py-3">
                <Mail size={18} className="text-zinc-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-zinc-500 text-xs">Email</p>
                  <p className="text-white text-sm truncate">{user?.email ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-800/50 rounded-xl px-4 py-3">
                <UserIcon size={18} className="text-zinc-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-zinc-500 text-xs">Nom</p>
                  <p className="text-white text-sm truncate">
                    {user?.user_metadata?.full_name ??
                      user?.user_metadata?.name ??
                      "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active profile info */}
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-3">
              Profil actif
            </p>
            <div className="flex items-center gap-3 bg-zinc-800/50 rounded-xl px-4 py-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: activeProfile?.avatar_color ?? "#71717a" }}
              >
                {activeProfile?.avatar_icon ? (
                  <AvatarIcon iconId={activeProfile.avatar_icon} className="w-5 h-5" />
                ) : (
                  activeProfile?.name?.charAt(0).toUpperCase() ?? "?"
                )}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {activeProfile?.name ?? "Aucun"}
                </p>
                {activeProfile?.is_kid && (
                  <p className="text-emerald-400 text-xs">Profil enfant</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile count */}
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-3">
              Profils spectateurs
            </p>
            <p className="text-zinc-300 text-sm">
              {profiles.length} / 4 profils créés
            </p>
          </div>

          {/* Sign out */}
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
