import { useState } from "react";
import type { Gift } from "../config/types";

export function GiftSection({ gift }: { gift: Gift }) {
  const [selected, setSelected] = useState("");
  return (
    <section
      id="gift"
      className="chapter gift-section"
      aria-labelledby="gift-heading"
    >
      <header className="chapter-header">
        <span className="gift-ribbon" aria-hidden="true">
          ♡
        </span>
        <h2 id="gift-heading">{gift.heading}</h2>
        <p>{gift.introduction}</p>
      </header>
      <fieldset className="gift-choices">
        <legend className="hand">{gift.choiceLabel}</legend>
        <div className="gift-grid">
          {gift.options.map((option) => (
            <label
              className={`paper gift-option ${selected === option.id ? "chosen" : ""}`}
              key={option.id}
            >
              <input
                type="radio"
                name="anniversary-gift"
                value={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
              />
              <span className="gift-symbol" aria-hidden="true">
                {option.symbol}
              </span>
              <span className="gift-title">{option.title}</span>
              <span className="gift-description">{option.description}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="gift-christmas hand">{gift.christmasNote}</p>
      <p className="gift-selection-note" aria-live="polite">
        {selected && gift.selectionNote}
      </p>
    </section>
  );
}
