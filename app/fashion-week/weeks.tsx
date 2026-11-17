import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { Btn, Card, DateBadge, Header, List, MonthHeading, Screen } from '../../src/ui';
import { data } from '../../src/data';
import { dayRange, monthShort, monthYearLong, sortByStart } from '../../src/dates';
import { addToCalendar, localDay } from '../../src/actions';
import { colors, fonts } from '../../src/theme';

export default function Weeks() {
  const weeks = sortByStart(data.weeks);
  return (
    <Screen section="fashion" header={<Header section="fashion" label="01 · FASHION WEEK" title="FASHION WEEKS" />}>
      <List>
        {weeks.map((w, i) => (
          <Fragment key={w.id}>
            {(i === 0 || monthYearLong(weeks[i - 1].start) !== monthYearLong(w.start)) && <MonthHeading>{monthYearLong(w.start)}</MonthHeading>}
            <Card style={{ flexDirection: 'row', gap: 12 }}>
              <DateBadge top={monthShort(w.start)} bottom={dayRange(w.start, w.end)} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.black, fontSize: 13, color: colors.ink }}>{w.name.toUpperCase()}</Text>
                <Text style={{ fontFamily: fonts.semibold, fontSize: 10, color: '#3A3833', marginTop: 4 }}>{w.city}, {w.country}</Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <Btn icon="calendar" label="Add to calendar" onPress={() => addToCalendar({ title: w.name, start: localDay(w.start), end: localDay(w.end), allDay: true, location: `${w.city}, ${w.country}` })} />
                </View>
              </View>
            </Card>
          </Fragment>
        ))}
      </List>
    </Screen>
  );
}
