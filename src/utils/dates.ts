export function parseDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(0);
  d.setUTCFullYear(+m[1], +m[2] - 1, +m[3]);
  d.setUTCHours(0, 0, 0, 0);
  return d.getUTCFullYear() === +m[1] &&
    d.getUTCMonth() === +m[2] - 1 &&
    d.getUTCDate() === +m[3]
    ? d
    : null;
}
export function today(timeZone?: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function dayDifference(start: string, end: string): number | null {
  const a = parseDate(start),
    b = parseDate(end);
  return a && b ? Math.max(0, Math.round((+b - +a) / 86400000)) : null;
}
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const last = new Date(d);
  last.setUTCMonth(last.getUTCMonth() + 1);
  last.setUTCDate(0);
  d.setUTCDate(Math.min(day, last.getUTCDate()));
  return d;
}
export function calendarDuration(start: string, end: string) {
  const a = parseDate(start),
    b = parseDate(end);
  if (!a || !b) return null;
  if (b < a) return { years: 0, months: 0, days: 0 };
  let months =
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
    b.getUTCMonth() -
    a.getUTCMonth();
  if (addMonths(a, months) > b) months--;
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: Math.round((+b - +addMonths(a, months)) / 86400000),
  };
}
