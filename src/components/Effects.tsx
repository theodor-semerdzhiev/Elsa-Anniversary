import { useEffect, useRef } from "react";
import type { AnniversaryConfig } from "../config/types";
export function celebrate() {
  window.dispatchEvent(new Event("scrapbook-celebrate"));
}
export function Effects({
  config,
  reduced,
}: {
  config: AnniversaryConfig;
  reduced: boolean;
}) {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced || (!config.features.heartCursor && !config.features.confetti))
      return;
    const root = layer.current!;
    let last = 0;
    let touch: { x: number; y: number } | null = null;
    const spawn = (x: number, y: number, celebration = false) => {
      if (root.childElementCount >= 36) return;
      const particle = document.createElement("span");
      particle.className = "heart-particle";
      particle.textContent = celebration
        ? ["✧", "♡", "✿"][Math.floor(Math.random() * 3)]
        : "♡";
      particle.style.cssText = `left:${x}px;top:${y}px;font-size:${12 + Math.random() * 14}px;--drift:${(Math.random() - 0.5) * 100}px;--rise:${celebration ? -200 : -70}px`;
      root.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove(), {
        once: true,
      });
    };
    const move = (e: PointerEvent) => {
      if (
        !config.features.heartCursor ||
        e.pointerType !== "mouse" ||
        Date.now() - last < 150
      )
        return;
      last = Date.now();
      spawn(e.clientX, e.clientY);
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch") touch = { x: e.clientX, y: e.clientY };
    };
    const up = (e: PointerEvent) => {
      if (
        config.features.heartCursor &&
        touch &&
        Math.hypot(e.clientX - touch.x, e.clientY - touch.y) < 10
      )
        for (let i = 0; i < 3; i++) spawn(e.clientX, e.clientY);
      touch = null;
    };
    const burst = () => {
      if (config.features.confetti)
        for (let i = 0; i < 24; i++)
          spawn(
            window.innerWidth * (0.25 + Math.random() * 0.5),
            window.innerHeight * 0.65,
            true,
          );
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("scrapbook-celebrate", burst);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("scrapbook-celebrate", burst);
      root.replaceChildren();
    };
  }, [config, reduced]);
  return (
    <>
      <div className="effects" aria-hidden="true" ref={layer} />
      <div className="background-effects" aria-hidden="true">
        {config.features.floatingHearts &&
          !reduced &&
          Array.from(
            { length: Math.min(30, Math.max(0, config.floating.density)) },
            (_, i) => (
              <span
                key={i}
                className="floating-heart"
                style={{
                  left: `${(i * 37 + 7) % 100}%`,
                  animationDuration: `${Math.max(5, config.floating.speed) + (i % 5)}s`,
                  animationDelay: `${-i * 4}s`,
                  opacity: config.floating.opacity,
                  color:
                    config.floating.colours[i % config.floating.colours.length],
                }}
              >
                ♡
              </span>
            ),
          )}
      </div>
    </>
  );
}
