import { View } from 'react-native';
import { Header, HubRow, List, Screen, SectionStack } from '../../src/ui';

export default function MarketHub() {
  return (
    <Screen section="market" stack header={<Header section="market" title="SALES" big="FW27" />}>
      <List>
        <HubRow title="SHOWROOMS" subtitle="Book appointments with Milan showrooms" href="/market/showrooms" />
        <HubRow title="BRANDS" subtitle="Every brand and where to see it" href="/market/brands" />
      </List>
      <View style={{ flex: 1, minHeight: 40 }} />
      <SectionStack show={['fashion', 'info']} />
    </Screen>
  );
}
