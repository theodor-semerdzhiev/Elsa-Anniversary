import { test, expect } from "@playwright/test";
import { anniversary as config } from "../src/config/anniversary";
const widths = [320, 375, 390, 430, 768, 1024, 1440];
for (const width of widths)
  test(`scrapbook layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      config.general.title,
    );
    if (width === 1440 || width === 390)
      await page.screenshot({ path: `test-results/opening-${width}.png` });
    await page.locator(".envelope").click();
    await expect(page.locator("#letter")).toBeVisible();
    for (const id of [
      "letter",
      ...(config.features.photoGallery ? ["memories"] : []),
      ...(config.features.relationshipTimeline ? ["timeline"] : []),
      ...(config.features.stickerBoard ? ["stickers"] : []),
      ...(config.features.timeTogether ? ["together"] : []),
      ...(config.features.secretMessages ? ["secrets"] : []),
      "ending",
      ...(config.gift ? ["gift"] : []),
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    if (!config.features.stickerBoard) {
      await expect(page.locator("#stickers")).toHaveCount(0);
      await expect(page.locator('nav a[href="#stickers"]')).toHaveCount(0);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const outside = await page
      .locator("main button, main a, .letter-paper, .polaroid, .milestone")
      .evaluateAll((elements) =>
        elements
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
          })
          .map((el) => el.className),
      );
    expect(outside).toEqual([]);
    if (config.features.photoGallery && (width === 1440 || width === 390)) {
      await page.locator("#memories").scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await page.screenshot({ path: `test-results/memories-${width}.png` });
    }
    expect(errors).toEqual([]);
  });
test("gallery focus, keyboard, backdrop, stickers, secrets, and replay", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 850 });
  await page.goto("./");
  await page.locator(".envelope").click();
  const card = page.locator(".polaroid").first();
  await card.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(
    config.photos[1].title,
  );
  for (let i = 0; i < 7; i++) await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(card).toBeFocused();
  await card.click();
  await page.mouse.click(5, 5);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  if (config.features.stickerBoard) {
    const sticker = page.locator(".sticker").first();
    await sticker.scrollIntoViewIfNeeded();
    const original = await sticker.evaluate((el) => ({
      x: (el as HTMLElement).style.left,
      y: (el as HTMLElement).style.top,
    }));
    const bounds = await sticker.boundingBox();
    if (!bounds) throw Error("Sticker missing");
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(2000, 2000, { steps: 8 });
    await page.mouse.up();
    const board = await page.locator(".sticker-board").boundingBox();
    const moved = await sticker.boundingBox();
    expect(moved!.x + moved!.width).toBeLessThanOrEqual(
      board!.x + board!.width,
    );
    expect(moved!.y + moved!.height).toBeLessThanOrEqual(
      board!.y + board!.height,
    );
    await page
      .getByRole("button", { name: config.labels.resetStickers })
      .click();
    expect(
      await sticker.evaluate((el) => ({
        x: (el as HTMLElement).style.left,
        y: (el as HTMLElement).style.top,
      })),
    ).toEqual(original);
    await sticker.focus();
    await page.keyboard.press("ArrowRight");
    expect(
      await sticker.evaluate((el) => (el as HTMLElement).style.left),
    ).not.toBe(original.x);
  }
  const secret = page.locator("#secrets .secret-trigger");
  await secret.click();
  await secret.click();
  await expect(page.locator("#secrets .secret-paper")).toHaveCount(0);
  await secret.click();
  await expect(page.locator("#secrets .secret-paper")).toBeVisible();
  await page.locator(".hidden-flower .secret-trigger").click();
  await expect(page.locator(".hidden-flower .secret-paper")).toBeVisible();
  await page.getByRole("button", { name: config.labels.replay }).click();
  await expect(page.locator("#letter")).toHaveCount(0);
  await expect(page.locator(".envelope")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});
test("touch dragging and reduced motion on a narrow phone", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/anniversary/");
  await page.locator(".envelope").tap();
  await expect(page.locator(".scrapbook")).toHaveClass(/reduced/);
  await expect(page.locator(".floating-heart")).toHaveCount(0);
  if (config.features.stickerBoard) {
    const sticker = page.locator(".sticker").first();
    await sticker.scrollIntoViewIfNeeded();
    const b = (await sticker.boundingBox())!;
    const session = await context.newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: b.x + b.width / 2, y: b.y + b.height / 2 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: b.x + b.width / 2 + 40, y: b.y + b.height / 2 + 30 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    expect(
      await sticker.evaluate((el) =>
        parseFloat((el as HTMLElement).style.left),
      ),
    ).toBeGreaterThan(45);
    await page.getByRole("button", { name: config.labels.resetStickers }).tap();
    expect(await sticker.evaluate((el) => (el as HTMLElement).style.left)).toBe(
      "45px",
    );
  }
  await context.close();
});
test("subpath assets and static sharing metadata", async ({ request }) => {
  const response = await request.get("./");
  const html = await response.text();
  expect(response.ok()).toBeTruthy();
  expect(html).toContain('property="og:image"');
  expect(html).toContain(
    "https://example.com/anniversary/images/decorations/preview.png",
  );
  expect(
    (await request.get("images/decorations/preview.png")).ok(),
  ).toBeTruthy();
  expect(
    (await request.get("images/decorations/favicon.svg")).ok(),
  ).toBeTruthy();
});

test("gift choices are exclusive and reset on replay", async ({ page }) => {
  await page.goto("./");
  await page.locator(".envelope").click();
  const gift = page.locator("#gift");
  await gift.scrollIntoViewIfNeeded();
  await expect(gift.getByRole("heading")).toHaveText(config.gift.heading);
  await expect(gift.getByText(config.gift.christmasNote)).toBeVisible();
  const choices = gift.getByRole("radio");
  await expect(choices).toHaveCount(config.gift.options.length);
  await choices.nth(0).check();
  await expect(choices.nth(0)).toBeChecked();
  await choices.nth(1).check();
  await expect(choices.nth(0)).not.toBeChecked();
  await expect(choices.nth(1)).toBeChecked();
  await expect(gift.getByText(config.gift.selectionNote)).toBeVisible();
  await page.getByRole("button", { name: config.labels.replay }).click();
  await page.locator(".envelope").click();
  await expect(page.locator("#gift input:checked")).toHaveCount(0);
});
