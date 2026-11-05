import { useState } from "react";
import { motion } from "framer-motion";
import type { Secret } from "../config/types";
import { PhotoImage } from "./PhotoImage";
import { celebrate } from "./Effects";
export function secretUnlocked(count: number, required: number) {
  return count >= Math.max(1, required);
}
export function SecretNote({
  secret,
  label,
}: {
  secret: Secret;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const unlocked = secretUnlocked(count, secret.clicks);
  return (
    <div
      className={`secret-note ${secret.trigger === "hidden" ? "hidden-flower" : ""}`}
    >
      <p className="hand">{secret.hint}</p>
      <button
        className="secret-trigger"
        aria-label={`${label}: ${secret.hint}`}
        aria-expanded={unlocked}
        onClick={() => {
          if (unlocked) return;
          const next = count + 1;
          setCount(next);
          if (secretUnlocked(next, secret.clicks)) celebrate();
        }}
      >
        {secret.trigger === "heart" ? "♥" : "✿"}
      </button>
      <div aria-live="polite" className="secret-progress">
        {!unlocked && `${count} / ${Math.max(1, secret.clicks)}`}
      </div>
      {unlocked && (
        <motion.article
          className="secret-paper paper"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>{secret.title}</h3>
          <p>{secret.body}</p>
          {secret.image && (
            <PhotoImage path={secret.image} alt={secret.title} />
          )}
          <p className="hand">{secret.closing}</p>
        </motion.article>
      )}
    </div>
  );
}
