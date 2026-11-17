import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Btn, Card, Empty, Header, List, Pill, Screen } from '../../../src/ui';
import { data } from '../../../src/data';
import { rangeLabel } from '../../../src/dates';
import { callNumber, openUrl, sendEmail } from '../../../src/actions';
import { colors, fonts } from '../../../src/theme';

export default function ShowroomDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const s = data.showrooms.find((x) => x.id === id);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [pick, setPick] = useState(false);
  if (!s) return <Screen section="market" header={<Header section="market" label="02 · MARKET" title="SHOWROOMS" />}><Empty text="Showroom not found." /></Screen>;

  const allIds = Array.from(new Set(s.campaigns.flatMap((c) => c.brands)));
  const brandName = (b: string) => data.brands.find((x) => x.id === b)?.name ?? b;
  const campaigns = s.campaigns.filter((c) => !brandFilter || c.brands.includes(brandFilter));

  return (
    <Screen section="market" header={<Header section="market" label="02 · MARKET" title="SHOWROOMS" />}>
      <List>
        <View style={{ paddingHorizontal: 2, marginBottom: 2 }}>
          <Text style={{ fontFamily: fonts.black, fontSize: 20, color: colors.ink }}>{s.name.toUpperCase()}</Text>
          <Text style={{ fontFamily: fonts.extra, fontSize: 9, letterSpacing: 0.8, color: colors.muted, marginTop: 2 }}>SHOWROOM</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Btn flex primary label="Email" onPress={() => s.email && sendEmail(s.email, `Appointment request — ${s.name}`)} />
          <Btn flex label="Call" onPress={() => s.phone && callNumber(s.phone)} />
          <Btn flex label="Website" onPress={() => s.website && openUrl(s.website)} />
        </View>

        <Card>
          <Pressable onPress={() => setPick(!pick)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.black, fontSize: 12, color: colors.ink }}>{brandFilter ? brandName(brandFilter).toUpperCase() : 'ALL BRANDS'}</Text>
            <View style={{ backgroundColor: colors.market, borderRadius: 9, paddingHorizontal: 8, height: 18, justifyContent: 'center', marginRight: 8 }}>
              <Text style={{ fontFamily: fonts.extra, fontSize: 9 }}>{brandFilter ? 1 : allIds.length}</Text>
            </View>
            <Feather name={pick ? 'chevron-up' : 'chevron-down'} size={16} color={colors.ink} />
          </Pressable>
          {pick && (
            <View style={{ marginTop: 10, gap: 2 }}>
              <Pressable onPress={() => { setBrandFilter(null); setPick(false); }}><Text style={{ fontFamily: fonts.bold, fontSize: 11, paddingVertical: 6 }}>All brands</Text></Pressable>
              {allIds.map((b) => (
                <Pressable key={b} onPress={() => { setBrandFilter(b); setPick(false); }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 11, paddingVertical: 6 }}>{brandName(b)}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </Card>

        {campaigns.map((c, i) => (
          <Card key={i}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Pill label={c.city} />
              <Text style={{ fontFamily: fonts.extra, fontSize: 9, letterSpacing: 0.6, color: colors.ink }}>{c.label.toUpperCase()}</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {c.ranges.map((r, j) => (
                <View key={j} style={{ backgroundColor: colors.bg, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: fonts.black, fontSize: 11, color: colors.ink }}>{rangeLabel(r.start, r.end)}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.bg }}>
              <Feather name="map-pin" size={12} color={colors.ink} style={{ marginTop: 1, marginRight: 6 }} />
              <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 10, color: '#2A2824' }}>{c.address}</Text>
            </View>
            <Text style={{ fontFamily: fonts.extra, fontSize: 8, letterSpacing: 0.8, color: colors.muted, marginTop: 10 }}>BRANDS</Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 10.5, lineHeight: 16, color: colors.ink, marginTop: 4 }}>
              {c.brands.map((b, k) => (
                <Text key={b} onPress={() => router.push(`/market/brands/${b}`)}>{brandName(b)}{k < c.brands.length - 1 ? ', ' : ''}</Text>
              ))}
            </Text>
          </Card>
        ))}
      </List>
    </Screen>
  );
}
