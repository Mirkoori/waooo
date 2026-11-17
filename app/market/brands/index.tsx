import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Empty, Header, List, Screen, SearchField } from '../../../src/ui';
import { data, showroomsForBrand } from '../../../src/data';
import { colors, fonts } from '../../../src/theme';

export default function Brands() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const list = [...data.brands].filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
    const map = new Map<string, typeof list>();
    list.forEach((b) => { const k = /^[a-z]/i.test(b.name) ? b.name[0].toUpperCase() : '#'; map.set(k, [...(map.get(k) ?? []), b]); });
    return [...map.entries()].sort(([a], [b]) => (a === '#' ? -1 : b === '#' ? 1 : a.localeCompare(b)));
  }, [q]);

  return (
    <Screen section="market" header={<Header section="market" label="02 · MARKET" title="BRANDS" />}>
      <List>
        <SearchField value={q} onChangeText={setQ} placeholder="Search brands" />
        {groups.length === 0 && <Empty text="No brand found." />}
        {groups.map(([letter, brands]) => (
          <View key={letter}>
            <Text style={{ fontFamily: fonts.extra, fontSize: 10, color: '#3A3833', marginTop: 8, marginBottom: 6 }}>{letter}</Text>
            <View style={{ backgroundColor: colors.card, borderRadius: 14, overflow: 'hidden' }}>
              {brands.map((b, i) => {
                const rooms = showroomsForBrand(b.id).map((x) => `${x.showroom.name} showroom`).join(', ');
                return (
                  <Pressable key={b.id} onPress={() => router.push(`/market/brands/${b.id}`)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 9, borderTopWidth: i ? 1 : 0, borderTopColor: colors.bg }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.black, fontSize: 12, color: colors.ink }}>{b.name.toUpperCase()}</Text>
                      {rooms ? <Text style={{ fontFamily: fonts.semibold, fontSize: 9, color: '#3A3833', marginTop: 2 }}>{rooms}</Text> : null}
                    </View>
                    <Feather name="chevron-right" size={16} color={colors.ink} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </List>
    </Screen>
  );
}
