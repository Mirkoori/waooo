import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { Empty, Header, List, Screen, SearchField } from '../src/ui';
import { data } from '../src/data';
import { colors, fonts } from '../src/theme';

type Hit = { key: string; group: string; title: string; sub?: string; href: Href };

export default function Search() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const hits = useMemo<Hit[]>(() => {
    const all: Hit[] = [
      ...data.brands.map((b) => ({ key: `b-${b.id}`, group: 'Brands', title: b.name, href: `/market/brands/${b.id}` as Href })),
      ...data.showrooms.map((s) => ({ key: `s-${s.id}`, group: 'Showrooms', title: s.name, href: `/market/showrooms/${s.id}` as Href })),
      ...data.runway.map((r) => ({ key: `r-${r.id}`, group: 'Runway', title: r.brand, sub: r.address, href: '/fashion-week/runway' as Href })),
      ...data.presentations.map((p) => ({ key: `p-${p.id}`, group: 'Presentations', title: p.brand, sub: p.address, href: '/fashion-week/presentations' as Href })),
      ...data.events.map((e) => ({ key: `e-${e.id}`, group: 'Events', title: e.name, sub: e.location, href: '/fashion-week/events' as Href })),
      ...data.tradeShows.map((t) => ({ key: `t-${t.id}`, group: 'Trade shows', title: t.name, sub: t.address, href: '/fashion-week/trade-shows' as Href })),
      ...data.weeks.map((w) => ({ key: `w-${w.id}`, group: 'Fashion weeks', title: w.name, sub: w.city, href: '/fashion-week/weeks' as Href })),
      ...data.stores.map((s) => ({ key: `st-${s.id}`, group: 'Stores', title: s.name, sub: s.address, href: '/market/stores' as Href })),
      ...data.partners.map((p) => ({ key: `pa-${p.id}`, group: 'Partners', title: p.name, href: '/info/partners' as Href })),
    ];
    const n = q.trim().toLowerCase();
    return n ? all.filter((h) => `${h.title} ${h.sub ?? ''}`.toLowerCase().includes(n)) : [];
  }, [q]);

  const groups = [...new Set(hits.map((h) => h.group))];
  return (
    <Screen section="fashion" header={<Header section="fashion" label="WAOOO" title="SEARCH" />}>
      <List>
        <SearchField autoFocus value={q} onChangeText={setQ} placeholder="Search brands, shows, showrooms…" />
        {q.trim() && hits.length === 0 && <Empty text="No results." />}
        {groups.map((g) => (
          <View key={g}>
            <Text style={{ fontFamily: fonts.extra, fontSize: 10, letterSpacing: 0.8, color: '#3A3833', marginTop: 10, marginBottom: 6 }}>{g.toUpperCase()}</Text>
            <View style={{ backgroundColor: colors.card, borderRadius: 14, overflow: 'hidden' }}>
              {hits.filter((h) => h.group === g).map((h, i) => (
                <Pressable key={h.key} onPress={() => router.push(h.href)} style={{ paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: colors.bg }}>
                  <Text style={{ fontFamily: fonts.black, fontSize: 12, color: colors.ink }}>{h.title.toUpperCase()}</Text>
                  {h.sub ? <Text style={{ fontFamily: fonts.semibold, fontSize: 9, color: '#3A3833', marginTop: 2 }}>{h.sub}</Text> : null}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </List>
    </Screen>
  );
}
