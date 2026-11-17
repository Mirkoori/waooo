import { View } from 'react-native';
import { Header, HubRow, List, Screen, SectionStack } from '../../src/ui';

export default function InfoHub() {
  return (
    <Screen section="info" stack header={<Header section="info" title="INFO" big="FW27" />}>
      <List>
        <HubRow title="CONTACTS" subtitle="Get in touch with the Waooo team" href="/info/contacts" />
        <HubRow title="PARTNERS" subtitle="The companies that support Waooo" href="/info/partners" />
      </List>
      <View style={{ flex: 1, minHeight: 40 }} />
      <SectionStack show={['fashion', 'market']} />
    </Screen>
  );
}
