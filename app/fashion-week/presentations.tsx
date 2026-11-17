import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { Btn, BtnRow, Card, DateBadge, Empty, Header, List, MonthHeading, NoteBox, Row, Screen } from '../../src/ui';
import { useData } from '../../src/data';
import { dayLong, monthDay, sortByStart, timeLabel } from '../../src/dates';
import { addToCalendar, openUrl } from '../../src/actions';
import { colors, fonts } from '../../src/theme';

export default function Presentations() {
  const data = useData();
  const items = sortByStart(data.presentations);
  return (
    <Screen section="fashion" header={<Header section="fashion" label="01 · FASHION WEEK" title="PRESENTATIONS" />}>
      <List>
        {items.length === 0 && <Empty text="Presentations will appear here as soon as they are announced." />}
        {items.map((p, i) => (
          <Fragment key={p.id}>
            {(i === 0 || dayLong(items[i - 1].start) !== dayLong(p.start)) && <MonthHeading>{dayLong(p.start)}</MonthHeading>}
            <Card style={{ flexDirection: 'row', gap: 12 }}>
              <DateBadge top={monthDay(p.start)} bottom={`${timeLabel(p.start)}${p.end ? `\n—\n${timeLabel(p.end)}` : ''}`} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.black, fontSize: 13, color: colors.ink }}>{p.brand.toUpperCase()}</Text>
                <Row icon="map-pin" text={p.address} />
                {p.notes ? <NoteBox text={p.notes} /> : null}
                <BtnRow>
                  <Btn primary icon="calendar" label="Add to calendar" onPress={() => {
                    const start = new Date(p.start);
                    addToCalendar({ title: `${p.brand} — presentation`, start, end: p.end ? new Date(p.end) : new Date(start.getTime() + 3600_000), location: p.address, notes: p.notes });
                  }} />
                  {p.website ? <Btn label="Website" onPress={() => openUrl(p.website!)} /> : null}
                </BtnRow>
              </View>
            </Card>
          </Fragment>
        ))}
      </List>
    </Screen>
  );
}
