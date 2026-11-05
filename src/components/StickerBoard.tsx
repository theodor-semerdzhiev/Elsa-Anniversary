import { useLayoutEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Labels, Sticker } from "../config/types";
import { assetUrl } from "../utils/assets";
export function initialPositions(stickers: Sticker[]) {
  return Object.fromEntries(stickers.map((s) => [s.id, { x: s.x, y: s.y }]));
}
export function clampPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  size: number,
) {
  return {
    x: Math.max(0, Math.min(x, width - size)),
    y: Math.max(0, Math.min(y, height - size)),
  };
}
export function StickerBoard({
  stickers,
  labels,
}: {
  stickers: Sticker[];
  labels: Labels;
}) {
  const board = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState(() => initialPositions(stickers));
  const [active, setActive] = useState("");
  const [failed, setFailed] = useState<string[]>([]);
  const drag = useRef<{
    id: string;
    x: number;
    y: number;
    startX: number;
    startY: number;
    width: number;
    height: number;
    size: number;
  } | null>(null);
  // The square wrapper encloses the rotated sticker's actual visual bounds.
  const extent = (s: Sticker) =>
    s.size *
    (Math.abs(Math.cos((s.rotation * Math.PI) / 180)) +
      Math.abs(Math.sin((s.rotation * Math.PI) / 180)));
  const reset = () => {
    const b = board.current!;
    setPositions(
      Object.fromEntries(
        stickers.map((s) => [
          s.id,
          clampPosition(s.x, s.y, b.clientWidth, b.clientHeight, extent(s)),
        ]),
      ),
    );
    setActive("");
  };
  useLayoutEffect(() => {
    const b = board.current!;
    const observer = new ResizeObserver(() =>
      setPositions((old) =>
        Object.fromEntries(
          stickers.map((s) => [
            s.id,
            clampPosition(
              old[s.id]?.x ?? s.x,
              old[s.id]?.y ?? s.y,
              b.clientWidth,
              b.clientHeight,
              extent(s),
            ),
          ]),
        ),
      ),
    );
    observer.observe(b);
    return () => observer.disconnect();
  }, [stickers]);
  return (
    <>
      <div className="sticker-board" ref={board}>
        <span className="board-note hand">{labels.boardNote}</span>
        {stickers.map((s) => {
          const p = positions[s.id] ?? { x: s.x, y: s.y };
          const size = extent(s);
          return (
            <button
              key={s.id}
              aria-label={`${s.label || s.emoji || s.id}. ${labels.stickerControls}`}
              className={`sticker ${active === s.id ? "picked" : ""}`}
              style={{
                left: p.x,
                top: p.y,
                width: size,
                height: size,
                zIndex: active === s.id ? 2 : 1,
              }}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                e.currentTarget.setPointerCapture(e.pointerId);
                setActive(s.id);
                const b = board.current!;
                drag.current = {
                  id: s.id,
                  x: e.clientX,
                  y: e.clientY,
                  startX: p.x,
                  startY: p.y,
                  width: b.clientWidth,
                  height: b.clientHeight,
                  size,
                };
              }}
              onPointerMove={(e) => {
                const d = drag.current;
                if (!d || d.id !== s.id) return;
                setPositions((old) => ({
                  ...old,
                  [s.id]: clampPosition(
                    d.startX + e.clientX - d.x,
                    d.startY + e.clientY - d.y,
                    d.width,
                    d.height,
                    d.size,
                  ),
                }));
              }}
              onPointerUp={() => {
                drag.current = null;
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
              onLostPointerCapture={() => {
                drag.current = null;
              }}
              onKeyDown={(e) => {
                const direction: Record<string, number[]> = {
                  ArrowLeft: [-1, 0],
                  ArrowRight: [1, 0],
                  ArrowUp: [0, -1],
                  ArrowDown: [0, 1],
                };
                const delta = direction[e.key];
                if (!delta) return;
                e.preventDefault();
                setActive(s.id);
                const b = board.current!;
                const step = e.shiftKey ? 20 : 8;
                setPositions((old) => ({
                  ...old,
                  [s.id]: clampPosition(
                    p.x + delta[0] * step,
                    p.y + delta[1] * step,
                    b.clientWidth,
                    b.clientHeight,
                    size,
                  ),
                }));
              }}
            >
              <span
                style={{
                  width: s.size,
                  height: s.size,
                  fontSize: s.size * 0.8,
                  transform: `rotate(${s.rotation}deg)`,
                }}
              >
                {s.image && !failed.includes(s.id) ? (
                  <img
                    draggable="false"
                    src={assetUrl(s.image)}
                    alt=""
                    onError={() => setFailed((old) => [...old, s.id])}
                  />
                ) : (
                  s.emoji || "♡"
                )}
              </span>
            </button>
          );
        })}
      </div>
      <button className="text-button reset" onClick={reset}>
        <RotateCcw size={16} />
        {labels.resetStickers}
      </button>
    </>
  );
}
