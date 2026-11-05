# Our little love story

A complete static anniversary scrapbook built with React, TypeScript, Vite, Framer Motion and Lucide. Warm paper, a wax-sealed animated envelope, a handwritten letter, Polaroid memories, a timeline, draggable stickers, calendar counter, hidden notes and a romantic ending. All sample memories are fictional; replace them before sharing.

## Run locally

Use **Node.js 22.13+ (22 LTS)** or Node 24 LTS, and npm.

```sh
npm install
npm run dev
```

Open the Local URL Vite prints (usually http://localhost:5173).

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

`npm ci` installs the exact committed dependency versions. `dist/` is the production site. No backend, accounts, API keys, remote photo services or paid services are needed.

## Project map

```text
src/
  config/anniversary.ts       All personal content and settings
  config/types.ts            Typed configuration schema
  components/                Gallery, sticker board, counter, secrets, effects, music
  utils/                     Asset paths, calendar arithmetic, validation, tests
  App.tsx                    Narrative and section navigation
  styles.css                 Responsive scrapbook design
public/
  images/photos/             Your photos
  images/stickers/           Transparent PNG/WebP stickers
  images/decorations/        Favicon and default sharing card
  images/backgrounds/        Optional background assets
  audio/                     Optional music
.github/workflows/deploy.yml GitHub Pages deployment
CONTENT_GUIDE.md             Copy/paste customization examples
```

## Make it yours

Edit **`src/config/anniversary.ts`**. Names, dates, every letter paragraph, memories, timeline, stickers, secrets, theme, labels, music and metadata all live there. You do not need to edit components. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for examples.

Copy photos into **`public/images/photos/`**, then add their paths to `photos`. Missing and unconfigured images become illustrated cards automatically. JPG, PNG and WebP work, including portrait/landscape/square images. Prefer compressed photos around 1600px on the long edge, ideally below 500 KB. The photo modal uses `contain`; the Polaroid crop uses configurable `objectPosition`.

Fonts use installed serif, handwriting and sans-serif families with system fallbacks; no external font download or tracking is required. The precise handwriting font varies by device.

## Deploy free on GitHub Pages

1. Create a new GitHub repository. If pushing this folder, leave the new repository empty (do not initialize it with a README).
2. From this project folder, run:

   ```sh
   git init
   git add .
   git commit -m "Create anniversary scrapbook"
   git branch -M main
   ```

3. On the new repository’s GitHub page, copy its **“push an existing repository”** commands to add your actual remote and push `main`. Those commands contain your specific repository URL.
4. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
5. Open **Actions → Deploy anniversary scrapbook → Run workflow** (or push another commit). The workflow installs dependencies, type-checks, lints, tests, builds, and deploys `dist/` with the official Pages actions.
6. Open the URL in the completed deployment. The workflow obtains the correct base path and public origin from `configure-pages`. It works with repository sites, account sites and configured custom domains.

The local project is prepared for deployment; no repository has been created or published automatically.

### Sharing previews

Title, description and preview image come from `seo` in the config and are embedded in `dist/index.html` **at build time**. A bundled 1200×630 PNG is included. The Actions workflow supplies the actual deployment URL, creating absolute Open Graph and Twitter image URLs. When building outside Actions, set `seo.siteUrl` to your full public URL (including the repository path), or supply `SITE_URL` and `BASE_PATH` as environment variables. Relative metadata in a local build is expected when no public URL is configured. Messaging services may cache old previews.

### Rename or update

When the repository name changes, the next Actions run derives the new base path automatically. Update any manually configured `seo.siteUrl` and shared links. To update content, edit the config/add files, commit and push to `main`.

### Troubleshooting

- **Broken pictures:** paths are case-sensitive. `photos/Beach.jpg` maps to `public/images/photos/Beach.jpg`. Do not include `public/` in config paths. Check that the image was committed. Missing images intentionally fall back to illustrated cards.
- **Blank page / missing assets:** serve the production directory with `npm run preview`, not by double-clicking HTML. For manual hosting, rebuild with the correct `BASE_PATH`, including its trailing slash. The normal Actions workflow handles it.
- **Workflow fails:** inspect the first failed step under Actions. Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` locally. Ensure Pages source is GitHub Actions and the default/pushed branch is `main`. Check account/repository eligibility for free Pages hosting.
- **Music unavailable:** upload the configured file under `public/audio/`. Music is off by default, only plays after a user click, and shows a friendly error when missing or blocked.
- **Dates look wrong:** use `YYYY-MM-DD`, not a timestamp. See the calendar conventions in the content guide.

## Accessibility and behavior

Native buttons and links, visible focus outlines, native modal dialog focus containment and Escape dismissal, restored photo-trigger focus, keyboard sticker movement, touch pointer capture, reduced-motion support, and safe-area padding are included. Arrow keys move stickers 8px (Shift: 20px). Stickers reset on replay/reload; positions are deliberately not persisted. The board measures rotated sticker bounds and reclamps after resize. Navigation only includes enabled sections. The envelope and letter are sequential; after opening, the rest scrolls naturally.

## Verification

`npm test` covers day differences, DST calendar dates, leap years, month ends, invalid dates, asset subpaths, configuration validation, empty galleries, modal navigation, disabled flags, three-click secrets, sticker movement/reset, and replay. Browser verification results from implementation are recorded in `QA.md`. To repeat the production subpath browser suite:

```sh
BASE_PATH=/anniversary/ SITE_URL=https://example.com/anniversary/ npm run build
npm run test:browser
```

On macOS the suite uses installed Google Chrome. Elsewhere, install Playwright Chromium first with `npx playwright install chromium`. The suite starts and stops its own local preview server. Screenshots are saved in the ignored `test-results/` directory. Run a normal `npm run build` again afterward for default relative paths.

## Public content

GitHub Pages content and public repository files can be accessed by other people. Hidden notes are playful surprises, **not security or privacy features**. Do not add sensitive photos, addresses or secrets you would not want publicly accessible. Use music/images you have permission to share. No copyrighted music is bundled.
