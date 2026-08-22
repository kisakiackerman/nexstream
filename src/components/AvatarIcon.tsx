type AvatarIconProps = {
  iconId: string;
  className?: string;
};

export const AVATAR_ICONS: { id: string; label: string }[] = [
  { id: "crescent", label: "Croissant de lune" },
  { id: "star", label: "Étoile" },
  { id: "crescent-star", label: "Croissant et étoile" },
  { id: "mosque", label: "Mosquée" },
  { id: "dome", label: "Dôme" },
  { id: "minaret", label: "Minaret" },
  { id: "lantern", label: "Lanterne" },
  { id: "rosette", label: "Rosace géométrique" },
  { id: "star8", label: "Étoile à 8 pointes" },
  { id: "arch", label: "Arche" },
  { id: "tasbih", label: "Chapelet (Tasbih)" },
  { id: "book", label: "Livre" },
  { id: "calligraphy", label: "Calligraphie" },
  { id: "pattern", label: "Motif géométrique" },
];

// Toutes les icônes sont dessinées en trait (stroke="currentColor"), pensées
// pour être posées sur le fond coloré (avatar_color) du profil.
export default function AvatarIcon({ iconId, className = "w-8 h-8" }: AvatarIconProps) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (iconId) {
    case "crescent":
      return (
        <svg {...common}>
          <path d="M15.5 4.5a8 8 0 1 0 0 15 6.5 6.5 0 1 1 0-15Z" fill="currentColor" stroke="none" />
        </svg>
      );

    case "star":
      return (
        <svg {...common}>
          <path
            d="M12 3.5l2.2 5.3 5.7.5-4.3 3.8 1.3 5.6L12 15.9l-4.9 2.8 1.3-5.6-4.3-3.8 5.7-.5L12 3.5Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "crescent-star":
      return (
        <svg {...common}>
          <path d="M13.5 4.5a7.2 7.2 0 1 0 0 14 5.8 5.8 0 1 1 0-14Z" fill="currentColor" stroke="none" />
          <path
            d="M18.3 12.2l.9 1.9 2.1.2-1.6 1.4.5 2-1.9-1.1-1.9 1.1.5-2-1.6-1.4 2.1-.2.9-1.9Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "mosque":
      return (
        <svg {...common}>
          <path d="M12 3v2.2" />
          <circle cx="12" cy="6.2" r="1" fill="currentColor" stroke="none" />
          <path d="M6 20v-6a6 6 0 0 1 12 0v6" />
          <path d="M3 20h18" />
          <path d="M9 20v-4a3 3 0 0 1 6 0v4" />
          <path d="M4 20v-3a2 2 0 0 1 4 0v3" />
          <path d="M16 20v-3a2 2 0 0 1 4 0v3" />
        </svg>
      );

    case "dome":
      return (
        <svg {...common}>
          <path d="M12 3v2" />
          <circle cx="12" cy="5.6" r="0.9" fill="currentColor" stroke="none" />
          <path d="M5 19c0-5.5 3.5-11 7-11s7 5.5 7 11" />
          <path d="M3 19h18" />
          <path d="M8 19v-3a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "minaret":
      return (
        <svg {...common}>
          <path d="M12 2.5v1.8" />
          <circle cx="12" cy="4.9" r="0.7" fill="currentColor" stroke="none" />
          <path d="M9.5 8l2.5-2.3L14.5 8" />
          <path d="M10 8h4v10h-4z" />
          <path d="M9 21h6" />
          <path d="M9 21v-1.5h6V21" />
          <path d="M10.5 11h3" />
          <path d="M10.5 14h3" />
        </svg>
      );

    case "lantern":
      return (
        <svg {...common}>
          <path d="M12 2v2" />
          <path d="M9.5 4h5l-1 2.2h-3L9.5 4Z" />
          <path d="M9 6.5h6l1 3.5-1 8.5H9l-1-8.5 1-3.5Z" />
          <path d="M9.3 10h5.4" />
          <path d="M9.7 14.5h4.6" />
          <path d="M12 18.5V22" />
        </svg>
      );

    case "rosette":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="12"
              x2={12 + 8 * Math.cos((deg * Math.PI) / 180)}
              y2={12 + 8 * Math.sin((deg * Math.PI) / 180)}
              opacity={0.001}
            />
          ))}
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        </svg>
      );

    case "star8":
      return (
        <svg {...common}>
          <path
            d="M12 2.5l1.8 4.2 4.5-1.5-1.5 4.5 4.2 1.8-4.2 1.8 1.5 4.5-4.5-1.5-1.8 4.2-1.8-4.2-4.5 1.5 1.5-4.5-4.2-1.8 4.2-1.8-1.5-4.5 4.5 1.5L12 2.5Z"
          />
        </svg>
      );

    case "arch":
      return (
        <svg {...common}>
          <path d="M6 21V11a6 6 0 0 1 12 0v10" />
          <path d="M3 21h18" />
          <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
        </svg>
      );

    case "tasbih":
      return (
        <svg {...common}>
          <circle cx="12" cy="4.5" r="1.4" />
          <circle cx="17" cy="6.5" r="1.4" />
          <circle cx="19.5" cy="11" r="1.4" />
          <circle cx="18.5" cy="16" r="1.4" />
          <circle cx="14.5" cy="19.3" r="1.4" />
          <circle cx="9.2" cy="19.3" r="1.4" />
          <circle cx="5.2" cy="16" r="1.4" />
          <circle cx="4.2" cy="11" r="1.4" />
          <circle cx="6.8" cy="6.5" r="1.4" />
          <path d="M12 5.9v2" />
        </svg>
      );

    case "book":
      return (
        <svg {...common}>
          <path d="M12 6.5c-1.5-1.3-3.5-2-6-2v13c2.5 0 4.5.7 6 2 1.5-1.3 3.5-2 6-2v-13c-2.5 0-4.5.7-6 2Z" />
          <path d="M12 6.5v13" />
        </svg>
      );

    case "calligraphy":
      return (
        <svg {...common}>
          <path d="M4 15c1-4 3-8 5-8 1.5 0 1 3-.5 5.5C7.2 15 9 15.5 10 13c1-2.5 1.5-6 3-6 1 0 .5 2.5-.5 4.5-.8 1.6.3 2.5 1.5 1.5 1-1 1.5-2.5 3-2.5" />
          <circle cx="18.3" cy="9" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );

    case "pattern":
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1" />
          <rect x="13" y="4" width="7" height="7" rx="1" />
          <rect x="4" y="13" width="7" height="7" rx="1" />
          <rect x="13" y="13" width="7" height="7" rx="1" />
          <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="7.5" cy="16.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="16.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}