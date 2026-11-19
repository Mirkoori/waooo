import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Header, List, Screen } from '../../src/ui';
import { useData } from '../../src/data';
import { openUrl } from '../../src/actions';
import { colors, fonts } from '../../src/theme';

export default function Partners() {
  const data = useData();
  return (
    <Screen section="info" header={<Header section="info" label="03 · INFO" title="PARTNERS" />}>
      <List>
        {data.partners.map((p) => (
          <Pressable key={p.id} onPress={() => p.url && openUrl(p.url)} style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, minHeight: 44, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.black, fontSize: 12, color: colors.ink }}>{p.name.toUpperCase()}</Text>
              {p.description ? <Text style={{ fontFamily: fonts.semibold, fontSize: 10, lineHeight: 15, color: '#2A2824', marginTop: 3 }}>{p.description}</Text> : null}
            </View>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="arrow-up-right" size={12} color={colors.ink} />
            </View>
          </Pressable>
        ))}
      </List>
    </Screen>
  );
}
