import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Btn, BtnRow, Card, Empty, Header, List, Row, Screen } from '../../src/ui';
import { useData } from '../../src/data';
import { dayLong } from '../../src/dates';
import { addToCalendar, localDay, openMap } from '../../src/actions';
import { colors, fonts } from '../../src/theme';
import type { EventItem } from '../../src/types';

function EventCard({ e, open, toggle }: { e: EventItem; open: boolean; toggle: () => void }) {
  const when = [e.date ? dayLong(e.date) : 'Date TBA', e.startTime && e.endTime ? `${e.startTime} – ${e.endTime}` : e.startTime].filter(Boolean).join(' · ');
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
            {e.image ? <Image source={{ uri: e.image }} style={{ width: 46, height: 56, borderRadius: 6, backgroundColor: colors.bg }} /> : null}
          </View>
          <Row icon="map-pin" text={e.location} />
          <BtnRow>
            {e.date ? (
              <Btn primary icon="calendar" label="Add to calendar" onPress={() => {
                const day = localDay(e.date!);
                const at = (t: string | undefined, fallback: number) => { const d = new Date(day); const [h, m] = (t ?? `${fallback}:00`).split(':').map(Number); d.setHours(h, m); return d; };
                addToCalendar({ title: e.name, start: at(e.startTime, 10), end: at(e.endTime, 18), location: e.location });
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
  const [openId, setOpenId] = useState<string | null>(data.events[0]?.id ?? null);
  return (
    <Screen section="fashion" header={<Header section="fashion" label="01 · FASHION WEEK" title="EVENTS" />}>
      <List>
        {data.events.length === 0 && <Empty text="Events will appear here as soon as they are announced." />}
        {data.events.map((e) => (
          <EventCard key={e.id} e={e} open={openId === e.id} toggle={() => setOpenId(openId === e.id ? null : e.id)} />
        ))}
      </List>
    </Screen>
  );
}
