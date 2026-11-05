# Personalize your scrapbook

Everything below is edited in `src/config/anniversary.ts`. Save the file to see changes in the development server. Quotes, commas and brackets matter; run `npm run typecheck` to catch mistakes. Use double quotes for text containing apostrophes, or curly apostrophes as in the examples. No HTML needed.

## Names, dates and letter

Change `general.girlfriend`, `general.author`, `general.greeting`, the anniversary title/subtitle, `closingHeading`, `closing` and `footer`. Update `letter.signature` separately so it reads exactly as you want. `nickname` is optional reference information you may use in your greeting; `durationLabel` appears below the counter.

Dates use `'2024-06-15'`. `general.startDate` powers the counter unless `counter.startDate` overrides it. `general.anniversaryDate` controls the month/day of the anniversary greeting. A future start date shows zero days.

Each item in `letter.paragraphs` is one paragraph. Use `\n` inside a string for a line break, or a backtick-delimited multiline string. Any length is supported:

```ts
paragraphs: [
  "My favourite days start with you.",
  `Thank you for the big adventures,
  and for making the little days feel special.`,
],
```

## Add a photo

Copy `first-date.jpg` into `public/images/photos/`, then add an object inside `photos: [...]`:

```ts
{
  id: 'first-date', // Unique across photos.
  image: 'photos/first-date.jpg',
  title: 'Our first date',
  caption: 'The coffee went cold. Neither of us noticed.',
  date: '2024-06-15',
  location: 'Our little café',
  story: 'The longer story appears when you tap this photo.',
  alt: 'The two of us smiling at our café table',
  rotation: -4,
  objectPosition: '50% 35%', // Move the crop toward the top.
  stickers: ['♡', '✧'],
},
```

Only `id` and `title` are required. No image gives an illustrated placeholder. You can use zero, one, or many photos. Each ID must be unique. Remove the entire object to remove the card. Use URL-safe filenames and correct capitalization.

## Add a timeline memory

```ts
{
  id: 'first-trip',
  date: '2024-08-23',
  title: 'Our first adventure',
  description: 'A wrong turn that became our favourite memory.',
  photo: 'photos/first-trip.webp', // Optional.
  emoji: '☀',
  location: 'By the sea',
},
```

Entries are sorted by date automatically. Set `features.relationshipTimeline` to `false` to remove the section and its navigation item.

## Add stickers

Emoji sticker:

```ts
{ id: 'sunshine', emoji: '🌻', x: 90, y: 120, size: 70, rotation: -8, label: 'Sunflower' },
```

Transparent image sticker (copy the file to `public/images/stickers/`):

```ts
{ id: 'our-cat', image: 'stickers/cat.webp', emoji: '🐈', x: 200, y: 30, size: 80, rotation: 10, label: 'Our cat' },
```

`x`, `y` and `size` are pixels. Keep sizes around 40–110px for narrow phones. The board clamps positions at its current width and respects the rotated size. The optional emoji is also the fallback for a broken sticker image. Stickers may overlap; click or focus/move one to bring it forward.

## Add secrets

```ts
{
  id: 'another-note',
  trigger: 'heart', // Or 'hidden': a small flower beneath the gallery.
  clicks: 3, // Positive integer. Each secret is independent.
  hint: 'Three taps for a little reminder.',
  title: 'Always you.',
  body: 'Your own message goes here.\nA second line can go here.',
  image: 'photos/us.jpg', // Optional.
  closing: 'Love, me.',
},
```

If the gallery is disabled, flower secrets move to the secrets section. Do not put confidential material here: all message text is publicly inspectable.

## Counter

`format` is `'days'`, `'calendar'`, or `'both'`. `showTotalDays` and `showCalendar` can independently hide those displays. `showAnniversary` enables the greeting on the configured anniversary month/day. Customize `heading`, `subtitle`, `anniversaryMessage`, and the year/month/day labels.

The default is the visitor’s local calendar. Optionally add `timeZone: 'America/Toronto'` inside `counter`. Dates are parsed as calendar dates without browser UTC shifts; total days do not depend on 23/25-hour DST days. Calendar months clamp to the last day of the destination month: Jan 31 → Feb 28 is one month in a non-leap year; Feb 29 → Feb 28 the next year is one year. The counter checks the current date every second. Invalid dates produce a gentle fallback and a development warning.

## Theme and motion

Change `theme.background`, `primary`, `secondary`, `paper`, `text`, and `decorative`. Keep sufficient text contrast. Fonts are CSS font-family lists in `serif`, `handwriting`, and `sans`; using fonts installed on the device avoids network requests. You can use your own externally loaded fonts, but the default requires none. `radius` is a CSS length. `aesthetic: 'clean'` reduces paper grain; `'vintage'` restores it. `intensity` scales Motion transition duration; `0` disables animated effects. `reducedMotionSupport: true` respects the visitor’s system preference.

`floating` controls density (capped at 30), travel time in seconds, opacity, and colours. The cursor layer caps particles at 36, throttles desktop emissions, and emits only on short touch taps.

## Flags and button labels

Every optional feature has its own boolean in `features`. All may be disabled at once. `envelopeAnimation: false` retains the opening interaction but skips its animation. `confetti` controls celebration particles independently of cursor trails. Edit `labels` for section headings, navigation, prompts and controls. The envelope’s label is `letter.buttonLabel` (`labels.openLetter` is its fallback). Unused convenience labels are available for future sections.

## Optional music

1. Copy an audio file you have permission to share into `public/audio/`.
2. Set `audio.path`, for example `'audio/our-song.mp3'`.
3. Set `audio.volume` between 0 and 1.
4. Set `features.backgroundMusic: true`.

Music never autoplays. A play/pause control appears in the corner. No song is bundled.

## Sharing card

Change `seo.title`, `seo.description`, and `seo.image`. Put a 1200×630 PNG/JPG at `public/images/decorations/preview.png` or change the configured path. The default card is intentionally generic. For builds outside GitHub Actions, set `seo.siteUrl` to your full public site URL. Rebuild after any metadata changes. Metadata is written into HTML for link crawlers, so it works without JavaScript.
