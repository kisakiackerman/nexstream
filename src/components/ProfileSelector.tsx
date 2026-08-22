import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, User, Loader2, Lock, Delete } from "lucide-react";
import { useViewerProfile, AVATAR_COLORS } from "@/hooks/useViewerProfile";
import type { ViewerProfile } from "@/lib/supabase";
import AvatarIcon, { AVATAR_ICONS } from "@/components/AvatarIcon";
import CategoryOnboarding from "@/components/CategoryOnboarding";

type ProfileSelectorProps = {
  onSelect: () => void;
};

const KID_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#14b8a6"];
const PIN_LENGTH = 4;

function ProfileAvatar({
  profile,
  size = "lg",
  editing = false,
}: {
  profile: ViewerProfile;
  size?: "lg" | "md";
  editing?: boolean;
}) {
  const dim = size === "lg" ? "w-28 h-28 sm:w-36 sm:h-36" : "w-12 h-12";
  const textSize = size === "lg" ? "text-4xl sm:text-5xl" : "text-lg";
  const iconDim = size === "lg" ? "w-14 h-14 sm:w-16 sm:h-16" : "w-6 h-6";
  return (
    <div
      className={`${dim} rounded-2xl flex items-center justify-center ${textSize} font-bold text-white relative overflow-hidden`}
      style={{ backgroundColor: profile.avatar_color }}
    >
      {profile.avatar_icon ? (
        <AvatarIcon iconId={profile.avatar_icon} className={iconDim} />
      ) : (
        profile.name.charAt(0).toUpperCase()
      )}
      {profile.has_pin && !editing && (
        <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-zinc-950/80 border border-white/20 flex items-center justify-center">
          <Lock size={12} className="text-white" />
        </div>
      )}
      {editing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Pencil size={size === "lg" ? 28 : 16} className="text-white" />
        </div>
      )}
    </div>
  );
}

// B2 — Clavier numérique à 4 cases, utilisé pour saisir un PIN existant afin
// d'accéder à un profil protégé.
function PinKeypad({
  profile,
  onSuccess,
  onCancel,
}: {
  profile: ViewerProfile;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { verifyProfilePin } = useViewerProfile();
  const [digits, setDigits] = useState("");
  const [checking, setChecking] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (digits.length !== PIN_LENGTH) return;
    let cancelled = false;

    (async () => {
      setChecking(true);
      setErrorMsg(null);
      const { ok, error } = await verifyProfilePin(profile.id, digits);
      if (cancelled) return;
      setChecking(false);

      if (error) {
        setErrorMsg("Une erreur est survenue, réessayez.");
        setDigits("");
        return;
      }

      if (ok) {
        onSuccess();
      } else {
        setErrorMsg("Code incorrect");
        setShake(true);
        setDigits("");
        setTimeout(() => setShake(false), 400);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  function pressDigit(d: string) {
    if (checking || digits.length >= PIN_LENGTH) return;
    setErrorMsg(null);
    setDigits((prev) => prev + d);
  }

  function pressBackspace() {
    if (checking) return;
    setDigits((prev) => prev.slice(0, -1));
  }

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-center px-4">
      <button
        onClick={onCancel}
        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
      >
        <X size={17} />
      </button>

      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mb-4"
        style={{ backgroundColor: profile.avatar_color }}
      >
        {profile.avatar_icon ? (
          <AvatarIcon iconId={profile.avatar_icon} className="w-10 h-10" />
        ) : (
          profile.name.charAt(0).toUpperCase()
        )}
      </div>
      <p className="text-white font-semibold text-lg mb-1">{profile.name}</p>
      <p className="text-zinc-500 text-sm mb-6">Saisissez le code PIN</p>

      {/* 4 cases */}
      <div
        className={`flex items-center gap-3 mb-3 transition-transform ${shake ? "animate-pulse" : ""}`}
        style={shake ? { animation: "nexstream-pin-shake 0.4s" } : undefined}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold text-white transition-colors ${
              errorMsg ? "border-red-500" : "border-zinc-700"
            } ${i < digits.length ? "bg-zinc-800" : "bg-zinc-900"}`}
          >
            {i < digits.length ? "•" : ""}
          </div>
        ))}
      </div>

      <div className="h-5 mb-6">
        {checking && <Loader2 size={16} className="text-zinc-500 animate-spin" />}
        {!checking && errorMsg && (
          <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
        )}
      </div>

      {/* Clavier numérique */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button
            key={d}
            onClick={() => pressDigit(d)}
            disabled={checking}
            className="h-16 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 disabled:opacity-40 text-white text-xl font-semibold transition-all"
          >
            {d}
          </button>
        ))}
        <div />
        <button
          onClick={() => pressDigit("0")}
          disabled={checking}
          className="h-16 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 disabled:opacity-40 text-white text-xl font-semibold transition-all"
        >
          0
        </button>
        <button
          onClick={pressBackspace}
          disabled={checking}
          className="h-16 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 disabled:opacity-40 text-zinc-300 flex items-center justify-center transition-all"
        >
          <Delete size={20} />
        </button>
      </div>

      <style>{`
        @keyframes nexstream-pin-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// B2 — Sous-formulaire de PIN réutilisé dans l'ajout et l'édition d'un profil.
function PinField({
  hasPin,
  pin,
  onPinChange,
  onRemovePin,
}: {
  hasPin: boolean;
  pin: string;
  onPinChange: (v: string) => void;
  onRemovePin?: () => void;
}) {
  const [showInput, setShowInput] = useState(false);

  if (!showInput && !pin) {
    return (
      <button
        type="button"
        onClick={() => setShowInput(true)}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-xs font-medium transition-colors"
      >
        <Lock size={11} />
        {hasPin ? "Changer le code PIN" : "Définir un code PIN (optionnel)"}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <div className="flex items-center gap-1.5">
        <Lock size={11} className="text-zinc-500" />
        <span className="text-zinc-500 text-xs">Code PIN à 4 chiffres</span>
      </div>
      <input
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={PIN_LENGTH}
        value={pin}
        onChange={(e) => onPinChange(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))}
        placeholder="••••"
        className="w-24 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-1.5 text-white text-sm text-center tracking-[0.3em] outline-none focus:border-emerald-500"
      />
      {hasPin && onRemovePin && (
        <button
          type="button"
          onClick={onRemovePin}
          className="text-red-400/80 hover:text-red-400 text-[11px] transition-colors"
        >
          Retirer le PIN
        </button>
      )}
    </div>
  );
}

// B3 — Grille de sélection d'icône d'avatar (optionnelle, en complément
// de la couleur). null = pas d'icône, on garde l'initiale colorée.
function IconPicker({
  color,
  selected,
  onSelect,
}: {
  color: string;
  selected: string | null;
  onSelect: (iconId: string | null) => void;
}) {
  return (
    <div className="w-full">
      <p className="text-zinc-500 text-xs text-center mb-1.5">Icône (optionnelle)</p>
      <div className="grid grid-cols-5 gap-1.5 max-w-[180px] mx-auto">
        <button
          type="button"
          onClick={() => onSelect(null)}
          title="Aucune icône (initiale)"
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all ${
            selected === null ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
          }`}
          style={{ backgroundColor: color }}
        >
          Aa
        </button>
        {AVATAR_ICONS.map((icon) => (
          <button
            key={icon.id}
            type="button"
            onClick={() => onSelect(icon.id)}
            title={icon.label}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all ${
              selected === icon.id ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundColor: color }}
          >
            <AvatarIcon iconId={icon.id} className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProfileSelector({ onSelect }: ProfileSelectorProps) {
  const {
    profiles,
    loading,
    createProfile,
    updateProfile,
    deleteProfile,
    selectProfile,
    refresh,
    setProfilePin,
  } = useViewerProfile();

  const [manageMode, setManageMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editIsKid, setEditIsKid] = useState(false);
  const [editPin, setEditPin] = useState("");
  const [editIcon, setEditIcon] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(AVATAR_COLORS[0]);
  const [newIsKid, setNewIsKid] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [newIcon, setNewIcon] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // B2 — Profil en attente de vérification de PIN avant sélection
  const [pinPrompt, setPinPrompt] = useState<ViewerProfile | null>(null);
  // B4 — Profil fraîchement créé, en attente de l'onboarding de préférences
  const [onboardingProfile, setOnboardingProfile] = useState<ViewerProfile | null>(null);

  const canAdd = profiles.length < 4;

  const handleSelect = (profile: ViewerProfile) => {
    if (manageMode) return;
    if (profile.has_pin) {
      setPinPrompt(profile);
      return;
    }
    selectProfile(profile);
    onSelect();
  };

  const startEdit = (p: ViewerProfile) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditColor(p.avatar_color);
    setEditIsKid(p.is_kid);
    setEditPin("");
    setEditIcon(p.avatar_icon ?? null);
    setAddingNew(false);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditColor("");
    setEditIsKid(false);
    setEditPin("");
    setEditIcon(null);
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    if (editPin && editPin.length !== PIN_LENGTH) {
      setError("Le code PIN doit contenir 4 chiffres");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await updateProfile(id, {
      name: editName.trim(),
      color: editColor,
      isKid: editIsKid,
      avatarIcon: editIcon,
    });
    if (error) {
      setBusy(false);
      setError(error);
      return;
    }

    if (editPin) {
      const { error: pinError } = await setProfilePin(id, editPin);
      if (pinError) {
        setBusy(false);
        setError(pinError);
        return;
      }
    }

    setBusy(false);
    cancelEdit();
  };

  const removeEditPin = async (id: string) => {
    setBusy(true);
    setError(null);
    const { error } = await setProfilePin(id, null);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setEditPin("");
  };

  const handleDelete = async (id: string) => {
    setBusy(true);
    setError(null);
    const { error } = await deleteProfile(id);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    await refresh();
  };

  const startAdd = () => {
    setAddingNew(true);
    setNewName("");
    setNewColor(AVATAR_COLORS[profiles.length % AVATAR_COLORS.length]);
    setNewIsKid(false);
    setNewPin("");
    setNewIcon(null);
    setEditingId(null);
    setError(null);
  };

  const cancelAdd = () => {
    setAddingNew(false);
    setNewName("");
    setNewIsKid(false);
    setNewPin("");
    setNewIcon(null);
  };

  const saveAdd = async () => {
    if (!newName.trim()) return;
    if (newPin && newPin.length !== PIN_LENGTH) {
      setError("Le code PIN doit contenir 4 chiffres");
      return;
    }
    setBusy(true);
    setError(null);
    const { error, profile } = await createProfile(newName.trim(), newColor, newIsKid, newIcon);
    if (error) {
      setBusy(false);
      setError(error);
      return;
    }

    if (newPin && profile) {
      const { error: pinError } = await setProfilePin(profile.id, newPin);
      if (pinError) {
        setBusy(false);
        setError(pinError);
        return;
      }
    }

    setBusy(false);
    cancelAdd();
    await refresh();

    // B4 — Propose l'onboarding de préférences juste après la création
    if (profile) {
      setOnboardingProfile(profile);
    }
  };

  const colorPalette = newIsKid ? KID_COLORS : AVATAR_COLORS;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={40} className="text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-16">
      {pinPrompt && (
        <PinKeypad
          profile={pinPrompt}
          onCancel={() => setPinPrompt(null)}
          onSuccess={() => {
            selectProfile(pinPrompt);
            setPinPrompt(null);
            onSelect();
          }}
        />
      )}

      {/* B4 — Onboarding des préférences de contenu (optionnel) */}
      {onboardingProfile && (
        <CategoryOnboarding
          profile={onboardingProfile}
          onDone={() => setOnboardingProfile(null)}
        />
      )}

      <h1 className="text-white text-3xl sm:text-5xl font-black mb-2 tracking-tight">
        {manageMode ? "Gérer les profils" : "Qui regarde ?"}
      </h1>
      <p className="text-zinc-500 text-sm sm:text-base mb-10">
        {manageMode
          ? "Modifiez ou supprimez vos profils spectateurs"
          : "Sélectionnez votre profil pour continuer"}
      </p>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm max-w-md">
          {error}
        </div>
      )}

      {/* Profile grid */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mb-10">
        {profiles.map((p) => (
          <div key={p.id} className="flex flex-col items-center gap-3 group">
            {editingId === p.id ? (
              <div className="w-28 sm:w-36 flex flex-col items-center gap-3">
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-bold text-white"
                  style={{ backgroundColor: editColor }}
                >
                  {editIcon ? (
                    <AvatarIcon iconId={editIcon} className="w-14 h-14 sm:w-16 sm:h-16" />
                  ) : (
                    editName.charAt(0).toUpperCase() || "?"
                  )}
                </div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={20}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm text-center outline-none focus:border-emerald-500"
                  placeholder="Nom du profil"
                  autoFocus
                />
                <div className="flex flex-wrap justify-center gap-1.5">
                  {(editIsKid ? KID_COLORS : AVATAR_COLORS).map((c) => (
                    <button
                      key={c}
                      onClick={() => setEditColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        editColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                {/* B3 — Icône d'avatar */}
                <IconPicker color={editColor} selected={editIcon} onSelect={setEditIcon} />

                <label className="flex items-center gap-2 text-zinc-400 text-xs">
                  <input
                    type="checkbox"
                    checked={editIsKid}
                    onChange={(e) => setEditIsKid(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  Profil enfant
                </label>

                {/* B2 — PIN */}
                <PinField
                  hasPin={p.has_pin}
                  pin={editPin}
                  onPinChange={setEditPin}
                  onRemovePin={() => removeEditPin(p.id)}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(p.id)}
                    disabled={busy || !editName.trim()}
                    className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 flex items-center justify-center text-white transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="w-9 h-9 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => (manageMode ? startEdit(p) : handleSelect(p))}
                  className="relative transition-transform hover:scale-105 active:scale-95"
                >
                  <ProfileAvatar profile={p} editing={manageMode} />
                </button>
                {manageMode && (
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={busy}
                    className="text-zinc-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={12} />
                    Supprimer
                  </button>
                )}
                <p className="text-zinc-400 group-hover:text-white text-sm font-medium transition-colors text-center max-w-[8rem] truncate">
                  {p.name}
                </p>
                {p.is_kid && (
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                    Enfant
                  </span>
                )}
              </>
            )}
          </div>
        ))}

        {/* Add new profile */}
        {canAdd && !addingNew && (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={startAdd}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-600 hover:text-zinc-300 transition-colors group"
            >
              <Plus size={48} className="group-hover:scale-110 transition-transform" />
            </button>
            <p className="text-zinc-500 group-hover:text-zinc-300 text-sm font-medium transition-colors">
              Ajouter un profil
            </p>
          </div>
        )}

        {/* New profile form */}
        {addingNew && (
          <div className="w-28 sm:w-36 flex flex-col items-center gap-3">
            <div
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-bold text-white"
              style={{ backgroundColor: newColor }}
            >
              {newIcon ? (
                <AvatarIcon iconId={newIcon} className="w-14 h-14 sm:w-16 sm:h-16" />
              ) : (
                newName.charAt(0).toUpperCase() || "?"
              )}
            </div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={20}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm text-center outline-none focus:border-emerald-500"
              placeholder="Nom du profil"
              autoFocus
            />
            <div className="flex flex-wrap justify-center gap-1.5">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    newColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* B3 — Icône d'avatar */}
            <IconPicker color={newColor} selected={newIcon} onSelect={setNewIcon} />

            <label className="flex items-center gap-2 text-zinc-400 text-xs">
              <input
                type="checkbox"
                checked={newIsKid}
                onChange={(e) => {
                  setNewIsKid(e.target.checked);
                  setNewColor(KID_COLORS[0]);
                }}
                className="accent-emerald-500"
              />
              Profil enfant
            </label>

            {/* B2 — PIN optionnel à la création */}
            <PinField hasPin={false} pin={newPin} onPinChange={setNewPin} />

            <div className="flex gap-2">
              <button
                onClick={saveAdd}
                disabled={busy || !newName.trim()}
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 flex items-center justify-center text-white transition-colors"
              >
                <Check size={16} />
              </button>
              <button
                onClick={cancelAdd}
                className="w-9 h-9 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      {profiles.length === 0 && !addingNew && (
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-24 h-24 rounded-2xl bg-zinc-800 flex items-center justify-center">
            <User size={40} className="text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-center max-w-sm">
            Vous n'avez pas encore de profil. Créez votre premier profil spectateur pour commencer à regarder.
          </p>
        </div>
      )}

      <button
        onClick={() => {
          setManageMode((m) => !m);
          cancelEdit();
          cancelAdd();
        }}
        className="px-6 py-2.5 border border-zinc-600 text-zinc-300 hover:text-white hover:border-white rounded-lg text-sm font-semibold tracking-wider uppercase transition-colors"
      >
        {manageMode ? "Terminer" : "Gérer les profils"}
      </button>
    </div>
  );
}