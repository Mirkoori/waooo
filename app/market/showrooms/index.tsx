import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Btn, Card, Empty, Header, List, Pill, Screen } from '../../../src/ui';
import { useData } from '../../../src/data';
import { rangeLabel } from '../../../src/dates';
import { callNumber, openUrl, sendEmail } from '../../../src/actions';
import { colors, fonts } from '../../../src/theme';

export default function Showrooms() {
  const data = useData();
  const router = useRouter();
  return (
    <Screen section="market" header={<Header section="market" label="02 · MARKET" title="SHOWROOMS" />}>
      <List>
        {data.showrooms.length === 0 && <Empty text="Showrooms will appear here soon." />}
        {data.showrooms.map((s) => (
          <Card key={s.id} onPress={() => router.push(`/market/showrooms/${s.id}`)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: fonts.black, fontSize: 14, color: colors.ink }}>{s.name.toUpperCase()}</Text>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="chevron-right" size={14} color={colors.ink} />
              </View>
            </View>
            {s.campaigns.map((c, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <View style={{ width: 52 }}><Pill label={c.city} /></View>
                <Text style={{ flex: 1, fontFamily: fonts.bold, fontSize: 10, color: colors.ink }}>{c.ranges.map((r) => rangeLabel(r.start, r.end)).join(' · ')}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <Btn flex primary label="Email" onPress={() => s.email && sendEmail(s.email, `Appointment request — ${s.name}`)} />
              <Btn flex label="Call" onPress={() => s.phone && callNumber(s.phone)} />
              <Btn flex label="Website" onPress={() => s.website && openUrl(s.website)} />
            </View>
          </Card>
        ))}
      </List>
    </Screen>
  );
}
