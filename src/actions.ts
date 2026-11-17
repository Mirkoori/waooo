import { Linking, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';

export const openUrl = (url: string) => Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
export const sendEmail = (to: string, subject?: string) =>
  Linking.openURL(`mailto:${to}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`);
export const callNumber = (n: string) => Linking.openURL(`tel:${n.replace(/\s/g, '')}`);
export const openMap = (query: string) => {
  const q = encodeURIComponent(query);
  return Linking.openURL(Platform.OS === 'ios' ? `http://maps.apple.com/?q=${q}` : `geo:0,0?q=${q}`);
};

/** Opens the system "new event" sheet, so the app never needs stored calendar access. */
export async function addToCalendar(e: {
  title: string; start: Date; end: Date; allDay?: boolean; location?: string; notes?: string;
}) {
  try {
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
