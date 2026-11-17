import type { Kind } from './data';

export type FieldType = 'text' | 'textarea' | 'date' | 'datetime' | 'time' | 'bool' | 'campaigns';
export type Field = { key: string; label: string; type: FieldType; required?: boolean; help?: string };
export type KindConfig = {
  kind: Kind; label: string; singular: string; titleKey: string; subtitle?: (o: any) => string;
  fields: Field[]; manualOrder?: boolean; sortBy?: string; help?: string;
};

const W: Field = { key: 'website', label: 'Sito web', type: 'text', help: 'es. https://www.marchio.com' };

export const CONFIG: KindConfig[] = [
  {
    kind: 'weeks', label: 'Fashion Weeks', singular: 'fashion week', titleKey: 'name', sortBy: 'start',
    subtitle: (o) => `${o.start} → ${o.end} · ${o.city}`,
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'city', label: 'Città', type: 'text', required: true },
      { key: 'country', label: 'Paese', type: 'text', required: true },
      { key: 'start', label: 'Primo giorno', type: 'date', required: true },
      { key: 'end', label: 'Ultimo giorno', type: 'date', required: true },
    ],
  },
  {
    kind: 'runway', label: 'Runway (sfilate)', singular: 'sfilata', titleKey: 'brand', sortBy: 'start',
    subtitle: (o) => `${String(o.start).replace('T', ' ').slice(0, 16)} · ${o.address}`,
    fields: [
      { key: 'brand', label: 'Brand', type: 'text', required: true },
      { key: 'start', label: 'Data e ora (ora di Milano)', type: 'datetime', required: true },
      { key: 'address', label: 'Indirizzo', type: 'text', required: true },
      { key: 'notes', label: 'Note', type: 'text', help: 'es. By invitation only' },
      W,
    ],
  },
  {
    kind: 'presentations', label: 'Presentations', singular: 'presentazione', titleKey: 'brand', sortBy: 'start',
    subtitle: (o) => `${String(o.start).replace('T', ' ').slice(0, 16)} · ${o.address}`,
    fields: [
      { key: 'brand', label: 'Brand', type: 'text', required: true },
      { key: 'start', label: 'Inizio (ora di Milano)', type: 'datetime', required: true },
      { key: 'end', label: 'Fine (ora di Milano)', type: 'datetime' },
      { key: 'address', label: 'Indirizzo', type: 'text', required: true },
      { key: 'notes', label: 'Note', type: 'text', help: 'es. By appointment only' },
      W,
    ],
  },
  {
    kind: 'events', label: 'Events', singular: 'evento', titleKey: 'name',
    subtitle: (o) => `${o.date ?? 'data da definire'}${o.startTime ? ' · ' + o.startTime : ''}`,
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'date', label: 'Data', type: 'date', help: 'Se vuota l’app mostra "Date TBA" e nasconde "Add to calendar"' },
      { key: 'startTime', label: 'Ora di inizio', type: 'time' },
      { key: 'endTime', label: 'Ora di fine', type: 'time' },
      { key: 'invitationOnly', label: 'Solo su invito', type: 'bool' },
      { key: 'description', label: 'Descrizione', type: 'textarea' },
      { key: 'location', label: 'Luogo', type: 'text', required: true },
      { key: 'image', label: 'Immagine (link)', type: 'text', help: 'Indirizzo web di una foto, facoltativo' },
    ],
  },
  {
    kind: 'tradeShows', label: 'Trade Shows', singular: 'fiera', titleKey: 'name', sortBy: 'start',
    subtitle: (o) => `${o.start} → ${o.end} · ${o.address}`,
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'start', label: 'Primo giorno', type: 'date', required: true },
      { key: 'end', label: 'Ultimo giorno', type: 'date', required: true },
      { key: 'address', label: 'Indirizzo', type: 'text', required: true },
      W,
      { key: 'email', label: 'Email', type: 'text' },
    ],
  },
  {
    kind: 'showrooms', label: 'Showrooms', singular: 'showroom', titleKey: 'name', manualOrder: true,
    subtitle: (o) => `${(o.campaigns ?? []).length} campagne vendite`,
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'phone', label: 'Telefono', type: 'text' },
      W,
      { key: 'campaigns', label: 'Campagne vendite', type: 'campaigns' },
    ],
  },
  {
    kind: 'brands', label: 'Brands', singular: 'brand', titleKey: 'name', sortBy: 'name',
    help: 'I brand si collegano agli showroom dalla scheda dello showroom (campagne vendite).',
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      W,
    ],
  },
  {
    kind: 'stores', label: 'Stores', singular: 'store', titleKey: 'name', manualOrder: true,
    subtitle: (o) => o.address,
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'address', label: 'Indirizzo', type: 'text', required: true },
      { key: 'hours', label: 'Orari di apertura', type: 'text', required: true },
      { key: 'phone', label: 'Telefono', type: 'text' },
      W,
    ],
  },
  {
    kind: 'contacts', label: 'Contacts', singular: 'contatto', titleKey: 'name', manualOrder: true,
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'tagline', label: 'Frase sotto il nome', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      W,
    ],
  },
  {
    kind: 'partners', label: 'Partners', singular: 'partner', titleKey: 'name', manualOrder: true,
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'url', label: 'Sito web', type: 'text' },
    ],
  },
];
