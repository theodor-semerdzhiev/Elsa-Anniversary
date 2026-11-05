import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { anniversary } from "./src/config/anniversary";
const escape = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
export default defineConfig({
  plugins: [
    react(),
    {
      name: "scrapbook-metadata",
      transformIndexHtml(html) {
        const { seo } = anniversary;
        const site = process.env.SITE_URL || seo.siteUrl;
        const base = process.env.BASE_PATH || "./";
        const image = site
          ? new URL(seo.image, site.endsWith("/") ? site : `${site}/`).href
          : `${base}${seo.image}`;
        return {
          html: html
            .replace(
              /<title>.*?<\/title>/,
              `<title>${escape(seo.title)}</title>`,
            )
            .replace(/<meta name="description"[^>]*\/>/, ""),
          tags: [
            {
              tag: "meta",
              attrs: { name: "description", content: seo.description },
            },
            {
              tag: "link",
              attrs: {
                rel: "icon",
                type: "image/svg+xml",
                href: `${base}images/decorations/favicon.svg`,
              },
            },
            ...[
              ["og:title", seo.title],
              ["og:description", seo.description],
              ["og:type", "website"],
              ["og:image", image],
              ...(site ? [["og:url", site]] : []),
            ].map(([property, content]) => ({
              tag: "meta",
              attrs: { property, content },
            })),
            ...[
              ["twitter:card", "summary_large_image"],
              ["twitter:title", seo.title],
              ["twitter:description", seo.description],
              ["twitter:image", image],
            ].map(([name, content]) => ({
              tag: "meta",
              attrs: { name, content },
            })),
          ],
        };
      },
    },
  ],
  base: process.env.BASE_PATH || "./",
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
  },
});
