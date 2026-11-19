import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { Btn, BtnRow, Card, DateBadge, Empty, Header, List, MonthHeading, NoteBox, Row, Screen } from '../../src/ui';
import { useData } from '../../src/data';
import { dayLong, monthDay, sortByStart, timeLabel } from '../../src/dates';
import { addToCalendar, openUrl } from '../../src/actions';
import { colors, fonts } from '../../src/theme';

export default function Runway() {
  const data = useData();
  const shows = sortByStart(data.runway);
  return (
    <Screen section="fashion" header={<Header section="fashion" label="01 · FASHION WEEK" title="RUNWAY" />}>
      <List>
        {shows.length === 0 && <Empty text="No shows scheduled yet." />}
        {shows.map((s, i) => (
          <Fragment key={s.id}>
            {(i === 0 || dayLong(shows[i - 1].start) !== dayLong(s.start)) && <MonthHeading>{dayLong(s.start)}</MonthHeading>}
            <Card style={{ flexDirection: 'row', gap: 12 }}>
              <DateBadge top={monthDay(s.start)} bottom={timeLabel(s.start)} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.black, fontSize: 13, color: colors.ink }}>{s.brand.toUpperCase()}</Text>
                <Row icon="map-pin" text={s.address} />
                {s.notes ? <NoteBox text={s.notes} /> : null}
                <BtnRow>
                  <Btn primary icon="calendar" label="Add to calendar" onPress={() => {
                    const start = new Date(s.start);
                    addToCalendar({ title: `${s.brand} — runway`, start, end: new Date(start.getTime() + 3600_000), location: s.address, notes: s.notes });
                  }} />
                  <Btn icon="play" label="Live streaming" disabled={!s.streamUrl} onPress={() => openUrl(s.streamUrl!)} />
                </BtnRow>
              </View>
            </Card>
          </Fragment>
        ))}
      </List>
    </Screen>
  );
}
