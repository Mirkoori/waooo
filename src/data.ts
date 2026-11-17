// Single access point for content. Today it reads the JSON files in ./data;
// when a backend is added only this file has to change.
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
import type { Week, Runway, Presentation, EventItem, TradeShow, Showroom, Brand, Store, Contact, Partner } from './types';

export const data = {
  weeks: weeks as Week[],
  runway: runway as Runway[],
  presentations: presentations as Presentation[],
  events: events as EventItem[],
  tradeShows: tradeShows as TradeShow[],
  showrooms: showrooms as Showroom[],
  brands: brands as Brand[],
  stores: stores as Store[],
  contacts: contacts as Contact[],
  partners: partners as Partner[],
};

export const showroomsForBrand = (brandId: string) =>
  data.showrooms
    .map((s) => ({ showroom: s, campaigns: s.campaigns.filter((c) => c.brands.includes(brandId)) }))
    .filter((x) => x.campaigns.length);
