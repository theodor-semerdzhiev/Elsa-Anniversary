export interface Photo {
  id: string;
  image?: string;
  title: string;
  caption?: string;
  date?: string;
  location?: string;
  story?: string;
  rotation?: number;
  stickers?: string[];
  alt?: string;
  objectPosition?: string;
}
export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  photo?: string;
  emoji?: string;
  location?: string;
}
export interface Sticker {
  id: string;
  emoji?: string;
  image?: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  label?: string;
}
export interface Secret {
  id: string;
  trigger: "heart" | "hidden";
  clicks: number;
  title: string;
  body: string;
  image?: string;
  closing?: string;
  hint: string;
}
export interface General {
  girlfriend: string;
  author: string;
  nickname?: string;
  title: string;
  subtitle: string;
  startDate: string;
  anniversaryDate?: string;
  greeting: string;
  closingHeading: string;
  closing: string;
  footer: string;
  durationLabel?: string;
}
export interface Letter {
  heading: string;
  salutation: string;
  paragraphs: string[];
  signature: string;
  postscript?: string;
  buttonLabel: string;
}
export interface Counter {
  startDate?: string;
  timeZone?: string;
  format: "days" | "calendar" | "both";
  heading: string;
  subtitle: string;
  showTotalDays: boolean;
  showCalendar: boolean;
  showAnniversary: boolean;
  anniversaryMessage: string;
}
export interface Theme {
  background: string;
  primary: string;
  secondary: string;
  paper: string;
  text: string;
  decorative: string;
  serif: string;
  handwriting: string;
  sans: string;
  radius: string;
  intensity: number;
  aesthetic: "vintage" | "clean";
}
export interface Features {
  floatingHearts: boolean;
  heartCursor: boolean;
  envelopeAnimation: boolean;
  photoGallery: boolean;
  relationshipTimeline: boolean;
  stickerBoard: boolean;
  timeTogether: boolean;
  secretMessages: boolean;
  confetti: boolean;
  backgroundMusic: boolean;
  reducedMotionSupport: boolean;
}
export interface Labels {
  openLetter: string;
  continue: string;
  memories: string;
  nextSection: string;
  resetStickers: string;
  revealSurprise: string;
  replay: string;
  backToTop: string;
  close: string;
  previous: string;
  next: string;
  emptyPhotos: string;
  placeholder: string;
  stickerControls: string;
  days: string;
  years: string;
  months: string;
  invalidDate: string;
  play: string;
  pause: string;
  audioError: string;
  book: string;
  letter: string;
  timeline: string;
  stickers: string;
  counter: string;
  secrets: string;
  galleryHeading: string;
  gallerySubtitle: string;
  timelineHeading: string;
  timelineSubtitle: string;
  boardHeading: string;
  boardSubtitle: string;
  boardNote: string;
  openingNote: string;
  endingNote: string;
  postmarkTop: string;
  postmarkBottom: string;
}
export interface Gift {
  heading: string;
  introduction: string;
  choiceLabel: string;
  options: { id: string; symbol: string; title: string; description: string }[];
  christmasNote: string;
  selectionNote: string;
}
export interface AnniversaryConfig {
  gift?: Gift;
  general: General;
  letter: Letter;
  photos: Photo[];
  timeline: Milestone[];
  stickers: Sticker[];
  secrets: Secret[];
  counter: Counter;
  theme: Theme;
  features: Features;
  labels: Labels;
  floating: {
    density: number;
    speed: number;
    opacity: number;
    colours: string[];
  };
  audio: { path: string; volume: number };
  seo: { title: string; description: string; siteUrl: string; image: string };
}
