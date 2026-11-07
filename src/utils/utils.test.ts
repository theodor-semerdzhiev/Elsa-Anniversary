import { describe, it, expect } from "vitest";
import { parseDate, dayDifference, calendarDuration } from "./dates";
import { assetUrl } from "./assets";
import { validateConfig } from "./validate";
import { anniversary } from "../config/anniversary";
import { initialPositions, clampPosition } from "../components/StickerBoard";
describe("calendar dates", () => {
  it("counts calendar days across daylight saving boundaries", () => {
    expect(dayDifference("2024-03-09", "2024-03-11")).toBe(2);
    expect(dayDifference("2024-11-02", "2024-11-04")).toBe(2);
  });
  it("handles leap years and century rules", () => {
    expect(dayDifference("2024-02-28", "2024-03-01")).toBe(2);
    expect(dayDifference("2023-02-28", "2023-03-01")).toBe(1);
    expect(parseDate("1900-02-29")).toBeNull();
    expect(parseDate("2000-02-29")).not.toBeNull();
  });
  it("clamps month-end anniversaries", () => {
    expect(calendarDuration("2024-01-31", "2024-02-29")).toEqual({
      years: 0,
      months: 1,
      days: 0,
    });
    expect(calendarDuration("2024-01-31", "2024-03-30")).toEqual({
      years: 0,
      months: 1,
      days: 30,
    });
    expect(calendarDuration("2024-02-29", "2025-02-28")).toEqual({
      years: 1,
      months: 0,
      days: 0,
    });
  });
  it("rejects invalid dates and handles future start", () => {
    expect(dayDifference("oops", "2024-01-01")).toBeNull();
    expect(parseDate("2024-02-30")).toBeNull();
    expect(parseDate("2024-13-01")).toBeNull();
    expect(dayDifference("2030-01-01", "2024-01-01")).toBe(0);
  });
});
describe("asset URLs", () => {
  it("supports repository paths and file types", () => {
    for (const extension of ["jpg", "png", "webp"])
      expect(assetUrl(`photos/our-photo_1.${extension}`, "/anniversary/")).toBe(
        `/anniversary/images/photos/our-photo_1.${extension}`,
      );
    expect(assetUrl("/images/photos/a.jpg", "/gift/")).toBe(
      "/gift/images/photos/a.jpg",
    );
    expect(assetUrl("audio/song.mp3", "/gift/", "file")).toBe(
      "/gift/audio/song.mp3",
    );
    expect(assetUrl("photos/a.jpg", "./")).toBe("./images/photos/a.jpg");
  });
});
describe("configuration", () => {
  it("accepts the current anniversary config", () =>
    expect(validateConfig(anniversary)).toEqual([]));
  it("reports duplicate IDs, invalid dates and bad triggers", () => {
    const c = structuredClone(anniversary);
    c.photos.push(c.photos[0]);
    c.general.startDate = "bad";
    c.secrets[0].clicks = 0;
    expect(validateConfig(c)).toEqual([
      "Duplicate IDs in photos",
      "Invalid date: bad",
      "Secret clicks must be a positive integer",
    ]);
  });
});
describe("sticker positions", () => {
  it("resets to a fresh copy of configured positions", () => {
    const positions = initialPositions(anniversary.stickers);
    positions.flower.x = 999;
    expect(initialPositions(anniversary.stickers).flower.x).toBe(45);
  });
  it("clamps all edges using actual sticker size", () => {
    expect(clampPosition(-10, 500, 300, 350, 80)).toEqual({ x: 0, y: 270 });
    expect(clampPosition(500, 0, 300, 350, 100)).toEqual({ x: 200, y: 0 });
  });
});
