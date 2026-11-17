const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// "YYYY-MM-DD" (optionally followed by T...) parsed without timezone shifts.
export function parts(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m: m - 1, d, dow };
}
export const monthShort = (iso: string) => MONTHS[parts(iso).m];
export const monthYearLong = (iso: string) => `${MONTHS_LONG[parts(iso).m]} ${parts(iso).y}`;
export const dayLong = (iso: string) => {
  const p = parts(iso);
  return `${DAYS_LONG[p.dow]}, ${MONTHS_LONG[p.m]} ${p.d}`;
};
export const monthDay = (iso: string) => `${monthShort(iso)} ${parts(iso).d}`;

/** "15–18" or "28–3" style day range used in date badges. */
export function dayRange(start: string, end?: string) {
  if (!end || end.slice(0, 10) === start.slice(0, 10)) return String(parts(start).d);
  return `${parts(start).d}–${parts(end).d}`;
}
/** "Jan 12 – Feb 12" */
export function rangeLabel(start: string, end: string) {
  const s = parts(start), e = parts(end);
  if (s.m === e.m) return `${MONTHS[s.m]} ${s.d} – ${e.d}`;
  return `${MONTHS[s.m]} ${s.d} – ${MONTHS[e.m]} ${e.d}`;
}
/** Wall-clock time of an ISO date-time as written (the event's local time). */
export function timeLabel(iso: string) {
  const m = iso.match(/T(\d{2}):(\d{2})/);
  if (!m) return '';
  const h = Number(m[1]);
  const mins = m[2] === '00' ? '' : `:${m[2]}`;
  return `${((h + 11) % 12) + 1}${mins} ${h < 12 ? 'AM' : 'PM'}`;
}
export const sortByStart = <T extends { start: string }>(a: T[]) =>
  [...a].sort((x, y) => x.start.localeCompare(y.start));
