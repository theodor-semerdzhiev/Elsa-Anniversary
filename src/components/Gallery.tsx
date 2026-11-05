import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Labels, Photo } from "../config/types";
import { PhotoImage } from "./PhotoImage";
export function Gallery({
  photos,
  labels,
}: {
  photos: Photo[];
  labels: Labels;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const photo = selected === null ? undefined : photos[selected];
  useEffect(() => {
    if (!photo) return;
    const d = dialog.current!;
    d.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      d.close();
      document.body.style.overflow = overflow;
      trigger.current?.focus();
    };
  }, [!!photo]);
  const move = (delta: number) =>
    setSelected((s) =>
      s === null ? null : (s + delta + photos.length) % photos.length,
    );
  return (
    <>
      <div className="polaroids">
        {photos.map((p, i) => (
          <button
            key={p.id}
            className="polaroid"
            style={
              { "--rotation": `${p.rotation ?? 0}deg` } as React.CSSProperties
            }
            onClick={(e) => {
              trigger.current = e.currentTarget;
              setSelected(i);
            }}
            aria-label={`${labels.memories}: ${p.title}`}
          >
            <span className="tape" />
            <div className="photo-frame">
              <PhotoImage
                path={p.image}
                alt={p.alt || p.title}
                position={p.objectPosition}
                index={i}
              />
            </div>
            <span className="photo-title">{p.title}</span>
            <span className="caption">{p.caption}</span>
            {p.date && (
              <span className="photo-date">
                {p.date.replaceAll("-", " · ")}
              </span>
            )}
            <span className="photo-stickers" aria-hidden="true">
              {p.stickers?.join(" ")}
            </span>
          </button>
        ))}
      </div>
      {photos.length === 0 && (
        <p className="empty-note">{labels.emptyPhotos}</p>
      )}
      {photo && (
        <dialog
          ref={dialog}
          className="photo-dialog"
          aria-labelledby="photo-title"
          onCancel={(e) => {
            e.preventDefault();
            setSelected(null);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") move(1);
            if (e.key === "ArrowLeft") move(-1);
          }}
        >
          <div className="modal-paper">
            <button
              className="icon-button modal-close"
              onClick={() => setSelected(null)}
              aria-label={labels.close}
              autoFocus
            >
              <X />
            </button>
            <div className="modal-image">
              <PhotoImage
                path={photo.image}
                alt={photo.alt || photo.title}
                position={photo.objectPosition}
                index={selected ?? 0}
              />
            </div>
            <h2 id="photo-title">{photo.title}</h2>
            <p className="hand">{photo.caption}</p>
            <small>
              {[photo.date, photo.location].filter(Boolean).join(" · ")}
            </small>
            <p className="story">{photo.story}</p>
            {photos.length > 1 && (
              <div className="modal-controls">
                <button onClick={() => move(-1)} aria-label={labels.previous}>
                  <ArrowLeft />
                </button>
                <span>
                  {(selected ?? 0) + 1} / {photos.length}
                </span>
                <button onClick={() => move(1)} aria-label={labels.next}>
                  <ArrowRight />
                </button>
              </div>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}
