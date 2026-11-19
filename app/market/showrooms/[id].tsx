import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Btn, Card, Empty, Header, List, Pill, Screen } from '../../../src/ui';
import { useData, cityRanges } from '../../../src/data';
import { rangeLabel } from '../../../src/dates';
import { callNumber, openUrl, sendEmail } from '../../../src/actions';
import { colors, fonts } from '../../../src/theme';

export default function ShowroomDetail() {
  const data = useData();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const s = data.showrooms.find((x) => x.id === id);
  const header = <Header section="market" label="02 · SALES" title="SHOWROOMS" />;
  if (!s) return <Screen section="market" header={header}><Empty text="Showroom not found." /></Screen>;
  const brandName = (b: string) => data.brands.find((x) => x.id === b)?.name ?? b;
  const cities = cityRanges(s.campaigns).map((c) => c.city);

  return (
    <Screen section="market" header={header}>
      <List>
        <View style={{ paddingHorizontal: 2, marginBottom: 2 }}>
          <Text style={{ fontFamily: fonts.black, fontSize: 20, color: colors.ink }}>{s.name.toUpperCase()}</Text>
          <Text style={{ fontFamily: fonts.extra, fontSize: 9, letterSpacing: 0.8, color: colors.muted, marginTop: 2 }}>SHOWROOM</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Btn flex primary label="Email" onPress={() => s.email && sendEmail(s.email, `Appointment request — ${s.name}`)} disabled={!s.email} />
          <Btn flex label="Call" onPress={() => s.phone && callNumber(s.phone)} disabled={!s.phone} />
          <Btn flex label="Website" onPress={() => s.website && openUrl(s.website)} disabled={!s.website} />
        </View>

        <Text style={{ fontFamily: fonts.extra, fontSize: 10, letterSpacing: 0.8, color: colors.ink, marginTop: 10 }}>FW27 SALES CAMPAIGN</Text>
        {cities.map((city) => {
          const list = s.campaigns.filter((c) => c.city === city);
          return (
            <Card key={city}>
              <Pill label={city} />
              {list.map((c, i) => (
                <View key={i} style={{ marginTop: 12, paddingTop: i ? 10 : 0, borderTopWidth: i ? 1 : 0, borderTopColor: colors.bg }}>
                  {c.label ? <Text style={{ fontFamily: fonts.black, fontSize: 12, color: colors.ink }}>{c.label.toUpperCase()}</Text> : null}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {c.ranges.map((r, j) => (
                      <View key={j} style={{ backgroundColor: colors.bg, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ fontFamily: fonts.black, fontSize: 10, color: colors.ink }}>{rangeLabel(r.start, r.end)}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <Feather name="map-pin" size={12} color={colors.ink} style={{ marginTop: 1, marginRight: 6 }} />
                    <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 10, color: '#2A2824' }}>{c.address}</Text>
                  </View>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 10.5, lineHeight: 16, color: colors.ink, marginTop: 8 }}>
                    {c.brands.map((b, k) => (
                      <Fragment key={b}>
                        <Text onPress={() => router.push(`/market/brands/${b}`)}>{brandName(b)}</Text>
                        {k < c.brands.length - 1 ? ', ' : ''}
                      </Fragment>
                    ))}
                  </Text>
                </View>
              ))}
            </Card>
          );
        })}
      </List>
    </Screen>
  );
}
