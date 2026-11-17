export type Week = { id: string; name: string; city: string; country: string; start: string; end: string };
export type Runway = { id: string; brand: string; start: string; address: string; notes?: string; website?: string };
export type Presentation = { id: string; brand: string; start: string; end?: string; address: string; notes?: string; website?: string };
export type EventItem = {
  id: string; name: string; date?: string; startTime?: string; endTime?: string;
  invitationOnly?: boolean; description?: string; image?: string; location: string;
};
export type TradeShow = { id: string; name: string; start: string; end: string; address: string; website?: string; email?: string };
export type DateRange = { start: string; end: string };
export type Campaign = {
  city: 'Milan' | 'Paris'; label: string; ranges: DateRange[]; address: string; brands: string[];
};
export type Showroom = { id: string; name: string; email?: string; phone?: string; website?: string; campaigns: Campaign[] };
export type Brand = { id: string; name: string; website?: string };
export type Store = { id: string; name: string; address: string; hours: string; phone?: string; website?: string };
export type Contact = { id: string; name: string; tagline?: string; email?: string; website?: string };
export type Partner = { id: string; name: string; url?: string };
