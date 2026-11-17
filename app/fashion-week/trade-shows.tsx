import { Text, View } from 'react-native';
import { Btn, BtnRow, Card, DateBadge, Empty, Header, List, Row, Screen } from '../../src/ui';
import { data } from '../../src/data';
import { dayRange, monthShort, sortByStart } from '../../src/dates';
import { addToCalendar, localDay, openUrl, sendEmail } from '../../src/actions';
import { colors, fonts } from '../../src/theme';

export default function TradeShows() {
  return (
    <Screen section="fashion" header={<Header section="fashion" label="01 · FASHION WEEK" title="TRADE SHOWS" />}>
      <List>
        {data.tradeShows.length === 0 && <Empty text="Trade shows will appear here soon." />}
        {sortByStart(data.tradeShows).map((t) => (
          <Card key={t.id} style={{ flexDirection: 'row', gap: 12 }}>
            <DateBadge top={monthShort(t.start)} bottom={dayRange(t.start, t.end)} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.black, fontSize: 13, color: colors.ink }}>{t.name.toUpperCase()}</Text>
              <Row icon="map-pin" text={t.address} />
              <BtnRow>
                <Btn primary icon="calendar" label="Add to calendar" onPress={() => addToCalendar({ title: t.name, start: localDay(t.start), end: localDay(t.end), allDay: true, location: t.address })} />
                {t.website ? <Btn label="Website" onPress={() => openUrl(t.website!)} /> : null}
                {t.email ? <Btn icon="mail" label="Email" onPress={() => sendEmail(t.email!)} /> : null}
              </BtnRow>
            </View>
          </Card>
        ))}
      </List>
    </Screen>
  );
}
