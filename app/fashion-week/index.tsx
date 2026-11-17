import { View } from 'react-native';
import { Header, HubRow, List, Screen, SectionStack } from '../../src/ui';

export default function FashionWeekHub() {
  return (
    <Screen section="fashion" stack header={<Header section="fashion" title="FASHION WEEK" big="FW27" />}>
      <List>
        <HubRow title="FASHION WEEKS" subtitle="Calendar of the international weeks" href="/fashion-week/weeks" />
        <HubRow title="RUNWAY" subtitle="Shows, live and on demand" href="/fashion-week/runway" />
        <HubRow title="PRESENTATIONS" subtitle="Collections presented by appointment" href="/fashion-week/presentations" />
        <HubRow title="EVENTS" subtitle="Parties, talks and openings" href="/fashion-week/events" />
        <HubRow title="TRADE SHOWS" subtitle="Fairs and exhibitions for buyers" href="/fashion-week/trade-shows" />
      </List>
      <View style={{ flex: 1, minHeight: 40 }} />
      <SectionStack show={['market', 'info']} />
    </Screen>
  );
}
