import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Btn, BtnRow, Card, Empty, Header, List, Row, Screen } from '../../src/ui';
import { useData } from '../../src/data';
import { dayLong, monthDay } from '../../src/dates';
import { loadTickets } from '../../src/tickets';
import { addToCalendar, localDay, openMap } from '../../src/actions';
import { colors, fonts } from '../../src/theme';
import type { EventItem } from '../../src/types';

function EventCard({ e, open, toggle, hasTicket, onZoom }: { e: EventItem; open: boolean; toggle: () => void; hasTicket: boolean; onZoom: (u: string) => void }) {
  const router = useRouter();
  const dateLine = e.date ? (e.endDate && e.endDate !== e.date ? `${monthDay(e.date)} – ${monthDay(e.endDate)}` : dayLong(e.date)) : 'Date TBA';
  const when = [dateLine, e.startTime && e.endTime ? `${e.startTime} – ${e.endTime}` : e.startTime].filter(Boolean).join(' · ');
  return (
    <Card>
      <Pressable onPress={toggle} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          {open && e.invitationOnly && (
            <View style={{ backgroundColor: colors.ink, alignSelf: 'flex-start', borderRadius: 9, paddingHorizontal: 9, height: 18, justifyContent: 'center', marginBottom: 6 }}>
              <Text style={{ fontFamily: fonts.extra, fontSize: 8, color: colors.bg, letterSpacing: 0.6 }}>BY INVITATION ONLY</Text>
            </View>
          )}
          <Text style={{ fontFamily: fonts.extra, fontSize: 9, color: colors.ink }}>{when.toUpperCase()}</Text>
          <Text style={{ fontFamily: fonts.black, fontSize: 14, color: colors.ink, marginTop: 3 }}>{e.name.toUpperCase()}</Text>
        </View>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.ink} />
        </View>
      </Pressable>
      {open && (
        <View style={{ marginTop: 8 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {e.description ? <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 10, lineHeight: 15, color: '#2A2824' }}>{e.description}</Text> : null}
            {e.image ? <Pressable onPress={() => onZoom(e.image!)}><Image source={{ uri: e.image }} style={{ width: 46, height: 56, borderRadius: 6, backgroundColor: colors.bg }} /></Pressable> : null}
          </View>
          <Row icon="map-pin" text={e.location} />
          <BtnRow>
            {e.registration ? (
              <Pressable onPress={() => router.push(hasTicket ? `/fashion-week/ticket/${e.id}` : `/fashion-week/register/${e.id}`)} style={{ backgroundColor: colors.fashion, borderRadius: 16, paddingHorizontal: 16, height: 32, justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.black, fontSize: 10, color: colors.ink }}>{hasTicket ? 'VIEW TICKET' : 'REGISTER'}</Text>
              </Pressable>
            ) : null}
            {e.date ? (
              <Btn primary icon="calendar" label="Add to calendar" onPress={() => {
                const day = localDay(e.date!);
                const at = (t: string | undefined, fallback: number) => { const d = new Date(day); const [h, m] = (t ?? `${fallback}:00`).split(':').map(Number); d.setHours(h, m); return d; };
                addToCalendar({ title: e.name, start: at(e.startTime, 10), end: e.endDate && e.endDate !== e.date ? (() => { const d = new Date(localDay(e.endDate!)); const [h, m] = (e.endTime ?? '18:00').split(':').map(Number); d.setHours(h, m); return d; })() : at(e.endTime, 18), location: e.location });
              }} />
            ) : null}
            <Btn primary={!e.date} label="Map" onPress={() => openMap(e.location)} />
          </BtnRow>
        </View>
      )}
    </Card>
  );
}

export default function Events() {
  const data = useData();
  const [openIds, setOpenIds] = useState<string[]>(data.events.slice(0, 1).map((x) => x.id));
  const [tickets, setTickets] = useState<Record<string, unknown>>({});
  const [zoom, setZoom] = useState<string | null>(null);
  useEffect(() => { loadTickets().then(setTickets); }, []);
  const toggle = (id: string) => setOpenIds((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  return (
    <Screen section="fashion" header={<Header section="fashion" label="01 · FASHION WEEK" title="EVENTS" />}>
      <List>
        {data.events.length === 0 && <Empty text="Events will appear here as soon as they are announced." />}
        {data.events.map((e) => (
          <EventCard key={e.id} e={e} open={openIds.includes(e.id)} toggle={() => toggle(e.id)} hasTicket={!!tickets[e.id]} onZoom={setZoom} />
        ))}
      </List>
      <Modal visible={!!zoom} transparent animationType="fade" onRequestClose={() => setZoom(null)}>
        <Pressable onPress={() => setZoom(null)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          {zoom ? <Image source={{ uri: zoom }} resizeMode="contain" style={{ width: '100%', height: '85%' }} /> : null}
        </Pressable>
      </Modal>
    </Screen>
  );
}
