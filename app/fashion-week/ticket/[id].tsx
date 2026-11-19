import { useEffect, useRef, useState } from 'react';
import { Platform, Share, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';
import { Btn, BtnRow, Card, Empty, Header, List, Row, Screen } from '../../../src/ui';
import { useData } from '../../../src/data';
import { dayLong } from '../../../src/dates';
import { getTicket, qrPayload, ticketCode, Ticket } from '../../../src/tickets';
import { colors, fonts } from '../../../src/theme';

export default function TicketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useData();
  const e = data.events.find((x) => x.id === id);
  const [t, setT] = useState<Ticket | null | undefined>(undefined);
  const qr = useRef<any>(null);
  const [note, setNote] = useState('');
  useEffect(() => { getTicket(String(id)).then((x) => setT(x ?? null)); }, [id]);
  const header = <Header section="fashion" label="01 · FASHION WEEK" title="YOUR TICKET" />;
  if (t === undefined) return <Screen section="fashion" header={header}><View /></Screen>;
  if (!e || !t) return <Screen section="fashion" header={header}><Empty text="No ticket found for this event." /></Screen>;

  function download() {
    if (Platform.OS === 'web') {
      qr.current?.toDataURL((b64: string) => {
        const a = document.createElement('a');
        a.href = `data:image/png;base64,${b64}`;
        a.download = `${ticketCode(t!)}.png`;
        a.click();
      });
    } else {
      Share.share({ message: `${e!.name} — ticket ${ticketCode(t!)}\n${t!.first} ${t!.last}\n${qrPayload(t!)}` });
    }
  }

  return (
    <Screen section="fashion" header={header}>
      <List>
        <Card style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.black, fontSize: 14, color: colors.ink, textAlign: 'center' }}>{e.name.toUpperCase()}</Text>
          <Text style={{ fontFamily: fonts.extra, fontSize: 9, color: colors.ink, marginTop: 3 }}>
            {[e.date ? dayLong(e.date).toUpperCase() : '', e.startTime].filter(Boolean).join(' · ')}
          </Text>
          <View style={{ backgroundColor: '#fff', padding: 14, borderRadius: 12, marginTop: 14 }}>
            <QRCode value={qrPayload(t)} size={180} getRef={(c) => (qr.current = c)} />
          </View>
          <Text style={{ fontFamily: fonts.black, fontSize: 13, color: colors.ink, marginTop: 12 }}>{`${t.first} ${t.last}`.toUpperCase()}</Text>
          <Text style={{ fontFamily: fonts.extra, fontSize: 10, letterSpacing: 1, color: colors.muted, marginTop: 2 }}>{ticketCode(t)}</Text>
          <View style={{ alignSelf: 'stretch' }}><Row icon="map-pin" text={e.location} /></View>
          <BtnRow>
            <Btn primary icon="download" label="Download" onPress={download} />
            <Btn icon="credit-card" label="Add to wallet" onPress={() => setNote('Apple / Google Wallet is coming soon.')} />
          </BtnRow>
          {note ? <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: colors.muted, marginTop: 8 }}>{note}</Text> : null}
        </Card>
      </List>
    </Screen>
  );
}
