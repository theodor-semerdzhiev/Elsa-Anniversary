import { useRef, useState } from "react";
import { Music2, Pause } from "lucide-react";
import type { AnniversaryConfig } from "../config/types";
import { assetUrl } from "../utils/assets";
export function Music({ config: c }: { config: AnniversaryConfig }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className="music">
      <audio
        ref={audio}
        src={assetUrl(c.audio.path, import.meta.env.BASE_URL, "file")}
        preload="none"
        loop
        onError={() => {
          setError(true);
          setPlaying(false);
        }}
      />
      <button
        disabled={error}
        onClick={async () => {
          const a = audio.current!;
          a.volume = Math.max(0, Math.min(1, c.audio.volume));
          if (playing) {
            a.pause();
            setPlaying(false);
          } else {
            try {
              await a.play();
              setPlaying(true);
            } catch {
              setError(true);
            }
          }
        }}
      >
        {playing ? <Pause size={16} /> : <Music2 size={16} />}{" "}
        {error ? c.labels.audioError : playing ? c.labels.pause : c.labels.play}
      </button>
    </div>
  );
}
