import { Linking, Platform } from 'react-native';
import * as Calendar from 'expo-calendar/legacy';

export const openUrl = (url: string) => Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
export const sendEmail = (to: string, subject?: string) =>
  Linking.openURL(`mailto:${to}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`);
export const callNumber = (n: string) => Linking.openURL(`tel:${n.replace(/\s/g, '')}`);
export const openMap = (query: string) => {
  const q = encodeURIComponent(query);
  return Linking.openURL(Platform.OS === 'ios' ? `http://maps.apple.com/?q=${q}` : `geo:0,0?q=${q}`);
};

const pad = (n: number) => String(n).padStart(2, '0');
const icsUtc = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
const icsDay = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const icsText = (t = '') => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

type CalEvent = { title: string; start: Date; end: Date; allDay?: boolean; location?: string; notes?: string };

/** Web fallback: downloads a .ics file the user can open with any calendar app. */
function downloadIcs(e: CalEvent) {
  const endDay = new Date(e.end.getFullYear(), e.end.getMonth(), e.end.getDate() + 1); // DTEND is exclusive for all-day
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//WAOOO//EN', 'BEGIN:VEVENT',
    `UID:${icsUtc(e.start)}-${Math.abs(hash(e.title))}@waooo`, `DTSTAMP:${icsUtc(new Date())}`,
    e.allDay ? `DTSTART;VALUE=DATE:${icsDay(e.start)}` : `DTSTART:${icsUtc(e.start)}`,
    e.allDay ? `DTEND;VALUE=DATE:${icsDay(endDay)}` : `DTEND:${icsUtc(e.end)}`,
    `SUMMARY:${icsText(e.title)}`,
    ...(e.location ? [`LOCATION:${icsText(e.location)}`] : []),
    ...(e.notes ? [`DESCRIPTION:${icsText(e.notes)}`] : []),
    'END:VEVENT', 'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${e.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);

/** Phones: opens the system "new event" sheet (no calendar permission stored by the app). Web: .ics download. */
export async function addToCalendar(e: CalEvent) {
  try {
    if (Platform.OS === 'web') return downloadIcs(e);
    await Calendar.createEventInCalendarAsync({
      title: e.title, startDate: e.start, endDate: e.end, allDay: e.allDay, location: e.location, notes: e.notes,
    });
  } catch {
    // Dismissed or calendar unavailable: nothing to do.
  }
}
/** Local-midnight Date for a "YYYY-MM-DD" string (used for all-day events). */
export const localDay = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};
