import { useEffect, useState, useCallback, useRef } from 'react';
import { X, Compass as CompassIcon, MapPin, RotateCw } from 'lucide-react';
import { reverseGeocode, geocodeCity, type PrayerLocation } from '@/utils/prayerTimes';
import { useViewerProfile } from '@/hooks/useViewerProfile';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

function calculateQiblaBearing(lat: number, lng: number): number {
  const userLat = toRad(lat);
  const userLng = toRad(lng);
  const kaabaLat = toRad(KAABA_LAT);
  const kaabaLng = toRad(KAABA_LNG);

  const deltaLng = kaabaLng - userLng;
  const y = Math.sin(deltaLng) * Math.cos(kaabaLat);
  const x =
    Math.cos(userLat) * Math.sin(kaabaLat) -
    Math.sin(userLat) * Math.cos(kaabaLat) * Math.cos(deltaLng);

  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  return bearing;
}

type SensorState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';

export default function QiblaCompass({ onClose }: { onClose: () => void }) {
  const { activeProfile } = useViewerProfile();
  const [location, setLocation] = useState<PrayerLocation | null>(null);
  const [needsManualCity, setNeedsManualCity] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(true);

  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [sensorState, setSensorState] = useState<SensorState>('idle');

  const headingRef = useRef<number | null>(null);

  // 1. Récupération de la position (réutilise le profil si déjà connu, sinon géolocalisation)
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const saved = (activeProfile as any)?.prayer_location as PrayerLocation | undefined;
      if (saved) {
        if (!cancelled) {
          setLocation(saved);
          setLoadingLocation(false);
        }
        return;
      }

      if (!navigator.geolocation) {
        if (!cancelled) {
          setNeedsManualCity(true);
          setLoadingLocation(false);
        }
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const city = await reverseGeocode(latitude, longitude);
          if (cancelled) return;
          setLocation({ lat: latitude, lng: longitude, city });
          setLoadingLocation(false);
        },
        () => {
          if (!cancelled) {
            setNeedsManualCity(true);
            setLoadingLocation(false);
          }
        }
      );
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [activeProfile]);

  async function handleManualCity() {
    if (!cityInput.trim()) return;
    const loc = await geocodeCity(cityInput);
    if (loc) {
      setLocation(loc);
      setNeedsManualCity(false);
    }
  }

  // 2. Calcul du bearing dès que la position est connue
  useEffect(() => {
    if (!location) return;
    setQiblaBearing(calculateQiblaBearing(location.lat, location.lng));
  }, [location]);

  // 3. Gestion du capteur d'orientation
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const webkitHeading = (event as any).webkitCompassHeading as number | undefined;
    let heading: number | null = null;

    if (typeof webkitHeading === 'number') {
      // iOS Safari : déjà un cap absolu par rapport au nord
      heading = webkitHeading;
    } else if (event.absolute && event.alpha !== null) {
      heading = 360 - event.alpha;
    } else if (event.alpha !== null) {
      // Repli non-absolu : mieux que rien, mais moins fiable
      heading = 360 - event.alpha;
    }

    if (heading !== null) {
      headingRef.current = heading;
      setDeviceHeading(heading);
    }
  }, []);

  const enableSensor = useCallback(async () => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setSensorState('unsupported');
      return;
    }

    setSensorState('requesting');

    const RequestPermissionAPI = (DeviceOrientationEvent as any).requestPermission;
    try {
      if (typeof RequestPermissionAPI === 'function') {
        const result = await RequestPermissionAPI();
        if (result !== 'granted') {
          setSensorState('denied');
          return;
        }
      }

      const eventName =
        'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
      window.addEventListener(eventName, handleOrientation as EventListener, true);
      setSensorState('granted');
    } catch {
      setSensorState('denied');
    }
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    };
  }, [handleOrientation]);

  const needleRotation =
    sensorState === 'granted' && deviceHeading !== null && qiblaBearing !== null
      ? qiblaBearing - deviceHeading
      : qiblaBearing ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <CompassIcon className="text-amber-400" size={22} />
          <h2 className="text-xl font-semibold text-white">Direction de la Qibla</h2>
        </div>

        {loadingLocation && (
          <div className="h-64 flex items-center justify-center">
            <RotateCw className="text-zinc-600 animate-spin" size={28} />
          </div>
        )}

        {!loadingLocation && needsManualCity && (
          <div className="bg-zinc-800/60 rounded-xl p-4">
            <p className="text-zinc-300 text-sm mb-2">
              Géolocalisation refusée ou indisponible — entre ta ville :
            </p>
            <div className="flex gap-2">
              <input
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualCity()}
                placeholder="Ex: Dakar, Paris..."
                className="flex-1 bg-zinc-900 text-white text-sm rounded-lg px-3 py-2 outline-none border border-zinc-700"
              />
              <button
                onClick={handleManualCity}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-2 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {!loadingLocation && location && qiblaBearing !== null && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-zinc-500 text-xs mb-4">
              <MapPin size={12} />
              {location.city}
            </div>

            {/* Cadran de la boussole */}
            <div className="relative w-56 h-56 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-zinc-700 bg-zinc-950/60" />
              {/* Repères cardinaux (N fixe en haut, cadran ne tourne pas — seule l'aiguille bouge) */}
              {['N', 'E', 'S', 'O'].map((label, i) => (
                <div
                  key={label}
                  className="absolute inset-0 flex items-start justify-center text-zinc-500 text-xs font-semibold"
                  style={{ transform: `rotate(${i * 90}deg)` }}
                >
                  <span style={{ transform: `rotate(${-i * 90}deg)` }} className="mt-2">
                    {label}
                  </span>
                </div>
              ))}

              {/* Aiguille pointant vers la Qibla */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <div className="relative w-1.5 h-40 flex flex-col items-center">
                  <div
                    className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[22px] border-b-amber-400"
                  />
                  <div className="flex-1 w-1.5 bg-gradient-to-b from-amber-400 to-zinc-700 rounded-full" />
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
            </div>

            <p className="text-white text-2xl font-bold mb-1">
              {Math.round(qiblaBearing)}°
              <span className="text-zinc-500 text-sm font-normal ml-2">depuis le Nord</span>
            </p>

            {sensorState === 'granted' && (
              <p className="text-emerald-400 text-xs mb-4">
                Boussole active — tourne ton téléphone pour aligner l'aiguille vers le haut
              </p>
            )}

            {sensorState !== 'granted' && (
              <div className="text-center mb-2">
                <p className="text-zinc-400 text-xs mb-3 max-w-xs">
                  Sur mobile, active le capteur pour orienter la boussole en temps réel. Sur
                  ordinateur, oriente-toi manuellement vers l'angle indiqué (0° = Nord, mesuré
                  dans le sens horaire).
                </p>
                <button
                  onClick={enableSensor}
                  disabled={sensorState === 'requesting'}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                  {sensorState === 'requesting' ? 'Demande en cours...' : 'Activer la boussole'}
                </button>
                {sensorState === 'denied' && (
                  <p className="text-red-400 text-xs mt-2">
                    Permission refusée — vérifie les réglages de ton navigateur.
                  </p>
                )}
                {sensorState === 'unsupported' && (
                  <p className="text-zinc-500 text-xs mt-2">
                    Capteur d'orientation non disponible sur cet appareil.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}