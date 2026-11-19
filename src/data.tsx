// Single access point for content.
// The app starts with the bundled JSON (instant, works offline) and then replaces it
// with what is stored in Supabase (table waooo_items), which the client edits from /admin.
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import weeks from './data/weeks.json';
import runway from './data/runway.json';
import presentations from './data/presentations.json';
import events from './data/events.json';
import tradeShows from './data/trade-shows.json';
import showrooms from './data/showrooms.json';
import brands from './data/brands.json';
import stores from './data/stores.json';
import contacts from './data/contacts.json';
import partners from './data/partners.json';
import { supabase } from './supabase';
import type { Week, Runway, Presentation, EventItem, TradeShow, Showroom, Brand, Store, Contact, Partner, DateRange } from './types';

export type AppData = {
  weeks: Week[]; runway: Runway[]; presentations: Presentation[]; events: EventItem[];
  tradeShows: TradeShow[]; showrooms: Showroom[]; brands: Brand[]; stores: Store[];
  contacts: Contact[]; partners: Partner[];
};
export type Kind = keyof AppData;
export const KINDS: Kind[] = ['weeks', 'runway', 'presentations', 'events', 'tradeShows', 'showrooms', 'brands', 'stores', 'contacts', 'partners'];

const bundled: AppData = {
  weeks: weeks as Week[], runway: runway as Runway[], presentations: presentations as Presentation[],
  events: events as EventItem[], tradeShows: tradeShows as TradeShow[], showrooms: showrooms as Showroom[],
  brands: brands as Brand[], stores: stores as Store[], contacts: contacts as Contact[], partners: partners as Partner[],
};

type Ctx = { data: AppData; reload: () => Promise<void>; remote: boolean };
const DataContext = createContext<Ctx>({ data: bundled, reload: async () => {}, remote: false });

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ data: AppData; remote: boolean }>({ data: bundled, remote: false });

  const reload = useCallback(async () => {
    try {
      const { data: rows, error } = await supabase.from('waooo_items').select('kind,data').order('sort', { ascending: true });
      if (error || !rows || rows.length === 0) return; // keep what we have
      const next = Object.fromEntries(KINDS.map((k) => [k, [] as unknown[]])) as unknown as Record<Kind, unknown[]>;
      for (const r of rows as { kind: Kind; data: unknown }[]) if (next[r.kind]) next[r.kind].push(r.data);
      setState({ data: next as unknown as AppData, remote: true });
    } catch {
      // offline: keep bundled / previous data
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);
  return <DataContext.Provider value={{ data: state.data, reload, remote: state.remote }}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext).data;
export const useDataControls = () => useContext(DataContext);

export const showroomsForBrand = (data: AppData, brandId: string) =>
  data.showrooms
    .map((s) => ({ showroom: s, campaigns: s.campaigns.filter((c) => c.brands.includes(brandId)) }))
    .filter((x) => x.campaigns.length);

const CITY_ORDER = ['Milan', 'Paris'];
/** Groups campaigns by city and merges their date ranges (sorted, without duplicates). */
export function cityRanges(campaigns: Showroom['campaigns']) {
  const map = new Map<string, DateRange[]>();
  for (const c of campaigns) {
    const list = map.get(c.city) ?? [];
    for (const r of c.ranges) if (!list.some((x) => x.start === r.start && x.end === r.end)) list.push(r);
    map.set(c.city, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => CITY_ORDER.indexOf(a) - CITY_ORDER.indexOf(b))
    .map(([city, ranges]) => ({ city, ranges: ranges.sort((a, b) => a.start.localeCompare(b.start)) }));
}
