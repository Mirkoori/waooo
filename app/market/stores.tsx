import { Text } from 'react-native';
import { Btn, BtnRow, Card, Empty, Header, List, Row, Screen } from '../../src/ui';
import { useData } from '../../src/data';
import { callNumber, openMap, openUrl } from '../../src/actions';
import { colors, fonts } from '../../src/theme';

export default function Stores() {
  const data = useData();
  return (
    <Screen section="market" header={<Header section="market" label="02 · MARKET" title="STORES" />}>
      <List>
        {data.stores.length === 0 && <Empty text="Stores will appear here soon." />}
        {data.stores.map((s) => (
          <Card key={s.id}>
            <Text style={{ fontFamily: fonts.black, fontSize: 14, color: colors.ink }}>{s.name.toUpperCase()}</Text>
            <Row icon="map-pin" text={s.address} />
            <Row icon="clock" text={s.hours} />
            <BtnRow stretch>
              <Btn flex primary label="Map" onPress={() => openMap(`${s.name}, ${s.address}`)} />
              <Btn flex label="Call" onPress={() => s.phone && callNumber(s.phone)} />
              <Btn flex label="Website" onPress={() => s.website && openUrl(s.website)} />
            </BtnRow>
          </Card>
        ))}
      </List>
    </Screen>
  );
}
