import { Pressable, Text, View } from 'react-native';
import { Btn, BtnRow, Card, Header, List, Logo, Screen } from '../../src/ui';
import { useData } from '../../src/data';
import { openUrl, sendEmail } from '../../src/actions';
import { LEGAL_LINKS } from '../../src/links';
import { colors, fonts } from '../../src/theme';

export default function Contacts() {
  const data = useData();
  return (
    <Screen section="info" header={<Header section="info" label="03 · INFO" title="CONTACTS" />}>
      <List>
        {data.contacts.map((c) => (
          <Card key={c.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {c.id === 'waooo' && <Logo size={30} />}
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.black, fontSize: 14, color: colors.ink }}>{c.name.toUpperCase()}</Text>
                {c.tagline ? <Text style={{ fontFamily: fonts.extra, fontSize: 8, letterSpacing: 0.6, color: '#3A3833', marginTop: 2 }}>{c.tagline.toUpperCase()}</Text> : null}
              </View>
            </View>
            <BtnRow stretch>
              <Btn flex primary label="Email" onPress={() => c.email && sendEmail(c.email)} />
              <Btn flex label="Website" onPress={() => c.website && openUrl(c.website)} />
            </BtnRow>
          </Card>
        ))}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 28 }}>
          {LEGAL_LINKS.map((l) => (
            <Pressable key={l.url} onPress={() => openUrl(l.url)} hitSlop={8}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: colors.muted, textDecorationLine: 'underline' }}>{l.label}</Text>
            </Pressable>
          ))}
        </View>
      </List>
    </Screen>
  );
}
