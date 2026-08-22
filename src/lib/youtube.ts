// Loads the YouTube IFrame API once and resolves when ready.
// The API calls window.onYouTubeIframeAPIReady when loaded; we bridge
// it to a promise so callers can just `await`.

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

export function loadYouTubeAPI(): Promise<void> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const existing = document.getElementById("yt-iframe-api");
    if (existing) {
      window.onYouTubeIframeAPIReady = () => resolve();
      return;
    }

    const tag = document.createElement("script");
    tag.id = "yt-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => resolve();
  });

  return apiPromise;
}

export { apiPromise };
