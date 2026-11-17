import { Text, View } from 'react-native';
import { Btn, BtnRow, Card, Header, List, Logo, Screen } from '../../src/ui';
import { data } from '../../src/data';
import { openUrl, sendEmail } from '../../src/actions';
import { colors, fonts } from '../../src/theme';

export default function Contacts() {
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
      </List>
    </Screen>
  );
}
