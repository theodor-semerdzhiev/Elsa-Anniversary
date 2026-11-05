import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { anniversary } from "../config/anniversary";
import type { AnniversaryConfig } from "../config/types";
import { Gallery } from "./Gallery";
import { SecretNote } from "./Secrets";
import { StickerBoard } from "./StickerBoard";
import App from "../App";
describe("gallery", () => {
  it("handles no photos", () => {
    render(<Gallery photos={[]} labels={anniversary.labels} />);
    expect(
      screen.getByText(anniversary.labels.emptyPhotos),
    ).toBeInTheDocument();
  });
  it("opens, navigates and closes the photo modal", () => {
    render(<Gallery photos={anniversary.photos} labels={anniversary.labels} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(anniversary.labels.next));
    expect(
      screen.getByRole("heading", { name: anniversary.photos[1].title }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(anniversary.labels.close));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
it("unlocks a secret on exactly the third click", () => {
  render(<SecretNote secret={anniversary.secrets[0]} label="Secret" />);
  const button = screen.getByRole("button");
  fireEvent.click(button);
  fireEvent.click(button);
  expect(
    screen.queryByText(anniversary.secrets[0].body),
  ).not.toBeInTheDocument();
  fireEvent.click(button);
  expect(screen.getByText(anniversary.secrets[0].body)).toBeInTheDocument();
});
it("moves stickers by keyboard and resets them", () => {
  const width = vi
    .spyOn(HTMLElement.prototype, "clientWidth", "get")
    .mockReturnValue(700);
  const height = vi
    .spyOn(HTMLElement.prototype, "clientHeight", "get")
    .mockReturnValue(360);
  render(
    <StickerBoard
      stickers={anniversary.stickers}
      labels={anniversary.labels}
    />,
  );
  const sticker = screen.getAllByRole("button")[0];
  fireEvent.keyDown(sticker, { key: "ArrowRight" });
  expect(sticker.style.left).toBe("53px");
  fireEvent.click(screen.getByText(anniversary.labels.resetStickers));
  expect(sticker.style.left).toBe("45px");
  width.mockRestore();
  height.mockRestore();
});
it("hides all optional sections and their navigation when flags are off", () => {
  const c: AnniversaryConfig = structuredClone(anniversary);
  for (const key of Object.keys(
    c.features,
  ) as (keyof AnniversaryConfig["features"])[])
    c.features[key] = false;
  render(<App config={c} />);
  fireEvent.click(
    screen.getAllByRole("button", { name: c.letter.buttonLabel })[0],
  );
  expect(
    screen.getByText(c.letter.salutation, { selector: "h2" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(c.labels.galleryHeading)).not.toBeInTheDocument();
  expect(screen.queryByText(c.labels.timelineHeading)).not.toBeInTheDocument();
  expect(screen.queryByText(c.labels.boardHeading)).not.toBeInTheDocument();
  expect(screen.queryByText(c.counter.heading)).not.toBeInTheDocument();
  expect(screen.queryByText(c.secrets[0].hint)).not.toBeInTheDocument();
  expect(
    screen.getAllByRole("navigation")[0].querySelectorAll("a"),
  ).toHaveLength(1);
});
it("replay closes the letter and restores the opening state", () => {
  render(<App />);
  fireEvent.click(
    screen.getAllByRole("button", { name: anniversary.letter.buttonLabel })[0],
  );
  fireEvent.click(screen.getByText(anniversary.labels.replay));
  expect(
    screen.queryByText(anniversary.labels.galleryHeading),
  ).not.toBeInTheDocument();
  expect(
    screen.getAllByRole("button", { name: anniversary.letter.buttonLabel })[0],
  ).toHaveAttribute("aria-expanded", "false");
});
