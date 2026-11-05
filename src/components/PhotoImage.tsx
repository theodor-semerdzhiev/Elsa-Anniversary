import { useState } from "react";
import { assetUrl } from "../utils/assets";
export function PhotoImage({
  path,
  alt,
  position,
  index = 0,
}: {
  path?: string;
  alt: string;
  position?: string;
  index?: number;
}) {
  const [failed, setFailed] = useState<string>();
  if (path && failed !== path)
    return (
      <img
        loading="lazy"
        src={assetUrl(path)}
        alt={alt}
        style={{ objectPosition: position }}
        onError={() => {
          setFailed(path);
          if (import.meta.env.DEV) console.warn(`Missing image: ${path}`);
        }}
      />
    );
  return (
    <div
      role="img"
      aria-label={alt}
      className={`illustration illustration-${index % 3}`}
    >
      <span className="sun" />
      <span className="hill hill-one" />
      <span className="hill hill-two" />
      <span className="illustration-mark">{["☕", "⛵", "✿"][index % 3]}</span>
      <span className="photo-grain" />
    </div>
  );
}
