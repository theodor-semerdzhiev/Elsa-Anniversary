import type { AnniversaryConfig } from "../config/types";
import { parseDate } from "./dates";
export function validateConfig(c: AnniversaryConfig): string[] {
  const warnings: string[] = [];
  for (const [name, list] of Object.entries({
    photos: c.photos,
    timeline: c.timeline,
    stickers: c.stickers,
    secrets: c.secrets,
  })) {
    if (new Set(list.map((item) => item.id)).size !== list.length)
      warnings.push(`Duplicate IDs in ${name}`);
  }
  for (const date of [
    c.general.startDate,
    c.general.anniversaryDate,
    c.counter.startDate,
    ...c.timeline.map((t) => t.date),
    ...c.photos.map((p) => p.date),
  ].filter((d): d is string => !!d))
    if (!parseDate(date)) warnings.push(`Invalid date: ${date}`);
  if (c.secrets.some((s) => !Number.isInteger(s.clicks) || s.clicks < 1))
    warnings.push("Secret clicks must be a positive integer");
  if (
    c.stickers.some(
      (s) => s.size <= 0 || !Number.isFinite(s.x + s.y + s.size + s.rotation),
    )
  )
    warnings.push("Sticker dimensions must be finite and positive");
  try {
    new Intl.DateTimeFormat("en", { timeZone: c.counter.timeZone });
  } catch {
    warnings.push("Invalid counter time zone");
  }
  return warnings;
}
