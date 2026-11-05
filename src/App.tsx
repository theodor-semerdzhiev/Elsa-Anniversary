import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUp, Heart, RotateCcw } from "lucide-react";
import { anniversary } from "./config/anniversary";
import type { AnniversaryConfig } from "./config/types";
import { validateConfig } from "./utils/validate";
import { Gallery } from "./components/Gallery";
import { StickerBoard } from "./components/StickerBoard";
import { Counter } from "./components/Counter";
import { SecretNote } from "./components/Secrets";
import { Effects, celebrate } from "./components/Effects";
import { Music } from "./components/Music";
import { PhotoImage } from "./components/PhotoImage";
function Flower({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`flower-art ${className}`}
      viewBox="0 0 160 230"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M75 220 Q103 140 77 73 M83 164 Q40 164 35 123 Q74 125 83 164 M88 130 Q130 127 139 91 Q104 96 88 130"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M80 74 C27 108 25 62 57 58 C15 27 56 5 75 43 C80 -5 122 17 101 49 C150 32 157 79 112 78 C137 116 91 135 80 74Z"
        fill="var(--blush)"
        stroke="var(--rose)"
        strokeWidth="1.5"
      />
      <circle cx="85" cy="64" r="12" fill="#c8ac74" />
      <path d="M40 131 L73 155 M129 102 L98 123" stroke="currentColor" />
    </svg>
  );
}
function Section({
  id,
  number,
  title,
  subtitle,
  children,
  className = "",
}: {
  id: string;
  number: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      className={`chapter ${className}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
    >
      <header className="chapter-header">
        <span className="chapter-number">
          {number} <span>—</span>
        </span>
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
      </header>
      {children}
    </motion.section>
  );
}
export default function App({
  config: c = anniversary,
}: {
  config?: AnniversaryConfig;
}) {
  const [opened, setOpened] = useState(false);
  const [edition, setEdition] = useState(0);
  const letter = useRef<HTMLElement>(null);
  const opening = useRef<HTMLButtonElement>(null);
  const preference = useReducedMotion();
  const reduced =
    (!!preference && c.features.reducedMotionSupport) ||
    c.theme.intensity === 0;
  useEffect(() => {
    if (import.meta.env.DEV) validateConfig(c).forEach((w) => console.warn(w));
  }, [c]);
  useEffect(() => {
    if (edition > 0) opening.current?.focus({ preventScroll: true });
  }, [edition]);
  const theme = {
    "--bg": c.theme.background,
    "--rose": c.theme.primary,
    "--blush": c.theme.secondary,
    "--paper": c.theme.paper,
    "--ink": c.theme.text,
    "--sage": c.theme.decorative,
    "--serif": c.theme.serif,
    "--hand": c.theme.handwriting,
    "--sans": c.theme.sans,
    "--radius": c.theme.radius,
    "--intensity": c.theme.intensity,
  } as CSSProperties;
  const nav = [
    { id: "letter", label: c.labels.letter, enabled: true },
    {
      id: "memories",
      label: c.labels.memories,
      enabled: c.features.photoGallery,
    },
    {
      id: "timeline",
      label: c.labels.timeline,
      enabled: c.features.relationshipTimeline,
    },
    {
      id: "stickers",
      label: c.labels.stickers,
      enabled: c.features.stickerBoard,
    },
    {
      id: "together",
      label: c.labels.counter,
      enabled: c.features.timeTogether,
    },
  ].filter((n) => n.enabled);
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? "instant" : "smooth",
      block: "start",
    });
  const replay = () => {
    setOpened(false);
    setEdition((n) => n + 1);
    go("beginning");
    opening.current?.focus({ preventScroll: true });
  };
  return (
    <MotionConfig
      reducedMotion={reduced ? "always" : "never"}
      transition={{
        duration: reduced ? 0 : 0.6 * Math.max(0.1, c.theme.intensity),
      }}
    >
      <div
        style={theme}
        className={`scrapbook ${reduced ? "reduced" : ""} ${c.theme.aesthetic}`}
      >
        <Effects config={c} reduced={reduced} />
        <header className="masthead">
          <a href="#beginning" className="brand">
            <Heart size={17} /> {c.labels.book}
          </a>
          <span>
            {c.general.girlfriend} <i>&</i> {c.general.author}
          </span>
          <span className="edition">{c.general.startDate.slice(0, 4)} — ∞</span>
        </header>
        <main key={edition}>
          <section id="beginning" className="opening">
            <div className="hero-topline">
              <span /> <p>{c.general.greeting}</p> <span />
            </div>
            <h1>{c.general.title}</h1>
            <p className="hero-subtitle">{c.general.subtitle}</p>
            <div className="envelope-scene">
              <Flower className="hero-flower" />
              <span className="little-star star-one" aria-hidden="true">
                ✧
              </span>
              <span className="little-star star-two" aria-hidden="true">
                ✧
              </span>
              <span className="envelope-annotation hand">
                {c.labels.openingNote}
                <span aria-hidden="true"> ⤵</span>
              </span>
              <button
                ref={opening}
                className={`envelope ${opened ? "opened" : ""} ${!c.features.envelopeAnimation ? "no-envelope-animation" : ""}`}
                aria-label={c.letter.buttonLabel || c.labels.openLetter}
                aria-expanded={opened}
                aria-controls="letter"
                onClick={() => {
                  if (!opened) setOpened(true);
                  else go("letter");
                }}
              >
                <span className="envelope-back" />
                <span className="envelope-letter">
                  <span className="hand">{c.letter.salutation}</span>
                  <span className="letter-lines" />
                </span>
                <span className="envelope-front" />
                <span className="envelope-flap" />
                <span className="wax-seal">♡</span>
              </button>
              <span className="postmark" aria-hidden="true">
                {c.labels.postmarkTop}
                <br />
                <span>♡</span>
                <br />
                {c.labels.postmarkBottom}
              </span>
            </div>
            <button
              className="text-button opening-button"
              onClick={() => {
                if (!opened) setOpened(true);
                else go("letter");
              }}
            >
              {opened ? c.labels.continue : c.letter.buttonLabel}
              <ArrowDown size={16} />
            </button>
            <div className="opening-bottom">
              <span /> <span aria-hidden="true">✿</span> <span />
            </div>
          </section>
          {opened && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: reduced || !c.features.envelopeAnimation ? 0 : 0.8,
              }}
              onAnimationComplete={() => {
                letter.current?.focus({ preventScroll: true });
              }}
            >
              <nav className="chapter-nav" aria-label={c.labels.book}>
                {nav.map((n) => (
                  <a key={n.id} href={`#${n.id}`}>
                    {n.label}
                  </a>
                ))}
              </nav>
              <section
                id="letter"
                ref={letter}
                tabIndex={-1}
                className="letter-section"
              >
                <article className="letter-paper paper">
                  <span className="tape" />
                  <span className="eyebrow">{c.letter.heading}</span>
                  <h2>{c.letter.salutation}</h2>
                  {c.letter.paragraphs.map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      {p}
                    </motion.p>
                  ))}
                  <p className="signature">{c.letter.signature}</p>
                  {c.letter.postscript && (
                    <p className="postscript">{c.letter.postscript}</p>
                  )}
                  <span className="letter-heart" aria-hidden="true">
                    ♡
                  </span>
                </article>
                <button
                  className="text-button"
                  onClick={() => go(nav[1]?.id || "ending")}
                >
                  {c.labels.continue}
                  <ArrowDown size={16} />
                </button>
              </section>
              {c.features.photoGallery && (
                <Section
                  id="memories"
                  number="01"
                  title={c.labels.galleryHeading}
                  subtitle={c.labels.gallerySubtitle}
                >
                  <Gallery photos={c.photos} labels={c.labels} />
                  {c.features.secretMessages &&
                    c.secrets
                      .filter((s) => s.trigger === "hidden")
                      .map((s) => (
                        <SecretNote
                          key={s.id}
                          secret={s}
                          label={c.labels.revealSurprise}
                        />
                      ))}
                </Section>
              )}
              {c.features.relationshipTimeline && (
                <Section
                  id="timeline"
                  number="02"
                  title={c.labels.timelineHeading}
                  subtitle={c.labels.timelineSubtitle}
                  className="timeline-section"
                >
                  <div className="timeline">
                    {[...c.timeline]
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((m, i) => (
                        <motion.article
                          className="milestone"
                          key={m.id}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                        >
                          <span className="timeline-dot" aria-hidden="true">
                            {m.emoji || "♡"}
                          </span>
                          <span className="eyebrow">
                            {m.date.replaceAll("-", " / ")}
                          </span>
                          <h3>{m.title}</h3>
                          <p>{m.description}</p>
                          {m.location && <small>{m.location}</small>}
                          {m.photo && (
                            <div className="timeline-photo">
                              <PhotoImage
                                path={m.photo}
                                alt={m.title}
                                index={i}
                              />
                            </div>
                          )}
                        </motion.article>
                      ))}
                  </div>
                </Section>
              )}
              {c.features.stickerBoard && (
                <Section
                  id="stickers"
                  number="03"
                  title={c.labels.boardHeading}
                  subtitle={c.labels.boardSubtitle}
                  className="board-section"
                >
                  <StickerBoard stickers={c.stickers} labels={c.labels} />
                </Section>
              )}
              {c.features.timeTogether && (
                <Section id="together" number="04" className="together-section">
                  <Counter config={c} />
                </Section>
              )}
              {c.features.secretMessages && (
                <Section id="secrets" number="05" className="secrets-section">
                  {c.secrets
                    .filter(
                      (s) => s.trigger === "heart" || !c.features.photoGallery,
                    )
                    .map((s) => (
                      <SecretNote
                        key={s.id}
                        secret={s}
                        label={c.labels.revealSurprise}
                      />
                    ))}
                </Section>
              )}
              <motion.section
                id="ending"
                className="ending"
                onViewportEnter={() => {
                  if (c.features.confetti) celebrate();
                }}
                viewport={{ once: true, amount: 0.6 }}
              >
                <Flower />
                <p className="hand">{c.labels.endingNote}</p>
                <h2>{c.general.closingHeading}</h2>
                <p className="closing-message">{c.general.closing}</p>
                <p className="hand closing-signature">{c.letter.signature}</p>
                <button className="text-button" onClick={replay}>
                  <RotateCcw size={16} />
                  {c.labels.replay}
                </button>
              </motion.section>
            </motion.div>
          )}
        </main>
        <footer>
          <span>
            {c.general.footer} <Heart size={12} />
          </span>
          <button className="text-button" onClick={() => go("beginning")}>
            {c.labels.backToTop}
            <ArrowUp size={14} />
          </button>
        </footer>
        {c.features.backgroundMusic && <Music config={c} />}
      </div>
    </MotionConfig>
  );
}
