import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

export type Ticket = { eventId: string; no: number; token: string; first: string; last: string };
const KEY = 'waooo.tickets';

export const qrPayload = (t: Ticket) => `WAOOO|${t.eventId}|${t.no}|${t.token}`;
export const ticketCode = (t: Ticket) => `WAOOO-${String(t.no).padStart(4, '0')}`;

export async function loadTickets(): Promise<Record<string, Ticket>> {
  try { return JSON.parse((await AsyncStorage.getItem(KEY)) ?? '{}'); } catch { return {}; }
}
export async function getTicket(eventId: string) { return (await loadTickets())[eventId]; }

const ERRORS: Record<string, string> = {
  consent_required: 'Please accept the privacy policy to register.',
  invalid_name: 'Please enter your first and last name.',
  invalid_email: 'Please enter a valid email address.',
  invalid_role: 'Please select your role.',
  registration_closed: 'Registration for this event is closed.',
  sold_out: 'This event is fully booked.',
};

export async function register(eventId: string, v: { first: string; last: string; email: string; role: string; consent: boolean }): Promise<Ticket> {
  const { data, error } = await supabase.rpc('waooo_register', {
    p_event_id: eventId, p_first: v.first, p_last: v.last, p_email: v.email, p_role: v.role, p_consent: v.consent,
  });
  if (error) {
    const key = Object.keys(ERRORS).find((k) => error.message.includes(k));
    throw new Error(key ? ERRORS[key] : 'Something went wrong. Please try again.');
  }
  const r = Array.isArray(data) ? data[0] : data;
  const t: Ticket = { eventId, no: r.t_no, token: r.t_token, first: r.t_first, last: r.t_last };
  const all = await loadTickets();
  all[eventId] = t;
  await AsyncStorage.setItem(KEY, JSON.stringify(all));
  return t;
}
