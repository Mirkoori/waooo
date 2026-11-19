import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Btn, Card, Empty, Header, List, Pill, Screen } from '../../../src/ui';
import { useData, showroomsForBrand, cityRanges } from '../../../src/data';
import { rangeLabel } from '../../../src/dates';
import { openUrl, sendEmail } from '../../../src/actions';
import { colors, fonts } from '../../../src/theme';

export default function BrandDetail() {
  const data = useData();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const brand = data.brands.find((b) => b.id === id);
  const header = <Header section="market" label="02 · SALES" title="BRANDS" />;
  if (!brand) return <Screen section="market" header={header}><Empty text="Brand not found." /></Screen>;
  const rooms = showroomsForBrand(data, brand.id);

  return (
    <Screen section="market" header={header}>
      <List>
        <View style={{ paddingHorizontal: 2 }}>
          <Text style={{ fontFamily: fonts.black, fontSize: 20, color: colors.ink }}>{brand.name.toUpperCase()}</Text>
          <Text style={{ fontFamily: fonts.extra, fontSize: 9, letterSpacing: 0.8, color: colors.muted, marginTop: 2 }}>BRAND</Text>
        </View>
        {brand.website ? (
          <Pressable onPress={() => openUrl(brand.website!)} style={{ backgroundColor: colors.ink, height: 40, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Text style={{ fontFamily: fonts.extra, fontSize: 10, letterSpacing: 0.6, color: colors.bg }}>VISIT WEBSITE</Text>
            <Feather name="arrow-up-right" size={12} color={colors.bg} />
          </Pressable>
        ) : null}
        <Text style={{ fontFamily: fonts.extra, fontSize: 10, letterSpacing: 0.8, color: '#3A3833', marginTop: 8 }}>WHERE TO SEE IT</Text>
        {rooms.length === 0 && <Empty text="Not in a showroom yet." />}
        {rooms.map(({ showroom, campaigns }) => (
          <Card key={showroom.id}>
            <Pressable onPress={() => router.push(`/market/showrooms/${showroom.id}`)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.black, fontSize: 13, color: colors.ink }}>{showroom.name.toUpperCase()}</Text>
                <Text style={{ fontFamily: fonts.extra, fontSize: 8, letterSpacing: 0.8, color: colors.muted, marginTop: 2 }}>SHOWROOM</Text>
              </View>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="chevron-right" size={14} color={colors.ink} />
              </View>
            </Pressable>
            {cityRanges(campaigns).map((c) => (
              <View key={c.city} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <View style={{ width: 52 }}><Pill label={c.city} /></View>
                <Text style={{ flex: 1, fontFamily: fonts.bold, fontSize: 10, color: colors.ink }}>{c.ranges.map((r) => rangeLabel(r.start, r.end)).join(' · ')}</Text>
              </View>
            ))}
            {showroom.email ? <View style={{ marginTop: 10 }}><Btn primary icon="mail" label="Email the showroom" onPress={() => sendEmail(showroom.email!, `Appointment request — ${brand.name}`)} /></View> : null}
          </Card>
        ))}
      </List>
    </Screen>
  );
}
